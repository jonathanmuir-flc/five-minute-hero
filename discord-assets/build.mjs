// Build the Discord assets from their sources.
// Run from the repo root: npm run discord-assets  (or: node discord-assets/build.mjs)
//
// - Pixel assets (emoji, server icon, event cover) start from the PixelLab
//   generations saved in source/ (see source/pixellab.json). The build snaps
//   them to the shared palette, removes stray pixels, adds a dark outline and a
//   light rim where asked, and upscales with nearest-neighbor only.
// - The event cover gets its title stamped in Silkscreen (OFL) at art scale.
// - The Hermes DM avatar is a vector SVG in avatar/ (gitignored). It is
//   rendered to PNG only if the SVG is present on this machine.
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { Resvg } from '@resvg/resvg-js';

const ROOT = dirname(fileURLToPath(import.meta.url));
const FONT = join(ROOT, 'fonts', 'Silkscreen-Regular.ttf');
const EMOJI_LIMIT = 256 * 1024;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const PALETTE = Object.fromEntries(
  Object.entries(JSON.parse(readFileSync(join(ROOT, 'palette.json'), 'utf8'))).map(([k, v]) => [k, hex(v)]),
);
const DARK = [PALETTE.black, PALETTE.ink];
// One step lighter, used for the rim on the lit (top-left) side.
const LIGHTER = {
  pineDeep: 'pine', pine: 'pineMid', pineMid: 'pineLeaf', pineLeaf: 'jade',
  brassDark: 'brassMid', brassMid: 'brass', brass: 'paleGold', ash: 'bone', red: 'redLight',
};

// Small hand fixes on top of a generation, as [x, y, palette name] at art scale.
const PATCHES = {
  // The generated tiny die had an "o" on it: clear its face and draw a 1.
  nat1: [
    ...[24, 25, 26, 27, 28].flatMap((x) => [24, 25, 26, 27].map((y) => [x, y, 'brass'])),
    [26, 24, 'ink'], [25, 25, 'ink'], [26, 25, 'ink'], [26, 26, 'ink'], [26, 27, 'ink'], [25, 27, 'ink'], [27, 27, 'ink'],
  ],
};

// Palette subsets per asset, so a generated orange snaps to brass, not to potion red.
const DARKS = ['black', 'ink'];
const BRASS = ['brassDark', 'brassMid', 'brass', 'paleGold'];
const PINE = ['pineDeep', 'pine', 'pineMid', 'pineLeaf', 'jade'];
const USE = {
  nat20: [...DARKS, ...BRASS],
  nat1: [...DARKS, ...BRASS, 'ash', 'bone', 'jade'],
  pause: [...DARKS, ...PINE],
  gold: [...DARKS, ...BRASS],
  boss: [...DARKS, ...PINE, ...BRASS, 'bone'],
  potion: [...DARKS, ...BRASS, 'ash', 'bone', 'red', 'redLight'],
  rest: [...DARKS, 'brassDark', 'brass', 'paleGold', 'bone'], // no brassMid, so the flame edge stays dark against the glass
};

// Each pixel asset: its PixelLab source, cleanup options and exports.
const PIXEL = [
  ...['nat20', 'nat1', 'pause', 'gold', 'boss', 'potion', 'rest'].map((n) => ({
    src: `emoji-${n}.png`, outline: true, rim: true, out: [[`emoji/${n}.png`, 4]],
    patch: PATCHES[n], use: USE[n],
  })),
  { src: 'server-icon.png', outline: false, rim: false, use: [...DARKS, ...BRASS, ...PINE], out: [['server-icon.png', 8]] },
  {
    src: 'island-of-trials.png', outline: false, rim: false, use: [...DARKS, ...PINE, ...BRASS, 'ash'],
    out: [['event/island-of-trials.png', 4], ['event/island-of-trials@2x.png', 8]],
    text: [
      { value: 'GAME NIGHT ·', x: 9, y: 26, color: 'brass' },
      { value: 'ISLAND OF TRIALS', x: 9, y: 36, color: 'paleGold' },
    ],
  },
];

// Nearest palette colour in CIELAB, which matches how different colours look.
function lab([r, g, b]) {
  const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const X = f((R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047);
  const Y = f(R * 0.2126 + G * 0.7152 + B * 0.0722);
  const Z = f((R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883);
  return [116 * Y - 16, 500 * (X - Y), 200 * (Y - Z)];
}
const LAB = Object.fromEntries(Object.entries(PALETTE).map(([k, c]) => [k, lab(c)]));
function nearest(rgb, use) {
  const p = lab(rgb);
  let best, bestD = Infinity;
  for (const name of use) {
    const c = LAB[name];
    const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
    if (d < bestD) [best, bestD] = [name, d];
  }
  return best;
}

// Grid of palette names (null = transparent).
function load(file, use = Object.keys(PALETTE)) {
  const png = PNG.sync.read(readFileSync(file));
  const g = [];
  for (let y = 0; y < png.height; y++) {
    g.push([]);
    for (let x = 0; x < png.width; x++) {
      const i = (y * png.width + x) * 4;
      g[y].push(png.data[i + 3] < 128 ? null : nearest([png.data[i], png.data[i + 1], png.data[i + 2]], use));
    }
  }
  return g;
}
const at = (g, x, y) => (y >= 0 && y < g.length && x >= 0 && x < g[0].length ? g[y][x] : null);
const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const N8 = [...N4, [1, 1], [1, -1], [-1, 1], [-1, -1]];

function removeStrays(g) {
  for (let y = 0; y < g.length; y++)
    for (let x = 0; x < g[0].length; x++)
      if (g[y][x] && N8.every(([dx, dy]) => !at(g, x + dx, y + dy))) g[y][x] = null;
}
function addOutline(g) {
  const isDark = (n) => n === 'black' || n === 'ink';
  const add = [];
  for (let y = 0; y < g.length; y++)
    for (let x = 0; x < g[0].length; x++) {
      if (g[y][x]) continue;
      if (N4.some(([dx, dy]) => { const n = at(g, x + dx, y + dy); return n && !isDark(n); })) add.push([x, y]);
    }
  for (const [x, y] of add) g[y][x] = 'ink';
  // Silhouette pixels on the canvas border can't get an outside outline.
  for (let y = 0; y < g.length; y++)
    for (let x = 0; x < g[0].length; x++)
      if (g[y][x] && !isDark(g[y][x]) && (x === 0 || y === 0 || x === g[0].length - 1 || y === g.length - 1)) g[y][x] = 'ink';
}
function addRim(g) {
  const hits = [];
  for (let y = 0; y < g.length; y++)
    for (let x = 0; x < g[0].length; x++) {
      const n = g[y][x];
      if (!n || !LIGHTER[n]) continue;
      const lit = [[-1, 0], [0, -1]].some(([dx, dy]) => { const m = at(g, x + dx, y + dy); return !m || m === 'ink' || m === 'black'; });
      if (lit) hits.push([x, y]);
    }
  for (const [x, y] of hits) g[y][x] = LIGHTER[g[y][x]];
}
function stampText(g, { value, x, y, color }) {
  const w = g[0].length, h = g.length;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <text x="${x}" y="${y}" font-family="Silkscreen" font-size="8" fill="#fff">${value}</text></svg>`;
  const px = new Resvg(svg, { font: { fontFiles: [FONT], loadSystemFonts: false }, shapeRendering: 0, textRendering: 0 }).render().pixels;
  const hitAt = (xx, yy) => xx >= 0 && yy >= 0 && xx < w && yy < h && px[(yy * w + xx) * 4 + 3] >= 128;
  // Shadow first (1px down-right in black), then the letters.
  for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (hitAt(xx - 1, yy - 1) && !hitAt(xx, yy)) g[yy][xx] = 'black';
  for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (hitAt(xx, yy)) g[yy][xx] = color;
}
function save(g, file, scale) {
  const w = g[0].length * scale, h = g.length * scale;
  const png = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const n = g[Math.floor(y / scale)][Math.floor(x / scale)];
      png.data.set(n ? [...PALETTE[n], 255] : [0, 0, 0, 0], (y * w + x) * 4);
    }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, PNG.sync.write(png, { colorType: 6 }));
}

let failed = false;
for (const a of PIXEL) {
  const g = load(join(ROOT, 'source', a.src), a.use);
  removeStrays(g);
  for (const [x, y, n] of a.patch ?? []) g[y][x] = n;
  if (a.outline) addOutline(g);
  if (a.rim) addRim(g);
  for (const t of a.text ?? []) stampText(g, t);
  for (const [out, scale] of a.out) {
    const file = join(ROOT, out);
    save(g, file, scale);
    const size = statSync(file).size;
    const tooBig = out.startsWith('emoji/') && size > EMOJI_LIMIT;
    if (tooBig) failed = true;
    console.log(`${tooBig ? 'TOO BIG' : 'ok'}  ${out}  ${g[0].length}x${g.length} x${scale}  ${(size / 1024).toFixed(1)} KB`);
  }
}

const avatarSvg = join(ROOT, 'avatar', 'hermes-dm.svg');
if (existsSync(avatarSvg)) {
  const png = new Resvg(readFileSync(avatarSvg, 'utf8'), { fitTo: { mode: 'width', value: 512 } }).render().asPng();
  writeFileSync(join(ROOT, 'avatar', 'hermes-dm.png'), png);
  console.log(`ok  avatar/hermes-dm.png  512x512  ${(png.length / 1024).toFixed(1)} KB  (gitignored)`);
} else {
  console.log('skip  avatar/hermes-dm.svg not found (it is gitignored and kept locally)');
}

if (failed) {
  console.error('An emoji is over Discord’s 256 KB limit.');
  process.exit(1);
}

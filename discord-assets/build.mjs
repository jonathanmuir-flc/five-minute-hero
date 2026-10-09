// Regenerate the Discord assets from the committed PNGs.
// Run from the repo root: npm run discord-assets  (or: node discord-assets/build.mjs)
//
// Every asset is pixel art that was upscaled with nearest-neighbor only. This
// script reads each PNG back down to its art-scale grid, checks that every art
// pixel is a clean block, snaps the colors to the shared palette
// (palette.json), and writes the exports again. Running it on unchanged files
// leaves them byte-for-byte the same. It exits with an error if a PNG is not a
// clean nearest-neighbor upscale or if an emoji is over Discord's 256 KB limit.
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const EMOJI_LIMIT = 256 * 1024;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const PALETTE = Object.fromEntries(
  Object.entries(JSON.parse(readFileSync(join(ROOT, 'palette.json'), 'utf8'))).map(([k, v]) => [k, hex(v)]),
);

// Each asset: the committed PNG, the scale it was exported at, and any
// additional exports as [file, scale].
const ASSETS = [
  ...['nat20', 'nat1', 'pause', 'gold', 'boss', 'potion', 'rest'].map((n) => ({ file: `emoji/${n}.png`, scale: 4 })),
  { file: 'server-icon.png', scale: 8 },
  { file: 'event/island-of-trials.png', scale: 4, extra: [['event/island-of-trials@2x.png', 8]] },
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
function nearest(rgb) {
  const p = lab(rgb);
  let best, bestD = Infinity;
  for (const [name, c] of Object.entries(LAB)) {
    const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
    if (d < bestD) [best, bestD] = [name, d];
  }
  return best;
}

// Grid of palette names (null = transparent), read at one pixel per art pixel.
function load(file, scale) {
  const png = PNG.sync.read(readFileSync(file));
  if (png.width % scale || png.height % scale) throw new Error(`${file}: ${png.width}x${png.height} is not a multiple of ${scale}`);
  const px = (x, y) => {
    const i = (y * png.width + x) * 4;
    return [png.data[i], png.data[i + 1], png.data[i + 2], png.data[i + 3]];
  };
  const g = [];
  for (let y = 0; y < png.height / scale; y++) {
    g.push([]);
    for (let x = 0; x < png.width / scale; x++) {
      const first = px(x * scale, y * scale);
      for (let dy = 0; dy < scale; dy++)
        for (let dx = 0; dx < scale; dx++)
          if (px(x * scale + dx, y * scale + dy).some((v, i) => v !== first[i]))
            throw new Error(`${file}: art pixel (${x}, ${y}) is not a clean ${scale}x${scale} block`);
      g[y].push(first[3] < 128 ? null : nearest(first));
    }
  }
  return g;
}

function save(g, file, scale) {
  const w = g[0].length * scale, h = g.length * scale;
  const png = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const n = g[Math.floor(y / scale)][Math.floor(x / scale)];
      png.data.set(n ? [...PALETTE[n], 255] : [0, 0, 0, 0], (y * w + x) * 4);
    }
  writeFileSync(file, PNG.sync.write(png, { colorType: 6 }));
}

let failed = false;
for (const a of ASSETS) {
  const g = load(join(ROOT, a.file), a.scale);
  for (const [out, scale] of [[a.file, a.scale], ...(a.extra ?? [])]) {
    const file = join(ROOT, out);
    save(g, file, scale);
    const size = statSync(file).size;
    const tooBig = out.startsWith('emoji/') && size > EMOJI_LIMIT;
    if (tooBig) failed = true;
    console.log(`${tooBig ? 'TOO BIG' : 'ok'}  ${out}  ${g[0].length}x${g.length} x${scale}  ${(size / 1024).toFixed(1)} KB`);
  }
}

if (failed) {
  console.error('An emoji is over Discord’s 256 KB limit.');
  process.exit(1);
}

// Render the pixel-art grids to PNG with nearest-neighbor scaling.
// Run from the repo root: npm run discord-assets  (or: node discord-assets/build.mjs)
//
// Each asset is a JSON file next to its PNG:
//   { "exports": [{ "file": "nat20.png", "scale": 4 }],
//     "rows": ["....kk....", ...],          one character per pixel, keys from palette.json
//     "text": [{ "font": "title", "x": 8, "y": 30, "color": "y", "shadow": "k", "value": "HI" }] }  optional
// No dependencies: PNGs are encoded with node:zlib.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PALETTE = JSON.parse(readFileSync(join(ROOT, 'palette.json'), 'utf8'));
const FONTS = JSON.parse(readFileSync(join(ROOT, 'pixel-font.json'), 'utf8'));
const EMOJI_LIMIT = 256 * 1024;

const rgba = Object.fromEntries(
  Object.entries(PALETTE).map(([k, hex]) =>
    [k, hex ? [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).concat(255) : [0, 0, 0, 0]],
  ),
);

function stampText(grid, { font, x, y, color, shadow, value }) {
  const f = FONTS[font];
  if (!f) throw new Error(`Unknown font "${font}"`);
  const draw = (ox, oy, c) => {
    let cx = x + ox;
    for (const ch of value) {
      const g = f.glyphs[ch];
      if (!g) throw new Error(`Font "${font}" has no glyph for "${ch}"`);
      g.forEach((row, gy) => [...row].forEach((px, gx) => {
        const yy = y + oy + gy, xx = cx + gx;
        if (px === '#' && grid[yy]?.[xx] !== undefined) grid[yy][xx] = c;
      }));
      cx += g[0].length + f.spacing;
    }
  };
  if (shadow) draw(1, 1, shadow);
  draw(0, 0, color);
}

const CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const head = Buffer.alloc(4);
  head.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(body));
  return Buffer.concat([head, body, tail]);
}
function encodePng(grid, scale) {
  const w = grid[0].length * scale, h = grid.length * scale;
  const stride = w * 4 + 1;
  const raw = Buffer.alloc(stride * h);
  for (let y = 0; y < h; y++) {
    const row = grid[Math.floor(y / scale)];
    for (let x = 0; x < w; x++) raw.set(rgba[row[Math.floor(x / scale)]], y * stride + 1 + x * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function sources() {
  const found = [];
  for (const dir of ['', 'emoji', 'avatar', 'event']) {
    for (const f of readdirSync(join(ROOT, dir))) {
      if (f.endsWith('.json') && !['palette.json', 'pixel-font.json'].includes(f)) found.push(join(ROOT, dir, f));
    }
  }
  return found;
}

let failed = false;
for (const src of sources()) {
  const asset = JSON.parse(readFileSync(src, 'utf8'));
  const name = relative(ROOT, src);
  const width = asset.rows[0].length;
  const grid = asset.rows.map((row, y) => {
    const px = [...row];
    if (px.length !== width) throw new Error(`${name}: row ${y} is ${px.length} wide, expected ${width}`);
    const bad = px.find((c) => !(c in rgba));
    if (bad) throw new Error(`${name}: row ${y} uses "${bad}", which is not in palette.json`);
    return px;
  });
  for (const t of asset.text ?? []) stampText(grid, t);
  for (const { file, scale } of asset.exports) {
    const out = join(dirname(src), file);
    writeFileSync(out, encodePng(grid, scale));
    const size = statSync(out).size;
    const tooBig = name.startsWith('emoji') && size > EMOJI_LIMIT;
    if (tooBig) failed = true;
    console.log(`${tooBig ? 'TOO BIG' : 'ok'}  ${relative(ROOT, out)}  ${width}x${grid.length} x${scale}  ${(size / 1024).toFixed(1)} KB`);
  }
}
if (failed) {
  console.error('An emoji is over Discord’s 256 KB limit.');
  process.exit(1);
}

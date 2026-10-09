// Export the Discord asset SVGs to PNG.
// Run from the repo root: npm run discord-assets  (or: node discord-assets/build.mjs)
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const ROOT = dirname(fileURLToPath(import.meta.url));
const FONT = join(ROOT, 'fonts', 'YoungSerif-Regular.ttf');
const EMOJI_LIMIT = 256 * 1024;

// [svg source, png output, output width]
const JOBS = [
  ...['nat20', 'nat1', 'pause', 'gold', 'boss', 'potion'].map((n) => [`emoji/${n}.svg`, `emoji/${n}.png`, 128]),
  ['avatar/dm-hooded.svg', 'avatar/dm-hooded.png', 512],
  ['avatar/dm-oracle.svg', 'avatar/dm-oracle.png', 512],
  ['event/island-of-trials.svg', 'event/island-of-trials.png', 800],
  ['event/island-of-trials.svg', 'event/island-of-trials@2x.png', 1600],
];

let failed = false;
for (const [src, out, width] of JOBS) {
  const svg = readFileSync(join(ROOT, src), 'utf8');
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles: [FONT], loadSystemFonts: false, defaultFontFamily: 'Young Serif' },
  })
    .render()
    .asPng();
  writeFileSync(join(ROOT, out), png);
  const size = statSync(join(ROOT, out)).size;
  const tooBig = out.startsWith('emoji/') && size > EMOJI_LIMIT;
  if (tooBig) failed = true;
  console.log(`${tooBig ? 'TOO BIG' : 'ok'}  ${out}  ${width}px  ${(size / 1024).toFixed(1)} KB`);
}
if (failed) {
  console.error('An emoji is over Discord’s 256 KB limit.');
  process.exit(1);
}

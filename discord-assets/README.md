# Discord assets: Five-Minute Heroes

Pixel art for the Five-Minute Heroes Discord server: seven custom emoji, a
server icon and an event cover for the first game night. They were generated
with PixelLab, cleaned up to one shared palette and exported with
nearest-neighbor scaling only, so the pixels stay sharp.

## Files

| File | Art size | Export | What it is |
| --- | --- | --- | --- |
| `emoji/nat20.png` | 32×32 | 128×128 (×4) | A brass d20 showing 20 on a pale-gold starburst. |
| `emoji/nat1.png` | 32×32 | 128×128 (×4) | A slumped bone skull with X eyes and a sweat drop, beside a tiny tarnished d20 showing 1. |
| `emoji/pause.png` | 32×32 | 128×128 (×4) | Two jade bars in a pine circle, for lines and veils. |
| `emoji/gold.png` | 32×32 | 128×128 (×4) | A stack of brass coins with one coin leaning in front. |
| `emoji/boss.png` | 32×32 | 128×128 (×4) | An original green dragon head in profile, with a curved brass horn. |
| `emoji/potion.png` | 32×32 | 128×128 (×4) | A round flask of red potion with a cork. |
| `emoji/rest.png` | 32×32 | 128×128 (×4) | A plain brass lantern with a warm flame, for short and long rests. |
| `server-icon.png` | 64×64 | 512×512 (×8) | A faceted brass d20 showing 20 on dark pine fading to black. Safe for a circle crop. |
| `event/island-of-trials.png` | 200×80 | 800×320 (×4) | A night sea with a ruined tower on an island, one lit window, mist, stars and a crescent moon. The title is set in Silkscreen. |
| `event/island-of-trials@2x.png` | 200×80 | 1600×640 (×8) | The same cover at 2×. |

Each emoji is about 1 KB, far inside Discord's 256 KB limit.

## Build script

`build.mjs` regenerates the exports from the PNGs in this folder:

```bash
npm run discord-assets      # or: node discord-assets/build.mjs
```

For each asset it:

- Reads the PNG back down to its art-scale grid and fails if any art pixel is
  not a clean block, which would mean the file is not a nearest-neighbor upscale.
- Snaps every pixel to the shared palette in `palette.json` using CIELAB
  distance.
- Writes the exports again at their scales, including the cover's `@2x`.
- Fails if an emoji is over Discord's 256 KB limit.

On unchanged files the output is byte-for-byte identical.

## Palette

`palette.json` is the server palette: black `#000000`, ink `#0b0f0c`; pine
`#0f1a14`, `#16251c`, `#1f4a36`, `#3e7a5b`; jade `#6fd39a`; brass `#8a6a1f`,
`#b08a3a`, `#d6b25e`; pale gold `#fae2a0`; bone `#e8e2d0`; ash `#8c8a84`;
potion red `#b8322c`, `#e05a4a`.

## Uploading to Discord

### Server icon

1. Open the server menu (the server name at the top left), then **Server Settings → Overview**.
2. Upload `server-icon.png`, keep the crop centered, then click **Apply** and **Save Changes**.

### Custom emoji

1. Open **Server Settings → Emoji** and click **Upload Emoji**.
2. Select all seven PNGs in `emoji/`. Discord names each emoji after its file
   (`nat20`, `nat1`, `pause`, `gold`, `boss`, `potion`, `rest`).
3. If an older version is already uploaded, delete it first so the names don't clash.

You need the **Manage Expressions** permission. A server without boosts has 50
static emoji slots.

### Event cover

1. In the server, open **Events**, then **Create Event**. Pick a location and click **Next**.
2. Under **Cover Image**, click **Upload Image** and choose
   `event/island-of-trials.png` (or the `@2x` file).
3. Check the preview, then click **Create Event**.

## Licensing

The PixelLab generations are used under PixelLab's
[terms of service](https://pixellab.ai/termsofservice). The Silkscreen font is
© The Silkscreen Project Authors, under the SIL Open Font License 1.1
(`fonts/OFL.txt`).

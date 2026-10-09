# Discord assets: Five-Minute Heroes (pixel art)

Original pixel art for the Five-Minute Heroes Discord server. Every image is a
hand-editable pixel grid stored as JSON, rendered to PNG with nearest-neighbor
scaling (no smoothing, no anti-aliasing). The earlier flat-vector set is kept in
`_vector-archive/`.

## Files

| File | Art grid | Export | What it is |
| --- | --- | --- | --- |
| `server-icon.png` | 64×64 | 512×512 (×8) | A brass faceted d20 showing 20, on a dithered pine-to-black background. Safe for a circle crop. |
| `avatar/dm-hooded.png` | 64×64 | 512×512 (×8) | Hermes DM: a hooded narrator glowing green on black. It has a pointed hood, an empty near-black face with two cold gold-white eye slits, a three-step shoulder mantle, a brass clasp with a jade gem, and a cloak hem that drips away into falling pixels. |
| `emoji/nat20.png` | 32×32 | 128×128 (×4) | A brass d20 showing 20, with a pixel starburst. |
| `emoji/nat1.png` | 32×32 | 128×128 (×4) | A slumped bone-white skull with X eyes and a sweat drop. A tiny tarnished d20 showing 1 sits beside it. |
| `emoji/pause.png` | 32×32 | 128×128 (×4) | A calm pause sign for lines and veils: two jade bars in a pine circle. |
| `emoji/gold.png` | 32×32 | 128×128 (×4) | Two stacks of brass coins with one loose coin in front. |
| `emoji/boss.png` | 32×32 | 128×128 (×4) | An original green dragon head in profile, with a brass horn. |
| `emoji/potion.png` | 32×32 | 128×128 (×4) | A round flask of red potion with a cork. |
| `emoji/rest.png` | 32×32 | 128×128 (×4) | A plain glowing lantern for short and long rests. |
| `event/island-of-trials.png` | 200×80 | 800×320 (×4) | Game-night cover: a dark sea at night with a ruined tower on an island, one lit window, mist, stars and a crescent moon. The title "GAME NIGHT · ISLAND OF TRIALS" is in pixel letters in the left half. |
| `event/island-of-trials@2x.png` | 200×80 | 1600×640 (×8) | The same cover at 2×. |

Every emoji is drawn on the same 32px grid, with a 1px near-black outline and a
1px lighter rim on the top-left (lit) side, so it reads on both Discord's dark
grey and white. Each one is under 1 KB, well inside Discord's 256 KB limit.

The vector `dm-oracle` lantern avatar was retired, and the lantern became the
`rest` emoji.

## Palette (`palette.json`)

Every asset uses one shared palette of 16 colours plus transparency. Each colour
has a one-character key:

| Key | Colour | Use |
| --- | --- | --- |
| `.` | transparent | |
| `K` | `#000000` | pure black |
| `k` | `#0b0f0c` | near-black, outlines |
| `p` | `#0f1a14` | pine, deepest |
| `q` | `#16251c` | pine |
| `g` | `#1f4a36` | pine, mid |
| `G` | `#3e7a5b` | pine leaf |
| `J` | `#6fd39a` | bright jade |
| `r` | `#8a6a1f` | brass, dark |
| `m` | `#b08a3a` | brass, mid (the one added shade, used for d20 facets) |
| `b` | `#d6b25e` | brass |
| `y` | `#fae2a0` | pale gold |
| `w` | `#e8e2d0` | bone |
| `a` | `#8c8a84` | ash |
| `R` | `#b8322c` | potion red |
| `P` | `#e05a4a` | potion red, light |
| `W` | `#f4f1d8` | cold eye white |

## Editing a pixel grid

Each PNG has a JSON source beside it (for example, `emoji/nat20.json` →
`emoji/nat20.png`):

```json
{
  "exports": [{ "file": "nat20.png", "scale": 4 }],
  "rows": [
    "..............kk................",
    ".............kyyk...............",
    "..."
  ]
}
```

- `rows` is the image, one string per pixel row and one character per pixel.
  Characters are palette keys. Every row must be the same width.
- To change a pixel, change its character. Row 0 is the top and character 0 is
  the left edge. A monospace editor with the font zoomed in makes this easy.
- `exports` lists the PNGs to write and the whole-number scale for each.
- The event cover also has a `text` list. The build stamps that text onto the
  grid using `pixel-font.json`, so you can change the title without redrawing
  it:
  `{ "font": "title", "x": 10, "y": 32, "color": "y", "shadow": "r", "value": "ISLAND OF TRIALS" }`.
  `small` is a 3×5 font and `title` is a 4×7 font. Both are uppercase A–Z, and
  `small` also has 0–9. Add a glyph by drawing it with `#` in `pixel-font.json`.
- To add a colour, add a key to `palette.json`. Try to stay under 20 colours.

Then rebuild:

```bash
npm run discord-assets      # or: node discord-assets/build.mjs
```

The build has no dependencies: it encodes PNGs with Node's built-in `zlib`. It
stops with a clear error if a row has the wrong width or uses a key that isn't
in the palette, and it fails if an emoji goes over 256 KB.

## Preview

`preview.html` shows every asset with `image-rendering: pixelated`, on Discord's
dark (`#313338`) and light (`#ffffff`) backgrounds:

- Emoji at 22px (chat), 48px (reactions) and 128px.
- The avatar in 40px and 128px circles.
- The server icon in 48px and 128px circles.
- The event cover at full size.

Serve the folder to view it, for example by running `python3 -m http.server`
from inside `discord-assets/`. `preview.png` is a screenshot of it.

## Uploading to Discord

### Server icon

1. Open the server menu (the server name at the top left), then **Server Settings → Overview**.
2. Click the current icon (or **Upload Image**) and choose `server-icon.png`.
3. Leave the crop centered and click **Apply**, then **Save Changes**.

### Custom emoji

1. Open the server menu, then **Server Settings → Emoji**.
2. Click **Upload Emoji** and select all seven PNGs in `emoji/`.
3. Discord names each emoji after its file (`nat20`, `nat1`, `pause`, `gold`,
   `boss`, `potion`, `rest`). Check the names, then use them in chat as `:nat20:` and so on.
4. If you uploaded the earlier vector emoji, delete those first or replace them
   so the names don't clash.

You need the **Manage Expressions** permission. A server without boosts has 50
static emoji slots.

### Bot avatar (Hermes DM)

Do this once the bot exists in the Discord Developer Portal.

1. Go to <https://discord.com/developers/applications> and open the Hermes DM application.
2. Open the **Bot** tab, click the avatar (**Icon**) and upload `avatar/dm-hooded.png`.
3. Click **Save Changes**. You can also set the same image as the **App Icon** on
   the **General Information** tab.
4. The new avatar can take a few minutes to show up in the server.

### Event cover

1. In the server, open **Events** (above the channel list), then **Create Event**.
2. Choose where it happens (for example, a voice channel) and click **Next**.
3. Fill in the topic, date and time. Under **Cover Image**, click **Upload Image**
   and choose `event/island-of-trials.png` (or the `@2x` file for extra sharpness).
4. Check the preview, then click **Create Event**.

Discord shows its own event details around the cover, so the cover's title stays
small and in the left half.

## Vector archive

`_vector-archive/` holds the earlier flat-vector set: the SVG sources and PNGs,
the Young Serif font (SIL OFL, `fonts/OFL.txt`), the old preview, and
`build-vector.mjs`. To re-render it, run `node discord-assets/_vector-archive/build-vector.mjs`.
That needs the `@resvg/resvg-js` dev dependency, which is still installed.

## Licensing

All artwork here is original and does not use any characters, logos or art from
D&D books or games. The pixel fonts in `pixel-font.json` were drawn for this
project.

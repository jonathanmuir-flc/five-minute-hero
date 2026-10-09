# Discord assets: Five-Minute Heroes

Assets for the Five-Minute Heroes Discord server. The emoji, server icon and
event cover come from the PixelLab MCP. The Hermes DM avatar is a vector edit
that is kept out of git (see [Avatar](#hermes-dm-avatar-gitignored)).

Earlier versions are archived: `_vector-archive/` holds the flat-vector set and
`_pixelgrid-archive/` holds the hand-placed pixel grids.

## Files

| File | Source | Art size | Export | What it is |
| --- | --- | --- | --- | --- |
| `emoji/nat20.png` | PixelLab | 32×32 | 128×128 (×4) | A brass d20 showing 20 on a pale-gold starburst. It's the style reference for the rest of the set. |
| `emoji/nat1.png` | PixelLab + 12-pixel patch | 32×32 | 128×128 (×4) | A slumped bone skull with X eyes and a sweat drop, beside a tiny tarnished d20 showing 1. |
| `emoji/pause.png` | PixelLab | 32×32 | 128×128 (×4) | Two jade bars in a pine circle, for lines and veils. |
| `emoji/gold.png` | PixelLab | 32×32 | 128×128 (×4) | A stack of brass coins with one coin leaning in front. |
| `emoji/boss.png` | PixelLab | 32×32 | 128×128 (×4) | An original green dragon head in profile, with a curved brass horn. |
| `emoji/potion.png` | PixelLab | 32×32 | 128×128 (×4) | A round flask of red potion with a cork. |
| `emoji/rest.png` | PixelLab | 32×32 | 128×128 (×4) | A plain brass lantern with a warm flame, for short and long rests. |
| `server-icon.png` | PixelLab | 64×64 | 512×512 (×8) | A faceted brass d20 showing 20 on dark pine fading to black. Safe for a circle crop. |
| `event/island-of-trials.png` | PixelLab + Silkscreen title | 200×80 | 800×320 (×4) | A night sea with a ruined tower on an island, one lit window, mist, stars and a crescent moon. |
| `event/island-of-trials@2x.png` | same | 200×80 | 1600×640 (×8) | The same cover at 2×. |
| `avatar/hermes-dm.svg` and `.png` | vector edit, **gitignored** | 512×512 | 512×512 | Hermes DM: the reference character in a pine hood and mantle with a brass clasp. |

Each emoji is about 1 KB, far inside Discord's 256 KB limit.

## How the pixel assets are made

1. **Generate.** Every pixel asset was made with PixelLab's `create_image_pro`,
   which returns 64 candidates per call at 32×32 (16 at 64×64). nat20 was
   generated first. Candidate 51 was picked and then passed as the
   `style_image` for every other emoji and the server icon, so the set shares
   one outline, detail level and shading. pause, boss and nat1 copy only the
   style, not nat20's colours. The cover was generated directly at 200×80.
   `source/pixellab.json` records each job ID, the candidate picked and the
   style settings.
2. **Keep the raw pick.** The chosen generations are in `source/`, unchanged.
3. **Clean up and export.** `build.mjs` does the rest:
   - Snaps every pixel to the shared palette (`palette.json`) using CIELAB
     distance. Each asset is limited to a sensible subset, so a generated
     orange becomes brass rather than potion red.
   - Removes isolated stray pixels.
   - Adds a 1px near-black outline wherever the silhouette lacks one, plus a
     1px lighter rim on the top-left (lit) edges, so each emoji reads on both
     Discord grey and white.
   - Applies any small documented patches. Only nat1 has one: its tiny die
     came out with an "o", so the build redraws a 1.
   - Stamps the cover title in Silkscreen (OFL, `fonts/`) at art scale, as two
     lines in the left half: "GAME NIGHT ·" and "ISLAND OF TRIALS".
   - Upscales with nearest-neighbor only.

To swap in a different generation, replace the file in `source/` and rebuild:

```bash
npm run discord-assets      # or: node discord-assets/build.mjs
```

### Palette

`palette.json` is the server palette: black `#000000`, ink `#0b0f0c`; pine
`#0f1a14`, `#16251c`, `#1f4a36`, `#3e7a5b`; jade `#6fd39a`; brass `#8a6a1f`,
`#d6b25e`; pale gold `#fae2a0`; bone `#e8e2d0`; ash `#8c8a84`; potion red
`#b8322c`, `#e05a4a`. I added one mid brass, `#b08a3a`, so the d20 facets and
coins keep a middle shade.

## Hermes DM avatar (gitignored)

`reference/hermes-agent.svg` is Nous Research's Hermes Agent mascot. This repo
is public, so **the reference and everything in `discord-assets/avatar/` are in
`.gitignore` and must never be committed.**

`avatar/hermes-dm.svg` keeps the original ink path exactly as drawn. Only the
white areas inside her silhouette are filled with bone `#e8e2d0`, behind the
ink. Added around her:

- A pine hood rising to a soft point.
- A turned-back front edge.
- Sharp jade highlight cuts on the folds, lit from above.
- A two-layer mantle.
- A brass clasp with a faceted jade gem.

The background is black with a faint pine glow. The hood tip and face sit
inside the center 80% for Discord's circle crop.

`npm run discord-assets` renders `avatar/hermes-dm.png` whenever the SVG is
present locally, and skips it otherwise.

## Preview

`preview.html` shows the emoji at 22, 48 and 128px on Discord's dark (`#313338`)
and light (`#ffffff`) backgrounds. It also shows the avatar in 40px and 128px
circles, the server icon in 48px and 128px circles, and the full cover. Pixel
assets use `image-rendering: pixelated` and the avatar renders smooth. Serve the
folder to view it, for example by running `python3 -m http.server` inside
`discord-assets/`.

- `preview.png` (committed) was taken with `preview.html?public`, which hides
  the avatar.
- `avatar/preview-full.png` (gitignored) includes the avatar.

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

### Bot avatar (Hermes DM)

1. In the [Discord Developer Portal](https://discord.com/developers/applications),
   open the Hermes DM application.
2. On the **Bot** tab, click the avatar (**Icon**) and upload your local
   `avatar/hermes-dm.png`, then click **Save Changes**.
3. The new avatar can take a few minutes to show up in the server.

### Event cover

1. In the server, open **Events**, then **Create Event**. Pick a location and click **Next**.
2. Under **Cover Image**, click **Upload Image** and choose
   `event/island-of-trials.png` (or the `@2x` file).
3. Check the preview, then click **Create Event**.

## Licensing

The PixelLab generations are used under PixelLab's terms of service. The
Silkscreen font is © The Silkscreen Project Authors, under the SIL OFL 1.1
(`fonts/OFL.txt`). The avatar is a derivative of third-party artwork, which is
why it stays local and out of the repo.

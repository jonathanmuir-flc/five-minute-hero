# Discord assets: Five-Minute Heroes

Original artwork for the Five-Minute Heroes Discord server, made to match the
server icon (`reference/five-minute-heroes-icon.png`): a brass d20 on pine green
with dark-brown outlines and a flat, slightly dimensional vector look.

Each image is drawn as an SVG source (kept next to its PNG). `build.mjs` exports
the PNGs.

| Palette | |
| --- | --- |
| Pine | `#16251c` / `#0f1a14` (plus `#1f4a36` and `#3e7a5b` from the quiz app) |
| Brass | `#d6b25e` / `#8a6a1f` |
| Pale gold | `#fae2a0` |
| Ink | `#1d2a22` |
| Outline | `#4a3410` (emoji), `#2a1d08` (avatars) |

The only colours outside this palette are the potion's red, its pale glass, the
nat1 skull's bone white and the cold white of the hooded DM's eyes.

## Files

### `emoji/`: custom emoji (128×128 PNG, transparent, each under 256 KB)

| File | Discord name | What it is |
| --- | --- | --- |
| `nat20.png` | `:nat20:` | A brass d20 showing 20 with a gold burst. Use it to celebrate. |
| `nat1.png` | `:nat1:` | A slumped cartoon skull with X eyes and a sweat drop. A tiny tarnished d20 showing 1 rolls away from it. |
| `pause.png` | `:pause:` | A calm pause sign for lines and veils. Anyone can drop it to stop the scene, no questions asked. |
| `gold.png` | `:gold:` | Two stacks of brass coins with one loose coin in front. |
| `boss.png` | `:boss:` | An original green dragon head with brass horns, for boss fights. |
| `potion.png` | `:potion:` | A red healing potion. |

The emoji share one outline colour and weight and use the same brass shading,
so they read as a set (the nat1 skull is bone white rather than brass, so it
can't be mistaken for nat20). They are drawn to stay readable at 22px (chat) and 48px
(reactions).

### `avatar/`: Hermes DM bot avatar (512×512 PNG, two options)

| File | What it is |
| --- | --- |
| `dm-hooded.png` | An ominous hooded narrator in a tall, pointed, tattered hood. The face is near-black except for two narrow slanted eyes glowing cold pale gold to white, and a faintly glowing open book lights the inside of the hood from below. |
| `dm-oracle.png` | A brass lantern with a friendly face in its flame. |

Discord crops avatars to a circle. Everything important sits inside the center
80% (radius 205px). Both use a pine background: the oracle matches the server
icon, and the hooded narrator uses a darker vignette. The oracle is friendly
and the hooded narrator is ominous. Neither has orange or red glow or teeth,
so both stay clearly different from an orange-eyed demon avatar.

### `event/`: game-night event cover

| File | Size |
| --- | --- |
| `island-of-trials.png` | 800×320 (Discord's cover size) |
| `island-of-trials@2x.png` | 1600×640 |

The scene is a ruined tower on an island at dusk, seen from the sea, with mist,
stars and a crescent moon. The title, "Game Night · Island of Trials", is set in
Young Serif over two lines in the left half, away from the edges.

### Other files

- `preview.html`: shows every asset on Discord's dark (`#313338`) and light
  (`#ffffff`) backgrounds. Emoji appear at 22, 48 and 128px, avatars in 40px
  and 128px circles, and the cover at full size. Serve the folder to view it,
  for example with `python3 -m http.server` from inside `discord-assets/`.
- `preview.png`: a screenshot of `preview.html`.
- `fonts/YoungSerif-Regular.ttf`: Young Serif, under the SIL Open Font License
  (`fonts/OFL.txt`). The export script uses it for the dice numbers and the
  cover title.

## Rebuilding the PNGs

```bash
npm install
npm run discord-assets      # or: node discord-assets/build.mjs
```

Edit an SVG, then rerun the export. The script uses `@resvg/resvg-js` and loads
only the bundled Young Serif, so the output is the same on every machine. It
fails if an emoji goes over 256 KB.

## Uploading to Discord

### Custom emoji

1. Open the server menu (the server name at the top left), then **Server Settings → Emoji**.
2. Click **Upload Emoji** and select the PNGs in `emoji/`. You can select all six at once.
3. Discord uses each file name as the emoji name (`nat20`, `nat1`, `pause`, `gold`,
   `boss`, `potion`). Check the names in the list and fix any that changed.
4. Use them in chat as `:nat20:` and so on.

You need the **Manage Expressions** permission. A server without boosts has 50
static emoji slots.

### Bot avatar (Hermes DM)

Do this once the bot exists in the Discord Developer Portal.

1. Go to <https://discord.com/developers/applications> and open the Hermes DM application.
2. Open the **Bot** tab and click the avatar (**Icon**) to upload `avatar/dm-hooded.png`
   or `avatar/dm-oracle.png`.
3. Click **Save Changes**. You can also set the same image as the **App Icon** on
   the **General Information** tab.
4. The new avatar can take a few minutes to show up in the server.

### Event cover

1. In the server, open **Events** (above the channel list), then **Create Event**.
2. Choose where it happens (for example, a voice channel) and click **Next**.
3. Fill in the topic, date and time. Under **Cover Image**, click **Upload Image**
   and choose `event/island-of-trials.png` (use the `@2x` file if you want it
   sharper on high-DPI screens).
4. Check the preview, then click **Create Event**.

Discord shows the event name, time and location below or on top of the cover,
so the cover's own title is kept small and in the left half.

## Licensing

All artwork here is original and does not use any characters, logos or art from
D&D books or games. Young Serif is © The Young Serif Project Authors, under the
SIL OFL 1.1.

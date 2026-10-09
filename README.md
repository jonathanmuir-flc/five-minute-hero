# Five-Minute Hero

Answer six questions and get a ready-to-play level 5 D&D character, built from
the free SRD 5.2, before a remote one-shot.

**Live: <https://jonathanmuir-flc.github.io/five-minute-hero/>**

Built for the Five-Minute Heroes Discord group. Each player takes the quiz in a
couple of minutes, copies a short summary into Discord and downloads a JSON file
for the DM. No backend, no accounts, no database: everything runs in the browser.

## Features

- **Six questions, one hero.** Four questions pick the class, one picks the body
  type (and so the species) and one picks the tone.
- **Level 5, ready to play.** Class, species, ability scores from the standard
  array, a background, a hook and a suggested name.
- **Live character sheet.** It appears once four questions are answered and
  updates as you change answers. "Try `<Class>` instead" swaps in the runner-up.
- **Copy for Discord.** Plain labelled lines on the clipboard, with a
  select-to-copy fallback if the browser blocks clipboard access.
- **Download for the DM.** A stable `Character` JSON, scores listed STR to CHA,
  made to be read by an AI DM.
- **Light, dark and auto themes**, with an accessible, readable type setup.

## Tech stack

Vite, React 19 and TypeScript, tested with Vitest. Deployed to GitHub Pages by
GitHub Actions.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173/five-minute-hero/
npm test           # golden cases, rules, and parity with the prototype
npm run build      # type-check with tsc, then bundle into dist/
npm run preview    # serve the production build locally
```

## Deploy

The workflow in `.github/workflows/deploy.yml` tests, builds and publishes the
site to GitHub Pages on every push to `main`. `vite.config.ts` sets
`base: '/five-minute-hero/'`, which must match the repository name. One-time
setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## How it is put together

| Folder            | What lives there                                                                 |
| ----------------- | -------------------------------------------------------------------------------- |
| `src/data/`       | The content: questions and scoring weights, classes, species fit, hooks, names   |
| `src/lib/`        | Pure functions with tests: `scoreClasses`, `pickSpecies`, `assignStats`, `buildHero`, `buildSummary` |
| `src/components/` | `Question`, `CharacterSheet`, `CopyButton`, `DownloadButton`                     |
| `src/types/`      | `Character`, the shape of the JSON file for the DM                               |
| `src/App.tsx`     | The single page: six questions, the names box, and the live character sheet      |
| `discord-assets/` | Pixel-art emoji, server icon and event cover for the Discord server              |

### How a hero is built

1. Questions 1 to 4 add points to classes. Question 5 picks a body type (which
   lists species) and question 6 picks the tone.
2. Classes are ranked by points, ties broken alphabetically. The top class wins.
3. The species is the first one in the question 5 answer that suits the class.
   If none suits it, the first one is used. With no answer, the hero is Human.
4. The standard array (15, 14, 13, 12, 10, 8) is dealt out in the class's
   ability priority order. Background ability bonuses are not applied. The DM
   does that.
5. If no name is typed, the suggested name is `NAMES[species][class name length % 2]`.
6. "Try `<Class>` instead" switches to the highest-ranked other class.
   Changing any answer clears that choice.

### Content comes from the prototype

`reference/hero-picker.html` is the source of truth for all content: question
text, scoring weights, classes, species fit, hooks, names and the Discord copy
format. Copy values from it; do not reword them. `src/lib/prototype.test.ts`
runs the prototype's own data and scoring code and checks this app against it,
for every possible set of answers.

### Discord assets

Pixel art for the server lives in [`discord-assets/`](discord-assets/README.md)
and is regenerated with `npm run discord-assets`.

## Credits

- Character options come from the System Reference Document 5.2 by Wizards of
  the Coast LLC, licensed under
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Young Serif and Silkscreen are used under the
  [SIL Open Font License 1.1](https://openfontlicense.org). The app also uses
  Atkinson Hyperlegible and JetBrains Mono, both under the same license.
- Pixel assets were made with [PixelLab](https://pixellab.ai).

## License

The code is released under the [MIT License](LICENSE). SRD 5.2 content remains
under CC BY 4.0, and fonts keep their own licenses.

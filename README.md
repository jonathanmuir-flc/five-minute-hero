# Five-Minute Hero

A tiny web app for the minutes before a remote D&D one-shot. Each player answers
six questions and gets a ready-to-play **level 5** character built only from
the free [System Reference Document 5.2](https://www.dndbeyond.com/srd) options,
then copies a short summary into Discord and downloads a JSON file for the DM.

No backend, no accounts, no database. Everything runs in the browser.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173/five-minute-hero/
```

Other scripts:

```bash
npm test           # Vitest unit tests for the pure logic in src/lib
npm run build      # type-check with tsc, then bundle into dist/
npm run preview    # serve the production build locally
```

## How it is put together

| Folder            | What lives there                                                        |
| ----------------- | ----------------------------------------------------------------------- |
| `src/data/`       | Typed content: classes, species, questions and weights, hooks, names    |
| `src/lib/`        | Pure functions with tests: `scoreClasses`, `pickSpecies`, `assignStats`, `buildSummary`, `buildCharacter` |
| `src/components/` | `Question`, `CharacterSheet`, `CopyButton`, `DownloadButton`            |
| `src/types/`      | `Character`, the shape of the JSON file the DM (and the AI DM) will read |
| `src/App.tsx`     | The three screens: intro, quiz, sheet. All state lives here             |

The quiz is deterministic: the same six answers always produce the same
character, name suggestions and story hook. Ability scores use the standard
array (15, 14, 13, 12, 10, 8) dealt out in each class's priority order.

### Note on the data

`reference/hero-picker.html` was meant to be the source of truth for the
questions, weights, hooks, names and copy format. It was missing when this
was built, so everything in `src/data/` is a clearly labelled first pass.
Swapping in the prototype's values is a data-only change; the logic and UI
do not need to move.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and publishes the site
on every push to `main`. `vite.config.ts` sets `base: '/five-minute-hero/'`,
which must match the repository name.

One-time setup after the repo exists on GitHub:

1. Open the repo on github.com, then **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or re-run the workflow from the Actions tab).

The site will be at `https://jonathanmuir-flc.github.io/five-minute-hero/`.

## Licence note

Built with content from the System Reference Document 5.2 by Wizards of the
Coast LLC, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

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
npm test           # Vitest: golden cases, rules, and parity with the prototype
npm run build      # type-check with tsc, then bundle into dist/
npm run preview    # serve the production build locally
```

## How it is put together

| Folder            | What lives there                                                                 |
| ----------------- | -------------------------------------------------------------------------------- |
| `src/data/`       | The content: questions and scoring weights, classes, species fit, hooks, names   |
| `src/lib/`        | Pure functions with tests: `scoreClasses`, `pickSpecies`, `assignStats`, `buildHero`, `buildSummary` |
| `src/components/` | `Question`, `CharacterSheet`, `CopyButton`, `DownloadButton`                     |
| `src/types/`      | `Character`, the shape of the JSON file for the DM (and the AI DM)               |
| `src/App.tsx`     | The single page: six questions, the names box, and the live character sheet      |

It is one page. The sheet appears once at least four questions are answered.
Before that it shows "(n of 6 answered)".

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
6. "Try <Class> instead" switches to the highest-ranked other class.
   Changing any answer clears that choice.

### Content comes from the prototype

`reference/hero-picker.html` is the source of truth for all content: question
text, scoring weights, classes, species fit, hooks, names and the Discord copy
format. Copy values from it; do not reword them. `src/lib/prototype.test.ts`
runs the prototype's own data and scoring code and checks this app against it,
for every possible set of answers.

## Output

- **Copy for Discord** puts plain labelled lines on the clipboard (PLAYER,
  CHARACTER, VIBE, SCORES, HOOK, DM). If the browser blocks clipboard access,
  the visible text box is selected so the player can copy by hand.
- **Download for the DM** saves the `Character` JSON from
  `src/types/character.ts`. Scores are listed STR to CHA. This file is meant for
  the AI DM.

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

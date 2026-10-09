# Five-Minute Hero

A Vite + React + TypeScript quiz. Each friend answers six questions and gets a
ready-to-play **level 5** D&D character before a remote one-shot. No backend.
Deployed to GitHub Pages (`vite.config.ts` base is `/five-minute-hero/`).

## Parity rule

`reference/hero-picker.html` is the content source of truth. Copy its values
exactly. Do not paraphrase, reorder or "improve" questions, weights, classes,
species fit, hooks, names or the Discord copy format. `src/lib/prototype.test.ts`
evaluates the prototype's script and compares this app against it, so a
mismatch fails `npm test`. If content should change, change the prototype first,
then the app.

## Where things live

- `src/data/questions.ts`: the six questions, titles, subtitles and weights.
- `src/data/classes.ts`: the 12 classes (ability priority, background, pitch, three "turn" bullets).
- `src/data/species.ts`: species fit, names, hooks, tone labels.
- `src/data/abilities.ts`: standard array and ability order.
- `src/lib/`: pure logic (`scoreClasses`, `pickSpecies`, `assignStats`, `buildHero`, `buildSummary`).
- `src/types/character.ts`: the JSON the DM downloads.
- `src/styles.css`: the prototype's color tokens (light and dark) and fonts.

## Decisions

- **No background ability bonuses.** Scores are the plain standard array. The DM applies bonuses.
- **SRD 5.2 only.** Keep the CC BY 4.0 attribution in the footer.
- **The JSON is for the AI DM.** Keep the `Character` shape stable and scores in STR to CHA order.
- Only questions 1 to 4 score classes. Question 5 picks species, question 6 picks tone.
- Ties sort alphabetically. The sheet shows at 4 or more answers. Changing an answer clears "Try <Class> instead".
- Fonts: Young Serif (display), Atkinson Hyperlegible (body), JetBrains Mono (stats and copy box).
- The theme toggle (auto, dark, light) is kept on top of the prototype's `prefers-color-scheme` tokens.

## Commands

```bash
npm run dev     # http://localhost:5173/five-minute-hero/
npm test        # must pass before committing
npm run build   # tsc -b, then vite build
```

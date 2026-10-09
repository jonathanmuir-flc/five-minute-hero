import { CLASSES, type ClassName } from '../data/classes'
import { HOOKS, NAMES, type SpeciesName } from '../data/species'
import type { Character, Tone } from '../types/character'
import { MIN_ANSWERS, answeredCount, chosenOption, type Answers } from './answers'
import { assignStats } from './assignStats'
import { pickSpecies } from './pickSpecies'
import { scoreClasses } from './scoreClasses'

/** "An" before a species that starts with a vowel, otherwise "A". */
export function articleFor(species: string): 'A' | 'An' {
  return /^[AEIOU]/.test(species) ? 'An' : 'A'
}

/** The suggested name when the name field is blank. */
export function suggestName(species: SpeciesName, className: ClassName): string {
  return NAMES[species][className.length % 2]
}

/** The q6 tone, or noble when q6 is unanswered. */
export function pickTone(answers: Answers): Tone {
  return chosenOption(answers, 'q6')?.tone ?? 'noble'
}

export interface HeroInput {
  player: string
  /** The character name field. Blank means "suggest one". */
  charName: string
  /** A class the player switched to ("Try X instead"), or null for the best match. */
  override: ClassName | null
}

export interface Hero {
  /** What goes into the "Download for the DM" JSON. */
  character: Character
  className: ClassName
  /** The top-ranked class, whether or not it is currently shown. */
  bestMatch: ClassName
  /** The highest-ranked class that isn't the current one. */
  runnerUp: ClassName
  overridden: boolean
  article: 'A' | 'An'
}

/** Null until at least MIN_ANSWERS questions are answered. */
export function buildHero(answers: Answers, input: HeroInput): Hero | null {
  if (answeredCount(answers) < MIN_ANSWERS) return null

  const ranked = scoreClasses(answers)
  const bestMatch = ranked[0].className
  const className = input.override ?? bestMatch
  const runnerUp = ranked.find((r) => r.className !== className)!.className
  const species = pickSpecies(answers, className)
  const tone = pickTone(answers)
  const info = CLASSES[className]

  return {
    character: {
      player: input.player.trim(),
      name: input.charName.trim() || suggestName(species, className),
      level: 5,
      species,
      class: className,
      background: info.bg,
      scores: assignStats(className),
      tone,
      hook: HOOKS[tone],
    },
    className,
    bestMatch,
    runnerUp,
    overridden: input.override !== null,
    article: articleFor(species),
  }
}

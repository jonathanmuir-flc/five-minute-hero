import { ABILITIES, ABILITY_KEY, STANDARD_ARRAY, type Ability } from '../data/abilities'
import { CLASSES, type ClassName } from '../data/classes'
import type { AbilityScores } from '../types/character'

/**
 * Deal the standard array (15, 14, 13, 12, 10, 8) out in the class's
 * priority order. No background bonuses: the DM applies those.
 * The result is built in STR to CHA order so the DM's JSON reads like a sheet.
 */
export function assignStats(className: ClassName): AbilityScores {
  const priority = CLASSES[className].pri
  const scores = {} as AbilityScores
  for (const ability of ABILITIES) {
    scores[ABILITY_KEY[ability]] = STANDARD_ARRAY[priority.indexOf(ability)]
  }
  return scores
}

/** D&D ability modifier: (score - 10) / 2, rounded down. */
export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

/** "+3" or "-1", the way sheets print modifiers. */
export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export function scoreFor(scores: AbilityScores, ability: Ability): number {
  return scores[ABILITY_KEY[ability]]
}

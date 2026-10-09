import { CLASSES, type ClassId } from '../data/classes'
import type { AbilityKey, AbilityScores } from '../types/character'

/** The standard array from the SRD, best to worst. */
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const

/** Order the six abilities are shown in on a sheet. */
export const ABILITY_ORDER: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

export const ABILITY_LABEL: Record<AbilityKey, string> = {
  str: 'STR',
  dex: 'DEX',
  con: 'CON',
  int: 'INT',
  wis: 'WIS',
  cha: 'CHA',
}

/**
 * Deal the standard array out in the class's priority order:
 * the class's most important ability gets 15, the next gets 14, and so on.
 */
export function assignStats(classId: ClassId): AbilityScores {
  const priority = CLASSES[classId].statPriority
  // Build the object in STR..CHA order so the JSON file reads like a sheet,
  // whatever order the class's priority list is in.
  const scores = {} as AbilityScores
  for (const ability of ABILITY_ORDER) {
    scores[ability] = STANDARD_ARRAY[priority.indexOf(ability)]
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

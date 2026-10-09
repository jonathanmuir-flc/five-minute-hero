// Content source of truth: reference/hero-picker.html (STD and AB).
import type { AbilityKey } from '../types/character'

/** Ability labels as the prototype writes them. */
export type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'

/** Display order on a sheet (the prototype's AB). */
export const ABILITIES: readonly Ability[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']

/** The standard array, best to worst (the prototype's STD). */
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const

/** Label to the lower-case key used in the "Download for the DM" JSON. */
export const ABILITY_KEY: Record<Ability, AbilityKey> = {
  STR: 'str',
  DEX: 'dex',
  CON: 'con',
  INT: 'int',
  WIS: 'wis',
  CHA: 'cha',
}

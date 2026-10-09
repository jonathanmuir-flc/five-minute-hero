// Numbers that follow from the character but are not stored in it:
// hit points and proficiency bonus at level 5.
import { CLASSES, type ClassId, type ClassInfo } from '../data/classes'
import type { Character } from '../types/character'
import { abilityModifier } from './assignStats'

export const PROFICIENCY_BONUS_LEVEL_5 = 3

/** Level 1 gets the full Hit Die; each level after that gets the average (rounded up). */
export function hitPointsAtLevel5(hitDie: ClassInfo['hitDie'], conScore: number): number {
  const conMod = abilityModifier(conScore)
  const perLevelAverage = hitDie / 2 + 1
  return hitDie + 4 * perLevelAverage + 5 * conMod
}

/** Look a class up by its display name (Character stores names, not ids). */
export function classByName(name: string): ClassInfo {
  const found = (Object.keys(CLASSES) as ClassId[]).map((id) => CLASSES[id]).find((c) => c.name === name)
  if (!found) throw new Error(`Unknown class: ${name}`)
  return found
}

export function characterHitPoints(character: Character): number {
  return hitPointsAtLevel5(classByName(character.class).hitDie, character.scores.con)
}

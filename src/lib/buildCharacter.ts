// Glue: turn six answers into a finished Character.
import { CLASSES, type SpeciesId } from '../data/classes'
import { HOOKS } from '../data/hooks'
import { NAMES } from '../data/names'
import { SPECIES } from '../data/species'
import type { AnswerOption } from '../data/questions'
import type { Character, Tone } from '../types/character'
import { assignStats } from './assignStats'
import { pickSpecies } from './pickSpecies'
import { scoreClasses } from './scoreClasses'
import { pickBySeed, seedFromAnswers } from './seed'

export const DEFAULT_TONE: Tone = 'heroic'

export function pickTone(answers: AnswerOption[]): Tone {
  // Walk backwards so the last tone-setting answer wins.
  for (let i = answers.length - 1; i >= 0; i--) {
    const tone = answers[i].tone
    if (tone) return tone
  }
  return DEFAULT_TONE
}

export function pickHook(tone: Tone, className: string, seed: number): string {
  return pickBySeed(HOOKS[tone], seed).replaceAll('{class}', className)
}

/** Three name ideas for the species, rotated by seed so the first one varies. */
export function suggestNames(speciesId: SpeciesId, seed: number, count = 3): string[] {
  const list = NAMES[speciesId]
  const start = seed % list.length
  return Array.from({ length: Math.min(count, list.length) }, (_, i) => list[(start + i) % list.length])
}

export interface BuildOptions {
  player?: string
  /** Override the auto-picked name (when the player clicks a suggestion). */
  name?: string
}

export function buildCharacter(answers: AnswerOption[], options: BuildOptions = {}): Character {
  const seed = seedFromAnswers(answers)
  const classId = scoreClasses(answers)[0].classId
  const classInfo = CLASSES[classId]
  const speciesId = pickSpecies(answers, classId)
  const tone = pickTone(answers)

  return {
    player: options.player ?? '',
    name: options.name ?? suggestNames(speciesId, seed)[0],
    level: 5,
    species: SPECIES[speciesId].name,
    class: classInfo.name,
    background: classInfo.background,
    scores: assignStats(classId),
    tone,
    hook: pickHook(tone, classInfo.name, seed),
  }
}

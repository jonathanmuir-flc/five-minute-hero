import { ABILITIES } from '../data/abilities'
import { CLASSES, type ClassName } from '../data/classes'
import { TONE_LABEL } from '../data/species'
import type { Character } from '../types/character'
import { scoreFor } from './assignStats'

/**
 * The "Copy for Discord" text. The line format and labels match the
 * prototype exactly, including the closing DM line.
 */
export function buildSummary(character: Character): string {
  const info = CLASSES[character.class as ClassName]
  const scores = ABILITIES.map((a) => `${a} ${scoreFor(character.scores, a)}`).join(', ')
  return [
    `PLAYER: ${character.player || '(your name)'}`,
    `CHARACTER: ${character.name}, level ${character.level} ${character.species} ${character.class} (${character.background} background)`,
    `VIBE: ${info.pitch}. Played as ${TONE_LABEL[character.tone]}.`,
    `SCORES (standard array): ${scores}`,
    `HOOK: ${character.hook}`,
    'DM: please finish the sheet (background bonuses, HP, gear, spells) from the SRD.',
  ].join('\n')
}

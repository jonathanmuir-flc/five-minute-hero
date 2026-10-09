import type { Character } from '../types/character'
import { ABILITY_LABEL, ABILITY_ORDER, abilityModifier, formatModifier } from './assignStats'
import { PROFICIENCY_BONUS_LEVEL_5, characterHitPoints } from './derive'

function capitalise(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * The text that gets pasted into Discord. Uses Discord's markdown
 * (**bold**) and keeps to a few short lines so it reads well on a phone.
 */
export function buildSummary(character: Character): string {
  const scores = ABILITY_ORDER.map((key) => {
    const score = character.scores[key]
    return `${ABILITY_LABEL[key]} ${score} (${formatModifier(abilityModifier(score))})`
  }).join(' · ')

  const lines = [
    `**${character.name}** — Level ${character.level} ${character.species} ${character.class} (${character.background})`,
    scores,
    `HP ${characterHitPoints(character)} · Proficiency +${PROFICIENCY_BONUS_LEVEL_5} · Tone: ${capitalise(character.tone)}`,
    `*${character.hook}*`,
  ]
  if (character.player.trim()) lines.push(`Played by ${character.player.trim()}`)
  return lines.join('\n')
}

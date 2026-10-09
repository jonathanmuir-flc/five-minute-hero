import type { ClassName } from '../data/classes'
import { SPECIES_FIT, type SpeciesName } from '../data/species'
import { chosenOption, type Answers } from './answers'

/**
 * The first q5 species that fits the chosen class; if none fits, the first
 * q5 species. With no q5 answer the hero is Human.
 */
export function pickSpecies(answers: Answers, className: ClassName): SpeciesName {
  const candidates = chosenOption(answers, 'q5')?.species ?? (['Human'] as const)
  return candidates.find((sp) => SPECIES_FIT[sp]?.includes(className)) ?? candidates[0]
}

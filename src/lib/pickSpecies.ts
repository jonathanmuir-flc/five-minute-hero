import { CLASSES, type ClassId, type SpeciesId } from '../data/classes'
import { SPECIES_IDS } from '../data/species'
import type { AnswerOption } from '../data/questions'

/**
 * Species = answer species weights + a small bonus for species that suit
 * the chosen class (3 / 2 / 1 for the class's first / second / third
 * affinity). Ties keep SPECIES_IDS order.
 */
export function pickSpecies(answers: AnswerOption[], classId: ClassId): SpeciesId {
  const totals: Record<SpeciesId, number> = Object.fromEntries(
    SPECIES_IDS.map((id) => [id, 0]),
  ) as Record<SpeciesId, number>

  for (const answer of answers) {
    for (const [id, weight] of Object.entries(answer.speciesWeights ?? {}) as [SpeciesId, number][]) {
      totals[id] += weight
    }
  }

  CLASSES[classId].speciesAffinity.forEach((id, index) => {
    totals[id] += 3 - index
  })

  let best: SpeciesId = SPECIES_IDS[0]
  for (const id of SPECIES_IDS) {
    if (totals[id] > totals[best]) best = id
  }
  return best
}

import { CLASS_IDS, type ClassId } from '../data/classes'
import type { AnswerOption } from '../data/questions'

export interface ClassScore {
  classId: ClassId
  score: number
}

/**
 * Add up every answer's class weights. Returns all twelve classes, highest
 * score first. Ties keep the alphabetical order of CLASS_IDS so the result
 * is stable.
 */
export function scoreClasses(answers: AnswerOption[]): ClassScore[] {
  const totals: Record<ClassId, number> = Object.fromEntries(
    CLASS_IDS.map((id) => [id, 0]),
  ) as Record<ClassId, number>

  for (const answer of answers) {
    // TS pattern: `Object.entries` loses the key type, so we cast it back.
    for (const [id, weight] of Object.entries(answer.classWeights) as [ClassId, number][]) {
      totals[id] += weight
    }
  }

  return CLASS_IDS.map((classId) => ({ classId, score: totals[classId] })).sort(
    (a, b) => b.score - a.score,
  )
}

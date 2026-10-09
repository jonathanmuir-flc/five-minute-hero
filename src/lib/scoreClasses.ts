import { CLASS_NAMES, type ClassName } from '../data/classes'
import { SCORING_QUESTION_IDS } from '../data/questions'
import { chosenOption, type Answers } from './answers'

export interface ClassScore {
  className: ClassName
  points: number
}

/**
 * Add up class points from q1-q4 only (q5 picks species, q6 picks tone).
 * Returns all twelve classes sorted by points descending, ties alphabetical.
 */
export function scoreClasses(answers: Answers): ClassScore[] {
  const totals = Object.fromEntries(CLASS_NAMES.map((name) => [name, 0])) as Record<ClassName, number>

  for (const id of SCORING_QUESTION_IDS) {
    const points = chosenOption(answers, id)?.points
    if (!points) continue
    for (const [name, value] of Object.entries(points) as [ClassName, number][]) {
      totals[name] += value
    }
  }

  return CLASS_NAMES.map((className) => ({ className, points: totals[className] })).sort(
    (a, b) => b.points - a.points || a.className.localeCompare(b.className),
  )
}

// Shared by the unit tests.
import { QUESTIONS } from '../data/questions'
import type { Answers } from './answers'

/** Build answers from 0-based option indexes in q1..q6 order; `undefined` leaves a question unanswered. */
export function pick(...indexes: (number | undefined)[]): Answers {
  const answers: Answers = {}
  QUESTIONS.forEach((q, i) => {
    const index = indexes[i]
    if (index !== undefined) answers[q.id] = index
  })
  return answers
}

import { QUESTIONS, type AnswerOption, type QuestionId } from '../data/questions'

/** The 0-based option index the player picked for each question they answered. */
export type Answers = Partial<Record<QuestionId, number>>

/** The sheet appears once this many questions are answered. */
export const MIN_ANSWERS = 4

export function answeredCount(answers: Answers): number {
  return QUESTIONS.filter((q) => answers[q.id] !== undefined).length
}

/** The chosen option for a question, or undefined if unanswered. */
export function chosenOption(answers: Answers, id: QuestionId): AnswerOption | undefined {
  const index = answers[id]
  if (index === undefined) return undefined
  return QUESTIONS.find((q) => q.id === id)?.options[index]
}

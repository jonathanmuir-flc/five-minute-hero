// Tiny deterministic helpers so the same answers always give the same
// character (and so tests are repeatable). No randomness anywhere.
import type { AnswerOption } from '../data/questions'

/** Classic string hash (djb2). Good enough for picking from short lists. */
export function hashString(input: string): number {
  let hash = 5381
  for (let i = 0; i < input.length; i++) {
    // `| 0` keeps the number inside 32-bit integer range.
    hash = ((hash << 5) + hash + input.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function seedFromAnswers(answers: AnswerOption[]): number {
  return hashString(answers.map((a) => a.id).join('|'))
}

/** Pick one item from a list using a seed. */
export function pickBySeed<T>(items: readonly T[], seed: number): T {
  if (items.length === 0) throw new Error('pickBySeed: empty list')
  // TS pattern: `<T>` is a *generic*. The function works for a list of
  // anything and returns the same kind of thing it was given.
  return items[seed % items.length]
}

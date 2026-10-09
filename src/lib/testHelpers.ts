// Shared by the unit tests: look answer options up by id.
import { QUESTIONS, type AnswerOption } from '../data/questions'

export function answers(...ids: string[]): AnswerOption[] {
  return ids.map((id) => {
    for (const q of QUESTIONS) {
      const found = q.options.find((o) => o.id === id)
      if (found) return found
    }
    throw new Error(`No answer option with id "${id}"`)
  })
}

/** A full six-answer path that should clearly land on Fighter. */
export const FIGHTER_PATH = ['brawl-swing', 'power-grit', 'weapon-big', 'role-tank', 'heart-loyal', 'tone-heroic']
/** A full six-answer path that should clearly land on Wizard. */
export const WIZARD_PATH = ['brawl-mutter', 'power-books', 'weapon-wand', 'role-blast', 'heart-curious', 'tone-mysterious']

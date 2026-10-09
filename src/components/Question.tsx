import type { Question as QuestionData } from '../data/questions'

/**
 * React pattern: *props* are the inputs a component receives from its
 * parent, passed like HTML attributes. We describe them with a TS
 * interface so typos are caught at compile time.
 */
interface QuestionProps {
  question: QuestionData
  /** 1-based position shown as "Question 2 of 6". */
  number: number
  total: number
  /** The option id the player has picked, or undefined if nothing yet. */
  selectedId?: string
  /** Callback the parent gives us; we call it when an option is clicked. */
  onSelect: (optionId: string) => void
}

export function Question({ question, number, total, selectedId, onSelect }: QuestionProps) {
  return (
    <section className="question" aria-labelledby={`q-${question.id}`}>
      <p className="question__count">
        Question {number} of {total}
      </p>
      <h2 id={`q-${question.id}`} className="question__prompt">
        {question.prompt}
      </h2>

      {/* React pattern: render a list with .map(). Each item needs a stable
          `key` so React can tell them apart between renders. */}
      <div className="question__options" role="radiogroup" aria-labelledby={`q-${question.id}`}>
        {question.options.map((option) => {
          const selected = option.id === selectedId
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={selected ? 'option option--selected' : 'option'}
              onClick={() => onSelect(option.id)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}

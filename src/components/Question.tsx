import type { Question as QuestionData } from '../data/questions'

interface QuestionProps {
  question: QuestionData
  /** 1-based position shown as "QUESTION 2 OF 6". */
  number: number
  total: number
  /** The 0-based option index the player picked, or undefined. */
  selected?: number
  onSelect: (index: number) => void
}

/** One question as a native radio group, so arrow keys and screen readers just work. */
export function Question({ question, number, total, selected, onSelect }: QuestionProps) {
  return (
    <fieldset>
      <legend>
        <span>
          QUESTION {number} OF {total}
        </span>
        {question.label}
      </legend>
      <div className="opts">
        {question.options.map((option, index) => {
          const id = `${question.id}_${index}`
          return (
            <div className="opt" key={id}>
              <input
                type="radio"
                name={question.id}
                id={id}
                value={index}
                checked={selected === index}
                onChange={() => onSelect(index)}
              />
              <label htmlFor={id}>
                <b>{option.title}</b>
                <small>{option.subtitle}</small>
              </label>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}

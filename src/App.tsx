import { useEffect, useMemo, useState } from 'react'
import { CharacterSheet } from './components/CharacterSheet'
import { Question } from './components/Question'
import type { ClassName } from './data/classes'
import { QUESTIONS, type QuestionId } from './data/questions'
import { answeredCount, type Answers } from './lib/answers'
import { buildHero } from './lib/buildHero'

type Theme = 'light' | 'dark' | 'auto'

const THEME_KEY = 'five-minute-hero:theme'

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage can throw in private windows; fall back to auto.
  }
  return 'auto'
}

export default function App() {
  const [answers, setAnswers] = useState<Answers>({})
  // A class the player switched to with "Try X instead"; null means the best match.
  const [override, setOverride] = useState<ClassName | null>(null)
  const [player, setPlayer] = useState('')
  const [charName, setCharName] = useState('')
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  // Apply the theme to <html data-theme="..."> so CSS can react to it.
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'auto') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
    try {
      if (theme === 'auto') localStorage.removeItem(THEME_KEY)
      else localStorage.setItem(THEME_KEY, theme)
    } catch {
      // ignore storage failures
    }
  }, [theme])

  const hero = useMemo(() => buildHero(answers, { player, charName, override }), [answers, player, charName, override])

  function select(id: QuestionId, index: number) {
    setAnswers((prev) => ({ ...prev, [id]: index }))
    // Changing any answer clears the "Try X instead" override.
    setOverride(null)
  }

  function cycleTheme() {
    setTheme((t) => (t === 'auto' ? 'dark' : t === 'dark' ? 'light' : 'auto'))
  }

  return (
    <>
      <main className="wrap">
        <div className="topbar">
          <p className="eyebrow">Game night · Level 5 one-shot</p>
          <button type="button" className="ghost small" onClick={cycleTheme} aria-live="polite">
            Theme: {theme}
          </button>
        </div>
        <header className="head">
          <h1>Five-Minute Hero</h1>
          <p className="lede">
            Answer six quick questions and you'll get a ready-to-play character built from the standard D&amp;D rules.
            Copy the result and paste it into our Discord before the game. The DM handles the fine print.
          </p>
        </header>

        <form className="quiz" onSubmit={(e) => e.preventDefault()} noValidate>
          {QUESTIONS.map((q, i) => (
            <Question
              key={q.id}
              question={q}
              number={i + 1}
              total={QUESTIONS.length}
              selected={answers[q.id]}
              onSelect={(index) => select(q.id, index)}
            />
          ))}
        </form>

        <fieldset>
          <legend>
            <span>LAST STEP</span>Names
          </legend>
          <div className="names">
            <label htmlFor="player">
              Your name
              <input
                type="text"
                id="player"
                autoComplete="given-name"
                placeholder="e.g. Sam"
                value={player}
                onChange={(e) => setPlayer(e.target.value)}
              />
            </label>
            <label htmlFor="charname">
              Character name (optional)
              <input
                type="text"
                id="charname"
                placeholder="Leave blank and we'll suggest one"
                value={charName}
                onChange={(e) => setCharName(e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        <CharacterSheet
          hero={hero}
          answered={answeredCount(answers)}
          onSwap={() => hero && setOverride(hero.runnerUp)}
          onReset={() => setOverride(null)}
        />
      </main>

      <footer className="footer">
        <p>
          Built with content from the System Reference Document 5.2 by Wizards of the Coast LLC, licensed under{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/" rel="license noreferrer" target="_blank">
            CC BY 4.0
          </a>
          .
        </p>
      </footer>
    </>
  )
}

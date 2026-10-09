import { useEffect, useMemo, useState } from 'react'
import { CharacterSheet } from './components/CharacterSheet'
import { Question } from './components/Question'
import { QUESTIONS, type AnswerOption } from './data/questions'
import { CLASSES, type SpeciesId } from './data/classes'
import { SPECIES_IDS } from './data/species'
import { buildCharacter, suggestNames } from './lib/buildCharacter'
import { pickSpecies } from './lib/pickSpecies'
import { scoreClasses } from './lib/scoreClasses'
import { seedFromAnswers } from './lib/seed'

type Step = 'intro' | 'quiz' | 'sheet'
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
  // React pattern: all the app's state lives here at the top, and flows
  // *down* into components through props. Events flow back *up* through
  // callbacks. This is "lifting state up".
  const [step, setStep] = useState<Step>('intro')
  const [player, setPlayer] = useState('')
  const [index, setIndex] = useState(0)
  // Which option id the player picked for each question id.
  const [picked, setPicked] = useState<Record<string, string>>({})
  const [chosenName, setChosenName] = useState<string | undefined>(undefined)
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

  // React pattern: useMemo caches a computed value and only recomputes it
  // when one of the listed dependencies changes.
  const answers: AnswerOption[] = useMemo(
    () =>
      QUESTIONS.flatMap((q) => {
        const option = q.options.find((o) => o.id === picked[q.id])
        return option ? [option] : []
      }),
    [picked],
  )

  const complete = answers.length === QUESTIONS.length

  const nameSuggestions = useMemo(() => {
    if (!complete) return []
    const classId = scoreClasses(answers)[0].classId
    const speciesId: SpeciesId = pickSpecies(answers, classId)
    return suggestNames(speciesId, seedFromAnswers(answers))
  }, [answers, complete])

  const character = useMemo(
    () => (complete ? buildCharacter(answers, { player, name: chosenName }) : null),
    [answers, complete, player, chosenName],
  )

  const current = QUESTIONS[index]
  const currentPick = picked[current.id]

  function select(optionId: string) {
    // React pattern: never mutate state; make a new object with the change.
    setPicked((prev) => ({ ...prev, [current.id]: optionId }))
  }

  function next() {
    if (index < QUESTIONS.length - 1) setIndex(index + 1)
    else setStep('sheet')
  }

  function restart() {
    setPicked({})
    setChosenName(undefined)
    setIndex(0)
    setStep('intro')
  }

  function cycleTheme() {
    setTheme((t) => (t === 'auto' ? 'dark' : t === 'dark' ? 'light' : 'auto'))
  }

  const themeLabel = theme === 'auto' ? 'Theme: auto' : theme === 'dark' ? 'Theme: dark' : 'Theme: light'

  return (
    <div className="app">
      <header className="masthead">
        <div className="masthead__inner">
          <h1 className="masthead__title">
            <span className="masthead__five">Five-Minute</span> Hero
          </h1>
          <button type="button" className="btn btn--ghost btn--small" onClick={cycleTheme} aria-live="polite">
            {themeLabel}
          </button>
        </div>
      </header>

      <main className="main">
        {step === 'intro' && (
          <section className="intro">
            <p className="intro__lead">
              Six quick questions. One ready-to-play level 5 character, built only from the free D&amp;D rules. Paste
              it into Discord and you are done.
            </p>
            <label className="field">
              <span>Your name (so the DM knows whose sheet this is)</span>
              <input
                type="text"
                value={player}
                onChange={(e) => setPlayer(e.target.value)}
                placeholder="e.g. Jon"
                autoComplete="name"
              />
            </label>
            <button type="button" className="btn btn--primary btn--large" onClick={() => setStep('quiz')}>
              Begin
            </button>
            <p className="intro__note">
              {Object.keys(CLASSES).length} classes · {SPECIES_IDS.length} species · standard array · no dice required
            </p>
          </section>
        )}

        {step === 'quiz' && (
          <>
            <div className="progress" aria-hidden="true">
              <div className="progress__bar" style={{ width: `${((index + 1) / QUESTIONS.length) * 100}%` }} />
            </div>
            <Question
              question={current}
              number={index + 1}
              total={QUESTIONS.length}
              selectedId={currentPick}
              onSelect={select}
            />
            <div className="quiz__nav">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => (index === 0 ? setStep('intro') : setIndex(index - 1))}
              >
                Back
              </button>
              <button type="button" className="btn btn--primary" onClick={next} disabled={!currentPick}>
                {index === QUESTIONS.length - 1 ? 'Reveal my hero' : 'Next'}
              </button>
            </div>
          </>
        )}

        {step === 'sheet' && character && (
          <CharacterSheet
            character={character}
            nameSuggestions={nameSuggestions}
            onPickName={setChosenName}
            onRestart={restart}
          />
        )}
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
    </div>
  )
}

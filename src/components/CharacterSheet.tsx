import { useRef, useState } from 'react'
import { ABILITIES } from '../data/abilities'
import { CLASSES } from '../data/classes'
import { HOOKS } from '../data/species'
import { QUESTIONS } from '../data/questions'
import { abilityModifier, formatModifier, scoreFor } from '../lib/assignStats'
import type { Hero } from '../lib/buildHero'
import { buildSummary } from '../lib/buildSummary'
import { CopyButton, type CopyResult } from './CopyButton'
import { DownloadButton } from './DownloadButton'

interface CharacterSheetProps {
  /** Null until enough questions are answered. */
  hero: Hero | null
  answered: number
  onSwap: () => void
  onReset: () => void
}

const DEFAULT_NOTE = 'Paste this in the game channel. The DM fills in hit points, gear, and spells.'
const NOTES: Record<CopyResult, string> = {
  copied: 'Copied. Paste it into Discord.',
  manual: 'Text selected. Press Ctrl+C (or ⌘C) to copy.',
}

export function CharacterSheet({ hero, answered, onSwap, onReset }: CharacterSheetProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // Remember which text the note is about, so it falls back to the default as soon as the sheet changes.
  const [copied, setCopied] = useState<{ text: string; result: CopyResult } | null>(null)

  if (!hero) {
    return (
      <section className="sheet" aria-live="polite">
        <h3>Your character</h3>
        <p className="empty">
          Answer at least the first four questions and your hero appears here.{' '}
          {answered > 0 && `(${answered} of ${QUESTIONS.length} answered)`}
        </p>
      </section>
    )
  }

  const { character } = hero
  const info = CLASSES[hero.className]
  const summary = buildSummary(character)
  const note = copied?.text === summary ? NOTES[copied.result] : DEFAULT_NOTE

  return (
    <section className="sheet" aria-live="polite">
      <h3>Your character</h3>
      <h2>{character.name}</h2>
      <p className="sub">
        {hero.article} level {character.level} {character.species} {character.class} · {character.background} background
      </p>
      <p style={{ margin: 0 }}>You're {info.pitch}.</p>
      <div className="stats">
        {ABILITIES.map((ability) => {
          const score = scoreFor(character.scores, ability)
          return (
            <div className="stat" key={ability}>
              <div className="k">{ability}</div>
              <div className="v">{score}</div>
              <div className="m">{formatModifier(abilityModifier(score))}</div>
            </div>
          )
        })}
      </div>
      <h3>On your turn</h3>
      <ul>
        {info.turn.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <h3>Story hook</h3>
      <p className="hook">{HOOKS[character.tone]}</p>
      <div className="row">
        <CopyButton
          text={summary}
          fallbackTarget={textareaRef}
          onResult={(result) => setCopied({ text: summary, result })}
        />
        <button type="button" className="ghost" onClick={onSwap}>
          Try {hero.runnerUp} instead
        </button>
        {hero.overridden && (
          <button type="button" className="ghost" onClick={onReset}>
            Back to my best match
          </button>
        )}
        <DownloadButton character={character} />
      </div>
      <p className="note">{note}</p>
      <textarea ref={textareaRef} readOnly value={summary} aria-label="Character summary to copy" />
    </section>
  )
}

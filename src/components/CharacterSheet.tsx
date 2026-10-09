import type { Character } from '../types/character'
import { ABILITY_LABEL, ABILITY_ORDER, abilityModifier, formatModifier } from '../lib/assignStats'
import { buildSummary } from '../lib/buildSummary'
import { PROFICIENCY_BONUS_LEVEL_5, characterHitPoints, classByName } from '../lib/derive'
import { SPECIES } from '../data/species'
import { SPECIES_IDS } from '../data/species'
import { CopyButton } from './CopyButton'
import { DownloadButton } from './DownloadButton'

interface CharacterSheetProps {
  character: Character
  /** Alternative names the player can click to swap in. */
  nameSuggestions: string[]
  onPickName: (name: string) => void
  onRestart: () => void
}

export function CharacterSheet({ character, nameSuggestions, onPickName, onRestart }: CharacterSheetProps) {
  const classInfo = classByName(character.class)
  const speciesInfo = SPECIES[SPECIES_IDS.find((id) => SPECIES[id].name === character.species) ?? 'human']
  const hp = characterHitPoints(character)
  const summary = buildSummary(character)

  return (
    <article className="sheet">
      <header className="sheet__header">
        <p className="sheet__eyebrow">Your hero</p>
        <h2 className="sheet__name">{character.name}</h2>
        <p className="sheet__line">
          Level {character.level} {character.species} {character.class} · {character.background}
        </p>
        <div className="sheet__names">
          <span className="sheet__names-label">Or call them:</span>
          {nameSuggestions.map((name) => (
            <button
              key={name}
              type="button"
              className={name === character.name ? 'chip chip--active' : 'chip'}
              onClick={() => onPickName(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </header>

      <section className="sheet__stats" aria-label="Ability scores">
        {ABILITY_ORDER.map((key) => {
          const score = character.scores[key]
          return (
            <div key={key} className="stat">
              <span className="stat__label">{ABILITY_LABEL[key]}</span>
              <span className="stat__score">{score}</span>
              <span className="stat__mod">{formatModifier(abilityModifier(score))}</span>
            </div>
          )
        })}
      </section>

      <section className="sheet__grid">
        <div className="card">
          <h3>Vitals</h3>
          <dl className="vitals">
            <dt>Hit points</dt>
            <dd>{hp}</dd>
            <dt>Hit die</dt>
            <dd>d{classInfo.hitDie}</dd>
            <dt>Proficiency</dt>
            <dd>+{PROFICIENCY_BONUS_LEVEL_5}</dd>
            <dt>Speed</dt>
            <dd>{speciesInfo.speed} ft.</dd>
            <dt>Size</dt>
            <dd>{speciesInfo.size}</dd>
          </dl>
        </div>
        <div className="card">
          <h3>{character.class} features</h3>
          <p className="card__blurb">{classInfo.blurb}</p>
          <ul>
            {classInfo.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>{character.species} traits</h3>
          <ul>
            {speciesInfo.traits.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="card card--hook">
          <h3>Story hook</h3>
          <p className="card__tone">Tone: {character.tone}</p>
          <p className="card__hook">{character.hook}</p>
        </div>
      </section>

      <section className="sheet__actions">
        <CopyButton text={summary} />
        <DownloadButton character={character} />
        <button type="button" className="btn btn--ghost" onClick={onRestart}>
          Start over
        </button>
      </section>

      <details className="sheet__preview">
        <summary>Preview the Discord text</summary>
        <pre>{summary}</pre>
      </details>
    </article>
  )
}

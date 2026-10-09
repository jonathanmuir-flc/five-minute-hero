// Parity with the prototype. reference/hero-picker.html is the content source
// of truth, so this suite runs the prototype's own data and scoring functions
// and checks the port against them, for the data and for every possible set
// of answers.
import { describe, expect, it } from 'vitest'
import prototypeHtml from '../../reference/hero-picker.html?raw'
import { ABILITIES, STANDARD_ARRAY } from '../data/abilities'
import { CLASSES, CLASS_NAMES } from '../data/classes'
import { QUESTIONS } from '../data/questions'
import { HOOKS, NAMES, SPECIES_FIT, TONE_LABEL } from '../data/species'
import { assignStats, scoreFor } from './assignStats'
import { buildHero } from './buildHero'
import { buildSummary } from './buildSummary'
import type { Answers } from './answers'
import { pickSpecies } from './pickSpecies'
import { scoreClasses } from './scoreClasses'

type ProtoOption = [string, string, Record<string, unknown>]
interface Proto {
  STD: number[]
  AB: string[]
  CLASSES: Record<string, { pri: string[]; bg: string; pitch: string; turn: string[] }>
  Q: { id: string; label: string; opts: ProtoOption[] }[]
  SPECIES_FIT: Record<string, string[]>
  HOOKS: Record<string, string>
  NAMES: Record<string, string[]>
  scoreClasses: (a: Record<string, unknown>) => [string, number][]
  pickSpecies: (a: Record<string, unknown>, cls: string) => string
  stats: (cls: string) => Record<string, number>
}

function between(start: string, end: string): string {
  const from = prototypeHtml.indexOf(start)
  const to = prototypeHtml.indexOf(end)
  if (from < 0 || to < from) throw new Error(`Cannot find "${start}" ... "${end}" in the prototype`)
  return prototypeHtml.slice(from, to)
}

// The data tables run from "const STD=" up to the DOM code at "const form=".
// The pure functions run from "function scoreClasses" up to "function esc".
const proto = new Function(
  `${between('const STD=', 'const form=')}
   ${between('function scoreClasses', 'function esc')}
   return {STD,AB,CLASSES,Q,SPECIES_FIT,HOOKS,NAMES,scoreClasses,pickSpecies,stats}`,
)() as Proto

describe('data parity with reference/hero-picker.html', () => {
  it('standard array and ability order', () => {
    expect([...STANDARD_ARRAY]).toEqual(proto.STD)
    expect([...ABILITIES]).toEqual(proto.AB)
  })

  it('classes: pri, bg, pitch and turn bullets', () => {
    expect([...CLASS_NAMES]).toEqual(Object.keys(proto.CLASSES).sort())
    for (const name of CLASS_NAMES) {
      expect(CLASSES[name], name).toEqual(proto.CLASSES[name])
    }
  })

  it('questions: ids, labels, order, titles and subtitles', () => {
    expect(QUESTIONS.map((q) => q.id)).toEqual(proto.Q.map((q) => q.id))
    QUESTIONS.forEach((q, i) => {
      const p = proto.Q[i]
      expect(q.label).toBe(p.label)
      expect(q.options.map((o) => [o.title, o.subtitle])).toEqual(p.opts.map((o) => [o[0], o[1]]))
    })
  })

  it('scoring weights for q1-q4, species lists for q5, tones for q6', () => {
    QUESTIONS.forEach((q, i) => {
      q.options.forEach((option, j) => {
        const extra = proto.Q[i].opts[j][2]
        if (['q1', 'q2', 'q3', 'q4'].includes(q.id)) {
          expect(option.points, `${q.id}[${j}]`).toEqual(extra)
          expect(option.species).toBeUndefined()
          expect(option.tone).toBeUndefined()
        } else if (q.id === 'q5') {
          expect(option.species, `${q.id}[${j}]`).toEqual(extra.sp)
          expect(option.points).toBeUndefined()
        } else {
          expect(option.tone, `${q.id}[${j}]`).toBe(extra.tone)
          expect(option.points).toBeUndefined()
        }
      })
    })
  })

  it('species fit, hooks and names', () => {
    expect(SPECIES_FIT).toEqual(proto.SPECIES_FIT)
    expect(HOOKS).toEqual(proto.HOOKS)
    expect(NAMES).toEqual(proto.NAMES)
  })

  it('the Discord tone labels appear in the prototype source', () => {
    for (const label of Object.values(TONE_LABEL)) {
      expect(prototypeHtml).toContain(`"${label}"`)
    }
  })
})

describe('behavior parity with the prototype, over every combination of answers', () => {
  // Each question can be unanswered (-1) or any of its options.
  const choices = QUESTIONS.map((q) => Array.from({ length: q.options.length + 1 }, (_, i) => i - 1))
  const combos: number[][] = choices.reduce<number[][]>(
    (acc, options) => acc.flatMap((prefix) => options.map((o) => [...prefix, o])),
    [[]],
  )

  it('covers all 32,400 combinations', () => {
    expect(combos).toHaveLength(5 * 9 * 4 * 6 * 6 * 5)
  })

  it('ranks classes, picks species and deals stats exactly like the prototype', () => {
    for (const combo of combos) {
      const mine: Answers = {}
      const theirs: Record<string, unknown> = {}
      QUESTIONS.forEach((q, i) => {
        if (combo[i] >= 0) {
          mine[q.id] = combo[i]
          theirs[q.id] = proto.Q[i].opts[combo[i]][2]
        }
      })

      const ranked = scoreClasses(mine)
      const protoRanked = proto.scoreClasses(theirs)
      expect(ranked.map((r) => [r.className, r.points]), combo.join()).toEqual(protoRanked)

      // The current class is the best match and also the runner-up, so both get checked.
      for (const className of [ranked[0].className, ranked[1].className]) {
        expect(pickSpecies(mine, className), `${combo.join()} ${className}`).toBe(proto.pickSpecies(theirs, className))
        const stats = proto.stats(className)
        const scores = assignStats(className)
        for (const ability of ABILITIES) expect(scoreFor(scores, ability)).toBe(stats[ability])
      }
    }
  })

  it('builds a character exactly when 4 or more questions are answered', () => {
    for (const combo of combos) {
      const answers: Answers = {}
      QUESTIONS.forEach((q, i) => {
        if (combo[i] >= 0) answers[q.id] = combo[i]
      })
      const answered = combo.filter((c) => c >= 0).length
      const hero = buildHero(answers, { player: '', charName: '', override: null })
      expect(hero === null, combo.join()).toBe(answered < 4)
      if (hero) expect(buildSummary(hero.character)).toContain(`level 5 ${hero.character.species} ${hero.className}`)
    }
  })
})

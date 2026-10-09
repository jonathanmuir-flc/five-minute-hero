import { describe, expect, it } from 'vitest'
import { ABILITIES, STANDARD_ARRAY } from '../data/abilities'
import { CLASSES, CLASS_NAMES } from '../data/classes'
import { QUESTIONS } from '../data/questions'
import { SPECIES_FIT } from '../data/species'
import { answeredCount } from './answers'
import { abilityModifier, assignStats, formatModifier } from './assignStats'
import { articleFor, buildHero, pickTone, suggestName } from './buildHero'
import { buildSummary } from './buildSummary'
import { scoreClasses } from './scoreClasses'
import { pick } from './testHelpers'

const noNames = { player: '', charName: '', override: null }

describe('golden case A: Wizard', () => {
  const answers = pick(2, 2, 2, 1, 1, 2)
  const hero = buildHero(answers, noNames)!

  it('ranks Wizard first with 11 points and Sorcerer second with 4', () => {
    const ranked = scoreClasses(answers)
    expect(ranked[0]).toEqual({ className: 'Wizard', points: 11 })
    expect(ranked[1]).toEqual({ className: 'Sorcerer', points: 4 })
    expect(hero.runnerUp).toBe('Sorcerer')
  })

  it('builds Fizzwick, a level 5 Gnome Wizard with the Sage background', () => {
    expect(hero.character).toMatchObject({
      name: 'Fizzwick',
      level: 5,
      species: 'Gnome',
      class: 'Wizard',
      background: 'Sage',
      tone: 'mystery',
    })
    expect(hero.article).toBe('A')
  })

  it('deals the standard array in Wizard priority order', () => {
    expect(hero.character.scores).toEqual({ str: 8, dex: 13, con: 14, int: 15, wis: 12, cha: 10 })
  })

  it('writes the Discord text in the prototype format', () => {
    expect(buildSummary({ ...hero.character, player: 'Sam' })).toBe(
      [
        'PLAYER: Sam',
        'CHARACTER: Fizzwick, level 5 Gnome Wizard (Sage background)',
        'VIBE: a scholar of magic with a spellbook for every problem. Played as a mysterious stranger.',
        'SCORES (standard array): STR 8, DEX 13, CON 14, INT 15, WIS 12, CHA 10',
        'HOOK: Carries a sealed letter they\'ve never opened and won\'t explain.',
        'DM: please finish the sheet (background bonuses, HP, gear, spells) from the SRD.',
      ].join('\n'),
    )
  })

  it('shows "(your name)" in the Discord text when the player name is blank', () => {
    expect(buildSummary(hero.character).split('\n')[0]).toBe('PLAYER: (your name)')
  })
})

describe('golden case B: Barbarian wins a tie', () => {
  const answers = pick(0, 1, 0, 3, 3, 0)
  const hero = buildHero(answers, noNames)!

  it('ties Barbarian and Fighter at 7 and breaks the tie alphabetically', () => {
    const ranked = scoreClasses(answers)
    expect(ranked[0]).toEqual({ className: 'Barbarian', points: 7 })
    expect(ranked[1]).toEqual({ className: 'Fighter', points: 7 })
    expect(hero.className).toBe('Barbarian')
    expect(hero.runnerUp).toBe('Fighter')
  })

  it('falls back to the first q5 species when neither fits the class', () => {
    expect(SPECIES_FIT.Dwarf).not.toContain('Barbarian')
    expect(SPECIES_FIT.Dragonborn).not.toContain('Barbarian')
    expect(hero.character.species).toBe('Dwarf')
  })

  it('builds Tordek the noble Soldier with Barbarian scores', () => {
    expect(hero.character).toMatchObject({ name: 'Tordek', background: 'Soldier', tone: 'noble' })
    expect(hero.character.scores).toEqual({ str: 15, dex: 13, con: 14, int: 8, wis: 12, cha: 10 })
  })
})

describe('answers needed', () => {
  it('builds no character with fewer than 4 answers, whichever questions they are', () => {
    expect(buildHero(pick(), noNames)).toBeNull()
    expect(buildHero(pick(2), noNames)).toBeNull()
    expect(buildHero(pick(2, 2, 2), noNames)).toBeNull()
    expect(buildHero(pick(undefined, undefined, undefined, undefined, 1, 2), noNames)).toBeNull()
    expect(answeredCount(pick(2, 2, 2))).toBe(3)
  })

  it('builds a character at exactly 4 answers', () => {
    expect(buildHero(pick(2, 2, 2, 1), noNames)).not.toBeNull()
  })

  it('uses Human when q5 is unanswered, and the noble tone when q6 is unanswered', () => {
    const hero = buildHero(pick(2, 2, 2, 1), noNames)!
    expect(hero.character.species).toBe('Human')
    expect(hero.character.tone).toBe('noble')
    expect(pickTone(pick(2, 2, 2, 1))).toBe('noble')
  })

  it('only q1-q4 score classes: q5 and q6 never change the ranking', () => {
    const base = scoreClasses(pick(2, 2, 2, 1))
    for (let q5 = 0; q5 < 5; q5++) {
      for (let q6 = 0; q6 < 4; q6++) {
        expect(scoreClasses(pick(2, 2, 2, 1, q5, q6))).toEqual(base)
      }
    }
  })
})

describe('names and article', () => {
  it('suggests NAMES[species][className.length % 2]', () => {
    expect(suggestName('Gnome', 'Wizard')).toBe('Fizzwick') // Wizard has 6 letters
    expect(suggestName('Dwarf', 'Barbarian')).toBe('Tordek') // Barbarian has 9
  })

  it('keeps a typed character name (trimmed) over the suggestion', () => {
    const hero = buildHero(pick(2, 2, 2, 1, 1, 2), { player: '  Sam ', charName: '  Pip  ', override: null })!
    expect(hero.character.name).toBe('Pip')
    expect(hero.character.player).toBe('Sam')
  })

  it('uses "An" before a vowel and "A" otherwise', () => {
    expect(articleFor('Elf')).toBe('An')
    expect(articleFor('Orc')).toBe('An')
    expect(articleFor('Human')).toBe('A')
    expect(articleFor('Dragonborn')).toBe('A')
    expect(articleFor('Gnome')).toBe('A')
    // Case B is a Dwarf and case A a Gnome; an Elf hero reads "An".
    const elf = buildHero(pick(2, 2, 2, 1, 2, 0), noNames)! // q5=2 -> Elf/Tiefling, Wizard fits Elf
    expect(elf.character.species).toBe('Elf')
    expect(elf.article).toBe('An')
  })
})

describe('"Try <Class> instead"', () => {
  const answers = pick(2, 2, 2, 1, 1, 2)

  it('switches to the runner-up, whose own runner-up is the best match', () => {
    const swapped = buildHero(answers, { ...noNames, override: 'Sorcerer' })!
    expect(swapped.className).toBe('Sorcerer')
    expect(swapped.overridden).toBe(true)
    expect(swapped.bestMatch).toBe('Wizard')
    expect(swapped.runnerUp).toBe('Wizard')
    expect(swapped.character.class).toBe('Sorcerer')
    expect(swapped.character.background).toBe('Sage')
    expect(swapped.character.scores.cha).toBe(15)
  })

  it('is not overridden by default', () => {
    expect(buildHero(answers, noNames)!.overridden).toBe(false)
  })
})

describe('ability scores', () => {
  it('every class priority list holds all six abilities exactly once', () => {
    for (const name of CLASS_NAMES) {
      const pri = [...CLASSES[name].pri]
      expect(pri, name).toHaveLength(6)
      expect(new Set(pri).size, name).toBe(6)
      expect([...pri].sort(), name).toEqual([...ABILITIES].sort())
    }
  })

  it('gives every class exactly the standard array, with no background bonuses', () => {
    for (const name of CLASS_NAMES) {
      const values = Object.values(assignStats(name)).sort((a, b) => b - a)
      expect(values, name).toEqual([...STANDARD_ARRAY])
    }
  })

  it('lists the scores in STR to CHA order for the DM JSON', () => {
    expect(Object.keys(assignStats('Wizard'))).toEqual(['str', 'dex', 'con', 'int', 'wis', 'cha'])
  })

  it('computes and formats modifiers', () => {
    expect(formatModifier(abilityModifier(15))).toBe('+2')
    expect(formatModifier(abilityModifier(10))).toBe('+0')
    expect(formatModifier(abilityModifier(8))).toBe('-1')
  })
})

describe('questions', () => {
  it('has six questions with the expected option counts', () => {
    expect(QUESTIONS.map((q) => [q.id, q.options.length])).toEqual([
      ['q1', 4],
      ['q2', 8],
      ['q3', 3],
      ['q4', 5],
      ['q5', 5],
      ['q6', 4],
    ])
  })
})

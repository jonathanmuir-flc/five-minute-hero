import { describe, expect, it } from 'vitest'
import { buildCharacter, pickTone, suggestNames } from './buildCharacter'
import { FIGHTER_PATH, WIZARD_PATH, answers } from './testHelpers'

describe('buildCharacter', () => {
  it('builds a complete level 5 fighter from the martial path', () => {
    const c = buildCharacter(answers(...FIGHTER_PATH), { player: 'Jon' })
    expect(c.level).toBe(5)
    expect(c.class).toBe('Fighter')
    expect(c.background).toBe('Soldier')
    expect(c.tone).toBe('heroic')
    expect(c.player).toBe('Jon')
    expect(c.scores.str).toBe(15)
    expect(c.name.length).toBeGreaterThan(0)
    expect(c.hook.length).toBeGreaterThan(0)
    expect(c.hook).not.toContain('{class}')
  })

  it('is deterministic: same answers, same character', () => {
    const a = buildCharacter(answers(...WIZARD_PATH))
    const b = buildCharacter(answers(...WIZARD_PATH))
    expect(a).toEqual(b)
    expect(a.class).toBe('Wizard')
    expect(a.tone).toBe('mysterious')
  })

  it('respects a chosen name', () => {
    const c = buildCharacter(answers(...FIGHTER_PATH), { name: 'Sir Test' })
    expect(c.name).toBe('Sir Test')
  })

  it('has every field the DM JSON needs', () => {
    const c = buildCharacter(answers(...FIGHTER_PATH))
    expect(Object.keys(c).sort()).toEqual(
      ['background', 'class', 'hook', 'level', 'name', 'player', 'scores', 'species', 'tone'].sort(),
    )
  })
})

describe('pickTone', () => {
  it('defaults to heroic when no answer sets a tone', () => {
    expect(pickTone(answers('brawl-swing'))).toBe('heroic')
  })
  it('uses the tone answer', () => {
    expect(pickTone(answers('brawl-swing', 'tone-grim'))).toBe('grim')
  })
})

describe('suggestNames', () => {
  it('returns three distinct names and rotates by seed', () => {
    const a = suggestNames('human', 0)
    const b = suggestNames('human', 1)
    expect(a).toHaveLength(3)
    expect(new Set(a).size).toBe(3)
    expect(a[0]).not.toBe(b[0])
  })
})

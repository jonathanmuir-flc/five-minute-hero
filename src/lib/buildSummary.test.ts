import { describe, expect, it } from 'vitest'
import type { Character } from '../types/character'
import { buildSummary } from './buildSummary'
import { hitPointsAtLevel5 } from './derive'

const fighter: Character = {
  player: 'Jon',
  name: 'Ander Brightwood',
  level: 5,
  species: 'Human',
  class: 'Fighter',
  background: 'Soldier',
  scores: { str: 15, dex: 13, con: 14, int: 8, wis: 12, cha: 10 },
  tone: 'heroic',
  hook: 'A test hook.',
}

describe('hitPointsAtLevel5', () => {
  it('is max die at level 1 plus average after, plus CON per level', () => {
    // d10: 10 + 4*6 = 34, CON 14 (+2) adds 10 -> 44
    expect(hitPointsAtLevel5(10, 14)).toBe(44)
    // d6, CON 8 (-1): 6 + 4*4 - 5 = 17
    expect(hitPointsAtLevel5(6, 8)).toBe(17)
  })
})

describe('buildSummary', () => {
  it('produces the Discord lines in order', () => {
    const lines = buildSummary(fighter).split('\n')
    expect(lines[0]).toBe('**Ander Brightwood** — Level 5 Human Fighter (Soldier)')
    expect(lines[1]).toBe('STR 15 (+2) · DEX 13 (+1) · CON 14 (+2) · INT 8 (-1) · WIS 12 (+1) · CHA 10 (+0)')
    expect(lines[2]).toBe('HP 44 · Proficiency +3 · Tone: Heroic')
    expect(lines[3]).toBe('*A test hook.*')
    expect(lines[4]).toBe('Played by Jon')
  })

  it('leaves out the player line when no player name was given', () => {
    const text = buildSummary({ ...fighter, player: '  ' })
    expect(text).not.toContain('Played by')
    expect(text.split('\n')).toHaveLength(4)
  })
})

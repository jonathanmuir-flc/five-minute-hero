import { describe, expect, it } from 'vitest'
import { CLASS_IDS } from '../data/classes'
import { STANDARD_ARRAY, abilityModifier, assignStats, formatModifier } from './assignStats'

describe('assignStats', () => {
  it('gives a fighter 15 STR and 8 INT', () => {
    const s = assignStats('fighter')
    expect(s.str).toBe(15)
    expect(s.con).toBe(14)
    expect(s.int).toBe(8)
  })

  it('gives a wizard 15 INT', () => {
    expect(assignStats('wizard').int).toBe(15)
  })

  it('uses each standard array value exactly once for every class', () => {
    for (const id of CLASS_IDS) {
      const values = Object.values(assignStats(id)).sort((a, b) => b - a)
      expect(values).toEqual([...STANDARD_ARRAY])
    }
  })
})

describe('abilityModifier', () => {
  it('matches the SRD table', () => {
    expect(abilityModifier(8)).toBe(-1)
    expect(abilityModifier(10)).toBe(0)
    expect(abilityModifier(11)).toBe(0)
    expect(abilityModifier(15)).toBe(2)
  })

  it('formats with a sign', () => {
    expect(formatModifier(2)).toBe('+2')
    expect(formatModifier(0)).toBe('+0')
    expect(formatModifier(-1)).toBe('-1')
  })
})

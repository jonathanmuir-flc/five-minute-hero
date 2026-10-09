import { describe, expect, it } from 'vitest'
import { CLASS_IDS } from '../data/classes'
import { scoreClasses } from './scoreClasses'
import { FIGHTER_PATH, WIZARD_PATH, answers } from './testHelpers'

describe('scoreClasses', () => {
  it('returns every class with a zero score when there are no answers', () => {
    const result = scoreClasses([])
    expect(result).toHaveLength(CLASS_IDS.length)
    expect(result.every((r) => r.score === 0)).toBe(true)
  })

  it('sums weights across answers', () => {
    const result = scoreClasses(answers('brawl-swing', 'power-grit'))
    const barbarian = result.find((r) => r.classId === 'barbarian')
    // brawl-swing: barbarian 3, power-grit: barbarian 2
    expect(barbarian?.score).toBe(5)
  })

  it('sorts highest first and keeps a stable order on ties', () => {
    const result = scoreClasses([])
    expect(result.map((r) => r.classId)).toEqual([...CLASS_IDS])
  })

  it('lands on Fighter for a martial path', () => {
    expect(scoreClasses(answers(...FIGHTER_PATH))[0].classId).toBe('fighter')
  })

  it('lands on Wizard for a bookish path', () => {
    expect(scoreClasses(answers(...WIZARD_PATH))[0].classId).toBe('wizard')
  })
})

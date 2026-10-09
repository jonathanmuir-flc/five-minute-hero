import { describe, expect, it } from 'vitest'
import { pickSpecies } from './pickSpecies'
import { FIGHTER_PATH, WIZARD_PATH, answers } from './testHelpers'

describe('pickSpecies', () => {
  it('falls back to the class affinity when answers carry no species weights', () => {
    // No answers at all: only the affinity bonus counts, and wizard's first affinity is gnome.
    expect(pickSpecies([], 'wizard')).toBe('gnome')
  })

  it('lets answer weights outvote the affinity bonus', () => {
    // Four orc/goliath-flavoured answers against a bard (human/halfling/tiefling affinity).
    const a = answers('brawl-swing', 'weapon-big', 'heart-storm', 'role-tank')
    expect(['orc', 'goliath']).toContain(pickSpecies(a, 'bard'))
  })

  it('is deterministic for a full path', () => {
    const a = answers(...FIGHTER_PATH)
    expect(pickSpecies(a, 'fighter')).toBe(pickSpecies(a, 'fighter'))
    expect(pickSpecies(answers(...WIZARD_PATH), 'wizard')).toBe('gnome')
  })
})

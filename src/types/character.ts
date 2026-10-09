// The shape of a finished character. This is the contract for the
// "Download for the DM" JSON file, so keep it stable: the AI DM will
// read exactly these fields later.

/** The six ability keys, in the order D&D lists them. */
export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

/**
 * TS pattern: `Record<K, V>` builds an object type with one property per
 * member of the union `K`. So this is { str: number; dex: number; ... }.
 */
export type AbilityScores = Record<AbilityKey, number>

/** The mood the player asked for; it picks the story hook. */
export type Tone = 'noble' | 'scoundrel' | 'mystery' | 'comic'

export interface Character {
  /** The real person's name, so the DM knows whose sheet this is. */
  player: string
  /** The character's name. */
  name: string
  /**
   * TS pattern: a *literal type*. `level: 5` means the only allowed value
   * is the number 5, not any number. Handy when something is fixed by design.
   */
  level: 5
  species: string
  class: string
  background: string
  scores: AbilityScores
  tone: Tone
  hook: string
}

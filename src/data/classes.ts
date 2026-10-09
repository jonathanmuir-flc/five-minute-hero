// ---------------------------------------------------------------------------
// PLACEHOLDER DATA: the prototype (reference/hero-picker.html) was missing
// when this was built. Everything below is SRD 5.2 content, but the
// stat priorities, suggested backgrounds, and species affinities are a
// reasonable first pass, not a port. Replace with the prototype's values.
// ---------------------------------------------------------------------------
import type { AbilityKey } from '../types/character'

/**
 * TS pattern: `as const` freezes the array so TypeScript remembers the exact
 * strings instead of widening them to `string`. `typeof CLASS_IDS[number]`
 * then turns that into a union type: 'barbarian' | 'bard' | ...
 */
export const CLASS_IDS = [
  'barbarian',
  'bard',
  'cleric',
  'druid',
  'fighter',
  'monk',
  'paladin',
  'ranger',
  'rogue',
  'sorcerer',
  'warlock',
  'wizard',
] as const
export type ClassId = (typeof CLASS_IDS)[number]

export type SpeciesId =
  | 'dragonborn'
  | 'dwarf'
  | 'elf'
  | 'gnome'
  | 'goliath'
  | 'halfling'
  | 'human'
  | 'orc'
  | 'tiefling'

export interface ClassInfo {
  id: ClassId
  name: string
  /** One-line pitch shown on the sheet. */
  blurb: string
  /** Hit Die size (d12 -> 12). Used to work out level 5 hit points. */
  hitDie: 6 | 8 | 10 | 12
  /**
   * Which abilities matter most, best first. The standard array
   * (15, 14, 13, 12, 10, 8) is dealt out in this order.
   */
  statPriority: [AbilityKey, AbilityKey, AbilityKey, AbilityKey, AbilityKey, AbilityKey]
  /** One of the four SRD 5.2 backgrounds. */
  background: 'Acolyte' | 'Criminal' | 'Sage' | 'Soldier'
  /** What you can do at level 5, in plain words. */
  features: string[]
  /** Species that fit this class a little better (small tie-break bonus). */
  speciesAffinity: SpeciesId[]
}

export const CLASSES: Record<ClassId, ClassInfo> = {
  barbarian: {
    id: 'barbarian',
    name: 'Barbarian',
    blurb: 'A whirlwind of rage who shrugs off blows that would fell anyone else.',
    hitDie: 12,
    statPriority: ['str', 'con', 'dex', 'wis', 'cha', 'int'],
    background: 'Soldier',
    features: ['Rage (3/day, +2 damage, resist bludgeoning/piercing/slashing)', 'Reckless Attack', 'Extra Attack', 'Fast Movement (+10 ft.)', 'Danger Sense'],
    speciesAffinity: ['goliath', 'orc', 'dwarf'],
  },
  bard: {
    id: 'bard',
    name: 'Bard',
    blurb: 'A silver-tongued performer whose music is literally magic.',
    hitDie: 8,
    statPriority: ['cha', 'dex', 'con', 'wis', 'int', 'str'],
    background: 'Criminal',
    features: ['Bardic Inspiration (d8)', 'Font of Inspiration', 'Jack of All Trades', 'Spellcasting (up to 3rd-level spells)'],
    speciesAffinity: ['human', 'halfling', 'tiefling'],
  },
  cleric: {
    id: 'cleric',
    name: 'Cleric',
    blurb: 'A divine champion who heals the party and smites the wicked.',
    hitDie: 8,
    statPriority: ['wis', 'con', 'str', 'dex', 'cha', 'int'],
    background: 'Acolyte',
    features: ['Spellcasting (up to 3rd-level spells)', 'Channel Divinity (2/rest)', 'Sear Undead', 'Divine Order'],
    speciesAffinity: ['dwarf', 'human', 'dragonborn'],
  },
  druid: {
    id: 'druid',
    name: 'Druid',
    blurb: 'A keeper of the wild who turns into beasts and calls down storms.',
    hitDie: 8,
    statPriority: ['wis', 'con', 'dex', 'int', 'cha', 'str'],
    background: 'Sage',
    features: ['Spellcasting (up to 3rd-level spells)', 'Wild Shape (2/rest)', 'Wild Companion', 'Wild Resurgence'],
    speciesAffinity: ['elf', 'gnome', 'goliath'],
  },
  fighter: {
    id: 'fighter',
    name: 'Fighter',
    blurb: 'A master of arms who is good with every weapon and great with one.',
    hitDie: 10,
    statPriority: ['str', 'con', 'dex', 'wis', 'cha', 'int'],
    background: 'Soldier',
    features: ['Second Wind (2/rest)', 'Action Surge', 'Extra Attack', 'Fighting Style', 'Tactical Shift'],
    speciesAffinity: ['human', 'dwarf', 'dragonborn'],
  },
  monk: {
    id: 'monk',
    name: 'Monk',
    blurb: 'A disciplined martial artist who moves faster than the eye can follow.',
    hitDie: 8,
    statPriority: ['dex', 'wis', 'con', 'str', 'cha', 'int'],
    background: 'Acolyte',
    features: ['Martial Arts (d8)', 'Monk’s Focus (5 points)', 'Extra Attack', 'Stunning Strike', 'Deflect Attacks'],
    speciesAffinity: ['human', 'elf', 'goliath'],
  },
  paladin: {
    id: 'paladin',
    name: 'Paladin',
    blurb: 'A sworn knight whose oath burns bright enough to smite.',
    hitDie: 10,
    statPriority: ['str', 'cha', 'con', 'wis', 'dex', 'int'],
    background: 'Acolyte',
    features: ['Lay On Hands (25 HP pool)', 'Divine Smite', 'Extra Attack', 'Faithful Steed', 'Channel Divinity'],
    speciesAffinity: ['human', 'dragonborn', 'dwarf'],
  },
  ranger: {
    id: 'ranger',
    name: 'Ranger',
    blurb: 'A hunter of the wilds who never misses and never gets lost.',
    hitDie: 10,
    statPriority: ['dex', 'wis', 'con', 'str', 'int', 'cha'],
    background: 'Soldier',
    features: ['Favored Enemy (Hunter’s Mark, 2/day free)', 'Extra Attack', 'Fighting Style', 'Spellcasting (up to 2nd-level spells)'],
    speciesAffinity: ['elf', 'human', 'halfling'],
  },
  rogue: {
    id: 'rogue',
    name: 'Rogue',
    blurb: 'A shadow with a knife who is always somewhere they should not be.',
    hitDie: 8,
    statPriority: ['dex', 'con', 'int', 'wis', 'cha', 'str'],
    background: 'Criminal',
    features: ['Sneak Attack (3d6)', 'Cunning Action', 'Uncanny Dodge', 'Steady Aim', 'Expertise'],
    speciesAffinity: ['halfling', 'elf', 'tiefling'],
  },
  sorcerer: {
    id: 'sorcerer',
    name: 'Sorcerer',
    blurb: 'Magic runs in their blood, and it wants out.',
    hitDie: 6,
    statPriority: ['cha', 'con', 'dex', 'wis', 'int', 'str'],
    background: 'Sage',
    features: ['Spellcasting (up to 3rd-level spells)', 'Font of Magic (5 Sorcery Points)', 'Metamagic', 'Sorcerous Restoration'],
    speciesAffinity: ['dragonborn', 'tiefling', 'elf'],
  },
  warlock: {
    id: 'warlock',
    name: 'Warlock',
    blurb: 'Someone, or something, gave them power. The price comes later.',
    hitDie: 8,
    statPriority: ['cha', 'con', 'dex', 'wis', 'int', 'str'],
    background: 'Criminal',
    features: ['Pact Magic (2 slots, 3rd level)', 'Eldritch Invocations (3)', 'Magical Cunning', 'Eldritch Blast'],
    speciesAffinity: ['tiefling', 'human', 'elf'],
  },
  wizard: {
    id: 'wizard',
    name: 'Wizard',
    blurb: 'A scholar of the arcane with an answer for everything (in a book).',
    hitDie: 6,
    statPriority: ['int', 'con', 'dex', 'wis', 'cha', 'str'],
    background: 'Sage',
    features: ['Spellcasting (up to 3rd-level spells)', 'Arcane Recovery', 'Ritual Adept', 'Memorize Spell'],
    speciesAffinity: ['gnome', 'elf', 'human'],
  },
}

// PLACEHOLDER DATA: SRD 5.2 species. See the note at the top of classes.ts.
import type { SpeciesId } from './classes'

export interface SpeciesInfo {
  id: SpeciesId
  name: string
  size: 'Small' | 'Medium'
  speed: number
  /** Short trait list for the sheet. */
  traits: string[]
}

export const SPECIES_IDS: SpeciesId[] = [
  'dragonborn',
  'dwarf',
  'elf',
  'gnome',
  'goliath',
  'halfling',
  'human',
  'orc',
  'tiefling',
]

export const SPECIES: Record<SpeciesId, SpeciesInfo> = {
  dragonborn: {
    id: 'dragonborn',
    name: 'Dragonborn',
    size: 'Medium',
    speed: 30,
    traits: ['Draconic Ancestry', 'Breath Weapon', 'Damage Resistance', 'Darkvision 60 ft.'],
  },
  dwarf: {
    id: 'dwarf',
    name: 'Dwarf',
    size: 'Medium',
    speed: 30,
    traits: ['Darkvision 120 ft.', 'Dwarven Resilience', 'Dwarven Toughness', 'Stonecunning'],
  },
  elf: {
    id: 'elf',
    name: 'Elf',
    size: 'Medium',
    speed: 30,
    traits: ['Darkvision 60 ft.', 'Elven Lineage', 'Fey Ancestry', 'Keen Senses', 'Trance'],
  },
  gnome: {
    id: 'gnome',
    name: 'Gnome',
    size: 'Small',
    speed: 30,
    traits: ['Darkvision 60 ft.', 'Gnomish Cunning', 'Gnomish Lineage'],
  },
  goliath: {
    id: 'goliath',
    name: 'Goliath',
    size: 'Medium',
    speed: 35,
    traits: ['Giant Ancestry', 'Large Form', 'Powerful Build'],
  },
  halfling: {
    id: 'halfling',
    name: 'Halfling',
    size: 'Small',
    speed: 30,
    traits: ['Brave', 'Halfling Nimbleness', 'Luck', 'Naturally Stealthy'],
  },
  human: {
    id: 'human',
    name: 'Human',
    size: 'Medium',
    speed: 30,
    traits: ['Resourceful', 'Skillful', 'Versatile'],
  },
  orc: {
    id: 'orc',
    name: 'Orc',
    size: 'Medium',
    speed: 30,
    traits: ['Adrenaline Rush', 'Darkvision 120 ft.', 'Relentless Endurance'],
  },
  tiefling: {
    id: 'tiefling',
    name: 'Tiefling',
    size: 'Medium',
    speed: 30,
    traits: ['Darkvision 60 ft.', 'Fiendish Legacy', 'Otherworldly Presence'],
  },
}

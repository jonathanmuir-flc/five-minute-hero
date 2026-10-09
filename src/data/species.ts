// Content source of truth: reference/hero-picker.html (SPECIES_FIT, HOOKS, NAMES).
import type { Tone } from '../types/character'
import type { ClassName } from './classes'

export type SpeciesName =
  | 'Goliath'
  | 'Orc'
  | 'Halfling'
  | 'Gnome'
  | 'Elf'
  | 'Tiefling'
  | 'Dwarf'
  | 'Dragonborn'
  | 'Human'

/** Which classes each species suits. Human is not listed: it fits nothing in particular. */
export const SPECIES_FIT: Partial<Record<SpeciesName, readonly ClassName[]>> = {
  Goliath: ['Barbarian', 'Fighter', 'Paladin'],
  Orc: ['Barbarian', 'Fighter', 'Ranger'],
  Halfling: ['Rogue', 'Bard', 'Ranger', 'Monk'],
  Gnome: ['Wizard', 'Rogue', 'Bard'],
  Elf: ['Wizard', 'Ranger', 'Druid', 'Monk'],
  Tiefling: ['Warlock', 'Sorcerer', 'Bard'],
  Dwarf: ['Cleric', 'Fighter', 'Paladin'],
  Dragonborn: ['Paladin', 'Sorcerer', 'Fighter'],
}

/** Two suggested names per species. The class name's length picks which one. */
export const NAMES: Record<SpeciesName, readonly [string, string]> = {
  Goliath: ['Kavaki', 'Thalai'],
  Orc: ['Grusk', 'Varra'],
  Halfling: ['Pip Tealeaf', 'Wren Underbough'],
  Gnome: ['Fizzwick', 'Nissa Brightcog'],
  Elf: ['Aelar', 'Sylvara'],
  Tiefling: ['Mordai', 'Vex'],
  Dwarf: ['Brunna Ironfell', 'Tordek'],
  Dragonborn: ['Arjhan', 'Sora Kerrhylon'],
  Human: ['Mara Voss', 'Tobin Hale'],
}

export const HOOKS: Record<Tone, string> = {
  noble: "Swore to protect someone who is now in danger, and won't rest until they're safe.",
  scoundrel: 'Owes a large debt to the wrong people and is hoping this adventure pays it off.',
  mystery: "Carries a sealed letter they've never opened and won't explain.",
  comic: "Is absolutely certain they're the chosen one of a prophecy nobody else has heard of.",
}

/** How the tone reads in the "Played as ..." part of the Discord text. */
export const TONE_LABEL: Record<Tone, string> = {
  noble: 'the noble hero',
  scoundrel: 'a lovable scoundrel',
  mystery: 'a mysterious stranger',
  comic: 'the comic relief',
}

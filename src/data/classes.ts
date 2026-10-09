// Content source of truth: reference/hero-picker.html. Values are copied from
// the prototype's CLASSES table. Do not reword or "improve" them; the parity
// tests compare this file against the prototype.
import type { Ability } from './abilities'

export const CLASS_NAMES = [
  'Barbarian',
  'Bard',
  'Cleric',
  'Druid',
  'Fighter',
  'Monk',
  'Paladin',
  'Ranger',
  'Rogue',
  'Sorcerer',
  'Warlock',
  'Wizard',
] as const
export type ClassName = (typeof CLASS_NAMES)[number]

export type Background = 'Acolyte' | 'Criminal' | 'Sage' | 'Soldier'

export interface ClassInfo {
  /** Ability priority, best first. The standard array is dealt out in this order. */
  pri: readonly [Ability, Ability, Ability, Ability, Ability, Ability]
  /** Background. Its ability bonuses are NOT applied; the DM does that. */
  bg: Background
  /** Finishes the sentence "You're ..." */
  pitch: string
  /** The three "On your turn" bullets. */
  turn: readonly [string, string, string]
}

export const CLASSES: Record<ClassName, ClassInfo> = {
  Barbarian: {
    pri: ['STR', 'CON', 'DEX', 'WIS', 'CHA', 'INT'],
    bg: 'Soldier',
    pitch: 'a furious powerhouse who wades into the fight and refuses to fall',
    turn: [
      'Rage to hit harder and shrug off damage',
      'Swing a big weapon twice each turn',
      'Stand at the front and soak hits for the party',
    ],
  },
  Bard: {
    pri: ['CHA', 'DEX', 'CON', 'WIS', 'INT', 'STR'],
    bg: 'Criminal',
    pitch: 'a silver-tongued performer whose magic lives in words and music',
    turn: [
      'Hand allies Bardic Inspiration dice for big moments',
      'Cast spells that charm, confuse, or heal',
      'Do the talking when the party meets someone new',
    ],
  },
  Cleric: {
    pri: ['WIS', 'CON', 'STR', 'CHA', 'INT', 'DEX'],
    bg: 'Acolyte',
    pitch: 'a divine champion who keeps the party alive and smites the wicked',
    turn: [
      'Heal friends and shield them with spells',
      'Channel Divinity for a burst of holy power',
      'Hold the line in armor with a mace when needed',
    ],
  },
  Druid: {
    pri: ['WIS', 'CON', 'DEX', 'INT', 'CHA', 'STR'],
    bg: 'Sage',
    pitch: 'a guardian of the wild who speaks for nature and wears its shapes',
    turn: [
      'Wild Shape into an animal to scout or fight',
      'Cast nature spells that tangle, heal, or call storms',
      'Read the land and its creatures',
    ],
  },
  Fighter: {
    pri: ['STR', 'CON', 'DEX', 'WIS', 'CHA', 'INT'],
    bg: 'Soldier',
    pitch: 'a disciplined warrior who has trained for exactly this',
    turn: [
      'Attack twice every turn',
      'Action Surge for one extra burst of actions',
      'Use Second Wind to patch yourself up mid-fight',
    ],
  },
  Monk: {
    pri: ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
    bg: 'Acolyte',
    pitch: 'a lightning-fast martial artist who turns their body into a weapon',
    turn: [
      'Throw a flurry of strikes using Focus',
      'Stun enemies with a precise blow',
      'Move fast and deflect attacks',
    ],
  },
  Paladin: {
    pri: ['STR', 'CHA', 'CON', 'WIS', 'DEX', 'INT'],
    bg: 'Acolyte',
    pitch: 'a sworn knight whose oath gives their blade holy fire',
    turn: [
      'Pour divine power into a hit with Divine Smite',
      'Heal with Lay on Hands',
      'Stand between your friends and danger in heavy armor',
    ],
  },
  Ranger: {
    pri: ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
    bg: 'Soldier',
    pitch: 'a sharp-eyed hunter and tracker who never loses the trail',
    turn: [
      "Mark a target with Hunter's Mark for extra damage",
      'Fire your bow twice each turn',
      'Scout ahead, track, and spot trouble first',
    ],
  },
  Rogue: {
    pri: ['DEX', 'CON', 'INT', 'WIS', 'CHA', 'STR'],
    bg: 'Criminal',
    pitch: 'a quick, sneaky specialist who strikes where it hurts',
    turn: [
      'Land one big Sneak Attack hit per turn',
      'Hide, dash, or slip away as a bonus action',
      'Pick locks, find traps, and get into places',
    ],
  },
  Sorcerer: {
    pri: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
    bg: 'Sage',
    pitch: 'someone born with raw magic in their blood that barely stays contained',
    turn: [
      'Throw big spells like Fireball',
      'Twist your spells with Metamagic',
      'Spend Sorcery Points to cast more',
    ],
  },
  Warlock: {
    pri: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
    bg: 'Criminal',
    pitch: 'someone who made a deal with a mysterious patron and got real power for it',
    turn: [
      'Blast enemies with Eldritch Blast every turn',
      'Use Invocations, small permanent magic tricks',
      'Recover your few spell slots after a short rest',
    ],
  },
  Wizard: {
    pri: ['INT', 'CON', 'DEX', 'WIS', 'CHA', 'STR'],
    bg: 'Sage',
    pitch: 'a scholar of magic with a spellbook for every problem',
    turn: [
      'Pick from the biggest spell list in the game',
      'Cast Fireball, shields, and clever utility spells',
      'Recover spells on a short rest with Arcane Recovery',
    ],
  },
}

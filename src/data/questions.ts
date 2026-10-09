// PLACEHOLDER DATA: the six questions and their scoring weights are a first
// pass, not a port of the prototype. See the note at the top of classes.ts.
import type { ClassId, SpeciesId } from './classes'
import type { Tone } from '../types/character'

export interface AnswerOption {
  /** Short stable id, used as the answer value and in tests. */
  id: string
  label: string
  /**
   * TS pattern: `Partial<Record<...>>` makes every key optional, so an
   * option only has to list the classes it actually nudges.
   */
  classWeights: Partial<Record<ClassId, number>>
  speciesWeights?: Partial<Record<SpeciesId, number>>
  /** Only the final question sets a tone. */
  tone?: Tone
}

export interface Question {
  id: string
  prompt: string
  options: AnswerOption[]
}

export const QUESTIONS: Question[] = [
  {
    id: 'brawl',
    prompt: 'A tavern brawl breaks out. What do you do?',
    options: [
      {
        id: 'brawl-swing',
        label: 'Flip the table and wade in swinging.',
        classWeights: { barbarian: 3, fighter: 2, paladin: 1 },
        speciesWeights: { orc: 1, goliath: 1 },
      },
      {
        id: 'brawl-knife',
        label: 'Slip behind the biggest one with a knife.',
        classWeights: { rogue: 3, ranger: 1, monk: 1 },
        speciesWeights: { halfling: 1, elf: 1 },
      },
      {
        id: 'brawl-shout',
        label: 'Say something so good that everyone stops to listen.',
        classWeights: { bard: 3, warlock: 1, sorcerer: 1, paladin: 1 },
        speciesWeights: { tiefling: 1, human: 1 },
      },
      {
        id: 'brawl-mutter',
        label: 'Back toward the door and start muttering under your breath.',
        classWeights: { wizard: 3, sorcerer: 2, warlock: 1, druid: 1 },
        speciesWeights: { gnome: 1, elf: 1 },
      },
    ],
  },
  {
    id: 'power',
    prompt: 'Where does your power come from?',
    options: [
      {
        id: 'power-grit',
        label: 'Training, scars, and sheer grit.',
        classWeights: { fighter: 3, barbarian: 2, monk: 2, rogue: 1 },
        speciesWeights: { human: 1, dwarf: 1 },
      },
      {
        id: 'power-oath',
        label: 'A god, an oath, or a cause bigger than me.',
        classWeights: { cleric: 3, paladin: 3 },
        speciesWeights: { dwarf: 1, dragonborn: 1 },
      },
      {
        id: 'power-wild',
        label: 'The wild places and the old ways.',
        classWeights: { druid: 3, ranger: 3 },
        speciesWeights: { elf: 1, goliath: 1 },
      },
      {
        id: 'power-books',
        label: 'Books, bargains, or blood.',
        classWeights: { wizard: 2, warlock: 2, sorcerer: 2 },
        speciesWeights: { tiefling: 1, gnome: 1 },
      },
    ],
  },
  {
    id: 'weapon',
    prompt: 'Pick your weapon.',
    options: [
      {
        id: 'weapon-big',
        label: 'Something huge that needs both hands.',
        classWeights: { barbarian: 2, fighter: 2, paladin: 2 },
        speciesWeights: { goliath: 1, orc: 1 },
      },
      {
        id: 'weapon-bow',
        label: 'A bow, from very far away.',
        classWeights: { ranger: 3, fighter: 1, rogue: 1 },
        speciesWeights: { elf: 1 },
      },
      {
        id: 'weapon-fists',
        label: 'My own two fists.',
        classWeights: { monk: 3, barbarian: 1 },
        speciesWeights: { human: 1, goliath: 1 },
      },
      {
        id: 'weapon-wand',
        label: 'A wand, a staff, or a withering stare.',
        classWeights: { wizard: 2, sorcerer: 2, warlock: 2, druid: 1, cleric: 1 },
        speciesWeights: { gnome: 1, tiefling: 1 },
      },
    ],
  },
  {
    id: 'role',
    prompt: 'What is your job in the party?',
    options: [
      {
        id: 'role-tank',
        label: 'Front line. I take the hits.',
        classWeights: { fighter: 2, barbarian: 2, paladin: 2 },
        speciesWeights: { dwarf: 1, goliath: 1 },
      },
      {
        id: 'role-heal',
        label: 'I keep everyone alive.',
        classWeights: { cleric: 3, druid: 2, paladin: 1, bard: 1 },
        speciesWeights: { human: 1, dwarf: 1 },
      },
      {
        id: 'role-solve',
        label: 'I solve the problems nobody else can.',
        classWeights: { rogue: 2, bard: 2, wizard: 1, ranger: 1 },
        speciesWeights: { halfling: 1, gnome: 1 },
      },
      {
        id: 'role-blast',
        label: 'I delete things from a safe distance.',
        classWeights: { wizard: 2, sorcerer: 2, warlock: 2, ranger: 1 },
        speciesWeights: { tiefling: 1, dragonborn: 1 },
      },
    ],
  },
  {
    id: 'heart',
    prompt: 'Who are you, deep down?',
    options: [
      {
        id: 'heart-loyal',
        label: 'A loyal friend who finishes what they start.',
        classWeights: { paladin: 2, fighter: 2, cleric: 1, ranger: 1 },
        speciesWeights: { human: 1, dwarf: 1, halfling: 1 },
      },
      {
        id: 'heart-curious',
        label: 'A curious soul who has to know how everything works.',
        classWeights: { wizard: 2, bard: 1, druid: 1, cleric: 1 },
        speciesWeights: { gnome: 2, elf: 1 },
      },
      {
        id: 'heart-wanderer',
        label: 'A wanderer with a past I do not talk about.',
        classWeights: { rogue: 2, ranger: 2, warlock: 1, monk: 1 },
        speciesWeights: { tiefling: 1, elf: 1 },
      },
      {
        id: 'heart-storm',
        label: 'A storm looking for somewhere to break.',
        classWeights: { barbarian: 2, sorcerer: 2, warlock: 1 },
        speciesWeights: { dragonborn: 1, orc: 1 },
      },
    ],
  },
  {
    id: 'tone',
    prompt: 'What should tonight feel like for you?',
    options: [
      {
        id: 'tone-heroic',
        label: 'Heroic. Big swings and bright banners.',
        classWeights: { paladin: 1, fighter: 1, cleric: 1 },
        tone: 'heroic',
      },
      {
        id: 'tone-grim',
        label: 'Grim. Mud, blood, and hard choices.',
        classWeights: { barbarian: 1, warlock: 1, ranger: 1 },
        tone: 'grim',
      },
      {
        id: 'tone-mischievous',
        label: 'Mischievous. Chaos, jokes, and loot.',
        classWeights: { rogue: 1, bard: 1, sorcerer: 1 },
        tone: 'mischievous',
      },
      {
        id: 'tone-mysterious',
        label: 'Mysterious. Secrets, whispers, and old magic.',
        classWeights: { wizard: 1, druid: 1, warlock: 1 },
        tone: 'mysterious',
      },
    ],
  },
]

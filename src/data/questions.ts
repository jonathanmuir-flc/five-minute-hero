// Content source of truth: reference/hero-picker.html (Q). Titles, subtitles,
// order and weights are copied exactly. Only q1-q4 score classes; q5 picks a
// species and q6 picks the tone.
import type { Tone } from '../types/character'
import type { ClassName } from './classes'
import type { SpeciesName } from './species'

export type QuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6'

export type ClassPoints = Partial<Record<ClassName, number>>

export interface AnswerOption {
  title: string
  subtitle: string
  /** q1-q4 only: points added to each listed class. */
  points?: ClassPoints
  /** q5 only: candidate species, in order of preference. */
  species?: readonly SpeciesName[]
  /** q6 only. */
  tone?: Tone
}

export interface Question {
  id: QuestionId
  label: string
  options: readonly AnswerOption[]
}

export const SCORING_QUESTION_IDS: readonly QuestionId[] = ['q1', 'q2', 'q3', 'q4']

export const QUESTIONS: readonly Question[] = [
  {
    id: 'q1',
    label: 'When the fight starts, you…',
    options: [
      { title: 'Charge in first', subtitle: 'Get up close and take the hits', points: { Barbarian: 3, Fighter: 3, Paladin: 2, Monk: 1 } },
      { title: 'Strike from the shadows', subtitle: 'Find the angle, hit hard, vanish', points: { Rogue: 3, Ranger: 2, Monk: 2 } },
      { title: 'Bend reality', subtitle: 'Throw magic from the back line', points: { Wizard: 3, Sorcerer: 3, Warlock: 3 } },
      { title: 'Keep everyone standing', subtitle: 'Heal, protect, and support', points: { Cleric: 3, Druid: 2, Bard: 2, Paladin: 1 } },
    ],
  },
  {
    id: 'q2',
    label: 'Where does your power come from?',
    options: [
      { title: 'Training and grit', subtitle: 'Years of practice', points: { Fighter: 2, Monk: 2, Rogue: 2, Ranger: 1 } },
      { title: 'Faith or a sacred oath', subtitle: 'A god or a promise you keep', points: { Cleric: 3, Paladin: 3 } },
      { title: 'Books and study', subtitle: 'You figured magic out', points: { Wizard: 4 } },
      { title: 'Born with it', subtitle: "It's in your blood", points: { Sorcerer: 4 } },
      { title: 'A deal you made', subtitle: 'Someone powerful owes you', points: { Warlock: 4 } },
      { title: 'Nature itself', subtitle: 'Forests, beasts, storms', points: { Druid: 3, Ranger: 2 } },
      { title: 'Pure fury', subtitle: 'Emotion turned into strength', points: { Barbarian: 4 } },
      { title: 'Charm and art', subtitle: 'Music, stories, and nerve', points: { Bard: 4 } },
    ],
  },
  {
    id: 'q3',
    label: 'How much do you want to keep track of?',
    options: [
      { title: 'Keep it simple', subtitle: 'A few big moves, mostly hitting things', points: { Barbarian: 2, Fighter: 2, Rogue: 1 } },
      { title: 'Some choices', subtitle: 'A handful of tricks each fight', points: { Paladin: 1, Ranger: 1, Monk: 1, Warlock: 1, Rogue: 1 } },
      { title: 'Give me all the options', subtitle: 'Lots of spells and decisions', points: { Wizard: 2, Cleric: 1, Druid: 2, Bard: 1, Sorcerer: 1 } },
    ],
  },
  {
    id: 'q4',
    label: "A free afternoon in town. You're…",
    options: [
      { title: 'Talking people into things', subtitle: 'Deals, rumors, free drinks', points: { Bard: 2, Warlock: 1, Sorcerer: 1, Paladin: 1 } },
      { title: 'In the library or temple', subtitle: 'Reading, praying, researching', points: { Wizard: 2, Cleric: 2 } },
      { title: 'Out past the city walls', subtitle: 'Woods and wild places', points: { Ranger: 2, Druid: 2 } },
      { title: 'In the tavern brawl', subtitle: 'Arm-wrestling, sparring', points: { Barbarian: 2, Fighter: 2, Monk: 1 } },
      { title: "Somewhere you shouldn't be", subtitle: 'Locked doors are a suggestion', points: { Rogue: 3, Warlock: 1 } },
    ],
  },
  {
    id: 'q5',
    label: 'Pick a body type for your hero',
    options: [
      { title: 'Big and imposing', subtitle: 'Towering or tusked', species: ['Goliath', 'Orc'] },
      { title: 'Small and quick', subtitle: 'Easy to overlook', species: ['Halfling', 'Gnome'] },
      { title: 'Graceful and ancient', subtitle: 'Long-lived and otherworldly', species: ['Elf', 'Tiefling'] },
      { title: 'Sturdy and stubborn', subtitle: 'Built like a mountain', species: ['Dwarf', 'Dragonborn'] },
      { title: 'Just a regular person', subtitle: 'An everyday human', species: ['Human'] },
    ],
  },
  {
    id: 'q6',
    label: 'How do you want to play them?',
    options: [
      { title: 'The noble hero', subtitle: 'Does the right thing, loudly', tone: 'noble' },
      { title: 'The lovable scoundrel', subtitle: 'Charming, a little shady', tone: 'scoundrel' },
      { title: 'The mysterious stranger', subtitle: 'Says little, knows more', tone: 'mystery' },
      { title: 'The comic relief', subtitle: 'Here for a good time', tone: 'comic' },
    ],
  },
]

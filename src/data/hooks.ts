// PLACEHOLDER DATA: story hooks, grouped by tone. Each hook can use the
// token {class} which is swapped for the character's class name.
import type { Tone } from '../types/character'

export const HOOKS: Record<Tone, string[]> = {
  heroic: [
    'The village that raised you sent a letter: the old bridge fell, the mill is silent, and they need a {class}. They need you.',
    'You once swore to a dying knight that you would carry her shield to the capital. Tonight is the night you finally arrive.',
    'A child handed you a wooden sword and called you a hero. You have been trying to live up to it ever since.',
  ],
  grim: [
    'The last party you travelled with did not come back from the barrow. You did. You still do not know why.',
    'There is a price on your head in two cities. One of them is right.',
    'You buried your mentor with their own blade, as they asked. Someone has since dug it up.',
  ],
  mischievous: [
    'You are fairly sure the map you stole is a fake. You are absolutely sure the person you stole it from is following you.',
    'You owe a dragon a favour. It was a small dragon. It is not small anymore.',
    'Every {class} needs a signature move. Yours involves a chicken, and the party has asked you to stop.',
  ],
  mysterious: [
    'You wake each dawn with the same word on your lips, in a language you have never learned. Last night, someone answered.',
    'The stars have been slightly wrong for a month. Nobody else seems to notice.',
    'A sealed letter arrived addressed to a {class} you have never met, bearing your handwriting.',
  ],
}

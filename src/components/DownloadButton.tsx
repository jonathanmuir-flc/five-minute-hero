import type { Character } from '../types/character'

interface DownloadButtonProps {
  character: Character
}

/** "ander-brightwood" from "Ander Brightwood". */
function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Saves the character as a .json file for the DM. The file's shape is the
 * Character type in src/types/character.ts, nothing more.
 */
export function DownloadButton({ character }: DownloadButtonProps) {
  function download() {
    const json = JSON.stringify(character, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${slug(character.name) || 'hero'}-level-5.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <button type="button" className="ghost" onClick={download}>
      Download for the DM
    </button>
  )
}

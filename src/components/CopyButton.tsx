import type { RefObject } from 'react'

export type CopyResult = 'copied' | 'manual'

interface CopyButtonProps {
  text: string
  /** The visible textarea holding `text`; selected when automatic copying fails. */
  fallbackTarget: RefObject<HTMLTextAreaElement | null>
  onResult: (result: CopyResult) => void
}

/**
 * Copies `text`. Tries the Clipboard API, then the old execCommand trick, and
 * if both fail it selects the visible textarea so the player can press
 * Ctrl+C (or Cmd+C).
 */
export function CopyButton({ text, fallbackTarget, onResult }: CopyButtonProps) {
  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        onResult('copied')
        return
      }
    } catch {
      // fall through to the next strategy
    }

    try {
      const scratch = document.createElement('textarea')
      scratch.value = text
      scratch.setAttribute('readonly', '')
      scratch.style.position = 'fixed'
      scratch.style.opacity = '0'
      document.body.appendChild(scratch)
      scratch.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(scratch)
      if (ok) {
        onResult('copied')
        return
      }
    } catch {
      // fall through
    }

    fallbackTarget.current?.focus()
    fallbackTarget.current?.select()
    onResult('manual')
  }

  return (
    <button type="button" onClick={copy}>
      Copy for Discord
    </button>
  )
}

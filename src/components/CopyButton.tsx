import { useEffect, useRef, useState } from 'react'

interface CopyButtonProps {
  text: string
  label?: string
}

type CopyState = 'idle' | 'copied' | 'manual'

/**
 * Copies `text` to the clipboard. Tries the modern Clipboard API first,
 * then the old execCommand trick, and if both fail it shows the text in a
 * textarea with everything selected so the player can press Ctrl/Cmd+C.
 */
export function CopyButton({ text, label = 'Copy for Discord' }: CopyButtonProps) {
  // React pattern: useState gives us a value plus a setter. Changing it
  // re-renders this component.
  const [state, setState] = useState<CopyState>('idle')

  // React pattern: useRef holds a reference to a real DOM element (or any
  // value) that survives re-renders without causing them.
  const fallbackRef = useRef<HTMLTextAreaElement>(null)

  // React pattern: useEffect runs *after* render. Here it resets the
  // "Copied!" label a couple of seconds later and cleans up the timer if
  // the component goes away first.
  useEffect(() => {
    if (state !== 'copied') return
    const timer = window.setTimeout(() => setState('idle'), 2000)
    return () => window.clearTimeout(timer)
  }, [state])

  useEffect(() => {
    if (state === 'manual') fallbackRef.current?.select()
  }, [state])

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        setState('copied')
        return
      }
    } catch {
      // fall through to the next strategy
    }

    // Legacy fallback: put the text in an off-screen textarea and ask the
    // browser to copy the selection.
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
        setState('copied')
        return
      }
    } catch {
      // fall through
    }

    setState('manual')
  }

  return (
    <div className="copy">
      <button type="button" className="btn btn--primary" onClick={copy}>
        {state === 'copied' ? 'Copied!' : label}
      </button>
      {/* React pattern: `cond && <jsx>` renders the element only when cond is true. */}
      {state === 'manual' && (
        <div className="copy__manual">
          <p>Your browser blocked automatic copying. The text is selected below, so press Ctrl+C (or Cmd+C).</p>
          <textarea ref={fallbackRef} readOnly value={text} rows={6} />
        </div>
      )}
    </div>
  )
}

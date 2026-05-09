'use client'

import { useEffect } from 'react'
import { enableVisualEditing } from '@sanity/visual-editing'

/**
 * Activates Sanity's Visual Editing overlay on mount. The library
 * communicates with Sanity Studio's Presentation tool via postMessage
 * over the iframe channel — no React tree to render, just a side-effect
 * that wires up listeners.
 */
export function VisualEditingClient() {
  useEffect(() => {
    const disable = enableVisualEditing()
    return () => {
      disable?.()
    }
  }, [])

  return null
}

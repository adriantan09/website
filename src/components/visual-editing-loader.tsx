import { draftMode } from 'next/headers'
import { VisualEditingClient } from './visual-editing-client'

/**
 * Renders Sanity's Visual Editing overlay only when Next.js Draft Mode is
 * active. This powers the two-way bridge between the previewed page and
 * Sanity Studio's Presentation tool — clicking an element in the iframe
 * focuses the corresponding field in Studio, and edits in Studio push
 * back to the iframe in real time.
 *
 * Public visitors never load any of this — the client component (and its
 * bundle) is only included on requests where Draft Mode is on.
 */
export async function VisualEditingLoader() {
  if (!(await draftMode()).isEnabled) return null
  return <VisualEditingClient />
}

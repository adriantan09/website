import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { previewClient } from '@/sanity/client'

/**
 * Enables Next.js Draft Mode.
 *
 * Sanity's Presentation tool calls this endpoint with a short-lived signed
 * token in the request URL. `defineEnableDraftMode` validates that token
 * against the dataset (using the previewClient's read token), enables
 * Next.js Draft Mode, and redirects back to the page being previewed.
 *
 * No shared "preview secret" is required — auth is gated by the user
 * being logged in to Sanity Studio for this dataset.
 */
export const { GET } = defineEnableDraftMode({
  client: previewClient.withConfig({ useCdn: false }),
})

import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId) {
  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID. ' +
      'Create a .env.local file at the project root and set it to your Sanity project ID. ' +
      'See .env.local.example for a template.',
  )
}

if (!dataset) {
  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET. ' +
      'Create a .env.local file at the project root and set it to your Sanity dataset (e.g. "production").',
  )
}

export const apiVersion = '2024-05-01'

/**
 * Public-facing client used for published content. Reads from Sanity's CDN
 * is disabled so that revalidation tags / on-publish webhooks reflect new
 * content immediately rather than getting stale-cached copies.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
})

/**
 * Preview/draft client used when Next.js Draft Mode is active. Requires a
 * Sanity API token with at least Viewer access (drafts are not public).
 *
 * The token is read at request time so the public client doesn't need it.
 * If the token is missing we fall back to the public client; previewing
 * drafts will simply show published content rather than crash.
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_READ_TOKEN,
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

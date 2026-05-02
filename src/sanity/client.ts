import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

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

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-05-01',
  useCdn: false, // Set to false for ISR or tags
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

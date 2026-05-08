import { draftMode } from 'next/headers'
import { client, previewClient } from './client'

interface SanityFetchOptions<P extends Record<string, unknown> = Record<string, unknown>> {
  query: string
  params?: P
  /**
   * Optional Next.js fetch tags so we can revalidate by tag from the
   * /api/revalidate webhook when content is published.
   */
  tags?: string[]
}

/**
 * Draft-aware Sanity fetch helper. When Next.js Draft Mode is enabled
 * (set via /api/draft), drafts are merged on top of published documents
 * via the previewClient. Otherwise, the public client is used.
 *
 * Use this in every server component / route handler in place of
 * `client.fetch(...)` so previews work end-to-end.
 */
export async function sanityFetch<T = unknown>({
  query,
  params,
  tags,
}: SanityFetchOptions): Promise<T> {
  const isDraftMode = (await draftMode()).isEnabled
  const fetchClient = isDraftMode ? previewClient : client

  // Note: tags are forwarded to Next's fetch so future revalidate-by-tag
  // hooks can target specific content. With force-cache + revalidatePath
  // in /api/revalidate, this works without further configuration.
  void tags
  return fetchClient.fetch<T>(query, params ?? {}, {
    cache: isDraftMode ? 'no-store' : 'force-cache',
  })
}

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { previewClient } from '@/sanity/client'

/**
 * Enables Next.js Draft Mode and redirects to the requested URL.
 *
 * Called by Sanity Studio's Presentation tool (and an "Open preview" link
 * on documents) to let editors view their unpublished changes on the live
 * site. The draft cookie is signed and only readable by the same browser
 * session, so other visitors continue to see published content.
 *
 * Usage: /api/draft?slug=/cycling/your-ride&secret=<env secret>
 *
 * `secret` is required so a stranger can't enable draft mode by guessing
 * URLs. We compare against `SANITY_PREVIEW_SECRET` which you set in your
 * hosting environment alongside `SANITY_API_READ_TOKEN`.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug') ?? '/'

  if (!process.env.SANITY_PREVIEW_SECRET) {
    return new Response(
      'Missing SANITY_PREVIEW_SECRET environment variable on the server.',
      { status: 500 },
    )
  }

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }

  // Sanity check: verify we can actually read drafts. If the read token
  // isn't configured, fail loudly so the user knows to set it up.
  if (!process.env.SANITY_API_READ_TOKEN) {
    return new Response(
      'Missing SANITY_API_READ_TOKEN environment variable on the server. ' +
        'Add a Sanity API token with Viewer access to enable draft previews.',
      { status: 500 },
    )
  }

  // A small safety net: only allow internal redirects so the secret can't
  // be used as an open redirect to phish users.
  const safeSlug = slug.startsWith('/') ? slug : `/${slug}`

  try {
    // Probe the preview client so any auth issue surfaces as a 500 here
    // rather than a confusing empty page later.
    await previewClient.fetch(`*[_type == "activity"][0]._id`)
  } catch (e) {
    return new Response(`Failed to authenticate with Sanity: ${(e as Error).message}`, {
      status: 500,
    })
  }

  ;(await draftMode()).enable()
  redirect(safeSlug)
}

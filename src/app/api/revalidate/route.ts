import { revalidatePath } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import type { NextRequest } from 'next/server'

/**
 * Sanity webhook endpoint. Configure a webhook in sanity.io/manage:
 *   - URL:      https://yoursite.com/api/revalidate
 *   - Trigger:  Create, Update, Delete
 *   - Filter:   _type in ["activity", "siteSettings", "project"]
 *   - HTTP method: POST
 *   - HTTP headers: none
 *   - Secret:   set to the same value as SANITY_REVALIDATE_SECRET in your env
 *
 * On every published change this route refreshes the relevant pages so the
 * live site reflects the new content within seconds rather than waiting
 * for the next scheduled rebuild.
 */
export async function POST(req: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response(
        'Missing SANITY_REVALIDATE_SECRET environment variable on the server.',
        { status: 500 },
      )
    }

    const { isValidSignature, body } = await parseBody<{
      _type?: string
      slug?: { current?: string }
    }>(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad payload', { status: 400 })
    }

    // Refresh the broad pages that depend on Sanity content. We use
    // `layout` so child pages (e.g. /cycling/some-slug) are invalidated
    // alongside the index pages.
    revalidatePath('/', 'layout')

    return Response.json({ revalidated: true, type: body._type })
  } catch (err) {
    return new Response((err as Error).message, { status: 500 })
  }
}

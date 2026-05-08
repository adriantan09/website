import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Exits Next.js Draft Mode and redirects back to the calling page (or `/`
 * if not provided). Triggered by the floating preview-mode banner.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') ?? '/'
  const safeSlug = slug.startsWith('/') ? slug : `/${slug}`

  ;(await draftMode()).disable()
  redirect(safeSlug)
}

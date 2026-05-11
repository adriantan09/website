import { draftMode } from 'next/headers'
import { cookies } from 'next/headers'
import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants'
import { previewClient } from '@/sanity/client'

/**
 * Enables Next.js Draft Mode and navigates the browser to the preview URL.
 *
 * We deliberately use a meta-refresh HTML response rather than a server-side
 * `redirect()` because Sanity's Presentation tool doesn't always follow the
 * 307 inside its iframe — the URL bar stays pinned to /api/draft instead of
 * navigating to the actual content. A meta-refresh forces the browser to
 * navigate as a real top-level page load, which Presentation observes and
 * mirrors in its URL bar.
 *
 * Authorisation: validatePreviewUrl checks the signed
 * `sanity-preview-secret` query param that Presentation generates against
 * the dataset's read token — so only logged-in Studio users can succeed.
 */
export async function GET(request: Request) {
  const { isValid, redirectTo = '/', studioPreviewPerspective } =
    await validatePreviewUrl(
      previewClient.withConfig({ useCdn: false }),
      request.url,
    )

  if (!isValid) {
    return new Response('Invalid preview secret', { status: 401 })
  }

  const draftStore = await draftMode()
  if (!draftStore.isEnabled) draftStore.enable()

  const isSecure = process.env.NODE_ENV === 'production'
  const cookieStore = await cookies()

  // Refresh the bypass cookie so Next.js Draft Mode persists.
  const bypass = cookieStore.get('__prerender_bypass')
  cookieStore.set({
    name: '__prerender_bypass',
    value: bypass?.value ?? '',
    httpOnly: true,
    path: '/',
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
  })

  if (studioPreviewPerspective) {
    cookieStore.set({
      name: perspectiveCookieName,
      value: studioPreviewPerspective,
      httpOnly: true,
      path: '/',
      secure: isSecure,
      sameSite: isSecure ? 'none' : 'lax',
    })
  }

  // Escape the destination URL so it can be safely embedded in HTML.
  const escapedTarget = redirectTo
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=${escapedTarget}">
    <title>Entering preview…</title>
  </head>
  <body>
    <p>Entering preview… <a href="${escapedTarget}">Click here if you are not redirected.</a></p>
    <script>window.location.replace(${JSON.stringify(redirectTo)});</script>
  </body>
</html>`

  return new Response(html, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}

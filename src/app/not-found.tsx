import Link from 'next/link'

/**
 * Root-level 404 — used for any unmatched route outside of any route
 * group. Mirrors the styling of the (site)/not-found.tsx page so the
 * page still respects the site's theme tokens (background, foreground,
 * muted) and never falls back to Next.js's built-in dark page.
 *
 * Note: this file does not have access to the (site) layout's
 * Navigation. It deliberately renders a minimal, self-contained shell
 * with just the brand wordmark and a back-to-home link.
 */
export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-4">
          404
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-8">
          The page you were looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  )
}

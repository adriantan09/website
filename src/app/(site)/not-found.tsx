import Link from 'next/link'

/**
 * 404 for any route inside the (site) group. The (site)/layout.tsx
 * wrapper still applies, so the Navigation, theme tokens and overall
 * page chrome remain consistent with the rest of the site.
 */
export default function NotFound() {
  return (
    <div
      className={
        // Fill the viewport minus the height of the top Navigation so the
        // 404 message sits visually centered on the page.
        'container flex min-h-[calc(100vh-6rem)] items-center justify-center ' +
        'pt-6 pb-12 md:pt-10 md:pb-24'
      }
    >
      <div className="mx-auto max-w-xl text-center">
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
    </div>
  )
}

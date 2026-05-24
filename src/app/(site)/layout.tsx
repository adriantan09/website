import { Navigation } from '@/components/layout/navigation'

/**
 * Layout for the public-facing site. Wraps every public route group
 * (`/`, `/posts`, `/cycling`, `/hiking`, `/travel`, `/[...path]`) with
 * the shared site chrome.
 *
 * Chrome is intentionally minimal: a single navigation element that sits
 * centered at the top on small screens and pins to the left edge on
 * larger screens — no traditional header or footer.
 *
 * The admin route lives outside this group so it can use the full
 * viewport for Sanity Studio without the site chrome cropping it.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>{children}</main>
    </div>
  )
}

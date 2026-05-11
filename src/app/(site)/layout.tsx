import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

/**
 * Layout for the public-facing site. Wraps every public route group
 * (`/`, `/about`, `/cycling`, `/hiking`, `/travel`, `/[...path]`) with
 * the shared site chrome — header, main, footer.
 *
 * The admin route lives outside this group so it can use the full
 * viewport for Sanity Studio without the site chrome cropping it.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

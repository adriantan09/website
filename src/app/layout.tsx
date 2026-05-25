import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { DraftModeBanner } from '@/components/ui/draft-mode-banner'
import { VisualEditingLoader } from '@/components/visual-editing-loader'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'Adrian Tan | Activities Portfolio',
  description: 'A collection of hikes, cycling adventures, and photography.',
}

/**
 * Root layout: the bare-minimum HTML shell that every route inherits.
 * The site chrome (header/footer) lives in `(site)/layout.tsx` so the
 * admin route (Sanity Studio) gets the full viewport without it.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <DraftModeBanner />
          <VisualEditingLoader />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}

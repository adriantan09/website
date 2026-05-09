import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { DraftModeBanner } from '@/components/ui/draft-mode-banner'
import { VisualEditingLoader } from '@/components/visual-editing-loader'

export const metadata: Metadata = {
  title: 'Adrian Tan | Activities Portfolio',
  description: 'A collection of hikes, cycling adventures, and photography.',
}

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
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <DraftModeBanner />
          <VisualEditingLoader />
        </ThemeProvider>
      </body>
    </html>
  )
}

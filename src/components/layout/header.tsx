'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

const navLinks = [
  { name: 'Hikes', href: '/hiking' },
  { name: 'Cycling', href: '/cycling' },
  { name: 'Travels', href: '/travel' },
  { name: 'Collections', href: '/collections' },
  { name: 'About', href: '/about' },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header className="py-8 sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          ADRIAN TAN
        </Link>

        <nav className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-6 list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />)}
          </button>
        </nav>
      </div>
    </header>
  )
}

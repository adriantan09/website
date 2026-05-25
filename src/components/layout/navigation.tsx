'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState, forwardRef } from 'react'
import { Camera, Mail, Sun, Moon } from 'lucide-react'
import type { LucideIcon, LucideProps } from 'lucide-react'

/**
 * Brand icons (Instagram, GitHub) are intentionally not shipped by
 * `lucide-react` for trademark reasons, so we render lightweight inline
 * SVGs that match the visual weight of the Lucide stroke icons.
 */
const InstagramIcon: LucideIcon = forwardRef<SVGSVGElement, LucideProps>(
  ({ size = 24, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(props as any)}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
)
InstagramIcon.displayName = 'InstagramIcon'

const GithubIcon: LucideIcon = forwardRef<SVGSVGElement, LucideProps>(
  ({ size = 24, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(props as any)}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
)
GithubIcon.displayName = 'GithubIcon'

const EMAIL = 'adrian.tan09@gmail.com'

type NavLink = {
  label: string
  href: string
  Icon: LucideIcon
  external?: boolean
}

const navLinks: NavLink[] = [
  { label: 'Posts', href: '/posts', Icon: Camera },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/adriantan09/',
    Icon: InstagramIcon,
    external: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/adriantan09',
    Icon: GithubIcon,
    external: true,
  },
  { label: 'Email', href: `mailto:${EMAIL}`, Icon: Mail, external: true },
]

function NavButton({
  label,
  Icon,
  onClick,
  href,
  external,
  ariaLabel,
}: {
  label: string
  Icon: LucideIcon
  onClick?: () => void
  href?: string
  external?: boolean
  ariaLabel?: string
}) {
  const content = (
    <>
      <Icon size={18} aria-hidden="true" />
      {/* Tooltip-style label: appears below the icon on hover/focus. */}
      <span
        className={
          'pointer-events-none absolute top-full left-1/2 mt-1.5 -translate-x-1/2 ' +
          'whitespace-nowrap rounded-md bg-foreground px-2 py-1 ' +
          'text-xs font-medium text-background shadow-md ' +
          'opacity-0 transition-opacity duration-150 ' +
          'group-hover:opacity-100 group-focus-visible:opacity-100'
        }
      >
        {label}
      </span>
    </>
  )

  const className =
    'group relative flex items-center justify-center w-10 h-10 rounded-md ' +
    'cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
    'transition-colors'

  if (href) {
    if (external) {
      const isMailto = href.startsWith('mailto:')
      return (
        <a
          href={href}
          aria-label={ariaLabel ?? label}
          className={className}
          {...(isMailto
            ? {}
            : { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {content}
        </a>
      )
    }
    return (
      <Link href={href} aria-label={ariaLabel ?? label} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className={className}
    >
      {content}
    </button>
  )
}

export function Navigation() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = theme === 'dark'
  const ThemeIcon = mounted ? (isDark ? Sun : Moon) : Sun
  const themeLabel = mounted
    ? isDark
      ? 'Light mode'
      : 'Dark mode'
    : 'Toggle theme'

  return (
    <nav
      aria-label="Primary"
      className="container flex items-center justify-between gap-4 py-4"
    >
      {/* Wordmark / brand */}
      <Link
        href="/"
        aria-label="Adrian Tan — home"
        className="text-lg sm:text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
      >
        Adrian Tan
      </Link>

      {/* Icon group */}
      <div className="flex items-center gap-2 sm:gap-3">
        {navLinks.map((item) => (
          <NavButton
            key={item.href}
            label={item.label}
            href={item.href}
            external={item.external}
            Icon={item.Icon}
          />
        ))}
        <NavButton
          label={themeLabel}
          Icon={ThemeIcon}
          ariaLabel="Toggle color theme"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        />
      </div>
    </nav>
  )
}

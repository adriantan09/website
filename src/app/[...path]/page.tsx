import { urlFor } from '@/sanity/client'
import { resolveActivityByPath, buildActivityHref } from '@/sanity/resolve-activity-path'
import { HeroStats } from '@/components/ui/hero-stats'
import { BodyRenderer } from '@/components/ui/body-renderer'
import { ActivityCard } from '@/components/ui/cards'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  // Catch-all dynamic segment. In Next.js 15+ params is a Promise.
  params: Promise<{ path: string[] }>
}

export default async function ActivityDetail({ params }: Props) {
  const { path } = await params
  const segments = Array.isArray(path) ? path : [path]
  const activity = await resolveActivityByPath(segments)

  if (!activity) {
    notFound()
  }

  // Ancestor chain for the breadcrumb. The query returns ancestors in
  // root-first order (root → immediate parent).
  const ancestors: { _id: string; title: string; slug: { current: string } }[] =
    activity.ancestors ?? []

  // Build cumulative href for each ancestor: ['/japan', '/japan/foo', ...]
  const ancestorLinks = ancestors.map((a, i) => ({
    title: a.title,
    href: '/' + ancestors.slice(0, i + 1).map((x) => x.slug.current).join('/'),
  }))

  const isContainer = (activity.childActivities?.length ?? 0) > 0

  return (
    <article>
      <div className="container pt-8">
        {/* Breadcrumb of ancestors */}
        {ancestorLinks.length > 0 && (
          <nav className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {ancestorLinks.map((a, i) => (
              <span key={a.href}>
                <Link href={a.href} className="hover:text-foreground underline-offset-4 hover:underline">
                  {a.title}
                </Link>
                <span className="mx-2 opacity-60">/</span>
                {i === ancestorLinks.length - 1 ? null : null}
              </span>
            ))}
          </nav>
        )}

        {/* Hero Image with title overlay — constrained to content width */}
        <header className="relative w-full aspect-[3/2] md:aspect-[16/9] bg-muted overflow-hidden rounded-xl">
          {activity.mainImage && (
            <Image
              src={urlFor(activity.mainImage).width(2000).url()}
              alt={activity.mainImage?.alt || activity.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1100px) 100vw, 1100px"
            />
          )}
          {/* Bottom gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
            <div className="max-w-3xl">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] mb-3 text-white/80">
                {activity.category && <>{activity.category}</>}
                {activity.subCategory && ` • ${activity.subCategory}`}
                {activity.location && `${activity.category ? ' • ' : ''}${activity.location}`}
                {!activity.category && !activity.location && isContainer && 'Trip'}
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] text-white drop-shadow-sm">
                {activity.title}
              </h1>
            </div>
          </div>
        </header>

        {/* Stats footer band — directly under the hero image */}
        <HeroStats
          variant="footer"
          stats={activity.keyStats ?? []}
        />
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
        </div>

        {/* Interleaved body */}
        <BodyRenderer body={activity.body} />

        {/* Child activities (if this activity is a container/trip) */}
        {isContainer && (
          <section className="mt-20 max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-2">
                In this trip
              </h2>
              <h3 className="text-3xl font-bold tracking-tight">Activities</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {activity.childActivities.map((child: any) => (
                <ActivityCard key={child._id} activity={child} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}

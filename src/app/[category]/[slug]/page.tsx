import { client, urlFor } from '@/sanity/client'
import { activityBySlugQuery } from '@/sanity/queries'
import { HeroStats } from '@/components/ui/hero-stats'
import { MapEmbed } from '@/components/ui/map-embed'
import { BodyRenderer } from '@/components/ui/body-renderer'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  // In Next.js 15+ dynamic route params are async — they're a Promise that
  // must be awaited (or unwrapped with React.use in Client Components).
  params: Promise<{
    category: string
    slug: string
  }>
}

export default async function ActivityDetail({ params }: Props) {
  const { slug } = await params
  const activity = await client.fetch(activityBySlugQuery, { slug })

  if (!activity) {
    notFound()
  }

  return (
    <article className="pb-24">
      {/* Hero Image */}
      <div className="relative w-full h-[70vh] mb-12 bg-muted">
        {activity.mainImage && (
          <Image
            src={urlFor(activity.mainImage).width(2000).url()}
            alt={activity.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        <div className="absolute bottom-12 left-0 w-full">
          <div className="container">
            <div className="max-w-3xl">
              {activity.parentCollection && (
                <Link
                  href={`/collections/${activity.parentCollection.slug.current}`}
                  className="inline-block text-xs font-semibold uppercase tracking-[0.3em] mb-3 text-foreground/80 hover:text-foreground underline-offset-4 hover:underline"
                >
                  ← Part of: {activity.parentCollection.title}
                </Link>
              )}
              <p className="text-sm font-semibold uppercase tracking-[0.3em] mb-4 text-foreground/80">
                {activity.category} {activity.subCategory && `• ${activity.subCategory}`}
                {activity.location && ` • ${activity.location}`}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 leading-tight">
                {activity.title}
              </h1>
              <p className="text-lg font-medium opacity-80">
                {new Date(activity.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {activity.excerpt && (
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
              {activity.excerpt}
            </p>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {/* Stats */}
          <HeroStats
            distance={activity.stats?.distance}
            elevation={activity.stats?.elevation}
            duration={activity.stats?.duration}
            days={activity.stats?.days}
          />

          {/* Map Embed */}
          {activity.embedUrl && <MapEmbed url={activity.embedUrl} />}

          {/* Multi-day Breakdown */}
          {activity.stats?.days > 1 && activity.multiDayBreakdown && (
            <div className="my-12 p-8 bg-muted/50 rounded-sm border border-border">
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6">Daily Breakdown</h2>
              <div className="space-y-6">
                {activity.multiDayBreakdown.map((day: any) => (
                  <div key={day.day} className="flex flex-col md:flex-row md:items-start gap-4 pb-6 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="w-16">
                      <span className="text-sm font-bold">DAY {day.day}</span>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        {day.campSite && <p className="text-sm font-medium mb-1">{day.campSite}</p>}
                        {day.notes && <p className="text-sm text-muted-foreground">{day.notes}</p>}
                      </div>
                      <div className="text-right flex md:flex-col gap-2 md:gap-0 items-center md:items-end">
                         {day.distance && <span className="text-sm font-bold tabular-nums">{day.distance}km</span>}
                         {day.duration && <span className="text-xs text-muted-foreground tabular-nums">{day.duration}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interleaved body: prose, section headings, galleries, pull quotes */}
        <BodyRenderer body={activity.body} />
      </div>
    </article>
  )
}

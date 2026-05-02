import { client, urlFor } from '@/sanity/client'
import { activityBySlugQuery } from '@/sanity/queries'
import { HeroStats } from '@/components/ui/hero-stats'
import { MapEmbed } from '@/components/ui/map-embed'
import { RichText } from '@/components/ui/rich-text'
import { MediaGallery } from '@/components/ui/media-gallery'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    category: string
    slug: string
  }
}

export default async function ActivityDetail({ params }: Props) {
  const activity = await client.fetch(activityBySlugQuery, { slug: params.slug })

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
              <p className="text-sm font-semibold uppercase tracking-[0.3em] mb-4 text-foreground/80">
                {activity.category} {activity.subCategory && `• ${activity.subCategory}`}
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

          {/* Notes */}
          {activity.content && (
            <div className="my-12">
              <RichText value={activity.content} />
            </div>
          )}
        </div>

        {/* Photo Gallery (Full width of container) */}
        {activity.gallery && activity.gallery.length > 0 && (
          <div className="mt-20">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-8 text-center">Gallery</h2>
            <MediaGallery images={activity.gallery} />
          </div>
        )}
      </div>
    </article>
  )
}

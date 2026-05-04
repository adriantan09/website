import { client, urlFor } from '@/sanity/client'
import { collectionBySlugQuery } from '@/sanity/queries'
import { BodyRenderer } from '@/components/ui/body-renderer'
import { ActivityCard } from '@/components/ui/cards'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface Props {
  // Next.js 16 dynamic route params are async — must be awaited.
  params: Promise<{ slug: string }>
}

function formatDateRange(start?: string, end?: string) {
  if (!start && !end) return null
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  return fmt((start ?? end)!)
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params
  const collection = await client.fetch(collectionBySlugQuery, { slug })

  if (!collection) {
    notFound()
  }

  const dateRange = formatDateRange(collection.startDate, collection.endDate)

  return (
    <article className="pb-24">
      {/* Hero */}
      <div className="relative w-full h-[70vh] mb-12 bg-muted">
        {collection.coverImage && (
          <Image
            src={urlFor(collection.coverImage).width(2400).url()}
            alt={collection.title}
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
                Collection {collection.location && `• ${collection.location}`}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 leading-tight">
                {collection.title}
              </h1>
              {dateRange && (
                <p className="text-lg font-medium opacity-80">{dateRange}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {collection.summary && (
          <div className="max-w-3xl mx-auto mb-16">
            <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
              {collection.summary}
            </p>
          </div>
        )}

        {/* Optional collection-level body (intro / interludes) */}
        <BodyRenderer body={collection.body} />

        {/* Activities */}
        {collection.activities && collection.activities.length > 0 && (
          <section className="mt-20 max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-2">
                In this collection
              </h2>
              <h3 className="text-3xl font-bold tracking-tight">Activities</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {collection.activities.map((activity: any) => (
                <ActivityCard key={activity.slug.current} activity={activity} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}

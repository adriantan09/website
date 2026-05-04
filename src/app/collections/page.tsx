import { client } from '@/sanity/client'
import { collectionsQuery } from '@/sanity/queries'
import { CollectionCard } from '@/components/ui/cards'

export const metadata = {
  title: 'Collections',
  description: 'Trips and themed groupings of activities.',
}

export default async function CollectionsIndexPage() {
  const collections = await client.fetch(collectionsQuery)

  return (
    <div className="container py-24">
      <header className="max-w-3xl mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          Collections
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Trips and themed groupings of activities — multi-day journeys, regions,
          or stories that span more than a single outing.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {collections?.map((collection: any) => (
          <CollectionCard key={collection.slug.current} collection={collection} />
        ))}
        {(!collections || collections.length === 0) && (
          <p className="text-muted-foreground col-span-full py-12 border border-dashed border-border text-center rounded-sm">
            No collections yet. Create one in Sanity to get started.
          </p>
        )}
      </div>
    </div>
  )
}

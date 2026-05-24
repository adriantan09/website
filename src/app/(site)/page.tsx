import { sanityFetch } from '@/sanity/fetch'
import { homePortfolioPhotosQuery } from '@/sanity/queries'
import { HomeGallery } from '@/components/ui/home-gallery'
import Link from 'next/link'

export default async function Home() {
  const photos = await sanityFetch<any[]>({
    query: homePortfolioPhotosQuery,
  })

  return (
    <div className="container pt-6 pb-12 md:pt-10 md:pb-24">
      <HomeGallery photos={photos ?? []} />

      <div className="mt-10 flex justify-center">
        <Link
          href="/posts"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          View all posts →
        </Link>
      </div>
    </div>
  )
}

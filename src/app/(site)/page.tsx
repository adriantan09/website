import { sanityFetch } from '@/sanity/fetch'
import { homePortfolioPhotosQuery } from '@/sanity/queries'
import { HomeGallery } from '@/components/ui/home-gallery'

export default async function Home() {
  const photos = await sanityFetch<any[]>({
    query: homePortfolioPhotosQuery,
  })

  return (
    <div className="container pt-6 pb-12 md:pt-10 md:pb-24">
      <HomeGallery photos={photos ?? []} />
    </div>
  )
}

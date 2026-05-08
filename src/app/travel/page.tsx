import { sanityFetch } from '@/sanity/fetch'
import { activitiesByCategoryQuery } from '@/sanity/queries'
import { ActivityListPage } from '@/components/layout/activity-list-page'

export default async function TravelPage() {
  const activities = await sanityFetch<any[]>({
    query: activitiesByCategoryQuery,
    params: { category: 'travel' },
  })

  return (
    <ActivityListPage 
      title="Travels" 
      description="Photos and notes from around the world." 
      activities={activities} 
    />
  )
}

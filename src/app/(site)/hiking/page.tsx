import { sanityFetch } from '@/sanity/fetch'
import { activitiesByCategoryQuery } from '@/sanity/queries'
import { ActivityListPage } from '@/components/layout/activity-list-page'

export default async function HikingPage() {
  const activities = await sanityFetch<any[]>({
    query: activitiesByCategoryQuery,
    params: { category: 'hiking' },
  })

  return (
    <ActivityListPage 
      title="Hikes" 
      description="A collection of trails, summits, and multi-day treks." 
      activities={activities} 
    />
  )
}

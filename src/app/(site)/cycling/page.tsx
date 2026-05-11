import { sanityFetch } from '@/sanity/fetch'
import { activitiesByCategoryQuery } from '@/sanity/queries'
import { ActivityListPage } from '@/components/layout/activity-list-page'

export default async function CyclingPage() {
  const activities = await sanityFetch<any[]>({
    query: activitiesByCategoryQuery,
    params: { category: 'cycling' },
  })

  return (
    <ActivityListPage 
      title="Cycling" 
      description="Road, gravel, and bikepacking journeys." 
      activities={activities} 
    />
  )
}

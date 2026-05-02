import { client } from '@/sanity/client'
import { activitiesByCategoryQuery } from '@/sanity/queries'
import { ActivityListPage } from '@/components/layout/activity-list-page'

export default async function CyclingPage() {
  const activities = await client.fetch(activitiesByCategoryQuery, { category: 'cycling' })

  return (
    <ActivityListPage 
      title="Cycling" 
      description="Road, gravel, and bikepacking journeys." 
      activities={activities} 
    />
  )
}

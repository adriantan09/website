import { client } from '@/sanity/client'
import { activitiesByCategoryQuery } from '@/sanity/queries'
import { ActivityListPage } from '@/components/layout/activity-list-page'

export default async function TravelPage() {
  const activities = await client.fetch(activitiesByCategoryQuery, { category: 'travel' })

  return (
    <ActivityListPage 
      title="Travels" 
      description="Photos and notes from around the world." 
      activities={activities} 
    />
  )
}

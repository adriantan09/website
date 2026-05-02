import { client } from '@/sanity/client'
import { activitiesByCategoryQuery } from '@/sanity/queries'
import { ActivityListPage } from '@/components/layout/activity-list-page'

export default async function HikingPage() {
  const activities = await client.fetch(activitiesByCategoryQuery, { category: 'hiking' })

  return (
    <ActivityListPage 
      title="Hikes" 
      description="A collection of trails, summits, and multi-day treks." 
      activities={activities} 
    />
  )
}

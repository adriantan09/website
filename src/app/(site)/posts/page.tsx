import { sanityFetch } from '@/sanity/fetch'
import { allTopLevelActivitiesQuery } from '@/sanity/queries'
import { ActivityListPage } from '@/components/layout/activity-list-page'

export default async function PostsPage() {
  const activities = await sanityFetch<any[]>({
    query: allTopLevelActivitiesQuery,
  })

  return (
    <ActivityListPage
      title="Posts"
      description="All posts — hikes, rides, trips, and more."
      activities={activities}
    />
  )
}

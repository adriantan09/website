import { sanityFetch } from '@/sanity/fetch'
import {
  allTopLevelActivitiesQuery,
  siteSettingsQuery,
} from '@/sanity/queries'
import { ActivityListPage } from '@/components/layout/activity-list-page'

export default async function PostsPage() {
  const [activities, settings] = await Promise.all([
    sanityFetch<any[]>({ query: allTopLevelActivitiesQuery }),
    sanityFetch<any>({ query: siteSettingsQuery }),
  ])

  // Editable from Sanity → Site Settings → Posts Page Title / Description.
  // Fall back to sensible defaults if nothing has been configured.
  const title =
    (settings?.postsTitle as string | undefined)?.trim() || 'Posts'
  const description =
    (settings?.postsDescription as string | undefined)?.trim() ||
    undefined

  return (
    <ActivityListPage
      title={title}
      description={description}
      activities={activities}
    />
  )
}

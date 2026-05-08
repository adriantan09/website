import { groq } from 'next-sanity'

/**
 * Common projection for an activity used in card lists.
 *
 * `pathSegments` is the array of slugs from the root ancestor down to this
 * activity, so consumers can build the full nested URL (e.g. ['japan',
 * 'hokkaido']). It's resolved by walking up via the inverse `childActivities`
 * reference. We cap the walk at a reasonable depth — activities should not
 * realistically nest more than a few levels deep.
 */
const ACTIVITY_CARD_PROJECTION = `
  _id,
  title,
  slug,
  category,
  subCategory,
  date,
  mainImage,
  keyStats,
  "childCount": count(childActivities),
  "pathSegments": array::compact([
    *[_type == "activity" && references(
      *[_type == "activity" && references(
        *[_type == "activity" && references(^._id)][0]._id
      )][0]._id
    )][0].slug.current,
    *[_type == "activity" && references(
      *[_type == "activity" && references(^._id)][0]._id
    )][0].slug.current,
    *[_type == "activity" && references(^._id)][0].slug.current,
    slug.current
  ])
`

// Activities of a given category, sorted by date desc.
// Includes nested activities — the URL is built from `pathSegments`.
export const activitiesByCategoryQuery = groq`*[_type == "activity" && category == $category] | order(date desc) {
  ${ACTIVITY_CARD_PROJECTION}
}`

// Recent activities for the homepage — top-level only (no parent), so we
// surface trips/standalones rather than burying nested children.
export const recentActivitiesQuery = groq`*[
  _type == "activity" &&
  count(*[_type == "activity" && references(^._id)]) == 0
] | order(date desc) [0...6] {
  ${ACTIVITY_CARD_PROJECTION}
}`

/**
 * Resolve an activity by its full URL path (array of slug segments).
 *
 * Each segment must either be a top-level activity (for the first segment) or
 * a direct child of the previous segment's activity. We resolve by fetching
 * candidates with the leaf slug and then verifying the ancestor chain on the
 * server side. Returns the matching activity (with body, parent breadcrumbs,
 * and child activities) or null.
 */
export const activityByPathQuery = groq`
  *[_type == "activity" && slug.current == $leafSlug] {
    ...,
    mapEmbed,
    body[] {
      ...,
      _type == "photoGroup" => {
        ...,
        images[] {
          ...,
          "url": asset->url,
          "dimensions": asset->metadata.dimensions
        }
      }
    },
    "ancestors": array::compact([
      *[_type == "activity" && references(
        *[_type == "activity" && references(
          *[_type == "activity" && references(^._id)][0]._id
        )][0]._id
      )][0]{ _id, title, slug },
      *[_type == "activity" && references(
        *[_type == "activity" && references(^._id)][0]._id
      )][0]{ _id, title, slug },
      *[_type == "activity" && references(^._id)][0]{ _id, title, slug }
    ]),
    "childActivities": childActivities[]-> {
      ${ACTIVITY_CARD_PROJECTION}
    }
  }
`

export const projectsQuery = groq`*[_type == "project"] | order(_createdAt desc) {
  title,
  link,
  description,
  thumbnail,
  type
}`

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  ...
}`

// All known activity URL paths — used for static generation and 404 fallback.
export const allActivityPathsQuery = groq`*[_type == "activity"] {
  "pathSegments": array::compact([
    *[_type == "activity" && references(
      *[_type == "activity" && references(
        *[_type == "activity" && references(^._id)][0]._id
      )][0]._id
    )][0].slug.current,
    *[_type == "activity" && references(
      *[_type == "activity" && references(^._id)][0]._id
    )][0].slug.current,
    *[_type == "activity" && references(^._id)][0].slug.current,
    slug.current
  ])
}`

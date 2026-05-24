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
  location,
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

// All top-level activities (no parent) for the /posts index page.
export const allTopLevelActivitiesQuery = groq`*[
  _type == "activity" &&
  count(*[_type == "activity" && references(^._id)]) == 0
] | order(date desc) {
  ${ACTIVITY_CARD_PROJECTION}
}`

/**
 * Every gallery image across every activity, flattened into a single list
 * for a site-wide photo wall on the home page. Newest activities first; the
 * mainImage is included before each activity's photoGroup blocks so the
 * lead photo for a post is always present in the tessellation.
 */
export const allGalleryPhotosQuery = groq`*[_type == "activity"] | order(date desc) {
  _id,
  title,
  slug,
  date,
  mainImage {
    ...,
    "url": asset->url,
    "dimensions": asset->metadata.dimensions
  },
  "photoGroups": body[_type == "photoGroup"]{
    images[]{
      ...,
      "url": asset->url,
      "dimensions": asset->metadata.dimensions
    }
  }
}`

/**
 * Curated images for the home-page tessellated gallery. Sourced from the
 * `homePortfolio` array on the singleton `siteSettings` document, in the
 * order they're arranged in Sanity Studio.
 */
export const homePortfolioPhotosQuery = groq`*[_type == "siteSettings"][0].homePortfolio[]{
  ...,
  "url": asset->url,
  "dimensions": asset->metadata.dimensions
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

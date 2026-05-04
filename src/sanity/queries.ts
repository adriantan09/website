import { groq } from 'next-sanity'

export const activitiesByCategoryQuery = groq`*[_type == "activity" && category == $category] | order(date desc) {
  title,
  slug,
  category,
  date,
  excerpt,
  mainImage,
  stats
}`

export const recentActivitiesQuery = groq`*[_type == "activity"] | order(date desc) [0...6] {
  title,
  slug,
  category,
  date,
  excerpt,
  mainImage,
  stats
}`

// Project the body array, resolving image asset URLs for gallery blocks so
// the renderer can use them directly via next/image + Sanity image-url.
export const activityBySlugQuery = groq`*[_type == "activity" && slug.current == $slug][0] {
  ...,
  body[] {
    ...,
    _type == "galleryBlock" => {
      ...,
      images[] {
        ...,
        "url": asset->url
      }
    }
  },
  "parentCollection": *[_type == "collection" && references(^._id)][0] {
    title,
    slug
  }
}`

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

// ---------- Collections ----------

export const collectionsQuery = groq`*[_type == "collection"] | order(coalesce(startDate, _createdAt) desc) {
  title,
  slug,
  summary,
  location,
  startDate,
  endDate,
  coverImage,
  "activityCount": count(activities)
}`

export const collectionBySlugQuery = groq`*[_type == "collection" && slug.current == $slug][0] {
  ...,
  body[] {
    ...,
    _type == "galleryBlock" => {
      ...,
      images[] {
        ...,
        "url": asset->url
      }
    }
  },
  activities[]-> {
    title,
    slug,
    category,
    subCategory,
    date,
    excerpt,
    mainImage,
    stats
  }
}`

import { groq } from 'next-sanity'

export const activitiesByCategoryQuery = groq`*[_type == "activity" && category == $category] | order(date desc) {
  title,
  slug,
  category,
  date,
  mainImage,
  stats
}`

export const recentActivitiesQuery = groq`*[_type == "activity"] | order(date desc) [0...6] {
  title,
  slug,
  category,
  date,
  mainImage,
  stats
}`

export const activityBySlugQuery = groq`*[_type == "activity" && slug.current == $slug][0] {
  ...,
  "mainImage": mainImage.asset->url,
  gallery[] {
    ...,
    "url": asset->url
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

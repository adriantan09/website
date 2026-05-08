import { client } from './client'
import { activityByPathQuery } from './queries'

/**
 * Builds the public URL path for an activity from its `pathSegments` array.
 * Returns a leading-slash URL like "/japan/hokkaido".
 */
export function buildActivityHref(pathSegments: string[] | undefined): string {
  if (!pathSegments || pathSegments.length === 0) return '/'
  return '/' + pathSegments.join('/')
}

/**
 * Resolve an activity by walking a list of slug segments, e.g.
 * ["japan", "hokkaido"]. The leaf slug must match an activity, and the
 * activity's ancestor chain (root → leaf) must equal the provided segments
 * minus the leaf. Returns null if no match.
 */
export async function resolveActivityByPath(segments: string[]) {
  if (segments.length === 0) return null

  const leafSlug = segments[segments.length - 1]
  const expectedAncestorSlugs = segments.slice(0, -1)

  // Fetch all candidates with this leaf slug. There may be more than one if
  // multiple parents have a child with the same slug — we'll disambiguate by
  // checking the ancestor chain.
  const candidates: any[] = await client.fetch(activityByPathQuery, { leafSlug })

  for (const activity of candidates ?? []) {
    const ancestorSlugs: string[] = (activity.ancestors ?? [])
      .map((a: any) => a?.slug?.current)
      .filter(Boolean)

    if (
      ancestorSlugs.length === expectedAncestorSlugs.length &&
      ancestorSlugs.every((s, i) => s === expectedAncestorSlugs[i])
    ) {
      return activity
    }
  }

  return null
}

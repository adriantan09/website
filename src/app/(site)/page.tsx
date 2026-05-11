import { sanityFetch } from '@/sanity/fetch'
import {
  recentActivitiesQuery,
  projectsQuery,
  siteSettingsQuery,
} from '@/sanity/queries'
import { ActivityCard, ProjectCard } from '@/components/ui/cards'
import Link from 'next/link'

/**
 * Splits the headline into segments wrapped in {{muted}}…{{/muted}} markers
 * so the muted portion can render in a softer colour. Anything outside the
 * markers is treated as the primary headline text.
 */
function renderHeadline(text: string) {
  const parts: { text: string; muted: boolean }[] = []
  const regex = /\{\{muted\}\}([\s\S]*?)\{\{\/muted\}\}/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), muted: false })
    }
    parts.push({ text: match[1], muted: true })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), muted: false })
  }
  return parts.map((part, i) =>
    part.muted ? (
      <span key={i} className="text-muted-foreground">
        {part.text}
      </span>
    ) : (
      <span key={i}>{part.text}</span>
    ),
  )
}

export default async function Home() {
  const [activities, projects, settings] = await Promise.all([
    sanityFetch<any[]>({ query: recentActivitiesQuery }),
    sanityFetch<any[]>({ query: projectsQuery }),
    sanityFetch<any>({ query: siteSettingsQuery }),
  ])

  const headline = settings?.homeHeadline as string | undefined
  const intro = settings?.homeIntro as string | undefined

  return (
    <div className="container py-12 md:py-24">
      {/* Hero Section — only rendered if Site Settings has the copy */}
      {(headline || intro) && (
        <section className="max-w-3xl mb-24">
          {headline && (
            <h1 className="text-2xl md:text-4xl font-bold tracking-tighter mb-5 leading-tight">
              {renderHeadline(headline)}
            </h1>
          )}
          {intro && (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {intro}
            </p>
          )}
        </section>
      )}

      {/* Activities Grid */}
      <section className="mb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-2">
              Recent Work
            </h2>
            <h3 className="text-3xl font-bold tracking-tight">Activities</h3>
          </div>
          <Link href="/hiking" className="text-sm font-medium hover:underline underline-offset-4">
            View all
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {activities?.map((activity: any) => (
            <ActivityCard key={activity.slug.current} activity={activity} />
          ))}
          {(!activities || activities.length === 0) && (
            <p className="text-muted-foreground col-span-full py-12 border border-dashed border-border text-center rounded-sm">
              No activities found. Connect Sanity and add some content!
            </p>
          )}
        </div>
      </section>

      {/* Projects Grid */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-2">
              Professional & Side Projects
            </h2>
            <h3 className="text-3xl font-bold tracking-tight">Work</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects?.map((project: any) => (
            <ProjectCard key={project.title} project={project} />
          ))}
          {(!projects || projects.length === 0) && (
             <p className="text-muted-foreground col-span-full py-12 border border-dashed border-border text-center rounded-sm">
             No projects found. Add them to your Sanity project.
           </p>
          )}
        </div>
      </section>
    </div>
  )
}

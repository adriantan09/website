import { sanityFetch } from '@/sanity/fetch'
import { recentActivitiesQuery, projectsQuery } from '@/sanity/queries'
import { ActivityCard, ProjectCard } from '@/components/ui/cards'
import Link from 'next/link'

export default async function Home() {
  const activities = await sanityFetch<any[]>({ query: recentActivitiesQuery })
  const projects = await sanityFetch<any[]>({ query: projectsQuery })

  return (
    <div className="container py-12 md:py-24">
      {/* Hero Section */}
      <section className="max-w-3xl mb-24">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 leading-tight">
          Exploring the outdoors through <span className="text-muted-foreground">hiking, cycling, and photography.</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          I'm Adrian Tan, a software engineer and outdoor enthusiast documenting my journeys 
          across trails and roads.
        </p>
      </section>

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

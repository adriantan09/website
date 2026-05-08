import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/client'
import { buildActivityHref } from '@/sanity/resolve-activity-path'

export function ActivityCard({ activity }: { activity: any }) {
  const href = buildActivityHref(activity.pathSegments)
  const isContainer = (activity.childCount ?? 0) > 0

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-sm mb-4">
        {activity.mainImage && (
          <Image
            src={urlFor(activity.mainImage).width(800).url()}
            alt={activity.mainImage?.alt || activity.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {isContainer && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-sm">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
              {activity.childCount} activit{activity.childCount === 1 ? 'y' : 'ies'}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium tracking-tight uppercase">{activity.title}</h3>
        <p className="text-xs text-muted-foreground">
          {activity.date && new Date(activity.date).getFullYear()}
          {activity.category && ` • ${activity.category}`}
        </p>
      </div>
    </Link>
  )
}

export function ProjectCard({ project }: { project: any }) {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group p-6 border border-border rounded-sm hover:bg-muted transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {project.type}
        </span>
      </div>
      <h3 className="text-lg font-bold mb-2 group-hover:underline">{project.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {project.description}
      </p>
    </a>
  )
}

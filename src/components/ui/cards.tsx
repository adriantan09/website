import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/client'

export function ActivityCard({ activity }: { activity: any }) {
  return (
    <Link 
      href={`/${activity.category}/${activity.slug.current}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-sm mb-4">
        <Image
          src={urlFor(activity.mainImage).width(800).url()}
          alt={activity.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium tracking-tight uppercase">{activity.title}</h3>
        <p className="text-xs text-muted-foreground">
          {new Date(activity.date).getFullYear()} • {activity.category} 
          {activity.stats?.distance && ` • ${activity.stats.distance}km`}
        </p>
      </div>
    </Link>
  )
}

export function CollectionCard({ collection }: { collection: any }) {
  const start = collection.startDate ? new Date(collection.startDate) : null
  const end = collection.endDate ? new Date(collection.endDate) : null
  const dateLabel = (() => {
    if (!start) return null
    if (end && end.getFullYear() !== start.getFullYear()) {
      return `${start.getFullYear()}–${end.getFullYear()}`
    }
    return String(start.getFullYear())
  })()

  return (
    <Link
      href={`/collections/${collection.slug.current}`}
      className="group block"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-muted rounded-sm mb-4">
        {collection.coverImage && (
          <Image
            src={urlFor(collection.coverImage).width(1200).url()}
            alt={collection.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute top-3 left-3 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-sm">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
            Collection
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold tracking-tight">{collection.title}</h3>
        <p className="text-xs text-muted-foreground">
          {[dateLabel, collection.location, collection.activityCount != null && `${collection.activityCount} activit${collection.activityCount === 1 ? 'y' : 'ies'}`]
            .filter(Boolean)
            .join(' • ')}
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

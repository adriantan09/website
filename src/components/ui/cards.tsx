import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/client'
import { buildActivityHref } from '@/sanity/resolve-activity-path'

export function ActivityCard({ activity }: { activity: any }) {
  const href = buildActivityHref(activity.pathSegments)
  const isContainer = (activity.childCount ?? 0) > 0

  // Eyebrow text shown above the title in the overlay. Prefer the most
  // specific bit of context we have: location > sub-category > category > year.
  const eyebrow =
    activity.location ||
    activity.subCategory ||
    activity.category ||
    (activity.date ? String(new Date(activity.date).getFullYear()) : null)

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-2xl">
        {activity.mainImage && (
          <Image
            src={urlFor(activity.mainImage).width(1200).url()}
            alt={activity.mainImage?.alt || activity.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}

        {/* Constant base shade for legibility across all images,
            plus a stronger bottom gradient under the text. */}
        <div className="absolute inset-0 bg-black/15 transition-colors duration-500 group-hover:bg-black/5" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        {isContainer && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/15 text-white backdrop-blur-md ring-1 ring-white/25">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
              {activity.childCount} activit{activity.childCount === 1 ? 'y' : 'ies'}
            </span>
          </div>
        )}

        {/* Title + subtitle overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 text-white">
          {eyebrow && (
            <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-white/80 mb-1.5">
              {eyebrow}
            </p>
          )}
          <h3 className="text-lg md:text-xl font-semibold tracking-tight leading-tight drop-shadow-sm">
            {activity.title}
          </h3>
        </div>
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

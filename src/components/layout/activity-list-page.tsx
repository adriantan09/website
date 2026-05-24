import { ActivityCard } from '@/components/ui/cards'

interface Props {
  title: string
  description?: string
  activities: any[]
}

export function ActivityListPage({ title, description, activities }: Props) {
  return (
    <div className="container pt-6 pb-12 md:pt-10 md:pb-24">
      <header className="max-w-3xl mb-10 md:mb-12">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
          {title}
        </h1>
        {description && (
          <p className="text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {activities?.map((activity: any) => (
          <ActivityCard key={activity.slug.current} activity={activity} />
        ))}
        {(!activities || activities.length === 0) && (
          <p className="text-muted-foreground col-span-full py-12 border border-dashed border-border text-center rounded-sm">
            No activities found in this category.
          </p>
        )}
      </div>
    </div>
  )
}

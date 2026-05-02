interface HeroStatsProps {
  distance?: number
  duration?: string
  elevation?: number
  days?: number
}

export function HeroStats({ distance, duration, elevation, days }: HeroStatsProps) {
  const stats = [
    days && days > 1 ? { label: 'Days', value: days } : null,
    distance ? { label: 'Distance', value: `${distance}km` } : null,
    elevation ? { label: 'Elevation', value: `${elevation}m` } : null,
    duration ? { label: 'Duration', value: duration } : null,
  ].filter(Boolean)

  if (stats.length === 0) return null

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4 py-6 border-b border-border mb-8">
      {stats.map((stat) => (
        <div key={stat!.label} className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            {stat!.label}
          </span>
          <span className="text-xl font-medium tabular-nums">{stat!.value}</span>
        </div>
      ))}
    </div>
  )
}

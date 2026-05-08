interface Stat {
  label: string
  value: string
}

interface HeroStatsProps {
  stats: Stat[]
  variant?: 'inline' | 'footer'
}

export function HeroStats({ stats, variant = 'inline' }: HeroStatsProps) {
  if (!stats || stats.length === 0) return null

  if (variant === 'footer') {
    return (
      <dl className="flex flex-wrap justify-center items-start gap-y-4 py-3 border-b border-border text-center">
        {stats.map((stat, i) => (
          <div
            key={stat.label + i}
            className={`flex flex-col gap-1 px-6 md:px-8 ${i !== 0 ? 'border-l border-border' : ''}`}
          >
            <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {stat.label}
            </dt>
            <dd className="text-base md:text-lg font-medium tabular-nums">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    )
  }

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4 py-6 border-b border-border mb-8">
      {stats.map((stat, i) => (
        <div key={stat.label + i} className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            {stat.label}
          </span>
          <span className="text-xl font-medium tabular-nums">{stat.value}</span>
        </div>
      ))}
    </div>
  )
}

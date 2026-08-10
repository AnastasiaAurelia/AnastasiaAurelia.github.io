import type { ImpactStat } from '@/lib/sanity/types'

export function KeyImpact({ stats }: { stats: ImpactStat[] }) {
  if (stats.length === 0) return null

  return (
    <dl className="flex flex-wrap gap-x-10 gap-y-6">
      {stats.map((stat) => (
        <div key={stat.label} className="min-w-[7rem]">
          <dt className="label-mono text-ink-faint">{stat.label}</dt>
          <dd className="mt-1 font-serif text-3xl">{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}

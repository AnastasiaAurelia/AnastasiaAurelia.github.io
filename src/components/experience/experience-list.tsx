import type { SanityExperience } from '@/lib/sanity/types'
import { EmptyState } from '@/components/state/query-states'

function formatRange(exp: SanityExperience) {
  const start = exp.startDate?.slice(0, 7) ?? '?'
  const end = exp.isCurrent ? 'Present' : (exp.endDate?.slice(0, 7) ?? '?')
  return `${start} — ${end}`
}

export function ExperienceList({ experience }: { experience: SanityExperience[] }) {
  if (experience.length === 0) {
    return <EmptyState message="No experience entries published yet." />
  }

  return (
    <ol className="divide-y divide-line border-y border-line">
      {experience.map((exp) => (
        <li key={exp._id} className="py-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-lg">
              {exp.role} <span className="text-ink-faint">· {exp.company}</span>
            </h3>
            <p className="label-mono text-ink-faint">{formatRange(exp)}</p>
          </div>
          {exp.summary ? <p className="mt-2 max-w-2xl text-ink-muted">{exp.summary}</p> : null}
          {exp.achievements && exp.achievements.length > 0 ? (
            <ul className="mt-3 max-w-2xl list-disc space-y-1 pl-5 text-sm text-ink-muted">
              {exp.achievements.map((achievement) => (
                <li key={achievement}>{achievement}</li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

import type { SanityExperience } from '@/lib/sanity/types'
import { EmptyState } from '@/components/state/query-states'
import { formatMonth } from '@/lib/format-month'

function formatRange(exp: SanityExperience) {
  const start = formatMonth(exp.startDate)
  const end = exp.isCurrent ? 'Present' : formatMonth(exp.endDate)
  return `${start} – ${end}`
}

export function ExperienceList({ experience }: { experience: SanityExperience[] }) {
  if (experience.length === 0) {
    return <EmptyState message="No experience entries published yet." />
  }

  return (
    <ol className="divide-y divide-line border-y border-line">
      {experience.map((exp) => (
        <li key={exp._id} className={exp.secondary ? 'py-6 text-ink-faint' : 'py-6'}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className={exp.secondary ? 'text-base' : 'text-lg'}>
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

import type { Education } from '@/lib/sanity/types'
import { EmptyState } from '@/components/state/query-states'
import { formatMonth } from '@/lib/format-month'

function formatRange(edu: Education) {
  const start = formatMonth(edu.startDate)
  const end = edu.endDate ? formatMonth(edu.endDate) : (edu.status ?? '?')
  return `${start} – ${end}`
}

export function EducationList({ education }: { education: Education[] }) {
  if (education.length === 0) {
    return <EmptyState message="No education entries published yet." />
  }

  return (
    <ol className="divide-y divide-line border-y border-line">
      {education.map((edu) => (
        <li key={edu.institution + edu.program} className="py-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-lg">
              {edu.program} <span className="text-ink-faint">· {edu.institution}</span>
            </h3>
            <p className="label-mono text-ink-faint">{formatRange(edu)}</p>
          </div>
          {edu.coursework && edu.coursework.length > 0 ? (
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">Coursework: {edu.coursework.join(', ')}</p>
          ) : null}
          {edu.honors && edu.honors.length > 0 ? (
            <ul className="mt-3 max-w-2xl list-disc space-y-1 pl-5 text-sm text-ink-muted">
              {edu.honors.map((honor) => (
                <li key={honor}>{honor}</li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

import type { SkillGroup } from '@/lib/sanity/types'
import { EmptyState } from '@/components/state/query-states'

export function SkillGroups({ groups }: { groups: SkillGroup[] }) {
  if (groups.length === 0) {
    return <EmptyState message="No skills published yet." />
  }

  return (
    <dl className="grid gap-6 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.title}>
          <dt className="label-mono text-ink-faint">{group.title}</dt>
          <dd className="mt-2 text-ink-muted">{group.skills.join(', ')}</dd>
        </div>
      ))}
    </dl>
  )
}

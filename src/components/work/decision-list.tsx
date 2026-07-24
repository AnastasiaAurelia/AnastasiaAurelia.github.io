import type { Decision } from '@/content/types'

export function DecisionList({ decisions }: { decisions: Decision[] }) {
  return (
    <ol className="space-y-4">
      {decisions.map((decision, index) => (
        <li key={decision.title} className="border-l-2 border-line pl-4">
          <p className="text-xs text-ink-faint">Decision {index + 1}</p>
          <p className="font-medium">{decision.title}</p>
          <p className="text-sm text-ink-muted">{decision.detail}</p>
        </li>
      ))}
    </ol>
  )
}

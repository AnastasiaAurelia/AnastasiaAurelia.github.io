import { ExternalLink } from 'lucide-react'
import { EVIDENCE_META, type EvidenceType } from './evidence-meta'
import { PlaceholderNotice } from './placeholder-notice'

export interface Evidence {
  type: EvidenceType
  label: string
  url: string
  description?: string
}

export function EvidenceList({ evidence }: { evidence: Evidence[] }) {
  if (evidence.length === 0) {
    return <PlaceholderNotice label="No linked evidence yet" />
  }

  return (
    <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
      {evidence.map((item) => {
        const meta = EVIDENCE_META[item.type]
        const Icon = meta.icon
        return (
          <li key={item.url} className="bg-paper">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-1.5 p-5 transition-colors hover:bg-surface"
            >
              <span className="label-mono flex items-center gap-2 text-ink-faint">
                <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                {meta.label}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium">
                {item.label}
                <ExternalLink
                  className="size-3.5 shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
              {item.description ? (
                <span className="text-sm text-ink-muted">{item.description}</span>
              ) : null}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

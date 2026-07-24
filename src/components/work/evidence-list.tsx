import {
  BookOpen,
  ExternalLink,
  FileText,
  FlaskConical,
  GitBranch,
  Newspaper,
  PlayCircle,
  Rocket,
} from 'lucide-react'
import type { Evidence, EvidenceType } from '@/content/types'
import { PlaceholderNotice } from './placeholder-notice'

const ICONS: Record<EvidenceType, typeof ExternalLink> = {
  'case-study': BookOpen,
  repository: GitBranch,
  'live-product': Rocket,
  article: Newspaper,
  video: PlayCircle,
  document: FileText,
  'external-publication': Newspaper,
  experiment: FlaskConical,
}

export function EvidenceList({ evidence }: { evidence: Evidence[] }) {
  if (evidence.length === 0) {
    return <PlaceholderNotice label="No linked evidence yet" />
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {evidence.map((item) => {
        const Icon = ICONS[item.type]
        return (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-1 rounded-sm border border-line p-4 transition-colors hover:border-ink"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <Icon className="size-4 shrink-0 text-ink-faint" aria-hidden="true" />
                {item.label}
                <ExternalLink
                  className="size-3.5 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100"
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

import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { SanityProjectSummary } from '@/lib/sanity/types'
import { EVIDENCE_META, type EvidenceType } from './evidence-meta'

/** One row of the full work index — a numbered list, not a card grid. */
export function WorkCard({ project, index }: { project: SanityProjectSummary; index: number }) {
  const evidenceTypes: EvidenceType[] = [
    'case-study',
    ...(project.githubUrl ? (['repository'] as const) : []),
    ...(project.externalUrl ? (['live-product'] as const) : []),
  ]

  return (
    <Link
      to={`/work/${project.slug}`}
      className="group grid gap-3 border-t border-line py-8 transition-colors last:border-b hover:bg-surface sm:grid-cols-12 sm:gap-6 sm:px-2"
    >
      <span className="label-mono text-ink-faint sm:col-span-1">{String(index + 1).padStart(2, '0')}</span>
      <div className="sm:col-span-7">
        <h3 className="flex items-center gap-2 text-xl leading-snug">
          {project.title}
          <ArrowUpRight
            className="size-4 shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </h3>
        <p className="mt-2 max-w-xl text-sm text-ink-muted">{project.shortSummary}</p>
      </div>
      <div className="flex flex-col gap-2 sm:col-span-4">
        {project.tags?.length > 0 ? <p className="label-mono text-ink-faint">{project.tags.join(' · ')}</p> : null}
        <p className="label-mono text-accent">{evidenceTypes.map((t) => EVIDENCE_META[t].label).join(' · ')}</p>
      </div>
    </Link>
  )
}

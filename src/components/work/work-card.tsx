import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { SanityProjectSummary } from '@/lib/sanity/types'
import { EVIDENCE_META, type EvidenceType } from './evidence-meta'
import { getProjectRoute } from '@/lib/project-route'

/**
 * One row of the full work index. Deliberately technical/dense in its
 * metadata column — project type leads (an already-fetched field the
 * card didn't previously surface), then tags, then an evidence manifest
 * with icons — so it reads as a case-study record, not an essay.
 */
export function WorkCard({ project, index }: { project: SanityProjectSummary; index: number }) {
  const summary = project.caseStudyArticle?.excerpt ?? project.shortSummary
  const evidenceTypes: EvidenceType[] = [
    'case-study',
    ...(project.githubUrl ? (['repository'] as const) : []),
    ...(project.externalUrl ? (['live-product'] as const) : []),
  ]

  return (
    <Link
      to={getProjectRoute(project)}
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
        <p className="mt-2 max-w-xl text-sm text-ink-muted">{summary}</p>
      </div>
      <div className="flex flex-col gap-3 sm:col-span-4">
        <p className="label-mono text-accent">{project.projectType}</p>
        {project.tags?.length > 0 ? <p className="label-mono text-ink-faint">{project.tags.join(' · ')}</p> : null}
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          {evidenceTypes.map((type) => {
            const meta = EVIDENCE_META[type]
            const Icon = meta.icon
            return (
              <li key={type} className="label-mono flex items-center gap-1 text-ink-faint">
                <Icon className="size-3" aria-hidden="true" />
                {meta.label}
              </li>
            )
          })}
        </ul>
      </div>
    </Link>
  )
}

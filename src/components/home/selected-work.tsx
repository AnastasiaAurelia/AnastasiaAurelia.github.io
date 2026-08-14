import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { SanityProjectSummary } from '@/lib/sanity/types'
import { EVIDENCE_META, type EvidenceType } from '@/components/work/evidence-meta'
import { ProjectPlate } from '@/components/work/project-plate'
import { SectionKicker } from '@/components/editorial/section-kicker'
import { EmptyState } from '@/components/state/query-states'
import { useReveal } from '@/hooks/use-reveal'
import { cn } from '@/lib/utils'
import { getProjectRoute } from '@/lib/project-route'

function SelectedWorkEntry({ project, index }: { project: SanityProjectSummary; index: number }) {
  const { ref, visible } = useReveal<HTMLAnchorElement>()
  const flipped = index % 2 === 1
  const evidenceTypes: EvidenceType[] = [
    'case-study',
    ...(project.githubUrl ? (['repository'] as const) : []),
    ...(project.externalUrl ? (['live-product'] as const) : []),
  ]
  const category = project.tags?.[0] ?? project.projectType
  const summary = project.shortSummary

  return (
    <Link
      ref={ref}
      data-visible={visible}
      to={getProjectRoute(project)}
      className={cn(
        'reveal group grid gap-5 border-t border-line px-4 py-10 transition-colors last:border-b hover:bg-surface sm:grid-cols-12 sm:gap-8 sm:px-6 sm:py-14',
        flipped && 'sm:bg-surface/50',
      )}
    >
      <div className={cn('sm:col-span-3', flipped && 'sm:order-2')}>
        <span className="label-mono text-accent">{String(index + 1).padStart(2, '0')}</span>
        <p className="label-mono mt-2 text-ink-faint">{category}</p>
        <ProjectPlate
          projectType={project.projectType}
          tags={project.tags}
          index={index}
          className={cn(
            'hidden sm:mt-8 sm:block',
            'transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:-translate-y-1',
          )}
        />
      </div>
      <div className={cn('sm:col-span-9', flipped && 'sm:order-1')}>
        <h3 className="text-3xl leading-tight sm:text-4xl">{project.title}</h3>
        <p className="mt-4 max-w-2xl text-ink-muted">{summary}</p>
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
          {evidenceTypes.map((type) => (
            <li key={type} className="label-mono text-ink-faint">
              {EVIDENCE_META[type].label}
            </li>
          ))}
        </ul>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
          View case study
          <ArrowUpRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  )
}

export function SelectedWork({ projects }: { projects: SanityProjectSummary[] }) {
  return (
    <section className="container-editorial section-y-tight">
      <div className="mb-2 flex items-baseline justify-between">
        <SectionKicker index="03" title="Featured Projects" className="mb-0" />
        <Link to="/work" className="label-mono text-ink-faint transition-colors hover:text-ink">
          Full index
        </Link>
      </div>
      {projects.length === 0 ? (
        <EmptyState message="No featured projects published yet." />
      ) : (
        <div>
          {projects.map((project, index) => (
            <SelectedWorkEntry key={project._id} project={project} index={index} />
          ))}
        </div>
      )}
    </section>
  )
}

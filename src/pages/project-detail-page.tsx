import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { Seo } from '@/components/seo/seo'
import { Badge } from '@/components/ui/badge'
import { NarrativeSection } from '@/components/work/narrative-section'
import { PendingSections } from '@/components/work/pending-sections'
import { DecisionList } from '@/components/work/decision-list'
import { EvidenceList } from '@/components/work/evidence-list'
import { PlaceholderNotice } from '@/components/work/placeholder-notice'
import { getProjectBySlug } from '@/content/projects'
import { tagLabel } from '@/content/tags'
import { SITE } from '@/content/site'
import { NotFoundPage } from './not-found-page'

/**
 * The single template every project renders through. Adding a project
 * never means writing a new page component — it means adding a new
 * entry to `content/projects` that satisfies the `Project` type.
 *
 * Each narrative field is either rendered as a full section or, if
 * absent, its title is collected into one consolidated "not yet
 * documented" notice at the end — see `PendingSections`.
 */
export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project) {
    return <NotFoundPage />
  }

  const { narrative } = project

  const sections: { id: string; title: string; content: ReactNode | null }[] = [
    { id: 'overview', title: 'Overview', content: narrative.overview ? <p>{narrative.overview}</p> : null },
    { id: 'problem', title: 'Problem', content: narrative.problem ? <p>{narrative.problem}</p> : null },
    {
      id: 'why-it-mattered',
      title: 'Why it mattered',
      content: narrative.whyItMattered ? <p>{narrative.whyItMattered}</p> : null,
    },
    { id: 'ownership', title: 'My ownership', content: narrative.ownership ? <p>{narrative.ownership}</p> : null },
    {
      id: 'context',
      title: 'Context and constraints',
      content: narrative.contextAndConstraints ? <p>{narrative.contextAndConstraints}</p> : null,
    },
    {
      id: 'system',
      title: 'System / workflow',
      content: narrative.systemOrWorkflow ? <p>{narrative.systemOrWorkflow}</p> : null,
    },
    {
      id: 'decisions',
      title: 'Key product and technical decisions',
      content: narrative.decisions?.length ? <DecisionList decisions={narrative.decisions} /> : null,
    },
    { id: 'execution', title: 'Execution', content: narrative.execution ? <p>{narrative.execution}</p> : null },
    {
      id: 'outcomes',
      title: 'Evidence and outcomes',
      content: narrative.evidenceAndOutcomes ? <p>{narrative.evidenceAndOutcomes}</p> : null,
    },
    { id: 'tradeoffs', title: 'Trade-offs', content: narrative.tradeoffs ? <p>{narrative.tradeoffs}</p> : null },
    {
      id: 'limitations',
      title: 'Failures or limitations',
      content: narrative.failuresAndLimitations?.length ? (
        <ul className="list-disc space-y-1 pl-5">
          {narrative.failuresAndLimitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null,
    },
    {
      id: 'lessons',
      title: 'Lessons learned',
      content: narrative.lessonsLearned?.length ? (
        <ul className="list-disc space-y-1 pl-5">
          {narrative.lessonsLearned.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null,
    },
  ]

  const populated = sections.filter((section) => section.content !== null)
  const pending = sections.filter((section) => section.content === null)

  return (
    <>
      <Seo
        title={project.title}
        description={project.summary}
        path={`/work/${project.slug}`}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: project.summary,
            author: { '@type': 'Person', name: SITE.name },
          },
        ]}
      />

      <article className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-10 border-b border-line pb-8">
          {project.timeframe ? (
            <p className="text-sm text-ink-faint">{project.timeframe}</p>
          ) : null}
          <h1 className="mt-1 text-3xl">{project.title}</h1>
          <p className="mt-3 text-lg text-ink-muted">{project.tagline}</p>
          {project.tags.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <li key={tag}>
                  <Badge>{tagLabel(tag)}</Badge>
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        <div className="divide-y divide-line">
          {populated.map((section) => (
            <NarrativeSection key={section.id} id={section.id} title={section.title}>
              {section.content}
            </NarrativeSection>
          ))}

          <PendingSections titles={pending.map((section) => section.title)} />

          <section className="py-6">
            <h2 className="mb-3 text-xl">Evidence &amp; related links</h2>
            <p className="mb-4 text-sm text-ink-muted">
              Repository, live product, documentation, and media for this project.
            </p>
            {project.evidence.length > 0 ? (
              <EvidenceList evidence={project.evidence} />
            ) : (
              <PlaceholderNotice label="No linked evidence yet" />
            )}
          </section>
        </div>
      </article>
    </>
  )
}

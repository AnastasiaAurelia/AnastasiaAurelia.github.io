import { Navigate, useParams } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { Seo } from '@/components/seo/seo'
import { NarrativeSection } from '@/components/work/narrative-section'
import { PendingSections } from '@/components/work/pending-sections'
import { ChapterNav } from '@/components/work/chapter-nav'
import { EvidenceList, type Evidence } from '@/components/work/evidence-list'
import { LprEvidenceSection } from '@/components/work/lpr-evidence-section'
import { LoadingState, ErrorState } from '@/components/state/query-states'
import { portableTextComponents } from '@/components/portable-text/portable-text-components'
import { splitProjectContent } from '@/lib/sanity/split-project-content'
import { urlForImage } from '@/lib/sanity/image'
import { useProject } from '@/hooks/use-project'
import { SITE } from '@/content/site'
import { NotFoundPage } from './not-found-page'

/**
 * The single template every project renders through. Adding a project
 * never means writing a new page component — it means adding a new
 * document in Sanity Studio; this page resolves it by slug.
 *
 * The Portable Text `content` field is split into numbered chapters at
 * each "Project section" marker (see `splitProjectContent`); whichever
 * of the eleven canonical beats weren't used is named once, at the
 * end, by `PendingSections` — never left silently absent.
 */
export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { status, data: project } = useProject(slug)

  if (status === 'loading') {
    return <LoadingState label="Loading project" />
  }

  if (status === 'error') {
    return (
      <div className="container-editorial section-y-tight">
        <ErrorState message="Couldn't load this project. Check the console for details, or try refreshing." />
      </div>
    )
  }

  if (!project) {
    return <NotFoundPage />
  }

  if (project.caseStudyArticle?.slug) {
    return <Navigate to={`/articles/${project.caseStudyArticle.slug}`} replace />
  }

  const { chapters, pendingTitles } = splitProjectContent(project.content)
  const showPendingSections = project.slug !== 'computer-vision-lpr' && pendingTitles.length > 0

  const evidence: Evidence[] = [
    ...(project.githubUrl ? [{ type: 'repository' as const, label: 'Repository', url: project.githubUrl }] : []),
    ...(project.externalUrl
      ? [{ type: 'live-product' as const, label: 'Live product', url: project.externalUrl }]
      : []),
  ]

  const navChapters = [
    ...chapters
      .filter((c) => c.title)
      .map((chapter, index) => ({ id: chapter.id, number: String(index + 1).padStart(2, '0'), title: chapter.title })),
    {
      id: 'evidence',
      number: String(chapters.filter((c) => c.title).length + 1).padStart(2, '0'),
      title: 'Evidence & related links',
    },
  ]

  const coverUrl = project.coverImage ? urlForImage(project.coverImage).auto('format').fit('max').width(1600).url() : null

  return (
    <>
      <Seo
        title={project.seoTitle || project.title}
        description={project.seoDescription || project.shortSummary}
        path={`/work/${project.slug}`}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: project.shortSummary,
            author: { '@type': 'Person', name: SITE.name },
          },
        ]}
      />

      <article>
        <header className="container-editorial pt-14 pb-10">
          <p className="label-mono flex flex-wrap items-center gap-x-3 text-ink-faint">
            <span className="text-accent">Case study</span>
            <span>{project.projectType}</span>
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-tight sm:text-5xl">{project.title}</h1>
          <p className="mt-5 max-w-2xl font-serif text-2xl leading-snug text-ink-muted sm:text-3xl">
            {project.shortSummary}
          </p>
          {project.tags?.length > 0 ? (
            <p className="label-mono mt-6 text-ink-faint">{project.tags.join(' · ')}</p>
          ) : null}

          {coverUrl && project.coverImage ? (
            <img
              src={coverUrl}
              alt={project.coverImage.alt}
              className="mt-8 w-full rounded-sm border border-line"
              loading="eager"
            />
          ) : null}
        </header>

        <div className="container-editorial grid gap-10 border-t border-line pt-10 lg:grid-cols-[15rem_1fr] lg:gap-12">
          <ChapterNav chapters={navChapters} />

          <div className="min-w-0 divide-y divide-line lg:border-l lg:border-line lg:pl-14">
            {chapters
              .filter((chapter) => chapter.title)
              .map((chapter, index) => (
                <NarrativeSection
                  key={chapter.id}
                  id={chapter.id}
                  number={String(index + 1).padStart(2, '0')}
                  title={chapter.title}
                >
                  <PortableText value={chapter.blocks} components={portableTextComponents} />
                </NarrativeSection>
              ))}

            {showPendingSections ? <PendingSections titles={pendingTitles} /> : null}

            <section id="evidence" className="scroll-mt-28 py-8">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="label-mono text-accent">
                  {String(chapters.filter((c) => c.title).length + 1).padStart(2, '0')}
                </span>
                <h2 className="text-xl">Evidence &amp; related links</h2>
              </div>

              {slug === 'computer-vision-lpr' ? (
                <LprEvidenceSection />
              ) : (
                <>
                  <p className="mb-4 max-w-2xl text-sm text-ink-muted">
                    Repository, live product, and case-study material for this project.
                  </p>
                  <EvidenceList evidence={evidence} />
                </>
              )}
            </section>
          </div>
        </div>
      </article>
    </>
  )
}

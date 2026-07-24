import { useMemo, useState } from 'react'
import { Seo } from '@/components/seo/seo'
import { WorkCard } from '@/components/work/work-card'
import { TagFilter } from '@/components/work/tag-filter'
import { LoadingState, ErrorState, EmptyState } from '@/components/state/query-states'
import { useAllProjects } from '@/hooks/use-projects'
import { SITE } from '@/content/site'

export function WorkIndexPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const { status, data: projects } = useAllProjects()

  const availableTags = useMemo(() => {
    if (!projects) return []
    const set = new Set<string>()
    projects.forEach((project) => project.tags?.forEach((tag) => set.add(tag)))
    return Array.from(set)
  }, [projects])

  const visibleProjects = useMemo(() => {
    if (!projects) return []
    return activeTag ? projects.filter((project) => project.tags?.includes(activeTag)) : projects
  }, [projects, activeTag])

  return (
    <>
      <Seo
        title="Work"
        description={`Projects and case studies from ${SITE.name} across ${SITE.focusAreas}.`}
        path="/work"
      />

      <section className="container-editorial section-y-tight pt-14">
        <p className="label-mono text-accent">Index</p>
        <h1 className="mt-3 text-4xl">Work</h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Each entry aggregates the evidence for one project — case study, repository, live
          product, and supporting material — rather than standing alone as a separate post.
        </p>

        {status === 'loading' ? <LoadingState label="Loading projects" /> : null}
        {status === 'error' ? (
          <ErrorState message="Couldn't load projects. Check the console for details, or try refreshing." />
        ) : null}

        {status === 'success' ? (
          <>
            {availableTags.length > 0 ? (
              <div className="mt-8">
                <TagFilter tags={availableTags} active={activeTag} onChange={setActiveTag} />
              </div>
            ) : null}

            <div className="mt-4" aria-live="polite">
              {visibleProjects.map((project, index) => (
                <WorkCard key={project._id} project={project} index={index} />
              ))}
            </div>

            {visibleProjects.length === 0 ? (
              <div className="mt-8">
                <EmptyState
                  message={
                    projects && projects.length === 0
                      ? 'No projects published yet. Run the migration or add projects in Sanity Studio.'
                      : 'No projects match this filter yet.'
                  }
                />
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </>
  )
}

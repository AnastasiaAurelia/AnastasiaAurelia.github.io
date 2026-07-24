import { useMemo, useState } from 'react'
import { Seo } from '@/components/seo/seo'
import { WorkCard } from '@/components/work/work-card'
import { TagFilter } from '@/components/work/tag-filter'
import { projects } from '@/content/projects'
import type { TagId } from '@/content/tags'
import { SITE } from '@/content/site'

export function WorkIndexPage() {
  const [activeTag, setActiveTag] = useState<TagId | null>(null)

  const availableTags = useMemo(() => {
    const set = new Set<TagId>()
    projects.forEach((project) => project.tags.forEach((tag) => set.add(tag)))
    return Array.from(set)
  }, [])

  const visibleProjects = useMemo(
    () => (activeTag ? projects.filter((project) => project.tags.includes(activeTag)) : projects),
    [activeTag],
  )

  return (
    <>
      <Seo
        title="Work"
        description={`Projects and case studies from ${SITE.name} across ${SITE.focusAreas}.`}
        path="/work"
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl">Work</h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Each entry aggregates the evidence for one project — case study, repository, live
          product, and supporting material — rather than standing alone as a separate post.
        </p>

        {availableTags.length > 0 ? (
          <div className="mt-8">
            <TagFilter tags={availableTags} active={activeTag} onChange={setActiveTag} />
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {visibleProjects.map((project) => (
            <WorkCard key={project.slug} project={project} />
          ))}
        </div>

        {visibleProjects.length === 0 ? (
          <p className="mt-8 text-ink-muted">No projects match this filter yet.</p>
        ) : null}
      </section>
    </>
  )
}

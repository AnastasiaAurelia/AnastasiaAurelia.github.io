import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Seo } from '@/components/seo/seo'
import { WorkCard } from '@/components/work/work-card'
import { getFeaturedProjects } from '@/content/projects'
import { SITE } from '@/content/site'

export function HomePage() {
  const featured = getFeaturedProjects()

  return (
    <>
      <Seo
        title={`${SITE.name} — ${SITE.positioning}`}
        description={SITE.tagline}
        path="/"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: SITE.name,
            jobTitle: SITE.positioning,
            email: SITE.email,
            url: SITE.url,
          },
        ]}
      />

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <p className="text-sm font-medium text-accent">{SITE.positioning}</p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight sm:text-5xl">
          {SITE.focusAreas}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-muted">{SITE.tagline}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink/85"
          >
            Review the work
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            About
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-xl">Featured work</h2>
          <Link to="/work" className="text-sm text-ink-muted hover:text-ink">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <WorkCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </>
  )
}

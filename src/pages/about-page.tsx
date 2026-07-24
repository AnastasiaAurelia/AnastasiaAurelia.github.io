import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/seo/seo'
import { PendingSections } from '@/components/work/pending-sections'
import { SITE } from '@/content/site'

export function AboutPage() {
  return (
    <>
      <Seo
        title="About"
        description={`${SITE.positioning} — ${SITE.focusAreas}.`}
        path="/about"
      />

      <section className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl">About</h1>
        <p className="mt-4 text-lg text-ink-muted">
          {SITE.name} — {SITE.positioning}, focused on {SITE.focusAreas}.
        </p>

        <div className="mt-10 space-y-8 divide-y divide-line">
          <PendingSections titles={['Background', 'How I work']} />

          <div className="pt-8">
            <h2 className="mb-3 text-xl">Contact</h2>
            <p className="text-ink-muted">
              The fastest way to reach me is email. Project write-ups are under{' '}
              <Link to="/work" className="underline underline-offset-2 hover:text-ink">
                Work
              </Link>
              .
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-3 inline-flex items-center gap-2 rounded-sm border border-line px-4 py-2 text-sm font-medium hover:border-ink"
            >
              <Mail className="size-4" aria-hidden="true" />
              {SITE.email}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

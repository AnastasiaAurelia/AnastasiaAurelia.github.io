import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { Seo } from '@/components/seo/seo'
import { ExperienceList } from '@/components/experience/experience-list'
import { LoadingState, ErrorState, EmptyState } from '@/components/state/query-states'
import { portableTextComponents } from '@/components/portable-text/portable-text-components'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { useExperience } from '@/hooks/use-experience'
import { SITE } from '@/content/site'

export function AboutPage() {
  const settingsState = useSiteSettings()
  const experienceState = useExperience()

  const loading = settingsState.status === 'loading' || experienceState.status === 'loading'
  const hasError = settingsState.status === 'error' || experienceState.status === 'error'

  const settings = settingsState.status === 'success' ? settingsState.data : null
  const experience = experienceState.status === 'success' ? experienceState.data : []

  return (
    <>
      <Seo title="About" description={`${SITE.positioning} — ${SITE.focusAreas}.`} path="/about" />

      <section className="container-editorial section-y-tight pt-14">
        <p className="label-mono text-accent">About</p>
        <h1 className="mt-3 max-w-2xl font-serif text-3xl leading-snug sm:text-4xl">
          {SITE.name} — {SITE.positioning}, focused on {SITE.focusAreas}.
        </h1>

        {loading ? <LoadingState label="Loading" /> : null}
        {hasError ? (
          <ErrorState message="Couldn't load this page. Check the console for details, or try refreshing." />
        ) : null}

        {!loading && !hasError ? (
          <div className="mt-12 max-w-2xl space-y-8 divide-y divide-line">
            <div>
              <p className="label-mono text-ink-faint">Background</p>
              <div className="mt-3 space-y-4">
                {settings?.aboutContent && settings.aboutContent.length > 0 ? (
                  <PortableText value={settings.aboutContent} components={portableTextComponents} />
                ) : (
                  <EmptyState message="Background copy not yet supplied — add it to Site Settings in Sanity Studio." />
                )}
              </div>
            </div>

            <div className="pt-8">
              <p className="label-mono text-ink-faint">Experience</p>
              <div className="mt-3">
                <ExperienceList experience={experience} />
              </div>
            </div>

            {settings ? (
              <div className="pt-8">
                <p className="label-mono text-ink-faint">Contact</p>
                <p className="mt-3 text-ink-muted">
                  The fastest way to reach me is email. Project write-ups are under{' '}
                  <Link to="/work" className="underline underline-offset-2 hover:text-ink">
                    Work
                  </Link>
                  .
                </p>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="mt-4 inline-flex items-center gap-2 border-b border-line-strong pb-1 text-lg transition-colors hover:border-ink"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {settings.contactEmail}
                </a>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </>
  )
}

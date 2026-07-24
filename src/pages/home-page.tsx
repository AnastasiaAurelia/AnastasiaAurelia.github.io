import { Seo } from '@/components/seo/seo'
import { Hero } from '@/components/home/hero'
import { Capabilities } from '@/components/home/capabilities'
import { SelectedWork } from '@/components/home/selected-work'
import { LatestWriting } from '@/components/home/latest-writing'
import { EvidenceIndex } from '@/components/home/evidence-index'
import { ContactSection } from '@/components/home/contact-section'
import { LoadingState, ErrorState, EmptyState } from '@/components/state/query-states'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { useFeaturedProjects } from '@/hooks/use-projects'
import { useLatestArticles } from '@/hooks/use-articles'
import { SITE } from '@/content/site'

export function HomePage() {
  const settingsState = useSiteSettings()
  const projectsState = useFeaturedProjects()
  // Fetched independently of the gate below: a slow/failed Writing fetch
  // shouldn't hold up or blank the rest of the homepage. It simply
  // doesn't render (LatestWriting returns null on empty) until ready.
  const articlesState = useLatestArticles(3)

  const loading = settingsState.status === 'loading' || projectsState.status === 'loading'
  const hasError = settingsState.status === 'error' || projectsState.status === 'error'

  const settings = settingsState.status === 'success' ? settingsState.data : null
  const projects = projectsState.status === 'success' ? projectsState.data : []
  const latestArticles = articlesState.status === 'success' ? articlesState.data : []

  return (
    <>
      <Seo
        title={settings ? `${SITE.name} — ${SITE.positioning}` : SITE.name}
        description={settings?.homepageSupportingCopy ?? SITE.tagline}
        path="/"
        jsonLd={
          settings
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'Person',
                  name: SITE.name,
                  jobTitle: SITE.positioning,
                  email: settings.contactEmail,
                  url: SITE.url,
                },
              ]
            : []
        }
      />

      {loading ? <LoadingState label="Loading homepage content" /> : null}

      {hasError ? (
        <div className="container-editorial section-y-tight">
          <ErrorState message="Couldn't load homepage content. Check the console for details, or try refreshing." />
        </div>
      ) : null}

      {!loading && !hasError && !settings ? (
        <div className="container-editorial section-y-tight">
          <EmptyState message="Site Settings hasn't been published in Sanity Studio yet — the homepage has nothing to show until it is." />
        </div>
      ) : null}

      {!loading && !hasError && settings ? (
        <>
          <Hero
            headline={settings.homepageHeadline}
            supportingCopy={settings.homepageSupportingCopy}
            credibilityPoints={settings.credibilityPoints}
          />
          <Capabilities groups={settings.capabilityGroups ?? []} />
          <SelectedWork projects={projects} />
          <LatestWriting articles={latestArticles} />
          <EvidenceIndex projects={projects} />
          <ContactSection
            email={settings.contactEmail}
            linkedinUrl={settings.linkedinUrl}
            githubUrl={settings.githubUrl}
            resumeUrl={settings.resumeUrl}
          />
        </>
      ) : null}
    </>
  )
}

import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { Seo } from '@/components/seo/seo'
import { ExperienceList } from '@/components/experience/experience-list'
import { KeyImpact } from '@/components/about/key-impact'
import { SelectedTechnicalWork } from '@/components/about/selected-technical-work'
import { EducationList } from '@/components/about/education-list'
import { PublicationsList } from '@/components/about/publications-list'
import { SkillGroups } from '@/components/about/skill-groups'
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
  const primaryExperience = experience.filter((exp) => !exp.secondary)
  const additionalExperience = experience.filter((exp) => exp.secondary)

  const name = settings?.name || SITE.name
  const positioning = settings?.positioning || SITE.positioning

  return (
    <>
      <Seo title="About" description={`${SITE.positioning} — ${SITE.focusAreas}.`} path="/about" />

      <section className="container-editorial section-y-tight pt-14">
        <p className="label-mono text-accent">About</p>
        <h1 className="mt-3 max-w-2xl font-serif text-3xl leading-snug sm:text-4xl">
          {name} — {positioning}
        </h1>
        {settings?.location ? <p className="mt-2 label-mono text-ink-faint">{settings.location}</p> : null}

        {loading ? <LoadingState label="Loading" /> : null}
        {hasError ? (
          <ErrorState message="Couldn't load this page. Check the console for details, or try refreshing." />
        ) : null}

        {!loading && !hasError ? (
          <div className="mt-12 max-w-2xl space-y-8 divide-y divide-line">
            <div>
              <p className="label-mono text-ink-faint">Professional Summary</p>
              <div className="mt-3 space-y-4">
                {settings?.aboutContent && settings.aboutContent.length > 0 ? (
                  <PortableText value={settings.aboutContent} components={portableTextComponents} />
                ) : (
                  <EmptyState message="Background copy not yet supplied — add it to Site Settings in Sanity Studio." />
                )}
              </div>
            </div>

            {settings?.keyImpact && settings.keyImpact.length > 0 ? (
              <div className="pt-8">
                <p className="label-mono text-ink-faint">Key Impact</p>
                <div className="mt-4">
                  <KeyImpact stats={settings.keyImpact} />
                </div>
              </div>
            ) : null}

            <div className="pt-8">
              <p className="label-mono text-ink-faint">Experience</p>
              <div className="mt-3">
                <ExperienceList experience={primaryExperience} />
              </div>
            </div>

            {settings?.technicalWork && settings.technicalWork.length > 0 ? (
              <div className="pt-8">
                <p className="label-mono text-ink-faint">Selected Technical Work</p>
                <div className="mt-3">
                  <SelectedTechnicalWork items={settings.technicalWork} />
                </div>
              </div>
            ) : null}

            {settings?.education && settings.education.length > 0 ? (
              <div className="pt-8">
                <p className="label-mono text-ink-faint">Education</p>
                <div className="mt-3">
                  <EducationList education={settings.education} />
                </div>
              </div>
            ) : null}

            {settings?.publications && settings.publications.length > 0 ? (
              <div className="pt-8">
                <p className="label-mono text-ink-faint">Publications & Honors</p>
                <div className="mt-3">
                  <PublicationsList publications={settings.publications} />
                </div>
              </div>
            ) : null}

            {settings?.skillGroups && settings.skillGroups.length > 0 ? (
              <div className="pt-8">
                <p className="label-mono text-ink-faint">Skills</p>
                <div className="mt-3">
                  <SkillGroups groups={settings.skillGroups} />
                </div>
                {settings.linkedinUrl ? (
                  <a
                    href={settings.linkedinUrl}
                    className="mt-4 inline-block text-sm text-ink-faint underline underline-offset-2 hover:text-ink"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View additional certifications and credentials on LinkedIn →
                  </a>
                ) : null}
              </div>
            ) : null}

            {additionalExperience.length > 0 ? (
              <div className="pt-8">
                <p className="label-mono text-ink-faint">Additional Experience</p>
                <div className="mt-3">
                  <ExperienceList experience={additionalExperience} />
                </div>
              </div>
            ) : null}

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
                {settings.linkedinUrl ? (
                  <a
                    href={settings.linkedinUrl}
                    className="mt-3 block text-ink-muted underline underline-offset-2 hover:text-ink"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </>
  )
}

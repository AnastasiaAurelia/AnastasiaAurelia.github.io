import { Link } from 'react-router-dom'
import { SITE } from '@/content/site'
import { useSiteSettings } from '@/hooks/use-site-settings'

/**
 * Deliberately minimal utility chrome — the editorial "ending" lives in
 * the homepage's Contact section; this strip is just sitewide legal +
 * a secondary way back to the same contact point, read from Sanity.
 */
export function Footer() {
  const { status, data: settings } = useSiteSettings()
  const email = status === 'success' ? settings?.contactEmail : null
  const social =
    status === 'success'
      ? [
          settings?.linkedinUrl ? { label: 'LinkedIn', url: settings.linkedinUrl } : null,
          settings?.githubUrl ? { label: 'GitHub', url: settings.githubUrl } : null,
        ].filter((link): link is { label: string; url: string } => link !== null)
      : []

  return (
    <footer className="mt-auto border-t border-line">
      <div className="container-editorial flex flex-col gap-4 py-8 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <p className="label-mono">
            © {new Date().getFullYear()} {SITE.name}
          </p>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-4">
            {SITE.nav.map((item) => (
              <Link key={item.href} to={item.href} className="transition-colors hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {email ? (
            <a href={`mailto:${email}`} className="transition-colors hover:text-ink">
              {email}
            </a>
          ) : null}
          {social.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

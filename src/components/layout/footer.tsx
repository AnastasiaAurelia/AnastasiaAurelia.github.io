import { Mail } from 'lucide-react'
import { SITE } from '@/content/site'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {SITE.name}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${SITE.email}`}
            className="flex items-center gap-1.5 hover:text-ink"
          >
            <Mail className="size-4" aria-hidden="true" />
            {SITE.email}
          </a>
          {SITE.social.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

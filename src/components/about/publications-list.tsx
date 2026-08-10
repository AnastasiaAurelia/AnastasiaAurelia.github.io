import type { Publication } from '@/lib/sanity/types'
import { EmptyState } from '@/components/state/query-states'

export function PublicationsList({ publications }: { publications: Publication[] }) {
  if (publications.length === 0) {
    return <EmptyState message="No publications published yet." />
  }

  return (
    <ul className="space-y-3">
      {publications.map((pub) => (
        <li key={pub.title} className="text-ink-muted">
          {pub.url ? (
            <a href={pub.url} className="underline underline-offset-2 hover:text-ink" target="_blank" rel="noreferrer">
              “{pub.title}”
            </a>
          ) : (
            <span className="text-ink">“{pub.title}”</span>
          )}{' '}
          — {pub.venue}, {pub.year}
        </li>
      ))}
    </ul>
  )
}

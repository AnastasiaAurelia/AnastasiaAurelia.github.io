import { Link } from 'react-router-dom'
import type { TechnicalWorkHighlight } from '@/lib/sanity/types'
import { EmptyState } from '@/components/state/query-states'

export function SelectedTechnicalWork({ items }: { items: TechnicalWorkHighlight[] }) {
  if (items.length === 0) {
    return <EmptyState message="No technical work highlights published yet." />
  }

  return (
    <ol className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <li key={item.cvTitle} className="py-6">
          <h3 className="text-lg">
            {item.article ? (
              <Link to={`/articles/${item.article.slug}`} className="underline underline-offset-2 hover:text-ink">
                {item.cvTitle}
              </Link>
            ) : (
              item.cvTitle
            )}
          </h3>
          <p className="mt-2 max-w-2xl text-ink-muted">{item.cvSummary}</p>
        </li>
      ))}
    </ol>
  )
}

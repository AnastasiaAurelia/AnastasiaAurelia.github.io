import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { SanityArticleSummary } from '@/lib/sanity/types'
import { formatDate } from '@/lib/format-date'

/** One row of the Writing index — mirrors WorkCard's numbered-row pattern. */
export function ArticleCard({ article, index }: { article: SanityArticleSummary; index: number }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group grid gap-3 border-t border-line py-8 transition-colors last:border-b hover:bg-surface sm:grid-cols-12 sm:gap-6 sm:px-2"
    >
      <span className="label-mono text-ink-faint sm:col-span-1">{String(index + 1).padStart(2, '0')}</span>
      <div className="sm:col-span-7">
        <h3 className="flex items-center gap-2 text-xl leading-snug">
          {article.title}
          <ArrowUpRight
            className="size-4 shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </h3>
        <p className="mt-2 max-w-xl text-sm text-ink-muted">{article.excerpt}</p>
      </div>
      <div className="flex flex-col gap-2 sm:col-span-4">
        <p className="label-mono text-ink-faint">{formatDate(article.publishedAt)}</p>
        {article.category ? <p className="label-mono text-accent">{article.category}</p> : null}
      </div>
    </Link>
  )
}

import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { SanityArticleSummary } from '@/lib/sanity/types'
import { formatDate } from '@/lib/format-date'

/** The single featured-article treatment at the top of the Writing index. */
export function FeaturedArticle({ article }: { article: SanityArticleSummary }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group block border border-line px-6 py-8 transition-colors hover:bg-surface sm:px-8 sm:py-10"
    >
      <p className="label-mono text-accent">Featured</p>
      <h3 className="mt-3 text-3xl leading-tight sm:text-4xl">{article.title}</h3>
      <p className="mt-4 max-w-2xl text-ink-muted">{article.excerpt}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="label-mono text-ink-faint">{formatDate(article.publishedAt)}</p>
        {article.category ? <p className="label-mono text-ink-faint">{article.category}</p> : null}
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
        Read the article
        <ArrowUpRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  )
}

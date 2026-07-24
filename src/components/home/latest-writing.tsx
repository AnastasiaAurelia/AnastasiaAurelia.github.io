import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { SanityArticleSummary } from '@/lib/sanity/types'
import { SectionKicker } from '@/components/editorial/section-kicker'
import { formatDate } from '@/lib/format-date'

/**
 * Deliberately smaller than Selected Work: a plain three-up grid of
 * title/date/excerpt, no numbering, no alternating composition — this
 * section supports the homepage, it doesn't compete with the primary
 * work section above it. Renders nothing at all when there are no
 * published articles (see HomePage), rather than an empty section.
 */
export function LatestWriting({ articles }: { articles: SanityArticleSummary[] }) {
  if (articles.length === 0) return null

  return (
    <section className="container-editorial section-y-tight">
      <div className="mb-2 flex items-baseline justify-between">
        <SectionKicker index="04" title="Latest writing" className="mb-0" />
        <Link to="/articles" className="label-mono text-ink-faint transition-colors hover:text-ink">
          All writing
        </Link>
      </div>
      <div className="grid gap-6 border-t border-line pt-8 sm:grid-cols-3 sm:gap-8">
        {articles.map((article) => (
          <Link key={article._id} to={`/articles/${article.slug}`} className="group block">
            <p className="label-mono text-ink-faint">{formatDate(article.publishedAt)}</p>
            <h3 className="mt-2 flex items-start gap-1.5 text-lg leading-snug">
              {article.title}
              <ArrowUpRight
                className="mt-1 size-3.5 shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </h3>
            <p className="mt-2 text-sm text-ink-muted">{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

import { useMemo, useState } from 'react'
import { Seo } from '@/components/seo/seo'
import { ArticleCard } from '@/components/writing/article-card'
import { FeaturedArticle } from '@/components/writing/featured-article'
import { TagFilter } from '@/components/work/tag-filter'
import { LoadingState, ErrorState, EmptyState } from '@/components/state/query-states'
import { useAllArticles } from '@/hooks/use-articles'
import { SITE } from '@/content/site'

export function WritingIndexPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const { status, data: articles } = useAllArticles()

  const featured = useMemo(() => articles?.find((a) => a.featured) ?? null, [articles])

  const availableCategories = useMemo(() => {
    if (!articles) return []
    const set = new Set<string>()
    articles.forEach((a) => a.category && set.add(a.category))
    return Array.from(set)
  }, [articles])

  const listedArticles = useMemo(() => {
    if (!articles) return []
    // The featured article gets its own prominent slot above — don't repeat it in the list below.
    const rest = featured ? articles.filter((a) => a._id !== featured._id) : articles
    return activeCategory ? rest.filter((a) => a.category === activeCategory) : rest
  }, [articles, featured, activeCategory])

  return (
    <>
      <Seo
        title="Writing"
        description={`Articles and technical writing from ${SITE.name} on applied AI, computer vision, and product work.`}
        path="/articles"
      />

      <section className="container-editorial section-y-tight pt-14">
        <p className="label-mono text-accent">Index</p>
        <h1 className="mt-3 text-4xl">Writing</h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Notes and longer-form pieces on applied AI, computer vision, and the product work behind
          them.
        </p>

        {status === 'loading' ? <LoadingState label="Loading articles" /> : null}
        {status === 'error' ? (
          <ErrorState message="Couldn't load articles. Check the console for details, or try refreshing." />
        ) : null}

        {status === 'success' ? (
          <>
            {featured ? (
              <div className="mt-8">
                <FeaturedArticle article={featured} />
              </div>
            ) : null}

            {availableCategories.length > 0 ? (
              <div className="mt-8">
                <TagFilter
                  tags={availableCategories}
                  active={activeCategory}
                  onChange={setActiveCategory}
                  label="Filter articles by category"
                />
              </div>
            ) : null}

            <div className="mt-4" aria-live="polite">
              {listedArticles.map((article, index) => (
                <ArticleCard key={article._id} article={article} index={index} />
              ))}
            </div>

            {articles && articles.length === 0 ? (
              <div className="mt-8">
                <EmptyState message="No articles published yet. Check back soon." />
              </div>
            ) : null}

            {articles && articles.length > 0 && listedArticles.length === 0 && !featured ? (
              <div className="mt-8">
                <EmptyState message="No articles match this filter yet." />
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </>
  )
}

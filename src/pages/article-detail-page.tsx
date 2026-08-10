import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import { Seo } from '@/components/seo/seo'
import { LoadingState, ErrorState } from '@/components/state/query-states'
import { portableTextComponents } from '@/components/portable-text/portable-text-components'
import { urlForImage } from '@/lib/sanity/image'
import { formatDate } from '@/lib/format-date'
import { useArticle } from '@/hooks/use-article'
import { SITE } from '@/content/site'
import { NotFoundPage } from './not-found-page'

/**
 * The single template every article renders through. Unlike a project
 * case study, an article body is a flowing read — no chapter markers,
 * no sticky nav — so this stays a straightforward Portable Text render
 * inside the breakout grid that lets inline images opt into a wider
 * measure (see `.article-body-grid` in index.css).
 */
export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { status, data: article } = useArticle(slug)

  if (status === 'loading') {
    return <LoadingState label="Loading article" />
  }

  if (status === 'error') {
    return (
      <div className="container-editorial section-y-tight">
        <ErrorState message="Couldn't load this article. Check the console for details, or try refreshing." />
      </div>
    )
  }

  if (!article) {
    return <NotFoundPage />
  }

  const coverUrl = article.coverImage
    ? urlForImage(article.coverImage).auto('format').fit('max').width(1600).url()
    : null
  const updatedAt = article.updatedAtOverride
  const backLink = (
    <Link
      to="/articles"
      className="label-mono inline-flex items-center gap-2 text-ink-faint transition-colors hover:text-ink"
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      Writing
    </Link>
  )

  return (
    <>
      <Seo
        title={article.seoTitle || article.title}
        description={article.seoDescription || article.excerpt}
        path={`/articles/${article.slug}`}
        ogType="article"
        publishedTime={article.publishedAt}
        modifiedTime={updatedAt}
        image={article.socialShareImage ?? article.coverImage}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            datePublished: article.publishedAt,
            ...(updatedAt ? { dateModified: updatedAt } : {}),
            author: { '@type': 'Person', name: SITE.name },
          },
        ]}
      />

      <article className="container-editorial section-y-tight pt-14">
        <div className="mb-8">{backLink}</div>

        <header className="max-w-2xl">
          {article.category ? <p className="label-mono text-accent">{article.category}</p> : null}
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{article.title}</h1>
          <p className="mt-5 font-serif text-2xl leading-snug text-ink-muted sm:text-3xl">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="label-mono text-ink-faint">
              {formatDate(article.publishedAt)}
              {updatedAt ? ` · Updated ${formatDate(updatedAt)}` : null}
            </p>
            {article.tags?.length > 0 ? (
              <p className="label-mono text-ink-faint">{article.tags.join(' · ')}</p>
            ) : null}
          </div>
        </header>

        {article.role ? <dl className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Role', article.role], ['Project type', article.projectType], ['System', article.system],
            ['Core question', article.coreQuestion], ['Evidence', article.evidence], ['Status', article.status],
          ].map(([label, value]) => value ? <div key={label} className="bg-paper p-4"><dt className="label-mono text-accent">{label}</dt><dd className="mt-2 text-sm text-ink-muted">{value}</dd></div> : null)}
        </dl> : null}

        {coverUrl && article.coverImage ? (
          <figure className="mt-10">
            <img
              src={coverUrl}
              alt={article.coverImage.alt}
              className="w-full rounded-sm border border-line"
              loading="eager"
            />
            {article.coverImage.caption ? (
              <figcaption className="mt-2 text-sm text-ink-faint">{article.coverImage.caption}</figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="article-body-grid mt-10 space-y-4 border-t border-line pt-10">
          <PortableText value={article.body} components={portableTextComponents} />
        </div>

        <div className="mt-12 border-t border-line pt-8">{backLink}</div>
      </article>
    </>
  )
}

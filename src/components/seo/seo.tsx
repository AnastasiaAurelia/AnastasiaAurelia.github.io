import { Helmet } from 'react-helmet-async'
import { SITE } from '@/content/site'
import { urlForImage } from '@/lib/sanity/image'
import type { SanityImageWithAlt } from '@/lib/sanity/types'

interface SeoProps {
  title: string
  description: string
  path: string
  /** Inline JSON-LD objects (Person, CreativeWork, Article, etc.) for this page. */
  jsonLd?: Record<string, unknown>[]
  /** Defaults to "website" — pages representing a single piece of writing (articles) pass "article". */
  ogType?: 'website' | 'article'
  /** ISO datetime — rendered as article:published_time when `ogType` is "article". */
  publishedTime?: string
  /** ISO datetime — rendered as article:modified_time when present. */
  modifiedTime?: string
  /** A Sanity image with required alt — becomes og:image/twitter:image when present. */
  image?: SanityImageWithAlt
}

export function Seo({
  title,
  description,
  path,
  jsonLd = [],
  ogType = 'website',
  publishedTime,
  modifiedTime,
  image,
}: SeoProps) {
  const fullTitle = path === '/' ? title : `${title} · ${SITE.name}`
  const url = `${SITE.url}${path}`
  const imageUrl = image ? urlForImage(image).auto('format').fit('max').width(1200).url() : null

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE.name} />
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
      {imageUrl && image ? <meta property="og:image:alt" content={image.alt} /> : null}
      {ogType === 'article' && publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {ogType === 'article' && modifiedTime ? <meta property="article:modified_time" content={modifiedTime} /> : null}

      <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}

      {jsonLd.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}

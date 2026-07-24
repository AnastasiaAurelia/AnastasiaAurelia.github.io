import { Helmet } from 'react-helmet-async'
import { SITE } from '@/content/site'

interface SeoProps {
  title: string
  description: string
  path: string
  /** Inline JSON-LD objects (Person, CreativeWork, etc.) for this page. */
  jsonLd?: Record<string, unknown>[]
}

export function Seo({ title, description, path, jsonLd = [] }: SeoProps) {
  const fullTitle = path === '/' ? title : `${title} · ${SITE.name}`
  const url = `${SITE.url}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE.name} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {jsonLd.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}

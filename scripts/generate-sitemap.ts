/**
 * Build-time sitemap generator. Runs as a `postbuild` step against Node's
 * native TypeScript support (no bundler).
 *
 * Queries Sanity directly (published perspective, no token) for project
 * and article slugs — this used to read the old static `src/content`
 * module, which no longer reflects reality now that both are Sanity-
 * backed; that made the sitemap silently wrong. A self-contained client
 * (rather than importing `src/lib/sanity/client.ts`) because that module
 * reads `import.meta.env`, which only exists under Vite, not plain Node.
 */
import { writeFileSync } from 'node:fs'
import { createClient } from '@sanity/client'
import { SITE } from '../src/content/site.ts'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'l3uxv1lk'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  useCdn: false,
  perspective: 'published',
})

async function main() {
  const [projectSlugs, articleSlugs] = await Promise.all([
    client.fetch<string[]>('*[_type == "project"].slug.current'),
    // Draft-only articles are invisible to this client (`perspective:
    // "published"`), so this can never include an unpublished article.
    client.fetch<string[]>('*[_type == "article"].slug.current'),
  ])

  const staticRoutes = ['/', '/work', '/articles', '/about']
  const projectRoutes = projectSlugs.map((slug) => `/work/${slug}`)
  const articleRoutes = articleSlugs.map((slug) => `/articles/${slug}`)
  const routes = [...staticRoutes, ...projectRoutes, ...articleRoutes]

  const priorityFor = (route: string) => {
    if (route === '/') return '1.0'
    if (route.startsWith('/work/') || route.startsWith('/articles/')) return '0.7'
    return '0.5'
  }

  const urlEntries = routes
    .map((route) => {
      const loc = `${SITE.url}${route}`
      return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priorityFor(route)}</priority>\n  </url>`
    })
    .join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`

  writeFileSync('dist/sitemap.xml', sitemap)
  console.log(
    `Generated dist/sitemap.xml with ${routes.length} routes ` +
      `(${projectRoutes.length} projects, ${articleRoutes.length} articles).`,
  )
}

main().catch((error: unknown) => {
  console.error('Sitemap generation failed:', error instanceof Error ? error.message : error)
  process.exit(1)
})

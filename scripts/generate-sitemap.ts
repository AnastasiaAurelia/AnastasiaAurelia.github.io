/**
 * Build-time sitemap generator. Runs as a `postbuild` step against Node's
 * native TypeScript support (no bundler), reading the same content module
 * the app renders from — so the sitemap can never drift from the actual
 * route list as projects are added or removed.
 */
import { writeFileSync } from 'node:fs'
import { projects } from '../src/content/projects/index.ts'
import { SITE } from '../src/content/site.ts'

const staticRoutes = ['/', '/work', '/about']
const projectRoutes = projects.map((project) => `/work/${project.slug}`)
const routes = [...staticRoutes, ...projectRoutes]

const urlEntries = routes
  .map((route) => {
    const loc = `${SITE.url}${route}`
    const priority = route === '/' ? '1.0' : route.startsWith('/work/') ? '0.7' : '0.5'
    return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`
  })
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`

writeFileSync('dist/sitemap.xml', sitemap)
console.log(`Generated dist/sitemap.xml with ${routes.length} routes.`)

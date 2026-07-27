/**
 * Generates dist/404.html — the GitHub Pages SPA fallback — from the
 * already-built dist/index.html, run as a postbuild step (Node's native
 * TypeScript support, no bundler).
 *
 * GitHub Pages has no server-side rewrite rule, so a direct request for
 * /work/researchlens (a refresh, or a link opened in a new tab) 404s at
 * the CDN before React Router ever sees it. GitHub Pages does let a
 * static 404.html handle that instead. This file reuses the real
 * build's <head> (so the tab title/favicon/fonts are correct even
 * during the redirect) but intentionally does NOT include the app
 * bundle's <script> tag — its only job is to redirect immediately via
 * the query-string encoding trick, not to mount the app. The matching
 * "restore" half of this lives permanently in index.html and rewrites
 * the URL back to the clean path before React mounts.
 *
 * Pattern: https://github.com/rafgraph/spa-github-pages (MIT).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const INDEX_PATH = 'dist/index.html'
const OUTPUT_PATH = 'dist/404.html'

// This is a GitHub *user* site (AnastasiaAurelia.github.io), served at
// the domain root — see vite.config.ts, which is the single place the
// actual repo topology lives. Zero path segments belong to the "base",
// so the whole pathname is the route to restore.
const PATH_SEGMENTS_TO_KEEP = 0

// Pre-migration project-site base. The repo used to be "anastasia-
// portfolio", served at /anastasia-portfolio/, so old bookmarked or
// indexed links (e.g. /anastasia-portfolio/work/researchlens) still
// point here. GitHub Pages only supports one site-root 404.html — there
// is no per-directory override — so any request under this prefix with
// no matching file lands here too, and needs its own branch: strip the
// legacy prefix and hand off to the *same* ?/ restore contract below,
// just retargeted at the real root. Safe to delete this branch (and
// public/anastasia-portfolio/) once traffic to the old path is negligible.
const LEGACY_PROJECT_BASE = '/anastasia-portfolio'

if (!existsSync(INDEX_PATH)) {
  console.error(`${INDEX_PATH} not found — run the build before generating the SPA fallback.`)
  process.exit(1)
}

const indexHtml = readFileSync(INDEX_PATH, 'utf8')
const headMatch = indexHtml.match(/<head>([\s\S]*?)<\/head>/i)

if (!headMatch) {
  console.error(`Could not find a <head> section in ${INDEX_PATH}.`)
  process.exit(1)
}

// Strip the bundle's <script type="module"> and its <link rel="stylesheet">
// (Vite injects both into <head>, not <body>, on a production build).
// 404.html must never try to boot the app — its body has no #root to
// mount into, and depending on it not to run before the redirect fires
// would mean relying on script-execution-order/timing between a classic
// script and a deferred module script, which isn't something to build a
// "reliable" deploy on. Its only job is the redirect below.
const head = headMatch[1]
  .replace(/\s*<script type="module"[^>]*><\/script>/i, '')
  .replace(/\s*<link rel="stylesheet" crossorigin href="[^"]*"\s*\/?>/i, '')

const redirectScript = `
    <script type="text/javascript">
      // GitHub Pages SPA fallback (redirect half). See index.html for the
      // matching restore script. Pattern: https://github.com/rafgraph/spa-github-pages
      var l = window.location;
      var legacyBase = '${LEGACY_PROJECT_BASE}';
      if (l.pathname === legacyBase || l.pathname.indexOf(legacyBase + '/') === 0) {
        // Old project-site link with no matching file (e.g. a direct hit
        // to /anastasia-portfolio/work/researchlens, not the already-
        // encoded ?/ form — that's served straight from
        // public/anastasia-portfolio/index.html and never reaches here).
        // Strip the legacy prefix and reuse the same ?/ restore contract
        // as the standard branch below, retargeted at the real root.
        var rest = l.pathname.slice(legacyBase.length).replace(/^\\//, '');
        l.replace(
          l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') + '/?/' +
          rest.replace(/&/g, '~and~') +
          (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
          l.hash
        );
      } else {
        var pathSegmentsToKeep = ${PATH_SEGMENTS_TO_KEEP};
        l.replace(
          l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
          l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
          l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
          (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
          l.hash
        );
      }
    </script>`

const fallbackHtml = `<!doctype html>
<html lang="en">
  <head>${head}${redirectScript}
  </head>
  <body></body>
</html>
`

writeFileSync(OUTPUT_PATH, fallbackHtml)
console.log(`Generated ${OUTPUT_PATH} (SPA fallback, pathSegmentsToKeep=${PATH_SEGMENTS_TO_KEEP}).`)

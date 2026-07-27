import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'

/**
 * Exercises the *real* generated dist/404.html — not a reimplementation
 * of its string logic — against a throwaway fixture, so a subtle bug in
 * the redirect string-building (the riskiest part of the root-site
 * migration) fails a test instead of shipping. Runs the actual script as
 * a subprocess against a temp dist/, independent of the project's own
 * dist/ and of whether `build` has run yet (CI runs `test` before
 * `build` — see .github/workflows/deploy-pages.yml).
 */

const SCRIPT_PATH = path.resolve(__dirname, '../generate-spa-fallback.ts')
const REPO_ROOT = path.resolve(__dirname, '../..')

let tempDir: string
let redirectScriptBody: string

interface MockLocation {
  protocol: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  replaceTarget: string | null
  replace(url: string): void
}

function mockLocation(overrides: Partial<MockLocation>): MockLocation {
  return {
    protocol: 'https:',
    hostname: 'anastasiaaurelia.github.io',
    port: '',
    pathname: '/',
    search: '',
    hash: '',
    replaceTarget: null,
    replace(url: string) {
      this.replaceTarget = url
    },
    ...overrides,
  }
}

/** Runs the extracted <script> body against a mock `window.location`. */
function runRedirect(overrides: Partial<MockLocation>) {
  const location = mockLocation(overrides)
  const window = { location }
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function('window', redirectScriptBody)
  fn(window)
  return location.replaceTarget
}

beforeAll(() => {
  tempDir = mkdtempSync(path.join(tmpdir(), 'spa-fallback-test-'))
  mkdirSync(path.join(tempDir, 'dist'))
  writeFileSync(
    path.join(tempDir, 'dist', 'index.html'),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Anastasia Aurelia — AI Product Manager</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <script type="module" crossorigin src="/assets/index-abc123.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-abc123.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`,
  )

  execFileSync('node', [SCRIPT_PATH], { cwd: tempDir })

  const fallbackHtml = readFileSync(path.join(tempDir, 'dist', '404.html'), 'utf8')
  const scriptMatch = fallbackHtml.match(
    /<script type="text\/javascript">([\s\S]*?)<\/script>/,
  )
  if (!scriptMatch) throw new Error('Could not find redirect <script> in generated 404.html')
  redirectScriptBody = scriptMatch[1]
})

afterAll(() => {
  rmSync(tempDir, { recursive: true, force: true })
})

describe('generate-spa-fallback: generated dist/404.html', () => {
  it('produces a 404.html with no functional /anastasia-portfolio/ asset references', () => {
    const fallbackHtml = readFileSync(path.join(tempDir, 'dist', '404.html'), 'utf8')
    expect(fallbackHtml).not.toContain('/anastasia-portfolio/assets/')
    expect(fallbackHtml).not.toContain('/anastasia-portfolio/favicon.svg')
  })

  it('strips the app bundle script and stylesheet (never boots the app)', () => {
    const fallbackHtml = readFileSync(path.join(tempDir, 'dist', '404.html'), 'utf8')
    expect(fallbackHtml).not.toContain('type="module"')
    expect(fallbackHtml).not.toContain('assets/index-abc123.css')
  })

  it('redirects a direct legacy nested path to the ?/-encoded root form', () => {
    const target = runRedirect({ pathname: '/anastasia-portfolio/articles' })
    expect(target).toBe('https://anastasiaaurelia.github.io/?/articles')
  })

  it('redirects a direct legacy nested slug path to the ?/-encoded root form', () => {
    const target = runRedirect({ pathname: '/anastasia-portfolio/work/example' })
    expect(target).toBe('https://anastasiaaurelia.github.io/?/work/example')
  })

  it('redirects the bare legacy base (no trailing slash) to root', () => {
    const target = runRedirect({ pathname: '/anastasia-portfolio' })
    expect(target).toBe('https://anastasiaaurelia.github.io/?/')
  })

  it('preserves real query params and hash on a legacy nested path', () => {
    const target = runRedirect({
      pathname: '/anastasia-portfolio/work/example',
      search: '?utm_source=newsletter',
      hash: '#evidence',
    })
    expect(target).toBe(
      'https://anastasiaaurelia.github.io/?/work/example&utm_source=newsletter#evidence',
    )
  })

  it('still redirects a clean root-site route through the standard branch', () => {
    const target = runRedirect({ pathname: '/articles' })
    expect(target).toBe('https://anastasiaaurelia.github.io/?/articles')
  })

  it('still redirects a clean root-site slug route through the standard branch', () => {
    const target = runRedirect({ pathname: '/work/example' })
    expect(target).toBe('https://anastasiaaurelia.github.io/?/work/example')
  })

  it('does not misfire the legacy branch for a route that merely starts with the same letters', () => {
    // Guards against a naive prefix check matching /anastasia-portfolio-archive
    // or similar — must require an exact segment boundary.
    const target = runRedirect({ pathname: '/anastasia-portfolio-archive' })
    expect(target).toBe('https://anastasiaaurelia.github.io/?/anastasia-portfolio-archive')
  })
})

describe('legacy public/anastasia-portfolio/index.html shim', () => {
  const shimPath = path.join(REPO_ROOT, 'public', 'anastasia-portfolio', 'index.html')
  let shimScriptBody: string

  beforeAll(() => {
    const html = readFileSync(shimPath, 'utf8')
    const match = html.match(/<script type="text\/javascript">([\s\S]*?)<\/script>/)
    if (!match) throw new Error('Could not find redirect <script> in the legacy shim')
    shimScriptBody = match[1]
  })

  function runShim(overrides: Partial<MockLocation>) {
    const location = mockLocation(overrides)
    const window = { location }
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function('window', shimScriptBody)
    fn(window)
    return location.replaceTarget
  }

  it('defaults to / when there is no route payload', () => {
    expect(runShim({ pathname: '/anastasia-portfolio/', search: '' })).toBe('/')
  })

  it('preserves a hash on the no-payload default', () => {
    expect(runShim({ pathname: '/anastasia-portfolio/', search: '', hash: '#top' })).toBe('/#top')
  })

  it('relocates an already-encoded ?/ deep link to the root, unchanged', () => {
    expect(runShim({ pathname: '/anastasia-portfolio/', search: '?/articles' })).toBe(
      '/?/articles',
    )
  })

  it('relocates an already-encoded ?/ deep link with a nested slug', () => {
    expect(runShim({ pathname: '/anastasia-portfolio/', search: '?/work/researchlens' })).toBe(
      '/?/work/researchlens',
    )
  })

  it('preserves hash alongside an encoded deep link', () => {
    expect(
      runShim({ pathname: '/anastasia-portfolio/', search: '?/work/example', hash: '#evidence' }),
    ).toBe('/?/work/example#evidence')
  })
})

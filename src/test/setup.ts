import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { fixtureArticleBody, fixtureArticles, fixtureExperience, fixtureProjects, fixtureSiteSettings } from './fixtures'

// Tests never hit the real Sanity API — every page's data hook is backed
// by this mock, seeded with realistic fixtures. The mock deliberately
// re-implements the filter/sort the real GROQ queries perform
// (`featured == true`, `visible == true`, `order(displayOrder asc)`)
// rather than returning the raw fixture array, so tests actually
// exercise that contract instead of trivially passing regardless of it.
const byDisplayOrder = <T extends { displayOrder: number }>(items: T[]) =>
  [...items].sort((a, b) => a.displayOrder - b.displayOrder)

const byPublishedDesc = <T extends { publishedAt: string }>(a: T, b: T) => (a.publishedAt < b.publishedAt ? 1 : -1)

const byFeaturedThenPublished = <T extends { featured: boolean; publishedAt: string }>(items: T[]) =>
  [...items].sort((a, b) => Number(b.featured) - Number(a.featured) || byPublishedDesc(a, b))

vi.mock('@/lib/sanity/fetch', () => ({
  getSiteSettings: () => Promise.resolve(fixtureSiteSettings),
  getFeaturedProjects: () => Promise.resolve(byDisplayOrder(fixtureProjects.filter((p) => p.featured))),
  getAllProjects: () => Promise.resolve(byDisplayOrder(fixtureProjects)),
  getProjectBySlug: (slug: string) =>
    Promise.resolve(
      fixtureProjects.find((p) => p.slug === slug)
        ? { ...fixtureProjects.find((p) => p.slug === slug), content: [], gallery: [] }
        : null,
    ),
  getVisibleExperience: () => Promise.resolve(byDisplayOrder(fixtureExperience.filter((e) => e.visible))),
  getAllArticles: () => Promise.resolve(byFeaturedThenPublished(fixtureArticles)),
  getFeaturedArticles: () => Promise.resolve(byFeaturedThenPublished(fixtureArticles.filter((a) => a.featured))),
  getLatestArticles: (limit = 3) =>
    Promise.resolve([...fixtureArticles].sort(byPublishedDesc).slice(0, limit)),
  getArticleBySlug: (slug: string) =>
    Promise.resolve(fixtureArticles.some((a) => a.slug === slug) ? fixtureArticleBody : null),
}))

// jsdom doesn't implement matchMedia; useTheme() relies on it to read the
// OS-level color-scheme preference on first mount.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}

// jsdom doesn't implement IntersectionObserver; useReveal() and
// useActiveSection() use it for scroll-entrance and chapter-nav
// highlighting. The stub never fires — tests assert on DOM content,
// not on the reveal transition itself.
if (!window.IntersectionObserver) {
  // Cast rather than `implements IntersectionObserver` — the DOM lib's
  // exact shape (e.g. `scrollMargin`) varies across TS versions, and
  // this stub only needs to satisfy the hooks that call it.
  class IntersectionObserverStub {
    root = null
    rootMargin = ''
    thresholds: ReadonlyArray<number> = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }
  window.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver
}

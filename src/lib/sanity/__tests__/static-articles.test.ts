import { describe, expect, it, vi } from 'vitest'
import type { SanityArticleSummary } from '../types'

const sanityArticles: SanityArticleSummary[] = [
  {
    _id: 'a1',
    title: 'Sanity Article',
    slug: 'sanity-article',
    excerpt: 'From the CMS.',
    publishedAt: '2026-01-01',
    tags: [],
    featured: false,
  },
  {
    _id: 'dup',
    title: 'Stale CMS copy',
    slug: 'hidden-structure-of-work',
    excerpt: 'Should be replaced by the code-backed page.',
    publishedAt: '2025-01-01',
    tags: [],
    featured: false,
  },
]

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: {
    fetch: vi.fn((query: string) => {
      if (query.includes('count(')) return Promise.resolve(2)
      if (query.includes('.slug.current')) return Promise.resolve(['sanity-article'])
      return Promise.resolve(sanityArticles)
    }),
  },
}))

describe('code-backed articles in the article index', async () => {
  const actual = await vi.importActual<typeof import('@/lib/sanity/fetch')>('@/lib/sanity/fetch')

  it('lists The Hidden Structure of Work once, alongside CMS articles, newest first', async () => {
    const articles = await actual.getAllArticles()
    const slugs = articles.map((a) => a.slug)
    expect(slugs.filter((s) => s === 'hidden-structure-of-work')).toHaveLength(1)
    expect(articles.find((a) => a.slug === 'hidden-structure-of-work')?.title).toBe('The Hidden Structure of Work')
    expect(slugs).toEqual(['from-capability-to-value', 'hidden-structure-of-work', 'semiconductor-systems-guide', 'sanity-article'])
  })

  it('includes both code-backed slugs in published slugs and counts', async () => {
    expect(await actual.getPublishedArticleSlugs()).toEqual(
      expect.arrayContaining(['from-capability-to-value', 'hidden-structure-of-work', 'semiconductor-systems-guide', 'sanity-article']),
    )
    expect(await actual.getPublishedArticleCount()).toBe(5)
  })
})

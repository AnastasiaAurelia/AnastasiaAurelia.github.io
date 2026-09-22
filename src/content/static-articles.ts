import type { SanityArticleSummary } from '@/lib/sanity/types'

export const SEMICONDUCTOR_SYSTEMS_GUIDE_SLUG = 'semiconductor-systems-guide'

export const STATIC_ARTICLE_SUMMARY: SanityArticleSummary = {
  _id: 'static.semiconductor-systems-guide',
  title: 'Semiconductors, End to End: A Practical Systems Map',
  slug: SEMICONDUCTOR_SYSTEMS_GUIDE_SLUG,
  excerpt:
    'A source-grounded map from CMOS and RTL-to-GDS through fabrication, packaging, chiplets, HBM, and the product vocabulary that matters in hardware R&D.',
  publishedAt: '2026-09-22',
  tags: ['Semiconductors', 'Hardware R&D', 'Systems Thinking'],
  category: 'Research',
  featured: false,
}

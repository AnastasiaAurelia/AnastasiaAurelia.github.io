import type { SanityArticleSummary } from '@/lib/sanity/types'

export const SEMICONDUCTOR_SYSTEMS_GUIDE_SLUG = 'semiconductor-systems-guide'

export const STATIC_ARTICLE_SUMMARY: SanityArticleSummary = {
  _id: 'static.semiconductor-systems-guide',
  title: 'Semiconductors, End to End: A Step-by-Step Guide',
  slug: SEMICONDUCTOR_SYSTEMS_GUIDE_SLUG,
  excerpt:
    'A step-by-step guide to semiconductors, from transistor basics and digital logic through RTL-to-GDS, wafer fabrication, packaging, HBM, chiplets, and real product development.',
  publishedAt: '2026-09-22',
  tags: ['Semiconductors', 'Hardware R&D', 'Systems Thinking'],
  category: 'Research',
  featured: false,
}

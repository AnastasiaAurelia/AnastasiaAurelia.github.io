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

export const HIDDEN_STRUCTURE_SLUG = 'hidden-structure-of-work'

export const HIDDEN_STRUCTURE_SUBTITLE =
  'Power, strategy, information, and the relationships that make organizations move'

export const HIDDEN_STRUCTURE_ARTICLE_SUMMARY: SanityArticleSummary = {
  _id: 'static.hidden-structure-of-work',
  title: 'The Hidden Structure of Work',
  slug: HIDDEN_STRUCTURE_SLUG,
  excerpt:
    'Why org charts explain less than they seem to: a long-form synthesis of dependence, political skill, credibility, bargaining, information, reputation, and networks, ending in a diagnostic for real organizations and an account of where its models break.',
  publishedAt: '2026-09-23',
  tags: ['Organizations', 'Power', 'Strategy'],
  category: 'Research',
  featured: false,
}

/** Code-backed editorial pages that live outside Sanity, newest first. */
export const STATIC_ARTICLE_SUMMARIES: SanityArticleSummary[] = [
  HIDDEN_STRUCTURE_ARTICLE_SUMMARY,
  STATIC_ARTICLE_SUMMARY,
]

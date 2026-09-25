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

export const CAPABILITY_VALUE_SLUG = 'from-capability-to-value'

export const CAPABILITY_VALUE_SUBTITLE =
  "How a language model's raw ability becomes work you can trust"

export const CAPABILITY_VALUE_ARTICLE_SUMMARY: SanityArticleSummary = {
  _id: 'static.from-capability-to-value',
  title: 'From Capability to Value',
  slug: CAPABILITY_VALUE_SLUG,
  excerpt:
    'One vague bug report followed through six layers (model, context, action, trust, learning, value), built from a Stanford architecture lecture and three practitioner talks, with every equation derived and every claim traced to its source.',
  // Publication edition date, aligned with the chapter source (Asia/Jakarta).
  publishedAt: '2026-09-25',
  tags: ['AI Systems', 'Agents', 'Transformers'],
  category: 'Research',
  featured: false,
}

/** Code-backed editorial pages that live outside Sanity, newest first. */
export const STATIC_ARTICLE_SUMMARIES: SanityArticleSummary[] = [
  CAPABILITY_VALUE_ARTICLE_SUMMARY,
  HIDDEN_STRUCTURE_ARTICLE_SUMMARY,
  STATIC_ARTICLE_SUMMARY,
]

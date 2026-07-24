import type { TagId } from './tags.ts'

/**
 * The content model treats a "project" as an aggregate of professional
 * evidence, not a single article. The project's own detail page is the
 * primary case study; `evidence` holds supplementary external artifacts
 * (a repo, a live demo, a deck, a video) that support it.
 *
 * Every narrative field below is optional by design: the MVP ships with
 * real evidence for some sections and honest placeholders for others.
 * Nothing here should ever be filled with invented outcomes — an absent
 * field renders a "not yet documented" state instead of being guessed at.
 *
 * This module's exported shape is the CMS migration boundary: swapping
 * `content/projects/index.ts` for a fetch against a headless CMS only
 * requires the fetched data to satisfy `Project` — every component that
 * consumes it is unaffected.
 */

export type EvidenceType =
  | 'case-study'
  | 'repository'
  | 'live-product'
  | 'article'
  | 'video'
  | 'document'
  | 'external-publication'
  | 'experiment'

export interface Evidence {
  type: EvidenceType
  label: string
  url: string
  description?: string
}

export interface Decision {
  title: string
  detail: string
}

export type ProjectStatus = 'shipped' | 'in-progress' | 'archived' | 'concept'

export interface ProjectNarrative {
  overview?: string
  problem?: string
  whyItMattered?: string
  ownership?: string
  contextAndConstraints?: string
  systemOrWorkflow?: string
  decisions?: Decision[]
  execution?: string
  evidenceAndOutcomes?: string
  tradeoffs?: string
  failuresAndLimitations?: string[]
  lessonsLearned?: string[]
}

export interface ProjectImage {
  src: string
  alt: string
}

export interface Project {
  slug: string
  title: string
  /** Short, factual restatement of what the project is — no outcome claims. */
  tagline: string
  /** 1-2 sentence summary shown on work cards. */
  summary: string
  /** Omit rather than guess — a claimed status is itself a claim. */
  status?: ProjectStatus
  /** Shown in the featured section on the homepage, in `order`. */
  featured: boolean
  /** Sort weight within its listing (lower first). */
  order: number
  tags: TagId[]
  /** Free-text period, e.g. "2024–2025". Omit rather than guess. */
  timeframe?: string
  heroImage?: ProjectImage
  narrative: ProjectNarrative
  /** Supplementary artifacts: repo, live demo, docs, video, etc. */
  evidence: Evidence[]
}

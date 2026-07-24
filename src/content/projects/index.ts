import type { EvidenceType, Project } from '../types.ts'
import { computerVisionLpr } from './computer-vision-lpr.ts'
import { researchlens } from './researchlens.ts'
import { agenticWorkflows } from './agentic-workflows.ts'

/**
 * The full project catalogue. Adding a project is: write a new file in
 * this folder exporting a `Project`, then list it here. No new route or
 * page component is required — `/work/:slug` resolves against this array.
 *
 * Migrating to a CMS later means replacing this static array with a
 * fetch that resolves to `Project[]`; nothing downstream changes.
 */
export const projects: Project[] = [computerVisionLpr, researchlens, agenticWorkflows].sort(
  (a, b) => a.order - b.order,
)

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured)
}

/**
 * Tallies real evidence by type across the whole catalogue, for the
 * homepage's evidence-index section. Every project's own detail page
 * counts as one "case study" — the rest reflect actual linked evidence,
 * which is 0 for a type until it's genuinely supplied.
 */
export function getEvidenceTypeCounts(): Record<EvidenceType, number> {
  const counts: Record<EvidenceType, number> = {
    'case-study': projects.length,
    repository: 0,
    'live-product': 0,
    article: 0,
    video: 0,
    document: 0,
    'external-publication': 0,
    experiment: 0,
  }
  for (const project of projects) {
    for (const evidence of project.evidence) {
      counts[evidence.type] += 1
    }
  }
  return counts
}

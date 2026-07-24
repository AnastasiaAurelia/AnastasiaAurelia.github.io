import type { Project } from '../types.ts'
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

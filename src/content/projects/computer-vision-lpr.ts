import type { Project } from '../types.ts'

/**
 * Content policy for this file (applies across all project entries):
 * only facts directly evidenced by the project name/title are stated
 * as fact. Everything else — problem framing, ownership, decisions,
 * outcomes — is left undefined until real case-study material is
 * supplied, and renders as an explicit placeholder rather than a guess.
 */
export const computerVisionLpr: Project = {
  slug: 'computer-vision-lpr',
  title: 'Computer Vision and LPR Reliability',
  tagline:
    'A computer vision system for license plate recognition, built with a focus on real-world reliability.',
  summary:
    'Case study on hardening a license-plate-recognition computer vision pipeline for reliability under real-world conditions. Full narrative in progress.',
  featured: true,
  order: 1,
  tags: ['computer-vision', 'lpr', 'reliability-engineering'],
  narrative: {
    overview:
      'A computer vision system built around license plate recognition (LPR), scoped specifically around reliability — i.e. making recognition hold up outside of clean, controlled conditions.',
  },
  evidence: [],
}

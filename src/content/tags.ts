/**
 * Canonical tag registry. Projects reference tags by id (not free text) so
 * labels stay consistent as the catalogue grows — no "Computer Vision" vs
 * "computer-vision" drift across content files.
 */
export const TAGS = {
  'computer-vision': 'Computer Vision',
  lpr: 'License Plate Recognition',
  'reliability-engineering': 'Reliability Engineering',
  'applied-ai': 'Applied AI',
  'agentic-workflows': 'Agentic Workflows',
  'llm-tooling': 'LLM Tooling',
  'product-strategy': 'Product Strategy',
  'research-tooling': 'Research Tooling',
  'system-design': 'System Design',
  'developer-tools': 'Developer Tools',
} as const

export type TagId = keyof typeof TAGS

export function tagLabel(id: TagId): string {
  return TAGS[id]
}

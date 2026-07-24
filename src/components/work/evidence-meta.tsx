import { BookOpen, ExternalLink, GitBranch, Rocket } from 'lucide-react'

export type EvidenceType = 'case-study' | 'repository' | 'live-product'

/**
 * Single source of truth for the evidence taxonomy this schema actually
 * supports. Trimmed to exactly what `project` has real fields for
 * (`githubUrl`, `externalUrl`, and the case study itself) — no
 * speculative categories (document/video/article/...) that could never
 * be populated and would just read as permanently empty.
 */
export const EVIDENCE_META: Record<EvidenceType, { label: string; description: string; icon: typeof ExternalLink }> = {
  'case-study': {
    label: 'Case study',
    description: 'The project detail page itself — problem, decisions, and trade-offs.',
    icon: BookOpen,
  },
  repository: {
    label: 'Repository',
    description: 'Source code and implementation history.',
    icon: GitBranch,
  },
  'live-product': {
    label: 'Live product',
    description: 'A running instance that can be opened directly.',
    icon: Rocket,
  },
}

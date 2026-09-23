import type { EvidenceLabel } from '@/content/articles/parse-article-markdown'

/**
 * Evidence labels are rendered quietly: a small monospace word with a
 * shape glyph, never a filled badge. The shape (not only the color)
 * distinguishes the five types, and the definition is available as a
 * tooltip. The legend near the top of the article explains them once.
 */
export const EVIDENCE_META: Record<EvidenceLabel, { name: string; glyph: string; definition: string }> = {
  EMPIRICAL: {
    name: 'Empirical',
    glyph: '●',
    definition: 'A result from a study with identified data and methods.',
  },
  'FORMAL MODEL': {
    name: 'Formal model',
    glyph: '◇',
    definition: 'Holds within a mathematical model under stated assumptions; not evidence about real behavior.',
  },
  CONCEPTUAL: {
    name: 'Conceptual',
    glyph: '○',
    definition: "An author's argument, often supported by cases rather than measurement.",
  },
  PRACTITIONER: {
    name: 'Practitioner',
    glyph: '△',
    definition: 'Advice, interviews, or personal accounts from practitioner writing.',
  },
  SYNTHESIS: {
    name: 'Synthesis',
    glyph: '◆',
    definition: "This article's own integration, interpretation, or analogy, including hypothetical examples.",
  },
}

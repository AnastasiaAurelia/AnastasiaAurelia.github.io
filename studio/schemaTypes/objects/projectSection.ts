import { defineField, defineType } from 'sanity'
import { HashIcon } from '@sanity/icons/Hash'

const SUGGESTED_TITLES = [
  'Overview',
  'Problem',
  'Why it mattered',
  'My ownership',
  'Constraints',
  'System or workflow',
  'Key decisions',
  'Execution',
  'Evidence and outcomes',
  'Trade-offs',
  'Lessons learned',
]

/**
 * A section-break marker dropped inline into the Portable Text `content`
 * field. This is how the case-study narrative beats (Overview, Problem,
 * Ownership, …) are represented — as headings within one flowing
 * document, not as separate top-level schema fields per beat.
 */
export default defineType({
  name: 'projectSection',
  title: 'Project section',
  type: 'object',
  icon: HashIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Section title',
      type: 'string',
      description: 'E.g. Overview, Problem, My ownership. Pick a suggestion or type your own.',
      options: { list: SUGGESTED_TITLES },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'identifier',
      title: 'Section identifier',
      type: 'string',
      description:
        'Stable, URL-safe id used for in-page anchors (e.g. "why-it-mattered"). Avoid changing this once published — it may be linked to directly.',
      validation: (Rule) =>
        Rule.required().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
          name: 'kebab-case',
          invert: false,
        }),
    }),
    defineField({
      name: 'introText',
      title: 'Introductory text',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: { title: 'title', identifier: 'identifier' },
    prepare({ title, identifier }) {
      return {
        title: title || 'Project section',
        subtitle: identifier ? `#${identifier}` : 'Project section',
      }
    },
  },
})

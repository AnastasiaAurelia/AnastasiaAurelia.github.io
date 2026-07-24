import { defineField, defineType } from 'sanity'
import { CaseIcon } from '@sanity/icons/Case'

/** An in-body callout for one key product/technical decision, paired
 * with the reasoning and its trade-off — the "Key decisions" and
 * "Trade-offs" narrative beats, expressed as structured content rather
 * than forced into separate top-level document fields. */
export default defineType({
  name: 'decisionCallout',
  title: 'Decision callout',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'decision',
      title: 'Decision',
      type: 'string',
      description: 'The decision itself, stated plainly.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reasoning',
      title: 'Reasoning',
      type: 'text',
      rows: 3,
      description: 'Why this was the right call given the constraints at the time.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'consequence',
      title: 'Consequence / trade-off',
      type: 'text',
      rows: 3,
      description: 'What this decision cost, or the trade-off accepted to make it.',
    }),
  ],
  preview: {
    select: { title: 'decision' },
    prepare({ title }) {
      return { title: title || 'Decision callout', subtitle: 'Decision callout' }
    },
  },
})

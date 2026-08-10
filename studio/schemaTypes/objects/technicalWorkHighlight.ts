import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'technicalWorkHighlight',
  title: 'Technical work highlight',
  type: 'object',
  fields: [
    defineField({
      name: 'cvTitle',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cvSummary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Short CV-specific summary — not a duplicate of the full case study.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'articleRef',
      title: 'Linked article',
      type: 'reference',
      to: [{ type: 'article' }],
      description:
        'Optional. Leave unset if no detailed write-up exists yet — the entry then renders as text only.',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 0,
      validation: (Rule) => Rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: { title: 'cvTitle', subtitle: 'cvSummary' },
  },
})

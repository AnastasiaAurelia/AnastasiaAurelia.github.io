import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'credibilityPoint',
  title: 'Credibility point',
  type: 'object',
  fields: [
    defineField({
      name: 'statement',
      title: 'Statement',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'detail',
      title: 'Supporting detail',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: { title: 'statement', subtitle: 'detail' },
  },
})

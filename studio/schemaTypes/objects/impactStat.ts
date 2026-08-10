import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'impactStat',
  title: 'Impact stat',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'e.g. "100,000+" or "5". Presentation summary of a claim already documented elsewhere on the page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. "Production transactions reviewed".',
      validation: (Rule) => Rule.required(),
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
    select: { value: 'value', label: 'label' },
    prepare({ value, label }) {
      return { title: value || 'Value', subtitle: label }
    },
  },
})

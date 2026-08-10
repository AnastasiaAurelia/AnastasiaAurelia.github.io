import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'education',
  title: 'Education',
  type: 'object',
  fields: [
    defineField({
      name: 'institution',
      title: 'Institution',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'program',
      title: 'Program / degree',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
      description: 'Leave blank if still in progress and reflect that in Status instead.',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Free text shown next to the date range, e.g. "In Progress" or "2026".',
    }),
    defineField({
      name: 'coursework',
      title: 'Coursework',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) =>
        Rule.custom((items) => {
          if (!items) return true
          const hasEmpty = (items as string[]).some((item) => !item || !item.trim())
          return hasEmpty ? 'Coursework entries cannot be empty' : true
        }),
    }),
    defineField({
      name: 'honors',
      title: 'Honors',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) =>
        Rule.custom((items) => {
          if (!items) return true
          const hasEmpty = (items as string[]).some((item) => !item || !item.trim())
          return hasEmpty ? 'Honor entries cannot be empty' : true
        }),
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
    select: { institution: 'institution', program: 'program', status: 'status' },
    prepare({ institution, program, status }) {
      return {
        title: institution || 'Institution',
        subtitle: [program, status].filter(Boolean).join(' · '),
      }
    },
  },
})

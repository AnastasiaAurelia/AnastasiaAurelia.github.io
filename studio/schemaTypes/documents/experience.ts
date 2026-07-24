import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons/Users'

export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isCurrent',
      title: 'Current role',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
      hidden: ({ document }) => Boolean(document?.isCurrent),
      validation: (Rule) =>
        Rule.custom((endDate, context) => {
          const document = context.document as { isCurrent?: boolean; startDate?: string } | undefined
          const { isCurrent, startDate } = document ?? {}
          if (isCurrent) return true
          if (!endDate) return 'Required unless this is marked as a current role'
          if (startDate && typeof endDate === 'string' && endDate < (startDate as string)) {
            return 'End date cannot be earlier than the start date'
          }
          return true
        }),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'achievements',
      title: 'Achievements',
      type: 'array',
      description: 'One entry per achievement, rather than a single paragraph.',
      of: [{ type: 'string' }],
      validation: (Rule) =>
        Rule.custom((items) => {
          if (!items) return true
          const hasEmpty = (items as string[]).some((item) => !item || !item.trim())
          return hasEmpty ? 'Achievement entries cannot be empty' : true
        }),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 0,
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: 'visible',
      title: 'Visible on site',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: { company: 'company', role: 'role', startDate: 'startDate', endDate: 'endDate', isCurrent: 'isCurrent' },
    prepare({ company, role, startDate, endDate, isCurrent }) {
      const range = `${startDate ?? '?'} – ${isCurrent ? 'Present' : (endDate ?? '?')}`
      return {
        title: `${role || 'Role'} · ${company || 'Company'}`,
        subtitle: range,
      }
    },
  },
})

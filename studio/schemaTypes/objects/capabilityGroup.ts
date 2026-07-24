import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'capabilityGroup',
  title: 'Capability group',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'capabilities',
      title: 'Capabilities',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Optional short list of specific capabilities within this group.',
      validation: (Rule) =>
        Rule.custom((items) => {
          if (!items) return true
          const hasEmpty = (items as string[]).some((item) => !item || !item.trim())
          return hasEmpty ? 'Capability entries cannot be empty' : true
        }),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
})

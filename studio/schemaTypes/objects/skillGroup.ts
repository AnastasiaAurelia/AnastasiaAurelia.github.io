import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'skillGroup',
  title: 'Skill group',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom((items) => {
            if (!items) return true
            const hasEmpty = (items as string[]).some((item) => !item || !item.trim())
            return hasEmpty ? 'Skill entries cannot be empty' : true
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
    select: { title: 'title', skills: 'skills' },
    prepare({ title, skills }) {
      return {
        title: title || 'Skill group',
        subtitle: Array.isArray(skills) ? skills.join(', ') : undefined,
      }
    },
  },
})

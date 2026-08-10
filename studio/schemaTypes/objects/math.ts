import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'math', title: 'Math', type: 'object',
  fields: [
    defineField({ name: 'latex', title: 'LaTeX', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: 'display', title: 'Display equation', type: 'boolean', initialValue: true }),
    defineField({ name: 'databaseDefinition', title: 'Database-field definition', type: 'string' }),
  ],
  preview: { select: { title: 'latex', display: 'display' }, prepare: ({ title, display }) => ({ title, subtitle: display ? 'Display math' : 'Inline math' }) },
})

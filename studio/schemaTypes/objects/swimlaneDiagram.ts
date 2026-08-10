import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'swimlaneDiagram',
  title: 'Swimlane diagram',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Accessible title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 2 }),
    defineField({
      name: 'lanes', title: 'Lanes', type: 'array', validation: (Rule) => Rule.required().min(2),
      of: [defineArrayMember({
        name: 'swimlane', type: 'object',
        fields: [
          defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({
            name: 'nodes', type: 'array', validation: (Rule) => Rule.required().min(1),
            of: [defineArrayMember({
              name: 'swimlaneNode', type: 'object',
              fields: [
                defineField({ name: 'label', type: 'string', validation: (Rule) => Rule.required() }),
                defineField({ name: 'detail', type: 'text', rows: 3 }),
                defineField({ name: 'state', type: 'string', options: { list: ['process', 'decision', 'pending', 'blocked', 'success'] }, initialValue: 'process' }),
                defineField({ name: 'transitions', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
              ],
              preview: { select: { title: 'label', subtitle: 'state' } },
            })],
          }),
        ],
        preview: { select: { title: 'name' } },
      })],
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
})

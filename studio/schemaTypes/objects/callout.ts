import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'callout', title: 'Callout', type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
    defineField({ name: 'tone', title: 'Tone', type: 'string', options: { list: ['info', 'warning', 'success'] }, initialValue: 'info' }),
  ],
})

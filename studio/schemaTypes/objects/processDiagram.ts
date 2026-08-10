import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'processDiagram', title: 'Process diagram', type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Accessible title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'variant', title: 'Variant', type: 'string', options: { list: ['pipeline', 'timeline'] }, initialValue: 'pipeline' }),
    defineField({ name: 'steps', title: 'Steps', type: 'array', of: [defineArrayMember({ type: 'object', name: 'processStep', fields: [defineField({ name: 'label', type: 'string' }), defineField({ name: 'field', type: 'string' })] })], validation: (Rule) => Rule.required().min(2) }),
    defineField({ name: 'relationships', title: 'Relationships', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'warning', title: 'Warning', type: 'string' }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
})

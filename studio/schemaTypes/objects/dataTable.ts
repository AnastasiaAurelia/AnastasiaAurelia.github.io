import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'dataTable', title: 'Table', type: 'object',
  fields: [
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    defineField({ name: 'headers', title: 'Headers', type: 'array', of: [defineArrayMember({ type: 'string' })], validation: (Rule) => Rule.required().min(1) }),
    defineField({ name: 'rows', title: 'Rows', type: 'array', of: [defineArrayMember({ type: 'object', name: 'tableRow', fields: [defineField({ name: 'cells', title: 'Cells', type: 'array', of: [defineArrayMember({ type: 'string' })] })] })] }),
  ],
})

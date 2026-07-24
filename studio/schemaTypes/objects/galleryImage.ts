import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'galleryImage',
  title: 'Gallery image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Required for every image — describe what it shows.',
      validation: (Rule) => Rule.required().error('Alt text is required for every gallery image.'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'label',
      title: 'Display label',
      type: 'string',
      description: 'Optional short label, e.g. "Before" / "After" or "Dashboard view".',
    }),
  ],
  preview: {
    select: { media: 'asset', caption: 'caption', label: 'label', alt: 'alt' },
    prepare({ media, caption, label, alt }) {
      return {
        title: label || caption || alt || 'Gallery image',
        media,
      }
    },
  },
})

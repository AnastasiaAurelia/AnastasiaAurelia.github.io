import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons/Image'

const LAYOUTS = [
  { title: 'Normal (reading column)', value: 'normal' },
  { title: 'Wide', value: 'wide' },
  { title: 'Full width', value: 'full' },
]

/**
 * The inline image block for `article.body`. A distinct type from the
 * plain `standardImageBlock` used by `project.content` — articles need
 * layout variants and optional credit, which project case studies
 * don't — but it's an individual Portable Text array member exactly
 * like any other block, so editors insert and reorder it freely
 * anywhere in the body: before the first paragraph, mid-article, or
 * at the end. Never a separate gallery bolted on below the text.
 */
export default defineType({
  name: 'articleImage',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Required — describe what the image shows.',
      validation: (Rule) => Rule.required().error('Alt text is required for every image.'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'source',
      title: 'Source / credit',
      type: 'string',
      description: 'Optional attribution text, e.g. "Photo: Jane Doe" or "Diagram adapted from…".',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      description: 'Optional link the credit text points to.',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: LAYOUTS, layout: 'radio' },
      initialValue: 'normal',
    }),
  ],
  preview: {
    select: { media: 'asset', caption: 'caption', alt: 'alt', layout: 'layout' },
    prepare({ media, caption, alt, layout }) {
      return {
        title: caption || alt || 'Image',
        subtitle: layout && layout !== 'normal' ? `Layout: ${layout}` : undefined,
        media,
      }
    },
  },
})

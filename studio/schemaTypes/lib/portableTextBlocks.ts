import { defineArrayMember, defineField } from 'sanity'
import { LinkIcon } from '@sanity/icons/Link'

/**
 * The standard rich-text configuration shared by every Portable Text
 * field in this schema (`project.content`, `siteSettings.aboutContent`).
 * Centralized so the two never quietly drift apart.
 */
export const standardBlockStyle = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H2', value: 'h2' },
    { title: 'H3', value: 'h3' },
    { title: 'Quote', value: 'blockquote' },
  ],
  lists: [
    { title: 'Bullet', value: 'bullet' },
    { title: 'Numbered', value: 'number' },
  ],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
      { title: 'Inline code', value: 'code' },
    ],
    annotations: [
      defineField({
        name: 'link',
        title: 'Link',
        type: 'object',
        icon: LinkIcon,
        fields: [
          defineField({
            name: 'href',
            title: 'URL',
            type: 'url',
            validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https', 'mailto'], allowRelative: false }),
          }),
          defineField({
            name: 'newTab',
            title: 'Open in new tab',
            type: 'boolean',
            initialValue: true,
          }),
        ],
      }),
    ],
  },
})

export const standardImageBlock = defineArrayMember({
  type: 'image',
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
  ],
})

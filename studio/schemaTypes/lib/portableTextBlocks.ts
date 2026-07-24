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
            name: 'linkType',
            title: 'Link type',
            type: 'string',
            options: {
              list: [
                { title: 'External URL', value: 'external' },
                { title: 'Internal path', value: 'internal' },
              ],
              layout: 'radio',
              direction: 'horizontal',
            },
            initialValue: 'external',
          }),
          defineField({
            name: 'href',
            title: 'URL',
            type: 'url',
            hidden: ({ parent }) => (parent as { linkType?: string })?.linkType === 'internal',
            validation: (Rule) =>
              Rule.uri({ scheme: ['http', 'https', 'mailto'], allowRelative: false }).custom((value, context) => {
                const parent = context.parent as { linkType?: string } | undefined
                if (parent?.linkType === 'internal') return true
                return value ? true : 'Required for an external link'
              }),
          }),
          defineField({
            name: 'internalPath',
            title: 'Internal path',
            type: 'string',
            description: 'A relative path on this site, e.g. /work/researchlens or /articles/my-post',
            hidden: ({ parent }) => (parent as { linkType?: string })?.linkType !== 'internal',
            validation: (Rule) =>
              Rule.custom((value, context) => {
                const parent = context.parent as { linkType?: string } | undefined
                if (parent?.linkType !== 'internal') return true
                if (!value) return 'Required for an internal link'
                return value.startsWith('/') ? true : 'Must start with / (a path relative to this site)'
              }),
          }),
          defineField({
            name: 'newTab',
            title: 'Open in new tab',
            type: 'boolean',
            initialValue: true,
            hidden: ({ parent }) => (parent as { linkType?: string })?.linkType === 'internal',
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

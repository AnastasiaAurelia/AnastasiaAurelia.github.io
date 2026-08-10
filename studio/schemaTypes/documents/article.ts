import { defineArrayMember, defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons/Document'
import { standardBlockStyle } from '../lib/portableTextBlocks'

const CATEGORIES = [
  'Applied AI',
  'Product Management',
  'Computer Vision',
  'Computer Vision / Data Validation',
  'Data Validation / Systems Reconciliation',
  'Computer Vision / Performance Diagnostics',
  'Research',
  'Agentic Workflows',
  'Career',
  'Other',
]

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'body', title: 'Body' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'Controls the article URL: /articles/<slug>. Keep stable once published — existing links depend on it.',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: async (value, context) => {
          const { document, getClient } = context
          const client = getClient({ apiVersion: '2025-01-01' })
          const id = document?._id.replace(/^drafts\./, '')
          const params = { draft: `drafts.${id}`, published: id, value }
          const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $value][0]._id)`
          return client.fetch(query, params)
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Shown on article cards and used as the default meta description. Keep it under ~240 characters.',
      validation: (Rule) => Rule.required().max(240),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Required — describe what the image shows.',
          validation: (Rule) => Rule.required().error('Alt text is required for the cover image.'),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAtOverride',
      title: 'Updated at (override)',
      type: 'datetime',
      group: 'content',
      description: 'Only set this when the article was substantively revised and you want that date shown explicitly.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      validation: (Rule) =>
        Rule.custom((tags) => {
          if (!tags) return true
          const hasEmpty = (tags as string[]).some((tag) => !tag || !tag.trim())
          return hasEmpty ? 'Tags cannot be empty strings' : true
        }),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: { list: CATEGORIES },
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'content',
      description: 'Shown in the homepage Latest Writing section and the Writing index\'s featured area.',
      initialValue: false,
    }),
    defineField({ name: 'role', title: 'Role', type: 'string', group: 'content' }),
    defineField({ name: 'projectType', title: 'Project type', type: 'string', group: 'content' }),
    defineField({ name: 'system', title: 'System', type: 'string', group: 'content' }),
    defineField({ name: 'coreQuestion', title: 'Core question', type: 'string', group: 'content' }),
    defineField({ name: 'evidence', title: 'Evidence', type: 'string', group: 'content' }),
    defineField({ name: 'status', title: 'Status', type: 'string', group: 'content' }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'body',
      description:
        'The full article. Insert an "Image" block anywhere — before the first paragraph, between paragraphs, or at the end — and reorder freely by dragging.',
      of: [
        standardBlockStyle,
        defineArrayMember({ type: 'articleImage' }),
        defineArrayMember({ type: 'code', title: 'Code block' }),
        defineArrayMember({ type: 'metricHighlight' }),
        defineArrayMember({ type: 'decisionCallout' }),
        defineArrayMember({ type: 'architectureDiagram' }),
        defineArrayMember({ type: 'math' }),
        defineArrayMember({ type: 'dataTable' }),
        defineArrayMember({ type: 'callout' }),
        defineArrayMember({ type: 'processDiagram' }),
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
      description: 'Overrides the default title used in <title> and Open Graph tags.',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      group: 'seo',
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'socialShareImage',
      title: 'Social share image',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) => Rule.required().error('Alt text is required for the social share image.'),
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Featured, then newest first',
      name: 'featuredThenPublishedDesc',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'publishedAt', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      category: 'category',
      publishedAt: 'publishedAt',
    },
    prepare({ title, media, category, publishedAt }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : null
      return {
        title: title || 'Untitled article',
        subtitle: [category, date].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})

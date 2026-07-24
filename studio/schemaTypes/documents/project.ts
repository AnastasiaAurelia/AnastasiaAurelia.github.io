import { defineArrayMember, defineField, defineType } from 'sanity'
import { CaseIcon } from '@sanity/icons/Case'
import { standardBlockStyle, standardImageBlock } from '../lib/portableTextBlocks'

const PROJECT_TYPES = [
  'Computer Vision',
  'Applied AI',
  'Research Intelligence',
  'Agentic Workflow',
  'Product Management',
  'Other',
]

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: CaseIcon,
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'caseStudy', title: 'Case study' },
    { name: 'links', title: 'Links' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'overview',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'overview',
      description: 'Controls the project-detail URL: /work/<slug>. Keep stable once published — existing links depend on it.',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: async (value, context) => {
          const { document, getClient } = context
          const client = getClient({ apiVersion: '2024-01-01' })
          const id = document?._id.replace(/^drafts\./, '')
          const params = { draft: `drafts.${id}`, published: id, value }
          const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $value][0]._id)`
          return client.fetch(query, params)
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortSummary',
      title: 'Short summary',
      type: 'text',
      group: 'overview',
      rows: 3,
      description: 'Shown on work cards and in the work index. Keep it scannable.',
      validation: (Rule) => Rule.required().max(280),
    }),
    defineField({
      name: 'projectType',
      title: 'Project type',
      type: 'string',
      group: 'overview',
      options: { list: PROJECT_TYPES },
      validation: (Rule) =>
        Rule.required().custom((value) =>
          value && !PROJECT_TYPES.includes(value) ? `Must be one of: ${PROJECT_TYPES.join(', ')}` : true,
        ),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'overview',
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
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'overview',
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
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'overview',
      description: 'Shown in the homepage Selected Work section.',
      initialValue: false,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      group: 'overview',
      description: 'Lower numbers appear first.',
      initialValue: 0,
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: 'content',
      title: 'Case study content',
      type: 'array',
      group: 'caseStudy',
      description:
        'The full case study — Overview, Problem, Ownership, Decisions, Trade-offs, Lessons learned, etc. Use "Project section" blocks to mark each beat, and the decision/metric/diagram blocks where they fit, rather than forcing every beat into its own field.',
      of: [
        standardBlockStyle,
        standardImageBlock,
        defineArrayMember({ type: 'code', title: 'Code block' }),
        defineArrayMember({ type: 'projectSection' }),
        defineArrayMember({ type: 'metricHighlight' }),
        defineArrayMember({ type: 'decisionCallout' }),
        defineArrayMember({ type: 'architectureDiagram' }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'caseStudy',
      of: [defineArrayMember({ type: 'galleryImage' })],
    }),
    defineField({
      name: 'externalUrl',
      title: 'Live product URL',
      type: 'url',
      group: 'links',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'githubUrl',
      title: 'Repository URL',
      type: 'url',
      group: 'links',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
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
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      projectType: 'projectType',
      featured: 'featured',
    },
    prepare({ title, media, projectType, featured }) {
      const bits = [projectType, featured ? 'Featured' : null].filter(Boolean)
      return {
        title: title || 'Untitled project',
        subtitle: bits.join(' · '),
        media,
      }
    },
  },
})

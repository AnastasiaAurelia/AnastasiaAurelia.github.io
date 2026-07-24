import { defineArrayMember, defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons/Cog'
import { standardBlockStyle, standardImageBlock } from '../lib/portableTextBlocks'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Singleton — exactly one document of this type should ever exist.
 * Enforced in `structure/structure.ts` (a fixed link, not a list, so
 * there's no "create new" entry point) and in `sanity.config.ts`
 * (create/duplicate actions filtered out for this type).
 */
export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'homepage', title: 'Homepage', default: true },
    { name: 'about', title: 'About' },
    { name: 'contact', title: 'Contact' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'homepageHeadline',
      title: 'Homepage headline',
      type: 'string',
      group: 'homepage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'homepageSupportingCopy',
      title: 'Homepage supporting copy',
      type: 'text',
      group: 'homepage',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'credibilityPoints',
      title: 'Credibility points',
      type: 'array',
      group: 'homepage',
      of: [defineArrayMember({ type: 'credibilityPoint' })],
    }),
    defineField({
      name: 'capabilityGroups',
      title: 'Capability groups',
      type: 'array',
      group: 'homepage',
      of: [defineArrayMember({ type: 'capabilityGroup' })],
    }),
    defineField({
      name: 'aboutContent',
      title: 'About content',
      type: 'array',
      group: 'about',
      of: [standardBlockStyle, standardImageBlock],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      group: 'contact',
      validation: (Rule) =>
        Rule.required().regex(EMAIL_PATTERN, { name: 'email' }).error('Enter a valid email address'),
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'contact',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      group: 'contact',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'resumeUrl',
      title: 'Resume URL',
      type: 'url',
      group: 'contact',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'defaultSeoTitle',
      title: 'Default SEO title',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'defaultSeoDescription',
      title: 'Default SEO description',
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
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})

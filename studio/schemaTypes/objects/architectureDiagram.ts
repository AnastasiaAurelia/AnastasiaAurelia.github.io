import { defineField, defineType } from 'sanity'
import { ProjectsIcon } from '@sanity/icons/Projects'

/** An in-body architecture/workflow diagram — distinct from a plain
 * inline image because it always carries a caption and alt text is
 * mandatory, never optional, given how load-bearing these images are
 * for explaining a system. */
export default defineType({
  name: 'architectureDiagram',
  title: 'Architecture / workflow diagram',
  type: 'object',
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Diagram',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe what the diagram shows — required for screen-reader users.',
      validation: (Rule) => Rule.required().error('Alt text is required for every diagram.'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'explanation',
      title: 'Explanation',
      type: 'text',
      rows: 3,
      description: 'Optional prose expanding on what the diagram shows.',
    }),
  ],
  preview: {
    select: { media: 'image', caption: 'caption', alt: 'alt' },
    prepare({ media, caption, alt }) {
      return {
        title: caption || alt || 'Architecture diagram',
        subtitle: 'Architecture / workflow diagram',
        media,
      }
    },
  },
})

import { defineArrayMember, defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

/** A sequence-aware, in-body evidence gallery. */
export default defineType({
  name: 'imageGallery',
  title: 'Image gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryImage' })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { images: 'images' },
    prepare({ images }) {
      const count = Array.isArray(images) ? images.length : 0
      return { title: `${count} image${count === 1 ? '' : 's'}`, subtitle: 'Image gallery', media: images?.[0] }
    },
  },
})

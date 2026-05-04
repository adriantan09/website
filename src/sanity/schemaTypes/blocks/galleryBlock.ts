import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'galleryBlock',
  title: 'Image Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      initialValue: 'grid-2',
      options: {
        list: [
          { title: 'Single (centered, max-width)', value: 'single' },
          { title: 'Two-up grid', value: 'grid-2' },
          { title: 'Three-up grid', value: 'grid-3' },
          { title: 'Full-bleed (edge to edge)', value: 'full-bleed' },
          { title: 'Masonry (mixed heights)', value: 'masonry' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'caption', type: 'string', title: 'Per-image Caption' },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      layout: 'layout',
      images: 'images',
      caption: 'caption',
    },
    prepare({ layout, images, caption }) {
      const count = Array.isArray(images) ? images.length : 0
      return {
        title: caption || `Gallery (${layout})`,
        subtitle: `${count} image${count === 1 ? '' : 's'}`,
        media: Array.isArray(images) ? images[0] : undefined,
      }
    },
  },
})

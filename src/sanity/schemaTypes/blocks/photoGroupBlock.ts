import { defineField, defineType } from 'sanity'

/**
 * A flexible photo group block that auto-arranges any number of images into
 * a justified flow (Flickr/500px-style rows of varying heights but constant
 * row width). For panoramas/hero shots, set `presentation` to "full-bleed".
 *
 * Image dimensions are read from Sanity's asset metadata, so the layout is
 * determined automatically — no manual sizing needed in Studio.
 */
export default defineType({
  name: 'photoGroup',
  title: 'Photo Group',
  type: 'object',
  fields: [
    defineField({
      name: 'presentation',
      title: 'Presentation',
      type: 'string',
      initialValue: 'justified',
      options: {
        list: [
          { title: 'Justified flow (auto)', value: 'justified' },
          { title: 'Full-bleed (edge to edge, stacked)', value: 'full-bleed' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rowHeight',
      title: 'Target row height (px)',
      type: 'number',
      description: 'Approximate target height for each row in the justified layout. Larger = fewer images per row.',
      initialValue: 320,
      hidden: ({ parent }) => parent?.presentation === 'full-bleed',
      validation: (Rule) => Rule.min(120).max(800),
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
      caption: 'caption',
      media: 'images.0',
    },
    prepare({ caption, media }) {
      return {
        title: caption || 'Photo Group',
        media,
      }
    },
  },
})

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'activity',
  title: 'Activity',
  type: 'document',
  description:
    'An activity (hike, ride, trip…). Activities can optionally contain ' +
    'other activities — e.g. a "Japan" activity that contains rides in ' +
    'Hokkaido and Kyoto. Child activity URLs are nested under the parent ' +
    '(e.g. /japan/hokkaido).',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description:
        'Optional. Container activities (those with child activities) ' +
        'do not need a category. Standalone activities should set one.',
      options: {
        list: [
          { title: 'Hiking', value: 'hiking' },
          { title: 'Cycling', value: 'cycling' },
          { title: 'Travel', value: 'travel' },
        ],
      },
    }),
    defineField({
      name: 'subCategory',
      title: 'Sub Category',
      type: 'string',
      hidden: ({ document }) => document?.category !== 'cycling',
      options: {
        list: [
          { title: 'Road', value: 'road' },
          { title: 'Gravel', value: 'gravel' },
          { title: 'Bikepacking/Touring', value: 'bikepacking' },
        ],
      },
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location (optional)',
      type: 'string',
      description: 'e.g. "Franz Josef, New Zealand"',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'childActivities',
      title: 'Child activities (in display order)',
      description:
        'If this activity is a "container" (e.g. a multi-day trip or a ' +
        'themed grouping), add the child activities here. Their URLs will ' +
        'be nested under this activity\'s slug.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'activity' }] }],
      validation: (Rule) =>
        Rule.unique().error('Each activity can only be referenced once.'),
    }),
    defineField({
      name: 'keyStats',
      title: 'Key Stats',
      description:
        'Shown as a row of label/value pairs beneath the hero image. ' +
        'E.g. { label: "Distance", value: "142 km" } or { label: "Date", value: "Apr 25, 2026" }. ' +
        'Add as many as you like — they will display in the order entered.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string', description: 'e.g. Distance, Date, Elevation' },
            { name: 'value', title: 'Value', type: 'string', description: 'e.g. 142 km, Apr 25 2026, 2400 m' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      description:
        'Interleave text, section headings, image galleries, map embeds, and pull quotes in any order.',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'sectionHeadingBlock' },
        { type: 'photoGroup' },
        { type: 'mapEmbedBlock' },
        { type: 'pullQuoteBlock' },
        { type: 'dividerBlock' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'mainImage',
      childCount: 'childActivities.length',
    },
    prepare({ title, category, media, childCount }) {
      const subtitleParts = [
        category,
        childCount ? `${childCount} child activit${childCount === 1 ? 'y' : 'ies'}` : null,
      ].filter(Boolean)
      return { title, subtitle: subtitleParts.join(' • '), media }
    },
  },
})

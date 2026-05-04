import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'activity',
  title: 'Activity',
  type: 'document',
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
      options: {
        list: [
          { title: 'Hiking', value: 'hiking' },
          { title: 'Cycling', value: 'cycling' },
          { title: 'Travel', value: 'travel' },
        ],
      },
      validation: (Rule) => Rule.required(),
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
      name: 'excerpt',
      title: 'Excerpt / Subtitle',
      type: 'text',
      rows: 3,
      description: 'Short blurb shown on cards and at top of detail page.',
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
      name: 'stats',
      title: 'Statistics',
      type: 'object',
      fields: [
        { name: 'distance', title: 'Total Distance (km)', type: 'number' },
        { name: 'elevation', title: 'Total Elevation (m)', type: 'number' },
        { name: 'duration', title: 'Total Duration', type: 'string', description: 'e.g. 5h 30m' },
        { name: 'days', title: 'Number of Days', type: 'number', initialValue: 1 },
      ],
    }),
    defineField({
      name: 'multiDayBreakdown',
      title: 'Multi-day Breakdown',
      type: 'array',
      hidden: ({ document }) => ((document?.stats as any)?.days ?? 0) <= 1,
      of: [
        {
          type: 'object',
          fields: [
            { name: 'day', title: 'Day Number', type: 'number' },
            { name: 'distance', title: 'Distance (km)', type: 'number' },
            { name: 'duration', title: 'Duration', type: 'string' },
            { name: 'notes', title: 'Daily Notes', type: 'string' },
            { name: 'campSite', title: 'Camp Site / Stop', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'embedUrl',
      title: 'Map Embed URL',
      type: 'url',
      description: 'Strava, RideWithGPS, AllTrails, etc. (Share/Embed link)',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      description:
        'Interleave text, section headings, image galleries, and pull quotes in any order.',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'sectionHeadingBlock' },
        { type: 'galleryBlock' },
        { type: 'pullQuoteBlock' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'mainImage',
    },
    prepare(selection) {
      const { category } = selection
      return { ...selection, subtitle: category }
    },
  },
})

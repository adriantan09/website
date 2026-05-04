import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  description:
    'A trip or themed grouping of activities (e.g. "New Zealand 2024"). ' +
    'Activities can mix categories — hiking, cycling, travel.',
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
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "South Island, New Zealand"',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Short blurb shown on cards and at top of detail page.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alternative Text' }],
    }),
    defineField({
      name: 'activities',
      title: 'Activities (in display order)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'activity' }] }],
      validation: (Rule) =>
        Rule.unique().error('Each activity can only be referenced once.'),
    }),
    defineField({
      name: 'body',
      title: 'Body (optional intro / interludes)',
      description:
        'Optional long-form intro and between-activity prose using the same ' +
        'block types as activities (text, headings, galleries, pull quotes).',
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
      location: 'location',
      media: 'coverImage',
      activities: 'activities',
    },
    prepare({ title, location, media, activities }) {
      const count = Array.isArray(activities) ? activities.length : 0
      const subtitleParts = [location, `${count} activit${count === 1 ? 'y' : 'ies'}`].filter(Boolean)
      return { title, subtitle: subtitleParts.join(' • '), media }
    },
  },
})

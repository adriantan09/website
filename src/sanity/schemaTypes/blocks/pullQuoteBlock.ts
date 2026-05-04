import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pullQuoteBlock',
  title: 'Pull Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution (optional)',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'quote', subtitle: 'attribution' },
  },
})

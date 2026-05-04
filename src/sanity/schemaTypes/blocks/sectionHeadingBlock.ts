import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'sectionHeadingBlock',
  title: 'Section Heading',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading (optional)',
      type: 'string',
    }),
    defineField({
      name: 'anchor',
      title: 'Anchor / ID (optional)',
      type: 'string',
      description: 'URL slug for jump links, e.g. "the-summit"',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'subheading' },
  },
})

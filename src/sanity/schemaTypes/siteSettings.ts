import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
    }),
    defineField({
      name: 'homeHeadline',
      title: 'Home Headline',
      type: 'text',
      rows: 3,
      description:
        'Big H1 shown at the top of the home page. The portion wrapped in {{muted}}…{{/muted}} renders in a softer, muted colour. ' +
        'e.g. "Exploring the outdoors through {{muted}}hiking, cycling, and photography.{{/muted}}"',
    }),
    defineField({
      name: 'homeIntro',
      title: 'Home Intro Paragraph',
      type: 'text',
      rows: 3,
      description: 'Short paragraph shown below the headline on the home page.',
    }),
    defineField({
      name: 'homePortfolio',
      title: 'Home Portfolio',
      description:
        'Curated photos displayed in the tessellated gallery on the home page. Drag to reorder — order here determines display order on the site.',
      type: 'array',
      of: [{ type: 'portfolioImage' }],
    }),
    defineField({
      name: 'authorBio',
      title: 'Author Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'authorImage',
      title: 'Author Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'github', title: 'GitHub URL', type: 'url' },
        { name: 'instagram', title: 'Instagram URL', type: 'url' },
        { name: 'linkedin', title: 'LinkedIn URL', type: 'url' },
      ],
    }),
  ],
})

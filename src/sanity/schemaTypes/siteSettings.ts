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
      name: 'homePortfolio',
      title: 'Home Portfolio',
      description:
        'Curated photos displayed in the tessellated gallery on the home page. Drag to reorder — order here determines display order on the site.',
      type: 'array',
      of: [{ type: 'portfolioImage' }],
    }),
    defineField({
      name: 'postsTitle',
      title: 'Posts Page Title',
      type: 'string',
      description:
        'Heading shown at the top of the /posts page. Defaults to "Posts" if empty.',
    }),
    defineField({
      name: 'postsDescription',
      title: 'Posts Page Description',
      type: 'text',
      rows: 2,
      description:
        'Short paragraph shown under the heading on the /posts page. Leave empty to hide.',
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

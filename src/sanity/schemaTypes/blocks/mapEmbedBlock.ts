import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'mapEmbedBlock',
  title: 'Map Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'html',
      title: 'Embed Code',
      type: 'text',
      rows: 4,
      description:
        'Paste the full <iframe> embed code from AllTrails, RideWithGPS, or any other provider. ' +
        'Get it from the "Share / Embed" option on the route page.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { html: 'html' },
    prepare({ html }) {
      // Extract the src URL from the iframe for a readable subtitle
      const match = (html as string)?.match(/src=["']([^"']+)["']/)
      const src = match ? match[1] : 'No embed code yet'
      return {
        title: 'Map Embed',
        subtitle: src,
      }
    },
  },
})

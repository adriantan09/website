import { defineField, defineType } from 'sanity'

/**
 * Named object type used as the array item for the `siteSettings.homePortfolio`
 * gallery. Wrapping the image in a named type (rather than using an inline
 * `{ type: 'image' }` array entry with custom fields) avoids a Studio bug in
 * Sanity 5.23 where `UploadProgress` crashes with
 * "Cannot read properties of undefined (reading 'name')" when an inline image
 * array item carries extra fields.
 */
export default defineType({
  name: 'portfolioImage',
  title: 'Portfolio Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
    }),
    defineField({
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
    }),
  ],
})

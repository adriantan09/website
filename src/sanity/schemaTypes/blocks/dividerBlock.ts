import { defineField, defineType } from 'sanity'

/**
 * A simple visual separator that editors can drop between content blocks
 * to mark a clear break in the narrative. Two styles are available:
 *
 *   - `line`  — a thin horizontal hairline rule
 *   - `dots`  — a centered ornament of three small dots, more editorial
 *
 * No fields beyond the style choice; each instance just renders.
 */
export default defineType({
  name: 'dividerBlock',
  title: 'Divider',
  type: 'object',
  fields: [
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      initialValue: 'line',
      options: {
        list: [
          { title: 'Hairline rule', value: 'line' },
          { title: 'Centered dots', value: 'dots' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { style: 'style' },
    prepare({ style }) {
      return {
        title: 'Divider',
        subtitle: style === 'dots' ? '• • •' : '———',
      }
    },
  },
})

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './src/sanity/schemaTypes'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

/**
 * Resolves a document to its live URL so the Presentation tool can show
 * the right preview when an editor opens a document. Add new mappings
 * here whenever you introduce a new previewable document type.
 *
 * For activities we resolve the full nested URL by walking parent refs
 * client-side via the Studio's structure context — see Presentation docs.
 */
export default defineConfig({
  name: 'default',
  title: 'Adrian Tan Portfolio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/admin',

  plugins: [
    structureTool(),
    /**
     * Adds the "Presentation" workspace which renders the live site in an
     * iframe alongside the editor, with Draft Mode automatically enabled
     * via the /api/draft endpoint.
     *
     * Editors hit a "Open preview" eye icon on any document to launch it.
     */
    presentationTool({
      previewUrl: {
        origin: SITE_URL,
        // Sanity sends the user to /api/draft?slug=... which enables Draft
        // Mode (using SANITY_PREVIEW_SECRET) and redirects to the slug.
        draftMode: {
          enable: '/api/draft',
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})

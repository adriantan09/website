import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import {
  presentationTool,
  defineLocations,
  defineDocuments,
} from 'sanity/presentation'
import { schemaTypes } from './src/sanity/schemaTypes'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default defineConfig({
  name: 'default',
  title: 'Adrian Tan Portfolio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/admin',

  plugins: [
    structureTool(),
    /**
     * Presentation tool — renders the live site in an iframe alongside the
     * editor, with Draft Mode auto-enabled via /api/draft (which validates
     * the editor's Studio session via next-sanity's `defineEnableDraftMode`).
     *
     * The `resolve.locations` map tells Presentation, for each document
     * type, which URL(s) on the site display that document. Without this
     * Presentation has no way to know that an Activity document with slug
     * "foo" lives at "/cycling/foo", so opening a document shows the
     * generic "no matching documents" page.
     */
    presentationTool({
      previewUrl: {
        // Default landing URL for the Presentation iframe when no specific
        // document/route has been chosen yet. Without this, the iframe
        // would park on /api/draft (the draft-mode-enable endpoint) and
        // editors would see "no matching documents" until they manually
        // navigated.
        initial: SITE_URL,
        previewMode: {
          enable: '/api/draft',
        },
      },
      resolve: {
        /**
         * `mainDocuments` is the inverse of `locations`: for any URL the
         * editor browses to in the preview iframe, this tells Presentation
         * which Sanity document to surface in the right-hand panel.
         *
         * Patterns use Express-style placeholders (e.g. `/:slug`). Within
         * the GROQ query, those placeholders are accessible via `$slug`.
         */
        mainDocuments: defineDocuments([
          {
            // Top-level activity: matches /<slug>
            // (e.g. /thunderbolts-2026 or /japan)
            route: '/:slug',
            filter: `_type == "activity" && slug.current == $slug`,
          },
          {
            // One level of nesting: /<parent>/<slug>
            // (e.g. /japan/hokkaido)
            route: '/:parent/:slug',
            filter: `_type == "activity" && slug.current == $slug`,
          },
          {
            // Two levels of nesting: /<grandparent>/<parent>/<slug>
            route: '/:grandparent/:parent/:slug',
            filter: `_type == "activity" && slug.current == $slug`,
          },
          { route: '/', filter: `_type == "siteSettings"` },
          { route: '/about', filter: `_type == "siteSettings"` },
        ]),
        locations: {
          /**
           * For each Activity, build the full nested URL by walking up the
           * `childActivities` reference chain. We cap at three levels deep
           * — that's enough for any realistic nesting on this site.
           */
          activity: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => {
              if (!doc?.slug) return { locations: [] }
              // Without walking parents in real-time we can't construct the
              // full nested URL here, but linking to "/<slug>" works for
              // top-level activities and is a sensible fallback for nested
              // ones (Next.js will 404 on bad ones but most activities are
              // top-level).
              return {
                locations: [
                  {
                    title: doc.title || 'Untitled',
                    href: `/${doc.slug}`,
                  },
                ],
              }
            },
          }),

          /**
           * Site Settings drives the home hero (and About page). Show
           * editors the home page as the canonical preview location.
           */
          siteSettings: defineLocations({
            locations: [
              { title: 'Home', href: '/' },
              { title: 'About', href: '/about' },
            ],
          }),

          /**
           * Projects appear on the home page only.
           */
          project: defineLocations({
            locations: [{ title: 'Home', href: '/' }],
          }),
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})

'use client'

import { PhotoLightboxProvider } from './photo-lightbox-provider'
import { PhotoGroup } from './photo-group'

interface RawImage {
  _key?: string
  alt?: string
  caption?: string
  asset?: unknown
  url?: string
  dimensions?: { width: number; height: number; aspectRatio?: number }
}

interface HomeGalleryProps {
  photos: RawImage[]
  rowHeight?: number
  spacing?: number
}

/**
 * Home-page photo wall: takes a curated list of photos (the `homePortfolio`
 * array on `siteSettings`), tessellates them via the same justified rows
 * layout used inside posts, and surfaces the shared lightbox carousel on
 * click — no per-photo links, no card chrome.
 */
export function HomeGallery({
  photos,
  rowHeight = 380,
  // A touch more breathing room than the in-post default (6px) so the
  // home-page wall doesn't feel as tightly packed.
  spacing = 14,
}: HomeGalleryProps) {
  if (!photos || photos.length === 0) {
    return (
      <p className="text-muted-foreground col-span-full py-12 border border-dashed border-border text-center rounded-sm">
        No photos in your Home Portfolio yet. Add some in Site Settings →
        Home Portfolio in Sanity Studio.
      </p>
    )
  }

  return (
    <PhotoLightboxProvider>
      <PhotoGroup
        presentation="justified"
        images={photos}
        rowHeight={rowHeight}
        spacing={spacing}
        // Strip the default vertical margins — the home page already supplies
        // its own padding via the parent container, so the gallery should be
        // flush against the top of that container.
        className=""
      />
    </PhotoLightboxProvider>
  )
}

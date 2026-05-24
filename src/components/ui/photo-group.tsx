'use client'

import { useMemo, useState, useEffect } from 'react'
import { RowsPhotoAlbum } from 'react-photo-album'
import 'react-photo-album/rows.css'
import { urlFor } from '@/sanity/client'
import { useGroupLightbox } from './photo-lightbox-provider'

export type PhotoGroupPresentation = 'justified' | 'full-bleed'

interface SanityImage {
  _key?: string
  alt?: string
  caption?: string
  asset?: unknown
  url?: string
  dimensions?: { width: number; height: number; aspectRatio?: number }
}

interface PhotoGroupProps {
  presentation: PhotoGroupPresentation
  images: SanityImage[]
  caption?: string
  rowHeight?: number
  /**
   * Optional override for the outer <figure> classes. Pass `''` (empty) to
   * strip the default vertical margins when the group is rendered as a
   * standalone gallery (e.g. on the home page) rather than between body
   * sections in a post.
   */
  className?: string
}

/**
 * Renders any number of photos in either:
 *   - "justified" — Flickr/500px-style row layout where every row has uniform
 *     height and fills the container width, regardless of image count.
 *   - "full-bleed" — edge-to-edge stacked at their natural aspect ratio.
 *
 * The lightbox is owned by the page-wide PhotoLightboxProvider so the user
 * can scroll through every photo on the page (across all photo groups) in
 * a single continuous carousel rather than being trapped in one group.
 */
export function PhotoGroup({
  presentation,
  images,
  caption,
  rowHeight = 320,
  className,
}: PhotoGroupProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const photos = useMemo(
    () =>
      images
        .map((img, i) => {
          const width = img.dimensions?.width ?? 1600
          const height = img.dimensions?.height ?? 1067
          const src = img.asset
            ? urlFor(img as any).width(1600).url()
            : img.url ?? ''
          return {
            src,
            width,
            height,
            alt: img.alt || '',
            caption: img.caption,
            key: img._key ?? `p-${i}`,
          }
        })
        .filter((p) => p.src),
    [images]
  )

  const lightboxSlides = useMemo(
    () =>
      images
        .map((img) => {
          const src = img.asset
            ? urlFor(img as any).width(2400).url()
            : img.url ?? ''
          return {
            src,
            alt: img.alt || '',
            description: img.caption,
          }
        })
        .filter((s) => s.src),
    [images]
  )

  const { openLocal } = useGroupLightbox(lightboxSlides)

  if (photos.length === 0) return null

  return (
    <figure
      className={
        className ??
        (presentation === 'full-bleed' ? 'my-16 md:my-24' : 'my-12 md:my-16')
      }
    >
      {presentation === 'full-bleed' ? (
        <FullBleedStack images={images} onClick={openLocal} />
      ) : mounted ? (
        <RowsPhotoAlbum
          photos={photos}
          targetRowHeight={rowHeight}
          spacing={6}
          onClick={({ index }) => openLocal(index)}
          render={{
            image: (props, { photo }) => (
              // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
              <img
                {...props}
                alt={photo.alt}
                className="rounded-2xl"
              />
            ),
          }}
        />
      ) : (
        // SSR placeholder — reserves vertical space so the layout doesn't
        // jump when the album hydrates and renders for real.
        <div
          aria-hidden
          style={{ height: rowHeight }}
          className="bg-muted/30 rounded-2xl"
        />
      )}

      {caption && (
        <figcaption className="mt-4 text-center text-xs text-muted-foreground italic px-4">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

function FullBleedStack({
  images,
  onClick,
}: {
  images: SanityImage[]
  onClick: (index: number) => void
}) {
  return (
    <div className="space-y-1 md:space-y-2">
      {images.map((image, index) => {
        const src = image.asset
          ? urlFor(image as any).width(2400).url()
          : image.url ?? ''
        const aspect =
          image.dimensions
            ? `${image.dimensions.width} / ${image.dimensions.height}`
            : '16 / 9'
        return (
          <button
            key={image._key || index}
            type="button"
            onClick={() => onClick(index)}
            className="block w-full cursor-zoom-in overflow-hidden bg-muted rounded-2xl"
            aria-label={image.alt || `Open photo ${index + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={image.alt || ''}
              loading="lazy"
              className="w-full h-auto block"
              style={{ aspectRatio: aspect, objectFit: 'cover' }}
            />
          </button>
        )
      })}
    </div>
  )
}

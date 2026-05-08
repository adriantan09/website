'use client'

import { useState, useMemo } from 'react'
import { RowsPhotoAlbum } from 'react-photo-album'
import 'react-photo-album/rows.css'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { urlFor } from '@/sanity/client'

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
}

/**
 * Renders any number of photos in either:
 *   - "justified" — Flickr/500px-style row layout where every row has uniform
 *     height and fills the container width, regardless of image count.
 *   - "full-bleed" — edge-to-edge stacked at their natural aspect ratio.
 *
 * Clicking any image opens a lightbox with keyboard/swipe navigation.
 * Zoom is intentionally disabled per design preference.
 */
export function PhotoGroup({
  presentation,
  images,
  caption,
  rowHeight = 320,
}: PhotoGroupProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1)

  const photos = useMemo(
    () =>
      images
        .map((img, i) => {
          const width = img.dimensions?.width ?? 1600
          const height = img.dimensions?.height ?? 1067
          // Mid-size for layout thumbnails; lightbox uses a larger src below.
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

  if (photos.length === 0) return null

  return (
    <figure className={presentation === 'full-bleed' ? 'my-16 md:my-24' : 'my-12 md:my-16'}>
      {presentation === 'full-bleed' ? (
        <FullBleedStack
          images={images}
          onClick={(i) => setLightboxIndex(i)}
        />
      ) : (
        <RowsPhotoAlbum
          photos={photos}
          targetRowHeight={rowHeight}
          spacing={6}
          onClick={({ index }) => setLightboxIndex(index)}
        />
      )}

      {caption && (
        <figcaption className="mt-4 text-center text-xs text-muted-foreground italic px-4">
          {caption}
        </figcaption>
      )}

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={lightboxSlides}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: 'rgba(15, 15, 15, 0.85)', backdropFilter: 'blur(8px)' },
        }}
      />
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
            className="block w-full cursor-zoom-in overflow-hidden bg-muted"
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

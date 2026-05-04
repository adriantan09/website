'use client'

import Image from 'next/image'
import { urlFor } from '@/sanity/client'
import { clsx } from 'clsx'

export type GalleryLayout =
  | 'single'
  | 'grid-2'
  | 'grid-3'
  | 'full-bleed'
  | 'masonry'

interface GalleryImage {
  _key?: string
  alt?: string
  caption?: string
  asset?: unknown
  url?: string
}

interface GalleryBlockProps {
  layout: GalleryLayout
  images: GalleryImage[]
  caption?: string
}

/**
 * Renders a group of images with one of several layouts. The layouts mirror
 * the editorial styles seen on photo-essay sites like paulstamatiou.com:
 *
 *  - single      : one image, centered to body width
 *  - grid-2      : two-up grid (3:2 aspect)
 *  - grid-3      : three-up grid (3:2 aspect)
 *  - full-bleed  : edge-to-edge images stacked vertically
 *  - masonry     : CSS columns masonry with mixed natural heights
 */
export function GalleryBlock({ layout, images, caption }: GalleryBlockProps) {
  if (!images || images.length === 0) return null

  const wrapperClass =
    layout === 'full-bleed'
      ? 'my-16 -mx-[max(1rem,calc((100vw-theme(maxWidth.7xl))/2))] md:my-24'
      : 'my-12 md:my-16'

  return (
    <figure className={wrapperClass}>
      {layout === 'single' && <SingleLayout images={images} />}
      {layout === 'grid-2' && <GridLayout images={images} cols={2} />}
      {layout === 'grid-3' && <GridLayout images={images} cols={3} />}
      {layout === 'full-bleed' && <FullBleedLayout images={images} />}
      {layout === 'masonry' && <MasonryLayout images={images} />}
      {caption && (
        <figcaption className="mt-4 text-center text-xs text-muted-foreground italic px-4">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

function imgSrc(image: GalleryImage, width = 1600) {
  // Prefer the resolved asset, fall back to a pre-resolved URL string from GROQ.
  if (image.asset) return urlFor(image as any).width(width).url()
  return image.url ?? ''
}

function SingleLayout({ images }: { images: GalleryImage[] }) {
  const image = images[0]
  return (
    <div className="relative w-full aspect-[3/2] overflow-hidden bg-muted rounded-sm">
      <Image
        src={imgSrc(image, 2000)}
        alt={image.alt || ''}
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-cover"
      />
    </div>
  )
}

function GridLayout({ images, cols }: { images: GalleryImage[]; cols: 2 | 3 }) {
  const gridCols =
    cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 md:grid-cols-3'
  return (
    <div className={clsx('grid grid-cols-1 gap-3 md:gap-4', gridCols)}>
      {images.map((image, index) => (
        <div
          key={image._key || index}
          className="relative aspect-[3/2] overflow-hidden bg-muted rounded-sm"
        >
          <Image
            src={imgSrc(image, 1400)}
            alt={image.alt || ''}
            fill
            sizes={cols === 2 ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 640px) 100vw, 33vw'}
            className="object-cover"
          />
          {image.caption && (
            <span className="sr-only">{image.caption}</span>
          )}
        </div>
      ))}
    </div>
  )
}

function FullBleedLayout({ images }: { images: GalleryImage[] }) {
  return (
    <div className="space-y-1 md:space-y-2">
      {images.map((image, index) => (
        <div
          key={image._key || index}
          className="relative w-full aspect-[16/9] overflow-hidden bg-muted"
        >
          <Image
            src={imgSrc(image, 2400)}
            alt={image.alt || ''}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}

function MasonryLayout({ images }: { images: GalleryImage[] }) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-3 md:gap-4 [column-fill:_balance]">
      {images.map((image, index) => (
        <div
          key={image._key || index}
          className="mb-3 md:mb-4 break-inside-avoid relative overflow-hidden bg-muted rounded-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc(image, 1200)}
            alt={image.alt || ''}
            loading="lazy"
            className="w-full h-auto block"
          />
        </div>
      ))}
    </div>
  )
}

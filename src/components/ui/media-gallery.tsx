'use client'

import Image from 'next/image'
import { urlFor } from '@/sanity/client'

interface MediaGalleryProps {
  images: any[]
}

export function MediaGallery({ images }: MediaGalleryProps) {
  if (!images || images.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12">
      {images.map((image, index) => (
        <div 
          key={image._key || index} 
          className={`relative aspect-[3/2] overflow-hidden bg-muted ${
            index % 3 === 0 ? 'md:col-span-2' : ''
          }`}
        >
          <Image
            src={urlFor(image).width(1200).url()}
            alt={image.alt || 'Activity photo'}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  )
}

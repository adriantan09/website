import { urlFor } from '@/sanity/client'
import { sanityFetch } from '@/sanity/fetch'
import { siteSettingsQuery } from '@/sanity/queries'
import { BodyRenderer } from '@/components/ui/body-renderer'
import Image from 'next/image'

export default async function AboutPage() {
  const settings = await sanityFetch<any>({ query: siteSettingsQuery })

  return (
    <div className="container py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="relative aspect-[3/4] bg-muted overflow-hidden rounded-sm">
          {settings?.authorImage ? (
            <Image
              src={urlFor(settings.authorImage).width(1200).url()}
              alt={settings.authorName || 'Adrian Tan'}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Add author image in Sanity
            </div>
          )}
        </div>

        <div className="max-w-xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
            About
          </h1>
          {settings?.authorBio ? (
            <BodyRenderer body={settings.authorBio} />
          ) : (
            <p className="text-lg text-muted-foreground leading-relaxed">
              Software engineer by day, outdoor enthusiast by night. I love exploring 
              the world on two feet or two wheels. This site is a collection of my 
              hikes, cycling trips, and travel photography.
            </p>
          )}
          
          <div className="mt-12 pt-12 border-t border-border">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Contact</h2>
            <p className="text-muted-foreground">
              Feel free to reach out for collaborations or just to say hi.
            </p>
            <a 
              href={`mailto:${settings?.socialLinks?.email || 'your-email@example.com'}`}
              className="inline-block mt-4 text-lg font-medium hover:underline underline-offset-4"
            >
              {settings?.socialLinks?.email || 'your-email@example.com'}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

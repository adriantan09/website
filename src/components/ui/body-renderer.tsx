import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { GalleryBlock, type GalleryLayout } from './gallery-block'

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold tracking-tight mt-12 mb-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold tracking-tight mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-foreground/40 pl-4 my-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-base md:text-lg leading-8 mb-5 text-foreground/90">{children}</p>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="underline underline-offset-4 hover:text-foreground"
      >
        {children}
      </a>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  },
}

interface BodyBlock {
  _type: string
  _key?: string
  // Allow arbitrary fields per block type.
  [key: string]: unknown
}

interface BodyRendererProps {
  body: BodyBlock[] | undefined | null
}

/**
 * Walks the activity/collection body array and dispatches each block to the
 * appropriate renderer. Consecutive portable-text blocks are batched into a
 * single PortableText render so list/heading/paragraph context is preserved.
 */
export function BodyRenderer({ body }: BodyRendererProps) {
  if (!body || body.length === 0) return null

  // Group runs of plain portable-text blocks (those have _type === 'block')
  // so PortableText can handle lists/heading hierarchies properly.
  const groups: Array<
    | { kind: 'text'; blocks: BodyBlock[]; key: string }
    | { kind: 'custom'; block: BodyBlock; key: string }
  > = []

  body.forEach((block, idx) => {
    const key = block._key ?? `b-${idx}`
    if (block._type === 'block') {
      const last = groups[groups.length - 1]
      if (last && last.kind === 'text') {
        last.blocks.push(block)
      } else {
        groups.push({ kind: 'text', blocks: [block], key })
      }
    } else {
      groups.push({ kind: 'custom', block, key })
    }
  })

  return (
    <div className="activity-body">
      {groups.map((group) => {
        if (group.kind === 'text') {
          return (
            <div key={group.key} className="max-w-3xl mx-auto px-4 md:px-0">
              <PortableText
                value={group.blocks as never}
                components={portableTextComponents}
              />
            </div>
          )
        }

        const block = group.block

        if (block._type === 'sectionHeadingBlock') {
          const heading = block.heading as string
          const subheading = block.subheading as string | undefined
          const anchor = block.anchor as string | undefined
          return (
            <section
              key={group.key}
              id={anchor}
              className="max-w-3xl mx-auto px-4 md:px-0 mt-20 mb-8 scroll-mt-24"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
                {heading}
              </h2>
              {subheading && (
                <p className="mt-3 text-lg text-muted-foreground">{subheading}</p>
              )}
              <div className="mt-6 h-px w-12 bg-foreground/30" />
            </section>
          )
        }

        if (block._type === 'pullQuoteBlock') {
          const quote = block.quote as string
          const attribution = block.attribution as string | undefined
          return (
            <blockquote
              key={group.key}
              className="max-w-3xl mx-auto px-4 md:px-0 my-12 border-l-2 border-foreground pl-6"
            >
              <p className="text-2xl md:text-3xl font-medium leading-snug tracking-tight">
                “{quote}”
              </p>
              {attribution && (
                <footer className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  — {attribution}
                </footer>
              )}
            </blockquote>
          )
        }

        if (block._type === 'galleryBlock') {
          const layout = (block.layout as GalleryLayout) ?? 'grid-2'
          const images = (block.images as any[]) ?? []
          const caption = block.caption as string | undefined

          const wrapperClass =
            layout === 'full-bleed'
              ? '' // GalleryBlock handles its own full-bleed expansion
              : 'max-w-5xl mx-auto px-4 md:px-0'

          return (
            <div key={group.key} className={wrapperClass}>
              <GalleryBlock layout={layout} images={images} caption={caption} />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

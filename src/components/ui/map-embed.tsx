interface MapEmbedProps {
  html?: string
}

export function MapEmbed({ html }: MapEmbedProps) {
  if (!html) return null

  return (
    <div
      className="my-12 w-full [&_iframe]:w-full [&_iframe]:rounded-2xl [&_iframe]:border [&_iframe]:border-border"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

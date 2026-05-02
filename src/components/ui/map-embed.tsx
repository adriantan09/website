interface MapEmbedProps {
  url?: string
}

export function MapEmbed({ url }: MapEmbedProps) {
  if (!url) return null

  // Basic check to see if it's already an embed URL or needs conversion
  // Most providers give you a specific embed URL. 
  // We'll assume the user provides the embeddable version from the CMS.
  
  return (
    <div className="my-12 w-full">
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
        <iframe
          src={url}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
          title="Activity Route Map"
          className="w-full h-full"
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground text-center">
        Route data provided by 3rd party map service.
      </p>
    </div>
  )
}

import { PortableText } from '@portabletext/react'

const components = {
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl font-bold my-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold my-4">{children}</h2>,
    normal: ({ children }: any) => <p className="text-base leading-7 mb-4 text-muted-foreground">{children}</p>,
  },
}

export function RichText({ value }: { value: any }) {
  return (
    <div className="max-w-none prose dark:prose-invert">
      <PortableText value={value} components={components} />
    </div>
  )
}

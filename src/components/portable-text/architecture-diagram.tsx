import type { SanityImageObject } from '@sanity/image-url'
import { urlForImage } from '@/lib/sanity/image'

interface ArchitectureDiagramProps {
  value: (SanityImageObject & { alt: string; caption?: string; explanation?: string }) | {
    image: SanityImageObject
    alt: string
    caption?: string
    explanation?: string
  }
}

export function ArchitectureDiagram({ value }: ArchitectureDiagramProps) {
  const image = 'image' in value ? value.image : value
  const url = urlForImage(image).auto('format').fit('max').width(1400).url()

  return (
    <figure className="breakout-wide my-4 border border-line p-4">
      <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size diagram: ${value.alt}`} className="block">
        <img src={url} alt={value.alt} loading="lazy" className="h-auto w-full rounded-sm" />
      </a>
      {value.caption ? <figcaption className="mt-3 text-sm font-medium text-ink">{value.caption}</figcaption> : null}
      {value.explanation ? <p className="mt-1 text-sm text-ink-muted">{value.explanation}</p> : null}
    </figure>
  )
}

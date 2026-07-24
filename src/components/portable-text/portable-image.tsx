import { urlForImage } from '@/lib/sanity/image'
import type { SanityImageObject } from '@sanity/image-url'

interface PortableImageProps {
  value: SanityImageObject & { alt: string; caption?: string }
}

/** A standard inline image within Portable Text — responsive via `srcset`, alt required by schema. */
export function PortableImage({ value }: PortableImageProps) {
  const base = urlForImage(value).auto('format').fit('max')

  return (
    <figure className="my-2">
      <img
        src={base.width(1200).url()}
        srcSet={[480, 800, 1200, 1600]
          .map((w) => `${base.width(w).url()} ${w}w`)
          .join(', ')}
        sizes="(min-width: 768px) 42rem, 100vw"
        alt={value.alt}
        loading="lazy"
        className="w-full rounded-sm border border-line"
      />
      {value.caption ? <figcaption className="mt-2 text-sm text-ink-faint">{value.caption}</figcaption> : null}
    </figure>
  )
}

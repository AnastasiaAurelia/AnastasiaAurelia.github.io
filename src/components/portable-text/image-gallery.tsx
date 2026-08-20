import type { SanityImageObject } from '@sanity/image-url'
import { urlForImage } from '@/lib/sanity/image'

interface GalleryItem extends SanityImageObject {
  _key: string
  alt: string
  caption?: string
  label?: string
}

interface ImageGalleryProps {
  value: { images?: GalleryItem[] }
}

/** A responsive evidence gallery; each original-resolution asset opens without a new lightbox dependency. */
export function ImageGallery({ value }: ImageGalleryProps) {
  if (!value.images?.length) return null

  return (
    <div className="breakout-wide my-6 grid grid-cols-1 gap-x-5 gap-y-8 md:grid-cols-2">
      {value.images.map((item) => {
        const base = urlForImage(item).auto('format').fit('max')
        const fullUrl = base.width(2000).url()

        return (
          <figure key={item._key} className="min-w-0">
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open full-size evidence image: ${item.alt}`}
              className="block overflow-hidden rounded-sm border border-line bg-surface"
            >
              <img
                src={base.width(800).url()}
                srcSet={[480, 800, 1200].map((width) => `${base.width(width).url()} ${width}w`).join(', ')}
                sizes="(min-width: 768px) 21rem, calc(100vw - 3rem)"
                alt={item.alt}
                loading="lazy"
                className="h-auto w-full"
              />
            </a>
            {item.label ? <p className="label-mono mt-3 text-accent">{item.label}</p> : null}
            {item.caption ? <figcaption className="mt-2 text-sm text-ink-muted">{item.caption}</figcaption> : null}
          </figure>
        )
      })}
    </div>
  )
}

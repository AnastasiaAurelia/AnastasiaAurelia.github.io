import type { SanityImageObject } from '@sanity/image-url'
import { urlForImage } from '@/lib/sanity/image'
import { cn } from '@/lib/utils'

interface ArticleImageProps {
  value: SanityImageObject & {
    alt: string
    caption?: string
    source?: string
    sourceUrl?: string
    layout?: 'normal' | 'wide' | 'full'
  }
}

/**
 * The flexible inline image for `article.body`. Renders wherever it sits
 * in the Portable Text array — the article page wraps its whole body in
 * `.article-body-grid` (see index.css), and this is the only block that
 * ever opts out of the default reading-column span, via `layout`.
 */
export function ArticleImage({ value }: ArticleImageProps) {
  const layout = value.layout ?? 'normal'
  const base = urlForImage(value).auto('format').fit('max')
  const widths = layout === 'normal' ? [480, 800, 1200] : [800, 1200, 1600, 2000]

  return (
    <figure
      className={cn(
        'my-4',
        layout === 'wide' && 'breakout-wide',
        layout === 'full' && 'breakout-full',
      )}
    >
      <img
        src={base.width(widths[widths.length - 1]).url()}
        srcSet={widths.map((w) => `${base.width(w).url()} ${w}w`).join(', ')}
        sizes={
          layout === 'full'
            ? '100vw'
            : layout === 'wide'
              ? '(min-width: 1024px) 56rem, 100vw'
              : '(min-width: 768px) 42rem, 100vw'
        }
        alt={value.alt}
        loading="lazy"
        className="w-full rounded-sm border border-line"
      />
      {value.caption || value.source ? (
        <figcaption className="mt-2 text-sm text-ink-faint">
          {value.caption}
          {value.caption && value.source ? ' — ' : null}
          {value.source ? (
            value.sourceUrl ? (
              <a
                href={value.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line-strong underline-offset-2 hover:decoration-ink"
              >
                {value.source}
              </a>
            ) : (
              value.source
            )
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  )
}

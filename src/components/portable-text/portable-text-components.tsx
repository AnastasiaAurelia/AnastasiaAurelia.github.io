import type { PortableTextComponents } from '@portabletext/react'
import { PortableImage } from './portable-image'
import { MetricHighlight } from './metric-highlight'
import { DecisionCallout } from './decision-callout'
import { ArchitectureDiagram } from './architecture-diagram'
import { CodeBlock } from './code-block'

/**
 * Everything Portable Text can render, mapped to the app's own styled
 * components — never raw HTML. `projectSection` is deliberately absent:
 * those blocks are extracted out to drive chapter numbering before this
 * ever sees the array (see `split-project-content.ts`), so encountering
 * one here would mean that split didn't happen; render nothing rather
 * than a confusing marker.
 */
export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-ink">{children}</p>,
    h2: ({ children }) => <h3 className="mt-6 text-xl first:mt-0">{children}</h3>,
    h3: ({ children }) => <h4 className="mt-4 text-lg first:mt-0">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-accent pl-4 font-serif text-xl leading-snug text-ink-muted">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="rounded-sm bg-surface px-1.5 py-0.5 font-mono text-[0.9em]">{children}</code>
    ),
    link: ({ children, value }) => {
      const href = value?.href as string | undefined
      if (!href) return <>{children}</>
      const isExternal = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          className="underline decoration-line-strong underline-offset-2 transition-colors hover:decoration-ink"
          {...(isExternal && value?.newTab !== false
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: PortableImage,
    architectureDiagram: ArchitectureDiagram,
    metricHighlight: MetricHighlight,
    decisionCallout: DecisionCallout,
    code: CodeBlock,
  },
}

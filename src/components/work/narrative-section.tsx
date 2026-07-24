import type { ReactNode } from 'react'

interface NarrativeSectionProps {
  id: string
  number: string
  title: string
  children: ReactNode
}

/** One numbered chapter of a project case study. */
export function NarrativeSection({ id, number, title, children }: NarrativeSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28 py-8">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="label-mono text-accent">{number}</span>
        <h2 id={`${id}-heading`} className="text-xl">
          {title}
        </h2>
      </div>
      <div className="max-w-2xl space-y-4 text-ink">{children}</div>
    </section>
  )
}

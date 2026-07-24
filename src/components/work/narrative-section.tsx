import type { ReactNode } from 'react'

interface NarrativeSectionProps {
  id: string
  title: string
  children: ReactNode
}

/** One labeled, populated section of a project case study. */
export function NarrativeSection({ id, title, children }: NarrativeSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 py-6">
      <h2 id={`${id}-heading`} className="mb-3 text-xl">
        {title}
      </h2>
      {children}
    </section>
  )
}

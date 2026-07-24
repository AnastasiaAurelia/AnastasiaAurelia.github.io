import { EVIDENCE_META, type EvidenceType } from '@/components/work/evidence-meta'
import { SectionKicker } from '@/components/editorial/section-kicker'
import { useReveal } from '@/hooks/use-reveal'
import type { SanityProjectSummary } from '@/lib/sanity/types'

const ORDER: EvidenceType[] = ['case-study', 'repository', 'live-product']

/**
 * An honest index of what this portfolio's evidence model supports —
 * not three projects re-shown as unrelated cards. Counts are computed
 * from the real fetched project list; a type reads "00" until it's
 * genuinely linked, never inflated with placeholder entries.
 */
export function EvidenceIndex({ projects }: { projects: SanityProjectSummary[] }) {
  const { ref, visible } = useReveal<HTMLElement>()

  const counts: Record<EvidenceType, number> = {
    'case-study': projects.length,
    repository: projects.filter((p) => p.githubUrl).length,
    'live-product': projects.filter((p) => p.externalUrl).length,
  }

  return (
    <section
      id="evidence-index"
      ref={ref}
      data-visible={visible}
      className="reveal container-editorial scroll-mt-24 section-y-tight border-t border-line"
    >
      <SectionKicker index="04" title="Evidence index" />
      <p className="max-w-2xl text-ink-muted">
        Each project aggregates whichever of these exist for it — a case study, a repository, a
        live product — behind one page, rather than as separate posts.
      </p>
      <ul className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {ORDER.map((type) => {
          const meta = EVIDENCE_META[type]
          const Icon = meta.icon
          return (
            <li key={type} className="flex flex-col gap-3 bg-paper p-5">
              <Icon className="size-4 text-ink-faint" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">{meta.label}</p>
                <p className="mt-1 text-xs text-ink-faint">{meta.description}</p>
              </div>
              <p className="label-mono mt-auto text-accent">
                {String(counts[type]).padStart(2, '0')} {type === 'case-study' ? 'published' : 'linked'}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

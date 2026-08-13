import { Link } from 'react-router-dom'
import { BookOpenText } from 'lucide-react'
import { EVIDENCE_META } from '@/components/work/evidence-meta'
import { SectionKicker } from '@/components/editorial/section-kicker'
import { useReveal } from '@/hooks/use-reveal'
import type { SanityProjectSummary } from '@/lib/sanity/types'

/**
 * The homepage index has its own small taxonomy — distinct from
 * per-project evidence (`EvidenceType` in evidence-meta.tsx, which still
 * legitimately includes `live-product` for individual projects). Reuses
 * the shared case-study/repository metadata so those two don't drift,
 * and adds a Methods card that has no project-level equivalent.
 */
const CARDS = [
  { key: 'case-study', ...EVIDENCE_META['case-study'], unit: 'published', href: '/work' },
  { key: 'repository', ...EVIDENCE_META.repository, unit: 'linked', href: null },
  {
    key: 'methods',
    label: 'Methods',
    description: 'Investigations, experiments, system decisions, and the reasoning behind the work.',
    icon: BookOpenText,
    unit: 'published',
    href: '/articles',
  },
] as const

/**
 * An honest index of what this portfolio's evidence model supports —
 * not three projects re-shown as unrelated cards. Counts are computed
 * from the real fetched project/article data; a card reads "00" until
 * it's genuinely populated, never inflated with placeholder entries.
 */
export function EvidenceIndex({
  projects,
  publishedArticleCount,
}: {
  projects: SanityProjectSummary[]
  publishedArticleCount: number
}) {
  const { ref, visible } = useReveal<HTMLElement>()

  const counts: Record<(typeof CARDS)[number]['key'], number> = {
    'case-study': projects.length,
    repository: projects.filter((p) => p.githubUrl).length,
    methods: publishedArticleCount,
  }

  return (
    <section
      id="evidence-index"
      ref={ref}
      data-visible={visible}
      className="reveal container-editorial scroll-mt-24 section-y-tight border-t border-line"
    >
      <SectionKicker index="05" title="Evidence index" />
      <p className="max-w-2xl text-ink-muted">
        A quick index of the work behind the portfolio — shipped case studies, implementation
        repositories, and published technical methods.
      </p>
      <ul className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {CARDS.map(({ key, label, description, icon: Icon, unit, href }) => {
          const content = (
            <>
              <Icon className="size-4 text-ink-faint" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="mt-1 text-xs text-ink-faint">{description}</p>
              </div>
              <p className="label-mono mt-auto text-accent">
                {String(counts[key]).padStart(2, '0')} {unit}
              </p>
            </>
          )
          return (
            <li key={key} className="h-full">
              {href ? (
                <Link to={href} className="flex h-full flex-col gap-3 bg-paper p-5 transition-colors hover:bg-surface">
                  {content}
                </Link>
              ) : (
                <div className="flex h-full flex-col gap-3 bg-paper p-5">{content}</div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

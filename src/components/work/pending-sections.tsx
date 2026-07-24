/**
 * A project case study exposes a fixed list of sections (Problem, Ownership,
 * Decisions, etc.) but ships with only some of them written up. Rather than
 * repeat an identical placeholder sentence once per missing section — which
 * reads as broken, not as "in progress" — the gaps are named once, together.
 */
export function PendingSections({ titles }: { titles: string[] }) {
  if (titles.length === 0) return null

  return (
    <section className="py-6">
      <div className="rounded-sm border border-dashed border-line px-4 py-3 text-sm text-ink-faint">
        Not yet documented: {titles.join(', ')}. These sections will be added as case-study
        material becomes available.
      </div>
    </section>
  )
}

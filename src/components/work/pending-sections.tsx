/**
 * A project case study exposes a fixed list of sections (Problem, Ownership,
 * Decisions, etc.) but ships with only some of them written up. Rather than
 * repeat an identical placeholder sentence once per missing section — which
 * reads as broken, not as "in progress" — the gaps are named once, together,
 * styled as an index entry rather than an apology.
 */
export function PendingSections({ titles }: { titles: string[] }) {
  if (titles.length === 0) return null

  return (
    <section className="border-t border-line py-8">
      <p className="label-mono text-ink-faint">In progress</p>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {titles.map((title) => (
          <li key={title} className="text-sm text-ink-faint">
            {title}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-ink-faint">
        Added to this case study as material becomes available.
      </p>
    </section>
  )
}

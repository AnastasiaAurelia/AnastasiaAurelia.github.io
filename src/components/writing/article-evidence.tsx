import { ExternalLink, FileText } from 'lucide-react'

const WUZZ_CHANGE_PLATE_SLUG = 'wuzz-change-plate-transfer-system-design'

export function ArticleEvidence({ slug }: { slug: string }) {
  if (slug !== WUZZ_CHANGE_PLATE_SLUG) return null

  return (
    <section className="mt-12 border-t border-line pt-10" aria-labelledby="design-evidence-heading">
      <div className="max-w-2xl">
        <p className="label-mono text-accent">Evidence &amp; design artifacts</p>
        <h2 id="design-evidence-heading" className="mt-3 text-3xl leading-tight sm:text-4xl">
          Alternative flows made the trade-offs visible
        </h2>
        <p className="mt-4 text-ink-muted">
          The final design was shaped by comparing system boundaries, operational ownership, coverage, and recovery
          behavior—not by assuming a single happy path.
        </p>
      </div>

      <a
        href="/evidence/wuzz-change-plate-proposed-flows.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-7 grid gap-5 rounded-sm border border-line bg-surface p-5 transition-colors hover:border-line-strong sm:grid-cols-[auto_1fr_auto] sm:items-start sm:p-7"
        aria-label="View Proposed Change Plate Flows and Implementation Strategy PDF (opens in a new tab)"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-line bg-paper text-accent">
          <FileText className="size-5" aria-hidden="true" />
        </span>

        <span className="min-w-0">
          <span className="label-mono text-accent">System design artifact · PDF</span>
          <span className="mt-2 block font-serif text-2xl leading-snug text-ink">
            Proposed Change Plate Flows &amp; Implementation Strategy
          </span>
          <span className="mt-3 block text-sm leading-relaxed text-ink-muted">
            Three implementation models explored before convergence: full system synchronization, an assisted CS/Ops
            workflow, and casual-only self-service. The comparison makes the engineering, operational, coverage,
            scalability, and recovery trade-offs explicit.
          </span>
          <span className="mt-3 block text-sm leading-relaxed text-ink-faint">
            Includes end-to-end swimlanes, membership handling, multi-location synchronization, failure states, recovery
            paths, and implementation trade-offs. For member flows, a WUZZ/CMS plate update is not complete until the
            required Agent and location updates are synchronized or confirmed; otherwise it remains pending or moves
            into recovery.
          </span>
        </span>

        <span className="inline-flex items-center gap-2 text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 sm:mt-1 sm:whitespace-nowrap">
          View proposed flows (PDF)
          <ExternalLink className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </a>
    </section>
  )
}

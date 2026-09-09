import { useId } from 'react'

const reports = [
  {
    label: 'RUN 01 — Location-level health',
    image: '/evidence/lpr-run-01-location-health.png',
    width: 754,
    height: 708,
    alt: 'Production LPR report showing the executive summary, location health, and last three daily results.',
  },
  {
    label: 'RUN 02 — Gate-level diagnostics',
    image: '/evidence/lpr-run-02-gate-diagnostics.png',
    width: 768,
    height: 978,
    alt: 'Production LPR report showing gate-level accuracy for JRP, Menteng Central, CFX, and Gading Riverview.',
  },
  {
    label: 'RUN 03 — Trend + recommended action',
    image: '/evidence/lpr-run-03-trend-action.png',
    width: 768,
    height: 497,
    alt: 'Production LPR report showing trend notes, a passed data-quality check, and recommended actions.',
  },
] as const

export function LprRecurringRuns() {
  const id = useId()
  return <section className="my-8 min-w-0 max-w-full border-t border-line pt-6" aria-labelledby={`${id}-heading`}>
    <h3 id={`${id}-heading`} className="text-xl">Recurring production runs</h3>
    <p className="mt-3 text-sm text-ink-muted">The workflow was not a one-off report generator. The same validated pipeline ran repeatedly, producing updated location, gate, and trend summaries as new production data arrived.</p>
    <figure className="mt-5">
      <ul className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-3">
        {reports.map((report) => <li key={report.image} className="min-w-0 border border-line bg-paper p-3">
          <p className="mb-3 font-mono text-xs leading-relaxed text-ink">{report.label}</p>
          <a href={report.image} target="_blank" rel="noopener noreferrer" aria-label={`Open ${report.label} at full resolution`} className="block cursor-zoom-in border border-line">
            <img src={report.image} width={report.width} height={report.height} alt={report.alt} loading="lazy" className="block h-auto w-full" />
          </a>
        </li>)}
      </ul>
      <figcaption className="mt-3 text-sm text-ink-muted">Daily LPR reports generated from the same validated operating workflow across multiple production runs.</figcaption>
    </figure>
  </section>
}

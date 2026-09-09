import { useId } from 'react'

function WorkflowNode({ x, y, width, label, detail }: { x: number; y: number; width: number; label: string; detail?: string }) {
  return <g>
    <rect x={x} y={y} width={width} height="62" rx="2" fill="var(--color-paper)" stroke="var(--color-line-strong)" />
    <text x={x + width / 2} y={y + (detail ? 25 : 36)} textAnchor="middle" fill="var(--color-ink)" className="font-sans" fontSize="17">{label}</text>
    {detail ? <text x={x + width / 2} y={y + 46} textAnchor="middle" fill="var(--color-ink-muted)" className="font-mono" fontSize="13">{detail}</text> : null}
  </g>
}

export function LprDailyReportWorkflow() {
  const id = useId()
  return <figure className="breakout-wide my-8 min-w-0 max-w-full" aria-labelledby={`${id}-heading`}>
    <div className="rounded-sm border border-line bg-surface">
      <div className="border-b border-line px-4 py-4 sm:px-6">
        <p className="label-mono text-accent">Validate before reporting</p>
        <h3 id={`${id}-heading`} className="mt-2 text-xl">Daily LPR reporting workflow</h3>
      </div>
      <div className="max-w-full overflow-x-auto" tabIndex={0} role="region" aria-label="Daily report workflow; scroll horizontally to explore both validation branches">
        <svg viewBox="0 0 780 964" className="block h-auto w-full min-w-[780px] lg:min-w-0" role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`}>
          <title id={`${id}-title`}>Fail-closed daily LPR reporting automation</title>
          <desc id={`${id}-desc`}>Every day at 08:00 WIB, fetch the current result of Metabase Card 512, an internal source identifier. Normalize location, period, and gate mapping before fail-closed validation. PASS leads to the approved report: leadership summary, location status, gate breakdown, trend notes, and recommended actions, followed by WhatsApp delivery and the daily operating loop. FAIL leads only to a failure notice; the full report is suppressed.</desc>
          <defs>
            <marker id={`${id}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M1 1 L7 4 L1 7" fill="none" stroke="var(--color-ink-muted)" />
            </marker>
          </defs>
          <g aria-hidden="true" fill="none" stroke="var(--color-ink-muted)" markerEnd={`url(#${id}-arrow)`}>
            <path d="M390 86 V116" />
            <path d="M390 178 V208" />
            <path d="M390 270 V306" />
            <path d="M210 376 H190 V492" />
            <path d="M570 376 H635 V492" strokeDasharray="5 4" />
            <path d="M190 554 V586" />
            <path d="M190 756 V792" />
            <path d="M190 854 V892" />
          </g>
          <WorkflowNode x={210} y={24} width={360} label="Daily 08:00 WIB" />
          <WorkflowNode x={210} y={116} width={360} label="Metabase Card 512" detail="current result only · internal source ID" />
          <WorkflowNode x={210} y={208} width={360} label="Normalize" detail="location + period + gate mapping" />
          <path d="M390 306 L570 376 L390 446 L210 376 Z" fill="var(--color-paper)" stroke="var(--color-accent)" />
          <text x="390" y="372" textAnchor="middle" fill="var(--color-ink)" className="font-sans" fontSize="18">Fail-closed validation</text>
          <text x="390" y="394" textAnchor="middle" fill="var(--color-ink-muted)" className="font-mono" fontSize="12">All checks must pass</text>
          <g className="font-mono" fontSize="14" fill="var(--color-ink)">
            <text x="174" y="462" textAnchor="end">PASS</text>
            <text x="651" y="462">FAIL</text>
          </g>
          <WorkflowNode x={30} y={492} width={320} label="Render approved report" />
          <WorkflowNode x={510} y={492} width={250} label="Failure notice only" detail="Full report suppressed" />
          <rect x="30" y="586" width="320" height="170" rx="2" fill="var(--color-paper)" stroke="var(--color-line-strong)" />
          <g fill="var(--color-ink-muted)" className="font-mono" fontSize="15" textAnchor="middle">
            {['Leadership summary', 'Location status', 'Gate breakdown', 'Trend notes', 'Recommended actions'].map((label, index) => <text key={label} x="190" y={616 + index * 28}>{label}</text>)}
          </g>
          <WorkflowNode x={30} y={792} width={320} label="WhatsApp delivery" />
          <WorkflowNode x={30} y={892} width={320} label="Daily operating loop" />
        </svg>
      </div>
    </div>
  </figure>
}

export function LprOperatingLoop() {
  return <>
    <p>Monitoring five locations manually was not sustainable. I turned the LPR performance review into a repeatable operating workflow: fetch the current performance data, validate its integrity, generate the same leadership-ready report every day, and deliver it automatically.</p>
    <p>The important part was not merely generating text. The workflow was designed to fail closed. If the source, location coverage, period alignment, or gate mapping could not be verified, the system would suppress the full report rather than publish numbers that might be wrong.</p>
    <p>This moved LPR monitoring from an analyst-dependent task into a deterministic daily operating process.</p>
    <LprDailyReportWorkflow />
    <figure className="breakout-wide my-8 min-w-0 max-w-full">
      <a href="/evidence/nano.png" target="_blank" rel="noopener noreferrer" aria-label="Open the production LPR report image at full resolution" className="block rounded-sm border border-line bg-paper p-3 sm:p-4">
        <img src="/evidence/nano.png" width="622" height="1082" alt="Automated LPR accuracy report delivered in WhatsApp showing executive summary, location status, recent-day trends, and gate-level breakdowns." className="mx-auto block h-auto w-full max-w-[622px] rounded-sm border border-line" loading="lazy" />
      </a>
      <figcaption className="mt-2 text-sm text-ink-muted">Production output. The automated workflow generated and delivered the daily LPR performance report directly into the operating channel, including location-level trends and gate-level diagnostics.</figcaption>
    </figure>
    <aside className="my-8 border-l-2 border-accent bg-surface p-4 sm:p-6" aria-label="From monitoring to operating system">
      <p className="label-mono leading-relaxed text-accent">FROM MONITORING TO OPERATING SYSTEM</p>
      <p className="mt-3 text-sm text-ink-muted">The automation separated data retrieval, validation, formatting, and delivery into distinct layers. That made the workflow easier to audit, safer to run unattended, and less dependent on one person manually preparing the report.</p>
    </aside>
  </>
}

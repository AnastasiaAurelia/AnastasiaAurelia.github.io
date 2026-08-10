import type { SwimlaneDiagramBlock } from '@/lib/sanity/types'

const stateLabel = { process: 'Process', decision: 'Decision', pending: 'Pending', blocked: 'Blocked or denied', success: 'Success' } as const

export function SwimlaneDiagram({ value }: { value: SwimlaneDiagramBlock }) {
  return <figure className="breakout-wide my-10" aria-labelledby={`${value._key}-title`}>
    <div className="rounded-sm border border-line bg-surface p-4 sm:p-6">
      <h3 id={`${value._key}-title`} className="font-serif text-xl font-semibold text-ink">{value.title}</h3>
      {value.summary ? <p className="mt-2 max-w-4xl text-sm text-ink-muted">{value.summary}</p> : null}
      <div className="mt-5 grid gap-4 lg:grid-cols-[repeat(var(--lane-count),minmax(0,1fr))]" style={{ '--lane-count': value.lanes.length } as React.CSSProperties}>
        {value.lanes.map((lane, laneIndex) => <section key={lane._key ?? lane.name} className="rounded-sm border border-line bg-paper p-3" aria-labelledby={`${value._key}-lane-${laneIndex}`}>
          <h4 id={`${value._key}-lane-${laneIndex}`} className="border-b border-line pb-2 font-mono text-xs font-bold uppercase tracking-wide text-ink-muted">
            <span className="lg:hidden">Step {laneIndex + 1} — </span>{lane.name}
          </h4>
          <ol className="mt-3 space-y-3">
            {lane.nodes.map((node) => <li key={node._key ?? node.label} className={`swimlane-node swimlane-node--${node.state ?? 'process'} rounded-sm border p-3`}>
              <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-ink-faint">{stateLabel[node.state ?? 'process']}</span>
              <strong className="mt-1 block text-sm leading-snug">{node.label}</strong>
              {node.detail ? <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-ink-muted">{node.detail}</p> : null}
              {node.transitions?.length ? <ul className="mt-2 space-y-1 border-t border-line pt-2 font-mono text-[0.68rem] leading-relaxed text-ink-muted">{node.transitions.map((transition) => <li key={transition}>→ {transition}</li>)}</ul> : null}
            </li>)}
          </ol>
        </section>)}
      </div>
    </div>
    {value.caption ? <figcaption className="mt-2 text-sm text-ink-faint">{value.caption}</figcaption> : null}
  </figure>
}

import type { SwimlaneDiagramBlock } from '@/lib/sanity/types'

const stateLabel = { process: 'Process', decision: 'Decision', pending: 'Pending', blocked: 'Blocked or denied', success: 'Success' } as const

export function SwimlaneDiagram({ value }: { value: SwimlaneDiagramBlock }) {
  return <figure className="breakout-wide my-10" aria-labelledby={`${value._key}-title`}>
    <div className="rounded-sm border border-line bg-surface p-4 sm:p-6">
      <h3 id={`${value._key}-title`} className="font-serif text-xl font-semibold text-ink">{value.title}</h3>
      {value.summary ? <p className="mt-2 max-w-4xl text-sm text-ink-muted">{value.summary}</p> : null}
      <div className="mt-5 max-w-full overflow-x-auto overscroll-x-contain pb-2" role="region" aria-label={`${value.title} lanes`} tabIndex={0}>
        <div className="swimlane-grid" style={{ '--lane-count': value.lanes.length, '--lane-min-width': `${value.lanes.length * 16 + Math.max(0, value.lanes.length - 1)}rem` } as React.CSSProperties}>
        {value.lanes.map((lane, laneIndex) => <section key={lane._key ?? lane.name} className="min-w-0 rounded-sm border border-line bg-paper p-3" aria-labelledby={`${value._key}-lane-${laneIndex}`}>
          <h4 id={`${value._key}-lane-${laneIndex}`} className="border-b border-line pb-2 font-mono text-xs font-bold uppercase tracking-wide text-ink-muted">
            <span className="md:hidden">Step {laneIndex + 1} — </span><span className="break-words [word-break:normal]">{lane.name}</span>
          </h4>
          <ol className="mt-3 space-y-3">
            {lane.nodes.map((node) => <li key={node._key ?? node.label} className={`swimlane-node swimlane-node--${node.state ?? 'process'} rounded-sm border p-3`}>
              <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-ink-faint">{stateLabel[node.state ?? 'process']}</span>
              <strong className="mt-1 block break-words text-sm leading-snug [word-break:normal]">{node.label}</strong>
              {node.detail ? <p className="mt-1 whitespace-pre-line break-words text-xs leading-relaxed text-ink-muted [word-break:normal]">{node.detail}</p> : null}
              {node.transitions?.length ? <ul className="mt-2 space-y-1 border-t border-line pt-2 font-mono text-[0.68rem] leading-relaxed text-ink-muted">{node.transitions.map((transition) => <li key={transition} className="break-words [word-break:normal]">→ {transition}</li>)}</ul> : null}
            </li>)}
          </ol>
        </section>)}
        </div>
      </div>
    </div>
    {value.caption ? <figcaption className="mt-2 text-sm text-ink-faint">{value.caption}</figcaption> : null}
  </figure>
}

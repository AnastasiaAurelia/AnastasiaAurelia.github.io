export function ProcessDiagram({ value }: { value: { title: string; variant?: string; steps: Array<{ _key?: string; label: string; field?: string }>; relationships?: string[]; warning?: string; caption?: string } }) {
  return <figure className="breakout-wide my-8" aria-label={value.title}>
    <div className="rounded-sm border border-line bg-surface p-4 sm:p-6">
      <div className={`grid gap-3 ${value.variant === 'timeline' ? 'sm:grid-cols-3' : 'sm:grid-flow-col sm:auto-cols-fr'}`}>
        {value.steps.map((step, index) => <div key={step._key ?? step.label} className="relative rounded-sm border border-line-strong bg-paper p-4 text-center">
          <strong className="block leading-tight">{step.label}</strong>{step.field ? <code className="mt-2 block break-all text-xs text-ink-muted">{step.field}</code> : null}
          {index < value.steps.length - 1 ? <span aria-hidden="true" className="absolute -bottom-4 left-1/2 text-accent sm:-right-3 sm:bottom-auto sm:left-auto sm:top-1/2 sm:-translate-y-1/2">→</span> : null}
        </div>)}
      </div>
      {value.relationships?.length ? <ul className="mt-5 grid gap-2 font-mono text-xs text-ink-muted sm:grid-cols-3">{value.relationships.map((item) => <li key={item}>{item}</li>)}</ul> : null}
      {value.warning ? <p className="mt-5 font-semibold text-accent">{value.warning}</p> : null}
    </div>{value.caption ? <figcaption className="mt-2 text-sm text-ink-faint">{value.caption}</figcaption> : null}
  </figure>
}

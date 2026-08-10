export function ProcessDiagram({ value }: { value: { title: string; variant?: string; steps: Array<{ _key?: string; label: string; field?: string }>; relationships?: string[]; warning?: string; caption?: string } }) {
  return <figure className="breakout-wide my-8" aria-label={value.title}>
    <div className="rounded-sm border border-line bg-surface p-4 sm:p-6">
      <ol className={`process-diagram-grid ${value.steps.length >= 5 ? 'process-diagram-grid--multi' : ''}`}>
        {value.steps.map((step, index) => <li key={step._key ?? step.label} className="relative min-w-0 rounded-sm border border-line-strong bg-paper p-4 text-center">
          <span className="mb-2 block font-mono text-[0.65rem] font-bold uppercase tracking-wider text-ink-faint">
            {value.variant === 'timeline' ? 'Point' : 'Step'} {String(index + 1).padStart(2, '0')}
          </span>
          <strong className="block break-words leading-tight [word-break:normal]">{step.label}</strong>
          {step.field ? <code className="mt-2 block break-words text-xs leading-relaxed text-ink-muted [word-break:normal]">{step.field}</code> : null}
          {index < value.steps.length - 1 ? <span aria-hidden="true" className="process-diagram-connector">↓</span> : null}
        </li>)}
      </ol>
      {value.relationships?.length ? <ul className="mt-5 grid gap-2 font-mono text-xs text-ink-muted sm:grid-cols-3">{value.relationships.map((item) => <li key={item}>{item}</li>)}</ul> : null}
      {value.warning ? <p className="mt-5 font-semibold text-accent">{value.warning}</p> : null}
    </div>{value.caption ? <figcaption className="mt-2 text-sm text-ink-faint">{value.caption}</figcaption> : null}
  </figure>
}

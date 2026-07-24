interface MetricHighlightProps {
  value: { label: string; value: string; context: string }
}

/** A quantified-outcome callout. `context` is required by the schema, so a bare number never appears unsupported. */
export function MetricHighlight({ value }: MetricHighlightProps) {
  return (
    <div className="my-2 border-l-2 border-accent py-1 pl-4">
      <p className="font-serif text-3xl leading-none text-ink">{value.value}</p>
      <p className="label-mono mt-2 text-ink-faint">{value.label}</p>
      <p className="mt-1 text-sm text-ink-muted">{value.context}</p>
    </div>
  )
}

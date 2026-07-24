interface DecisionCalloutProps {
  value: { decision: string; reasoning: string; consequence?: string }
}

/** One key product/technical decision, its reasoning, and its trade-off — styled to match the rest of the decision system. */
export function DecisionCallout({ value }: DecisionCalloutProps) {
  return (
    <div className="my-2 space-y-2 border-l-2 border-line pl-4">
      <p className="font-medium">{value.decision}</p>
      <p className="text-sm text-ink-muted">{value.reasoning}</p>
      {value.consequence ? (
        <p className="text-sm text-ink-faint">
          <span className="label-mono text-ink-faint">Trade-off — </span>
          {value.consequence}
        </p>
      ) : null}
    </div>
  )
}

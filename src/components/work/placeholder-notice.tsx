/**
 * Consistent, honest empty state for narrative sections that haven't
 * been written up yet. Deliberately looks intentional rather than
 * broken — a dashed rule and muted copy, not an invented sentence.
 */
export function PlaceholderNotice({ label = 'Not yet documented' }: { label?: string }) {
  return (
    <p className="rounded-sm border border-dashed border-line px-4 py-3 text-sm text-ink-faint">
      {label} — this section will be added as case-study material becomes available.
    </p>
  )
}

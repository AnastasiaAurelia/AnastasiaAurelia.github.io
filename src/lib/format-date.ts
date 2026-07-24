/** Formats an ISO datetime as e.g. "Jul 24, 2026" — used for article dates. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

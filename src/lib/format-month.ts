/** Formats a `YYYY-MM` (or `YYYY-MM-DD`) date string as e.g. "Jun 2025". */
export function formatMonth(date?: string): string {
  if (!date) return '?'
  const [year, month] = date.split('-')
  const parsed = new Date(Number(year), Number(month) - 1)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

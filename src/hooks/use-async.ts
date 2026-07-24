import { useEffect, useState } from 'react'

export type AsyncState<T> =
  | { status: 'loading'; data: undefined; error: undefined }
  | { status: 'error'; data: undefined; error: Error }
  | { status: 'success'; data: T; error: undefined }

/**
 * Runs `fetcher` on mount (and whenever `deps` change), exposing a
 * discriminated-union state so callers can't forget to handle the
 * loading/error case — there's no `data` to read until `status` says so.
 */
export function useAsync<T>(fetcher: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading', data: undefined, error: undefined })

  /* oxlint-disable react-hooks/exhaustive-deps -- a generic data-fetching
   * hook necessarily takes its dep array as a parameter rather than a
   * literal, which this rule can't statically verify — the same shape
   * react-query/SWR use internally. Callers own that array's correctness. */
  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading', data: undefined, error: undefined })

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data, error: undefined })
      })
      .catch((error: unknown) => {
        const normalized = error instanceof Error ? error : new Error('Unknown error')
        // Logged once, centrally — the full message (which can include a
        // request URL) belongs in devtools, never rendered in the UI.
        console.error('[useAsync] query failed:', normalized)
        if (!cancelled) {
          setState({ status: 'error', data: undefined, error: normalized })
        }
      })

    return () => {
      cancelled = true
    }
  }, deps)
  /* oxlint-enable react-hooks/exhaustive-deps */

  return state
}

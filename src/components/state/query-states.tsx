/** A quiet, non-layout-shifting loading indicator — no spinner/skeleton theatrics. */
export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <p className="label-mono py-16 text-center text-ink-faint" role="status">
      {label}…
    </p>
  )
}

/**
 * Query failed — distinct from "nothing here yet" (see EmptyState).
 * `message` is a short, user-safe summary; the real error (which can
 * contain a full request URL) belongs in `console.error` at the call
 * site, never rendered directly — both for a clean UI and so a raw API
 * URL never gets pasted into a bug report screenshot.
 */
export function ErrorState({ message = 'Something went wrong loading this content.' }: { message?: string }) {
  return (
    <div
      className="max-w-2xl overflow-hidden rounded-sm border border-dashed border-line px-4 py-3 text-sm break-words text-ink-faint"
      role="alert"
    >
      {message}
    </div>
  )
}

/** Query succeeded but returned nothing — e.g. no content migrated yet, or genuinely no matches. */
export function EmptyState({ message }: { message: string }) {
  return (
    <p className="max-w-2xl overflow-hidden rounded-sm border border-dashed border-line px-4 py-3 text-sm break-words text-ink-faint">
      {message}
    </p>
  )
}

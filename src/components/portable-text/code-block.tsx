interface CodeBlockProps {
  value: { code: string; language?: string; filename?: string }
}

/** Plain monospace rendering, no syntax-highlighter dependency — keeps the bundle lean and matches the existing restrained system. */
export function CodeBlock({ value }: CodeBlockProps) {
  return (
    <div className="my-2 overflow-hidden rounded-sm border border-line">
      {value.filename || value.language ? (
        <div className="label-mono flex min-w-0 items-start justify-between gap-3 border-b border-line bg-surface px-4 py-2 text-ink-faint">
          <span className="min-w-0 break-words [word-break:normal]">{value.filename ?? ''}</span>
          <span className="shrink-0">{value.language ?? ''}</span>
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 text-sm">
        <code className="font-mono">{value.code}</code>
      </pre>
    </div>
  )
}

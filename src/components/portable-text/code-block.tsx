interface CodeBlockProps {
  value: { code: string; language?: string; filename?: string }
}

/** Plain monospace rendering, no syntax-highlighter dependency — keeps the bundle lean and matches the existing restrained system. */
export function CodeBlock({ value }: CodeBlockProps) {
  return (
    <div className="my-2 overflow-hidden rounded-sm border border-line">
      {value.filename || value.language ? (
        <div className="label-mono flex items-center justify-between border-b border-line bg-surface px-4 py-2 text-ink-faint">
          <span>{value.filename ?? ''}</span>
          <span>{value.language ?? ''}</span>
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 text-sm">
        <code className="font-mono">{value.code}</code>
      </pre>
    </div>
  )
}

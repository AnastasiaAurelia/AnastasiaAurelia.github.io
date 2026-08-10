import katex from 'katex'
import 'katex/dist/katex.min.css'

export function MathBlock({ value }: { value: { latex: string; display?: boolean; databaseDefinition?: string } }) {
  const html = katex.renderToString(value.latex, { displayMode: value.display !== false, throwOnError: false, output: 'htmlAndMathml' })
  return <figure className="my-6 min-w-0 rounded-sm border border-line bg-surface p-4" aria-label={value.latex}>
    <div className="max-w-full overflow-x-auto overscroll-x-contain"><div className="min-w-max text-center" dangerouslySetInnerHTML={{ __html: html }} /></div>
    {value.databaseDefinition ? <figcaption className="mt-3 break-words border-t border-line pt-3 font-mono text-xs text-ink-muted [word-break:normal]">{value.databaseDefinition}</figcaption> : null}
  </figure>
}

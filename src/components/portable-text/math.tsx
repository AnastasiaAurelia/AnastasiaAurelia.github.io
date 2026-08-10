import katex from 'katex'
import 'katex/dist/katex.min.css'

export function MathBlock({ value }: { value: { latex: string; display?: boolean; databaseDefinition?: string } }) {
  const html = katex.renderToString(value.latex, { displayMode: value.display !== false, throwOnError: false, output: 'htmlAndMathml' })
  return <figure className="my-6 overflow-x-auto rounded-sm border border-line bg-surface p-4" aria-label={value.latex}>
    <div className="min-w-max text-center" dangerouslySetInnerHTML={{ __html: html }} />
    {value.databaseDefinition ? <figcaption className="mt-3 border-t border-line pt-3 font-mono text-xs text-ink-muted">{value.databaseDefinition}</figcaption> : null}
  </figure>
}

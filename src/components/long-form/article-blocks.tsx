import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { Block, EvidenceLabel, Inline } from '@/content/articles/parse-article-markdown'
import { EVIDENCE_META } from './evidence-meta'
import { MathBlock } from '@/components/portable-text/math'

export function EvidenceTag({ label, className }: { label: EvidenceLabel; className?: string }) {
  const meta = EVIDENCE_META[label]
  return (
    <span
      className={cn('evidence-tag', className)}
      title={meta.definition}
      data-evidence={label}
    >
      <span aria-hidden="true" className="evidence-tag-glyph">
        {meta.glyph}
      </span>
      {meta.name}
      <span className="sr-only">:</span>
    </span>
  )
}

export function InlineContent({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        switch (node.type) {
          case 'text':
            return <span key={index}>{node.value}</span>
          case 'strong':
            return (
              <strong key={index} className="font-semibold text-ink">
                <InlineContent nodes={node.children} />
              </strong>
            )
          case 'em':
            return (
              <em key={index}>
                <InlineContent nodes={node.children} />
              </em>
            )
          case 'code':
            return (
              <code key={index} className="rounded-sm bg-surface px-1 py-0.5 font-mono text-[0.85em]">
                {node.value}
              </code>
            )
          case 'label':
            return <EvidenceTag key={index} label={node.label} />
          case 'link':
            return <a key={index} href={node.href} className="underline decoration-accent/50 underline-offset-4 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"><InlineContent nodes={node.children} /></a>
          case 'cite':
            return (
              <cite key={index} className="article-cite">
                [{node.value}]
              </cite>
            )
        }
      })}
    </>
  )
}

function Legend({ items }: { items: Inline[][] }) {
  return (
    <dl className="my-8 grid gap-x-8 gap-y-4 border-y border-line py-6 sm:grid-cols-2">
      {items.map((item, index) => {
        const [first, ...rest] = item
        if (first?.type !== 'label') return null
        return (
          <div key={index}>
            <dt>
              <EvidenceTag label={first.label} />
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              <InlineContent nodes={rest} />
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

function Table({ block }: { block: Extract<Block, { type: 'table' }> }) {
  const isMatrix = block.variant === 'matrix'
  const isGrammar = block.variant === 'grammar'
  // In the illustrative payoff matrix, the two cells where neither team
  // gains by switching alone are marked in text, not only by outline.
  const stableCells = new Set(['2, 1', '1, 2'])

  return (
    <figure className={cn('my-8', isMatrix || isGrammar ? 'article-figure' : '')}>
      {isGrammar ? (
        <figcaption className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="label-mono text-accent">Figure 4 · Model card: strategic grammar</span>
          <EvidenceTag label="FORMAL MODEL" />
        </figcaption>
      ) : null}
      {isMatrix ? (
        <figcaption className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="label-mono text-accent">Figure 4, continued · Illustrative payoffs (Team A, Team B)</span>
          <EvidenceTag label="SYNTHESIS" />
        </figcaption>
      ) : null}
      <div className="overflow-x-auto">
        <table className={cn('article-table', isMatrix ? 'article-table--matrix' : block.header.length >= 3 && 'article-table--wide')}>
          <thead>
            <tr>
              {block.header.map((cell, index) => (
                <th key={index} scope="col">
                  <InlineContent nodes={cell} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const text = cell.map((n) => (n.type === 'text' ? n.value : '')).join('').trim()
                  const stable = isMatrix && cellIndex > 0 && stableCells.has(text)
                  const Cell = cellIndex === 0 ? 'th' : 'td'
                  return (
                    <Cell key={cellIndex} scope={cellIndex === 0 ? 'row' : undefined} data-stable={stable || undefined}>
                      <InlineContent nodes={cell} />
                      {stable ? <span className="label-mono ml-2 text-accent">Stable</span> : null}
                    </Cell>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isMatrix ? (
        <p className="mt-3 text-sm text-ink-muted">Stable is not the same as fair, efficient, or predicted.</p>
      ) : null}
    </figure>
  )
}

export function ArticleBlock({
  block,
  renderVisual,
}: {
  block: Block
  renderVisual: (id: string) => ReactNode
}) {
  switch (block.type) {
    case 'heading':
      return block.level === 4 ? (
        <h4 id={block.id} className="article-h4 scroll-mt-28">
          {block.text}
        </h4>
      ) : (
        <h3 id={block.id} className="mt-12 scroll-mt-28 text-2xl leading-snug">
          {block.text}
        </h3>
      )
    case 'math':
      return (
        <div className="long-form-math">
          <MathBlock value={{ latex: block.latex, display: true }} />
        </div>
      )
    case 'code':
      return (
        <pre className="article-code">
          <code>{block.value}</code>
        </pre>
      )
    case 'paragraph':
      return (
        <p id={block.id} className={cn('article-paragraph', block.id && 'scroll-mt-28')}>
          <InlineContent nodes={block.children} />
        </p>
      )
    case 'list':
      if (block.variant === 'legend') return <Legend items={block.items} />
      return block.ordered ? (
        <ol className="article-list list-decimal">
          {block.items.map((item, index) => (
            <li key={index}>
              <InlineContent nodes={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="article-list list-disc">
          {block.items.map((item, index) => (
            <li key={index}>
              <InlineContent nodes={item} />
            </li>
          ))}
        </ul>
      )
    case 'table':
      return <Table block={block} />
    case 'callout':
      return (
        <aside className="my-10 border-l-2 border-accent bg-surface px-5 py-6 sm:px-7">
          {block.title ? (
            <p className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-serif text-xl leading-snug text-ink">
              <InlineContent nodes={block.title} />
            </p>
          ) : null}
          <div className="space-y-4 text-[0.95rem] leading-relaxed text-ink-muted">
            {block.blocks.map((inner, index) => (
              <ArticleBlock key={index} block={inner} renderVisual={renderVisual} />
            ))}
          </div>
        </aside>
      )
    case 'visual':
      return <>{renderVisual(block.id)}</>
  }
}

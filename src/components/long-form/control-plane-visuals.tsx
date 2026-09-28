import type { ReactNode } from 'react'
import type { EvidenceLabel } from '@/content/articles/parse-article-markdown'
import { EvidenceTag } from './article-blocks'

/**
 * The single native figure for "The Control Plane Problem": the reference
 * architecture from Chapter 10. It reflows to one column on narrow
 * screens, carries meaning through text and position (never color alone),
 * and uses only the shared design tokens (border-line, bg-surface,
 * text-accent, etc.) so it holds up in both themes.
 */

function Figure({
  question,
  evidence,
  note,
  children,
}: {
  question: string
  evidence: EvidenceLabel[]
  note?: string
  children: ReactNode
}) {
  return (
    <figure className="article-figure my-12" aria-labelledby="rf-figure-caption">
      <figcaption id="rf-figure-caption" className="mb-5">
        <span className="label-mono text-accent">Figure — Reference architecture</span>
        <span className="mt-2 block font-serif text-lg leading-snug text-ink">{question}</span>
      </figcaption>
      {children}
      <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-line pt-3 text-sm text-ink-muted">
        <span className="flex flex-wrap gap-x-3 gap-y-1">
          {evidence.map((label) => (
            <EvidenceTag key={label} label={label} />
          ))}
        </span>
        {note ? <span>{note}</span> : null}
      </div>
    </figure>
  )
}

const STACK = [
  { name: 'Experience', detail: 'Copilots, applications, APIs — where a request enters the system.' },
  { name: 'Agent / workflow runtime', detail: 'The eight components of Chapter 4: runtime, reasoning, memory, tool calling, guardrails, security, testing, orchestration.' },
  { name: 'Orchestration', detail: 'Chapter 5\u2019s pattern choice — single agent, sequential, or orchestrator-based — reshapes every layer around it.' },
  { name: 'Models  ·  Context', detail: 'Side by side, not stacked: neither is \u201cthe system\u201d alone (Chapter 1).', split: true },
  { name: 'Tools  ·  APIs  ·  Enterprise systems', detail: 'Where reasoning becomes action, and where authorization has to be enforced, not just declared.' },
]

function ReferenceArchitecture() {
  return (
    <Figure
      question="One request's path through the stack, with the control plane running alongside every layer rather than sitting underneath it"
      evidence={['SYNTHESIS']}
      note="Author synthesis, informed by Forrester's platform diagram (FP, Figure 1) and eight-component breakdown (FA) — not a framework either report publishes as such."
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]">
        <div className="space-y-2">
          {STACK.map((layer, index) => (
            <div key={layer.name}>
              <div
                className={
                  layer.split
                    ? 'grid grid-cols-2 divide-x divide-line-strong rounded-sm border border-line-strong bg-paper'
                    : 'rounded-sm border border-line-strong bg-paper px-4 py-3'
                }
              >
                {layer.split ? (
                  <>
                    <div className="px-4 py-3">
                      <p className="label-mono text-accent">Models</p>
                    </div>
                    <div className="px-4 py-3">
                      <p className="label-mono text-accent">Context</p>
                    </div>
                  </>
                ) : (
                  <p className="label-mono text-accent">{layer.name}</p>
                )}
              </div>
              <p className="mt-1.5 text-sm leading-snug text-ink-muted">{layer.detail}</p>
              {index < STACK.length - 1 ? (
                <div aria-hidden="true" className="my-2 ml-4 h-3 border-l border-dashed border-line-strong" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="flex sm:flex-col">
          <div className="flex w-full items-center justify-center rounded-sm border border-accent/40 bg-accent-soft px-3 py-4 text-center sm:h-full sm:flex-col">
            <p className="label-mono text-accent sm:[writing-mode:vertical-lr]">Control plane</p>
          </div>
        </div>
      </div>

      <ul className="mt-4 grid gap-x-6 gap-y-1.5 text-sm text-ink-muted sm:grid-cols-2">
        <li>· Identity — who or what is acting, and on whose behalf</li>
        <li>· Policy — what this actor is authorized to do, right now</li>
        <li>· Evaluation — did the trajectory actually accomplish the task</li>
        <li>· Observability — why the trajectory ended where it did</li>
      </ul>
    </Figure>
  )
}

export function ControlPlaneVisual({ id }: { id: string }) {
  switch (id) {
    case 'reference-architecture':
      return <ReferenceArchitecture />
    default:
      return null
  }
}

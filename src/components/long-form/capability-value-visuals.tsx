import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { EvidenceLabel } from '@/content/articles/parse-article-markdown'
import { EvidenceTag } from './article-blocks'

/**
 * Native figures for "From Capability to Value". Each figure answers one
 * stated question, names its evidence status, and reflows into a single
 * column on narrow screens. Meaning is carried by text and order, never
 * by color alone.
 */

function Figure({
  number,
  question,
  evidence,
  note,
  children,
}: {
  number: number
  question: string
  evidence: EvidenceLabel[]
  note?: ReactNode
  children: ReactNode
}) {
  const id = `cv-figure-${number}`
  return (
    <figure className="article-figure my-12" aria-labelledby={`${id}-caption`}>
      <figcaption id={`${id}-caption`} className="mb-5">
        <span className="label-mono text-accent">Figure {number}</span>
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

const LAYERS = [
  { n: 6, name: 'Value', question: 'Was the work worth its cost, and did anyone want it?', source: 'Synthesis (+ SA, LT)', running: 'Worth the tokens, review time and risk?' },
  { n: 5, name: 'Learning', question: 'What gets better next time, and which “learning” do we mean?', source: 'TH · LM · LT · SA', running: 'Will the next agent avoid the mistake?' },
  { n: 4, name: 'Trust', question: 'Who or what decides the result is acceptable?', source: 'LT · LM', running: 'What stops a “fix” that moves heavy work onto the UI thread?' },
  { n: 3, name: 'Action', question: 'What can the agent do in a real system, and how does it see the result?', source: 'LT', running: 'Launch the app, reach the sidebar, record a trace' },
  { n: 2, name: 'Context', question: 'What does the model need to know about this situation?', source: 'LM · LT', running: 'Which part of this app is “the left sidebar”?' },
  { n: 1, name: 'Model', question: 'What can it compute, how is it kept stable, and what does it cost?', source: 'TH', running: 'Predict the next token of a plan or a patch' },
]

function LayerMap() {
  return (
    <Figure
      number={1}
      question="Six layers between a model's raw ability and valuable work, and where the running case sits in each"
      evidence={['SYNTHESIS']}
      note="The author's framework. Each layer answers a question the layer below leaves open."
    >
      <ol className="space-y-2">
        {LAYERS.map((layer) => (
          <li
            key={layer.n}
            className="grid gap-x-4 gap-y-1 rounded-sm border border-line-strong bg-paper px-4 py-3 md:grid-cols-[7rem_minmax(0,1.3fr)_minmax(0,1fr)]"
          >
            <p className="label-mono text-accent">
              {layer.n} · {layer.name}
            </p>
            <p className="text-sm leading-snug text-ink">
              {layer.question}
              <span className="label-mono mt-1 block text-ink-faint">{layer.source}</span>
            </p>
            <p className="text-sm leading-snug text-ink-muted">
              <span className="label-mono mr-1 text-ink-faint md:hidden">Running case:</span>
              {layer.running}
            </p>
          </li>
        ))}
      </ol>
    </Figure>
  )
}

function KvCache() {
  const steps = [1, 2, 3, 4, 5]
  return (
    <Figure
      number={2}
      question="Why decoding is memory-bound: every new token re-reads the weights and the whole growing cache"
      evidence={['FORMAL MODEL']}
      note="After the lecture's slides (pp. 58–61) and Shazeer (2019). Schematic, not to scale."
    >
      <div className="space-y-3">
        {steps.map((t) => (
          <div key={t} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3">
            <span className="label-mono text-ink-faint">step {t}</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-sm border border-line-strong px-2 py-1 text-xs text-ink-muted">weights (read)</span>
              <span aria-hidden="true" className="text-ink-faint">+</span>
              <span className="flex gap-0.5" aria-label={`${t} cached key/value entries read`}>
                {Array.from({ length: t }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'inline-block h-5 w-5 rounded-[2px] border',
                      i === t - 1 ? 'border-accent bg-accent-soft' : 'border-line-strong bg-surface',
                    )}
                  />
                ))}
              </span>
              <span className="text-xs text-ink-muted">{t === 1 ? '1 key/value entry' : `${t} key/value entries`} read; the newest (outlined) was just added</span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">
        Arithmetic per step stays roughly constant, but the bytes read grow with the context length n. Hence the decode intensity
        O((n/d + 1/b)⁻¹): longer contexts and smaller batches both push the GPU toward waiting on memory.
      </p>
    </Figure>
  )
}

function EnforcementLadder() {
  const rungs = [
    { n: 1, name: 'codebase', note: 'Agents tend to copy existing patterns', hard: true },
    { n: 2, name: 'static analysis (lint/compiler/ci)', note: 'Mechanical checks can fail CI', hard: true },
    { n: 3, name: 'rules/bugbot', note: 'Agents may omit guidance', hard: false },
    { n: 4, name: 'skills', note: 'Application may be inconsistent', hard: false },
    { n: 5, name: '“style guide”', note: 'Insufficient as the only enforcement layer', hard: false },
  ]
  return (
    <Figure
      number={3}
      question="Tan's layers of enforcement, strongest first: which rules can an agent forget?"
      evidence={['PRACTITIONER']}
      note="Layer names transcribed from Tan's slide (LT-full 48:20). Annotations paraphrase machine-transcribed commentary (V01 42:29–45:23), not listening-verified quotations. Hard enforcement requires mechanical checks."
    >
      <ol className="space-y-2">
        {rungs.map((rung) => (
          <li
            key={rung.n}
            className={cn(
              'grid gap-x-4 gap-y-1 rounded-sm border px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto]',
              rung.hard ? 'border-accent bg-accent-soft' : 'border-dashed border-line-strong bg-paper',
            )}
          >
            <p className="text-sm text-ink">
              <span className="label-mono mr-2 text-accent">{rung.n}</span>
              {rung.name}
              <span className="mt-1 block text-ink-muted">{rung.note}</span>
            </p>
            <p className="label-mono self-center text-ink-faint">{rung.hard ? 'Hard · makes CI red' : 'Soft · can be forgotten'}</p>
          </li>
        ))}
      </ol>
    </Figure>
  )
}

function ThreeLoops() {
  const loops = [
    { name: 'Loop 1 · Training', updates: 'Model weights', signal: 'Loss on training data', clock: 'Weeks to months', owner: 'The lab' },
    { name: 'Loop 2 · Agent memory and harness', updates: 'Memory, skills, rules', signal: 'Transcripts, traces, tests, evals', clock: 'Seconds to days', owner: 'The team running agents' },
    { name: 'Loop 3 · Founder and product', updates: 'The product; the founder’s beliefs', signal: 'What users do and say', clock: 'Days to months', owner: 'The founder' },
  ]
  return (
    <Figure
      number={4}
      question="Three loops that are all called “learning”: what each updates, from what signal, on what clock"
      evidence={['SYNTHESIS']}
      note="Outputs of one loop can feed another (a user report becomes agent context), but they do not merge."
    >
      <div className="grid gap-3 md:grid-cols-3">
        {loops.map((loop) => (
          <div key={loop.name} className="rounded-sm border border-line-strong bg-paper px-4 py-4">
            <p className="label-mono text-accent">{loop.name}</p>
            <dl className="mt-3 space-y-2 text-sm">
              {[
                ['Updates', loop.updates],
                ['Signal', loop.signal],
                ['Clock', loop.clock],
                ['Controlled by', loop.owner],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="label-mono text-ink-faint">{k}</dt>
                  <dd className="text-ink-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-sm border border-line px-4 py-3">
        <p className="label-mono text-ink-faint">Inside loop 3</p>
        <ol className="mt-2 grid gap-2 text-sm text-ink-muted sm:grid-cols-4">
          <li><span className="text-ink">build</span>: agents compress this</li>
          <li><span className="text-ink">ship</span>: deploy, distribute</li>
          <li><span className="text-ink">users respond</span>: days to months</li>
          <li><span className="text-ink">founder interprets</span>: conversations</li>
        </ol>
      </div>
    </Figure>
  )
}

export function CapabilityValueVisual({ id }: { id: string }) {
  switch (id) {
    case 'layer-map':
      return <LayerMap />
    case 'kv-cache':
      return <KvCache />
    case 'enforcement-ladder':
      return <EnforcementLadder />
    case 'three-loops':
      return <ThreeLoops />
    default:
      return null
  }
}

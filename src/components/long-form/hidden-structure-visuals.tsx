import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { EvidenceLabel } from '@/content/articles/parse-article-markdown'
import { EvidenceTag } from './article-blocks'

/**
 * Native explanatory figures for "The Hidden Structure of Work".
 * Every figure answers one stated question, carries its evidence
 * status, and reflows (rather than shrinks) on narrow screens. No
 * figure encodes meaning in color alone: states are also named in text
 * or marked with shape/strike-through.
 */

function Figure({
  id,
  question,
  evidence,
  note,
  wide,
  children,
}: {
  id: string
  question: string
  evidence: EvidenceLabel[]
  note?: ReactNode
  wide?: boolean
  children: ReactNode
}) {
  return (
    <figure className={cn('article-figure my-12', wide && 'article-figure--wide')} aria-labelledby={`${id}-caption`}>
      <figcaption id={`${id}-caption`} className="mb-5">
        <span className="label-mono text-accent">Figure {id.replace('V', '')}</span>
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

function Node({ children, strong, className }: { children: ReactNode; strong?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-sm border px-3 py-2 text-sm leading-snug',
        strong ? 'border-accent bg-accent-soft text-ink' : 'border-line-strong bg-paper text-ink-muted',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* V1 — Formal structure vs. working structure */
function V1() {
  const dependencies = [
    ['Data team', 'access to source tables'],
    ['Security', 'the review queue'],
    ['Finance', 'contractor budget'],
    ['Senior sales leader', 'adoption by the largest user group'],
  ]
  return (
    <Figure
      id="V1"
      question="Who is formally responsible, and who controls the conditions of implementation?"
      evidence={['SYNTHESIS']}
      note="Hypothetical example from Chapter 1."
    >
      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        <div>
          <p className="label-mono mb-4 text-ink-muted">What the org chart shows</p>
          <div className="flex flex-col items-center gap-3">
            <Node>Leadership</Node>
            <div className="h-4 w-px bg-line-strong" aria-hidden="true" />
            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
              <Node strong>Product manager · owns the launch</Node>
              <Node>Data</Node>
              <Node>Security</Node>
              <Node>Finance</Node>
              <Node>Sales</Node>
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-muted">Formal ownership sits in one box.</p>
        </div>
        <div>
          <p className="label-mono mb-4 text-ink-muted">What the launch depends on</p>
          <ul className="space-y-2">
            {dependencies.map(([who, what]) => (
              <li key={who}>
                <Node>
                  <span className="text-ink">{who}</span> controls {what}
                </Node>
              </li>
            ))}
          </ul>
          <p className="my-2 text-center text-accent" aria-hidden="true">
            ↓
          </p>
          <Node strong className="text-center">
            The launch needs all four forms of cooperation
          </Node>
        </div>
      </div>
    </Figure>
  )
}

/* V2 — Dependence and alternatives */
function V2() {
  const variants = [
    { label: 'No substitute', level: 'High dependence', weight: 'h-2.5', alt: 0 },
    { label: 'One substitute', level: 'Moderate dependence', weight: 'h-1.5', alt: 1 },
    { label: 'Several substitutes', level: 'Low dependence', weight: 'h-0.5', alt: 3 },
  ]
  return (
    <Figure
      id="V2"
      question="Where does leverage come from?"
      evidence={['CONCEPTUAL']}
      note="Dependence is “a function of how much others need what we control, as well as how many alternative sources for that resource there are” (Pfeffer, 1992, p. 92)."
    >
      <div className="grid gap-6 sm:grid-cols-3">
        {variants.map((v) => (
          <div key={v.label} className="border-t border-line pt-4">
            <p className="label-mono text-ink-muted">{v.label}</p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-ink">A needs</span>
              <span className={cn('flex-1 rounded-full bg-accent', v.weight)} aria-hidden="true" />
              <span className="text-ink">B</span>
            </div>
            <p className="mt-2 text-xs text-ink-muted">
              {v.alt === 0 ? 'No other source' : `${v.alt} other source${v.alt > 1 ? 's' : ''}`}
            </p>
            <p className="mt-3 font-medium text-ink">{v.level}</p>
          </div>
        ))}
      </div>
    </Figure>
  )
}

/* V3 — Political skill inside structure */
function V3() {
  const dimensions = [
    ['Social astuteness', 'Reading situations and interests'],
    ['Interpersonal influence', 'Adapting how one persuades'],
    ['Networking ability', 'Building and using relationships'],
    ['Apparent sincerity', 'Being perceived as genuine: perceived, not proven'],
  ]
  const constraints = ['Resources', 'Formal authority', 'Alternatives', 'How the audience reads the actor']
  return (
    <Figure
      id="V3"
      question="How can social effectiveness operate without becoming a claim about character or guaranteed success?"
      evidence={['EMPIRICAL', 'CONCEPTUAL', 'SYNTHESIS']}
      note="Four dimensions: Ferris et al. (2005; 2007). The surrounding constraints are this article's synthesis."
    >
      <div className="rounded-sm border border-dashed border-line-strong p-4 sm:p-6">
        <p className="label-mono mb-4 text-ink-muted">Operates inside: {constraints.join(' · ')}</p>
        <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
          {dimensions.map(([name, gloss]) => (
            <div key={name} className="bg-paper p-4">
              <p className="font-serif text-lg text-ink">{name}</p>
              <p className="mt-1 text-sm text-ink-muted">{gloss}</p>
            </div>
          ))}
        </div>
      </div>
    </Figure>
  )
}

/* V5 — Credibility decision tree */
function V5() {
  return (
    <Figure
      id="V5"
      question="Would this threat be carried out when the moment arrives?"
      evidence={['FORMAL MODEL', 'SYNTHESIS']}
      note="Payoffs from the illustrative matrix (Team A, Team B). Backward induction: Yildiz, Ch. 9."
    >
      <ol className="space-y-4">
        <li className="grid gap-2 sm:grid-cols-[7rem_1fr] sm:items-start">
          <span className="label-mono pt-2 text-ink-muted">Step 1</span>
          <Node strong>Team A moves first and builds the integration on Format A.</Node>
        </li>
        <li className="grid gap-2 sm:grid-cols-[7rem_1fr] sm:items-start">
          <span className="label-mono pt-2 text-ink-muted">Step 2</span>
          <div className="grid gap-3 sm:grid-cols-2">
            <Node>
              <span className="text-ink">Team B matches Format A</span>
              <span className="mt-1 block text-xs">Payoffs 2, 1. Team B gets 1.</span>
            </Node>
            <Node className="border-dashed">
              <span className="text-ink line-through decoration-accent decoration-2">Team B refuses to integrate</span>
              <span className="mt-1 block text-xs">Payoffs 0, 0. Team B gets 0.</span>
              <span className="label-mono mt-2 block text-accent">Not credible</span>
            </Node>
          </div>
        </li>
        <li className="grid gap-2 sm:grid-cols-[7rem_1fr] sm:items-start">
          <span className="label-mono pt-2 text-ink-muted">Reason back</span>
          <p className="text-sm text-ink-muted">
            Once Team A has built, refusing would cost Team B more than matching. Team B would not choose it at that
            point, so the threat does not deter Team A.
          </p>
        </li>
      </ol>
    </Figure>
  )
}

/* V6 — Bargaining range */
function RangeBar({ low, high, deal, caption }: { low: number; high: number; deal?: number; caption: string }) {
  return (
    <div>
      <div className="relative h-8" aria-hidden="true">
        <div className="absolute inset-x-0 top-1/2 h-px bg-line-strong" />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-accent-soft ring-1 ring-accent"
          style={{ left: `${low}%`, width: `${high - low}%` }}
        />
        <div className="absolute top-0 h-8 w-0.5 bg-ink" style={{ left: `${low}%` }} />
        <div className="absolute top-0 h-8 w-0.5 bg-ink" style={{ left: `${high}%` }} />
        {deal !== undefined ? (
          <div
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-ink"
            style={{ left: `${deal}%` }}
          />
        ) : null}
      </div>
      <p className="mt-1 text-sm text-ink-muted">{caption}</p>
    </div>
  )
}

function V6() {
  return (
    <Figure
      id="V6"
      question="What happens if the other side says no?"
      evidence={['FORMAL MODEL', 'SYNTHESIS']}
      note="Authority decides who may decide. Bargaining power depends on what each party can do if the other says no."
    >
      <div className="mb-4 flex justify-between gap-4 text-xs text-ink-muted">
        <span>← Terms better for the platform team</span>
        <span className="text-right">Terms better for the product team →</span>
      </div>
      <p className="mb-5 text-sm text-ink-muted">
        Each vertical line is a fallback: the product team accepts nothing left of its line, the platform team nothing
        right of its line. Any agreement falls in the shaded range between them.
      </p>
      <div className="space-y-5">
        <RangeBar low={30} high={70} caption="Baseline: both fallbacks moderate." />
        <RangeBar
          low={50}
          high={70}
          caption="(a) The product team finds a workaround: its fallback improves and the range shifts in its favor."
        />
        <RangeBar
          low={15}
          high={70}
          caption="(b) Delay becomes costly for the product team: it will accept worse terms, so the range extends against it."
        />
        <RangeBar
          low={30}
          high={70}
          deal={62}
          caption="(c) The procedure changes: the range is unchanged, but who proposes moves the likely deal (◆) within it."
        />
      </div>
    </Figure>
  )
}

/* V7 — Same action, hidden types */
function V7() {
  const panel = (title: string, rows: [string, string][], belief: string, learns: string) => (
    <div className="border-t border-line pt-4">
      <p className="font-serif text-lg text-ink">{title}</p>
      <table className="mt-3 w-full text-sm">
        <thead>
          <tr className="text-left text-ink-muted">
            <th scope="col" className="label-mono pb-2 font-normal">
              Hidden type
            </th>
            <th scope="col" className="label-mono pb-2 font-normal">
              Visible action
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([type, action]) => (
            <tr key={type} className="border-t border-line">
              <td className="py-2 pr-3 text-ink-muted">{type}</td>
              <td className="py-2 text-ink">{action}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-sm text-ink-muted">
        <span className="text-ink">After seeing “declines”:</span> {belief}
      </p>
      <p className="label-mono mt-2 text-accent">{learns}</p>
    </div>
  )
  return (
    <Figure
      id="V7"
      question="What can an observer actually learn from this action?"
      evidence={['FORMAL MODEL', 'SYNTHESIS']}
      note="Pooling and separating: Yildiz, Ch. 16, p. 321. The team example is an analogy."
    >
      <div className="grid gap-8 md:grid-cols-2">
        {panel(
          'Pooling',
          [
            ['Overloaded team', 'Declines'],
            ['Uninterested team', 'Declines'],
          ],
          'the director cannot tell which kind of team this is; the prior belief stands.',
          'Director learns nothing',
        )}
        {panel(
          'Separating',
          [
            ['Overloaded team', 'Declines'],
            ['Uninterested team', 'Accepts'],
          ],
          'only an overloaded team would decline, so the director updates.',
          'Director learns the type',
        )}
      </div>
    </Figure>
  )
}

/* V8 — Repeated-interaction timeline */
function Round({ move, note }: { move: 'C' | 'D'; note?: string }) {
  return (
    <span className="flex flex-col items-center gap-1">
      <span
        className={cn(
          'flex size-8 items-center justify-center rounded-sm border font-mono text-xs',
          move === 'C' ? 'border-line-strong bg-paper text-ink' : 'border-accent bg-accent-soft text-ink',
        )}
      >
        {move}
      </span>
      {note ? <span className="text-[0.65rem] text-ink-muted">{note}</span> : null}
    </span>
  )
}

function V8() {
  const row = (title: string, rounds: ReactNode, caption: string) => (
    <div className="grid gap-2 border-t border-line py-4 sm:grid-cols-[10rem_1fr]">
      <p className="label-mono pt-2 text-ink-muted">{title}</p>
      <div>
        <div className="flex gap-2 overflow-x-auto pb-1">{rounds}</div>
        <p className="mt-2 text-sm text-ink-muted">{caption}</p>
      </div>
    </div>
  )
  return (
    <Figure
      id="V8"
      question="How does the future change what is worth doing now?"
      evidence={['FORMAL MODEL', 'SYNTHESIS']}
      note="C = cooperate, D = defect. Yildiz, Ch. 12, pp. 201, 208, 215; Ch. 13, p. 252."
    >
      {row('One-shot', <Round move="D" />, 'No future: each player defects.')}
      {row(
        'Known last round',
        <>
          {[1, 2, 3, 4].map((n) => (
            <Round key={n} move="D" note={`${n}`} />
          ))}
          <Round move="D" note="last" />
        </>,
        'Defection in the last round unravels backward to the first.',
      )}
      {row(
        'Open-ended',
        <>
          {[1, 2, 3, 4].map((n) => (
            <Round key={n} move="C" note={`${n}`} />
          ))}
          <Round move="D" note="deviation" />
          <Round move="D" note="response" />
          <span className="self-center pb-5 text-ink-muted">…</span>
        </>,
        'Cooperation holds while the future matters; a deviation triggers a credible response.',
      )}
      <p className="mt-2 border-l-2 border-accent pl-4 text-sm text-ink-muted">
        The same mechanism can sustain cooperation among insiders that works against outsiders. Repetition expands what is
        stable. It does not select what is good.
      </p>
    </Figure>
  )
}

/* V9 — Brokerage and centrality */
function V9() {
  // Two clusters (left, right), a broker between them, a many-contact
  // node inside the left cluster, and a decision-maker attached right.
  const nodes: Record<string, [number, number]> = {
    a1: [70, 70],
    a2: [70, 190],
    a3: [150, 40],
    a4: [150, 220],
    hub: [130, 130],
    broker: [300, 130],
    b1: [450, 70],
    b2: [450, 190],
    b3: [530, 130],
    dm: [620, 130],
  }
  const edges: [string, string][] = [
    ['a1', 'a2'], ['a1', 'a3'], ['a2', 'a4'], ['a3', 'a4'],
    ['hub', 'a1'], ['hub', 'a2'], ['hub', 'a3'], ['hub', 'a4'],
    ['a3', 'broker'], ['broker', 'b1'],
    ['b1', 'b2'], ['b1', 'b3'], ['b2', 'b3'], ['b3', 'dm'],
  ]
  const marks: Record<string, string> = { hub: '1', broker: '2', dm: '3' }
  return (
    <Figure
      id="V9"
      question="Who is positioned to control information and assemble support?"
      evidence={['CONCEPTUAL']}
      note="Centrality measures as described in Pfeffer (1992, pp. 111–112); brokerage in Pfeffer (2010, Ch. 6)."
    >
      <svg viewBox="0 0 680 260" className="w-full" role="img" aria-labelledby="v9-title v9-desc">
        <title id="v9-title">Two groups joined by one broker</title>
        <desc id="v9-desc">
          Node 1 has many contacts inside the left group. Node 2 is the only link between the groups. Node 3, a
          decision-maker, is reachable from the left group only through node 2.
        </desc>
        {edges.map(([from, to]) => (
          <line
            key={`${from}-${to}`}
            x1={nodes[from][0]}
            y1={nodes[from][1]}
            x2={nodes[to][0]}
            y2={nodes[to][1]}
            stroke="var(--color-line-strong)"
            strokeWidth={2}
          />
        ))}
        {Object.entries(nodes).map(([key, [x, y]]) => {
          const marked = marks[key]
          const isBroker = key === 'broker'
          return (
            <g key={key}>
              {key === 'dm' ? (
                <rect x={x - 22} y={y - 22} width={44} height={44} rx={4} fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth={2} />
              ) : (
                <circle
                  cx={x}
                  cy={y}
                  r={marked ? 22 : 13}
                  fill={isBroker ? 'var(--color-accent-soft)' : 'var(--color-paper)'}
                  stroke={isBroker ? 'var(--color-accent)' : 'var(--color-ink-faint)'}
                  strokeWidth={isBroker ? 3 : 2}
                />
              )}
              {marked ? (
                <text x={x} y={y + 7} textAnchor="middle" fontSize={20} fill="var(--color-ink)" fontFamily="var(--font-mono)">
                  {marked}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="font-medium text-ink">1 · Many contacts</dt>
          <dd className="mt-1 text-ink-muted">High connectedness, low betweenness: everyone it knows also knows each other.</dd>
        </div>
        <div>
          <dt className="font-medium text-ink">2 · Broker</dt>
          <dd className="mt-1 text-ink-muted">High betweenness: the only path between groups, so it controls what each side learns.</dd>
        </div>
        <div>
          <dt className="font-medium text-ink">3 · Decision-maker</dt>
          <dd className="mt-1 text-ink-muted">Reachable from the left group only through the broker.</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-ink-muted">
        Network position is a property of this structure. Political skill is a capability of the person occupying it.
      </p>
    </Figure>
  )
}

/* V10 — Same move, different cost paths */
function V10() {
  const rows: [string, string, string][] = [
    ['Observer’s prior belief', 'Reads a refusal as a considered judgment', 'Reads the same refusal as low commitment'],
    ['Reputation buffer', 'Long favorable record', 'Newcomer with little history'],
    ['Available alternatives', 'Could credibly move elsewhere', 'Few workable options'],
    ['Remaining capacity', 'Slack to absorb the risk', 'Already carrying extra, less visible work'],
  ]
  return (
    <Figure
      id="V10"
      question="What does this move cost this person?"
      evidence={['SYNTHESIS', 'PRACTITIONER']}
      note="Two hypothetical people in the same role. Structurally available is not the same as equally affordable."
    >
      <p className="mb-4 text-sm text-ink-muted">
        <span className="text-ink">The move:</span> declining an extra assignment.
      </p>
      <div className="overflow-x-auto">
        <table className="article-table article-table--wide">
          <thead>
            <tr>
              <th scope="col">Checkpoint</th>
              <th scope="col">Person A</th>
              <th scope="col">Person B</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([checkpoint, a, b]) => (
              <tr key={checkpoint}>
                <th scope="row">{checkpoint}</th>
                <td>{a}</td>
                <td>{b}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">Resulting cost and risk</th>
              <td className="text-ink">Low</td>
              <td className="text-ink">High</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Figure>
  )
}

/* V11 — Organizational diagnostic systems map (hero) */
const STAGES: { name: string; dims: [number, string][] }[] = [
  { name: 'Formal structure', dims: [[1, 'Formal authority']] },
  { name: 'Dependence', dims: [[2, 'Resource control'], [3, 'Dependence']] },
  {
    name: 'Strategic conditions',
    dims: [[4, 'Incentives'], [5, 'Alternatives and fallbacks'], [6, 'Information distribution'], [7, 'Credibility']],
  },
  { name: 'Time', dims: [[8, 'Repeated interaction'], [9, 'Reputation']] },
  { name: 'Social structure', dims: [[10, 'Network position'], [11, 'Coalitions']] },
  { name: 'Execution under constraint', dims: [[12, 'Political skill'], [13, 'Individual and social constraints']] },
]

const CHAINS: { id: string; label: string; path: string; dims: number[] }[] = [
  { id: 'leverage', label: 'Leverage', path: 'Resource control → dependence → leverage', dims: [2, 3, 5] },
  {
    id: 'interpretation',
    label: 'Interpretation',
    path: 'Private information → belief → interpretation → strategic response',
    dims: [6, 9],
  },
  {
    id: 'implementation',
    label: 'Implementation',
    path: 'Network position → access → coalition possibilities → implementation capacity',
    dims: [10, 11],
  },
]

function V11() {
  const [chainId, setChainId] = useState<string | null>(null)
  const chain = CHAINS.find((c) => c.id === chainId) ?? null

  return (
    <Figure
      id="V11"
      question="Which mechanisms are operating here, and how do they connect?"
      evidence={['SYNTHESIS']}
      wide
      note="Select a dimension to read its questions below. The order of stages is a reading order, not a causal claim."
    >
      <p className="mb-6 border border-line-strong px-4 py-3 text-center text-sm text-ink" role="note">
        <span className="label-mono text-accent">Synthesis diagnostic</span>
        <span className="mx-2 text-ink-muted" aria-hidden="true">·</span>
        Not validated · Not predictive · Not an equation · Not a score
      </p>

      <ol className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {STAGES.map((stage, stageIndex) => (
          <li key={stage.name} className="bg-paper p-4">
            <p className="label-mono text-ink-muted">
              Stage {stageIndex + 1}
              <span aria-hidden="true"> {stageIndex < STAGES.length - 1 ? '→' : ''}</span>
            </p>
            <p className="mt-2 font-serif text-lg text-ink">{stage.name}</p>
            <ul className="mt-3 space-y-1.5">
              {stage.dims.map(([n, name]) => {
                const inChain = chain?.dims.includes(n) ?? false
                return (
                  <li key={n}>
                    <a
                      href={`#dimension-${n}`}
                      className={cn(
                        'flex items-baseline gap-2 rounded-sm px-1.5 py-1 text-sm transition-colors hover:bg-surface',
                        chain && !inChain ? 'text-ink-muted' : 'text-ink',
                        inChain && 'bg-accent-soft font-medium ring-1 ring-accent',
                      )}
                    >
                      <span className="label-mono w-5 shrink-0 text-accent">{n}</span>
                      <span>{name}</span>
                      {inChain ? <span className="sr-only">(in selected chain)</span> : null}
                    </a>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-6">
        <p className="label-mono mb-3 text-ink-muted">Recurring chains (synthesis, not tested causal models)</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Highlight a chain">
          {CHAINS.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={chainId === c.id}
              onClick={() => setChainId(chainId === c.id ? null : c.id)}
              className={cn(
                'rounded-sm border px-3 py-1.5 text-sm transition-colors',
                chainId === c.id ? 'border-accent bg-accent-soft text-ink' : 'border-line-strong text-ink-muted hover:text-ink',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <p className="mt-3 min-h-[1.5rem] text-sm text-ink-muted" aria-live="polite">
          {chain ? chain.path : 'Select a chain to highlight the dimensions it runs through.'}
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Cross-stage links: reputation → credibility · constraints → alternatives · information → reputation.
        </p>
      </div>
    </Figure>
  )
}

/* V12 — Model limitations grid */
function V12() {
  const rows: [string, string, string, string][] = [
    ['Hierarchy', 'Formal rights settle who acts', 'Who may decide and who is accountable', 'Who controls implementation'],
    ['Dependence', 'Needs and alternatives can be mapped', 'Where leverage comes from', 'Interpretation and legitimacy'],
    ['Strategic models', 'Known payoffs, actions, rational play', 'Credibility and stability', 'Fairness, psychology, the wrong game'],
    ['Information models', 'Known types, shared priors, consistent beliefs', 'Inference and signaling', 'Noisy, inconsistent beliefs; non-signals'],
    ['Repeated interaction', 'Observed actions, continuing relationship', 'How the future disciplines the present', 'Ambiguous history; stable but bad outcomes'],
    ['Networks', 'Position can be identified', 'Access and information control', 'Skill; which caused which'],
    ['Political skill', 'A measured individual construct', 'Social execution', 'Structure; causation; character'],
    ['Practitioner guidance', "Authors' observation and experience", 'Costs and constraints others omit', 'General effects'],
  ]
  return (
    <Figure
      id="V12"
      question="Which lens explains which part of the situation, and when does it stop working?"
      evidence={['SYNTHESIS']}
      note="Cells summarize the limits stated in this chapter."
    >
      <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line md:hidden">
        {rows.map(([lens, assumes, explains, fails]) => (
          <dl key={lens} className="bg-paper p-4 text-sm">
            <p className="font-serif text-lg text-ink">{lens}</p>
            <dt className="label-mono mt-3 text-ink-muted">Key assumption</dt>
            <dd className="mt-1 text-ink-muted">{assumes}</dd>
            <dt className="label-mono mt-3 text-ink-muted">Explains well</dt>
            <dd className="mt-1 text-ink-muted">{explains}</dd>
            <dt className="label-mono mt-3 text-ink-muted">Fails at</dt>
            <dd className="mt-1 text-ink-muted">{fails}</dd>
          </dl>
        ))}
      </div>
      <div className="hidden md:block">
        <table className="article-table article-table--wide">
          <thead>
            <tr>
              <th scope="col">Lens</th>
              <th scope="col">Key assumption</th>
              <th scope="col">Explains well</th>
              <th scope="col">Fails at</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([lens, assumes, explains, fails]) => (
              <tr key={lens}>
                <th scope="row">{lens}</th>
                <td>{assumes}</td>
                <td>{explains}</td>
                <td>{fails}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Figure>
  )
}

const VISUALS: Record<string, () => ReactNode> = { V1, V2, V3, V5, V6, V7, V8, V9, V10, V11, V12 }

export function HiddenStructureVisual({ id }: { id: string }) {
  const Visual = VISUALS[id]
  return Visual ? <Visual /> : null
}

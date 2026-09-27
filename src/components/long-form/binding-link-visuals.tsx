import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { EvidenceLabel } from '@/content/articles/parse-article-markdown'
import { EvidenceTag } from './article-blocks'

/**
 * Native explanatory figures for "The Binding Link". Each figure answers one
 * stated question, carries its evidence status, and reflows into a single
 * column on narrow screens rather than shrinking. No figure encodes meaning
 * in color alone: every state is also named in text or marked with a glyph.
 */

function Figure({
  n,
  question,
  evidence,
  note,
  children,
}: {
  n: number
  question: string
  evidence: EvidenceLabel[]
  note?: ReactNode
  children: ReactNode
}) {
  const id = `bl-figure-${n}`
  return (
    <figure className="article-figure my-12" aria-labelledby={`${id}-caption`}>
      <figcaption id={`${id}-caption`} className="mb-5">
        <span className="label-mono text-accent">Figure {n}</span>
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

function Card({
  children,
  strong,
  dashed,
  className,
}: {
  children: ReactNode
  strong?: boolean
  dashed?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-sm border px-4 py-3',
        strong ? 'border-accent bg-accent-soft' : dashed ? 'border-dashed border-line-strong bg-paper' : 'border-line-strong bg-paper',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ---------------------------------------------------------------- Figure 1 */

const LINKS = [
  { n: 1, name: 'Attention', carries: 'A moment of evaluation', measure: 'Engaged leads, not reach', ch: 2 },
  { n: 2, name: 'Demand', carries: 'Buyers who can act', measure: 'Qualified leads accepted by the receiving function', ch: 2 },
  { n: 3, name: 'Perceived value', carries: 'An estimate of what they will get', measure: 'Each driver paired with its delivered counterpart', ch: 3 },
  { n: 4, name: 'Conversion', carries: 'A commitment', measure: 'Close rate on accepted leads, with downstream counter-metrics', ch: 4 },
  { n: 5, name: 'Delivery', carries: 'Value that actually exists', measure: 'Spread of time-to-value, not its mean', ch: 5 },
  { n: 6, name: 'Retention and trust', carries: 'Repeat purchase, referral, reputation', measure: 'Value-driven and switching-cost retention, reported apart', ch: 6 },
  { n: 7, name: 'Unit economics', carries: 'What a customer may cost to acquire', measure: 'Lifetime gross profit; payback against runway', ch: 7 },
  { n: 8, name: 'Reinvestment', carries: 'More attention, and more capability', measure: 'Experiments that changed a decision', ch: 8 },
]

function ValueLoop() {
  return (
    <Figure
      n={1}
      question="Eight links, one closed cycle: what each link hands to the next, and the measurement that shows it working"
      evidence={['SYNTHESIS']}
      note="The article's own model. Link 8 returns to delivered value inside link 5, which is why the cycle is entered there and walked from link 1."
    >
      <ol className="space-y-2">
        {LINKS.map((link) => (
          <li
            key={link.n}
            className="grid gap-x-4 gap-y-1 rounded-sm border border-line-strong bg-paper px-4 py-3 md:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1.2fr)]"
          >
            <p className="label-mono text-accent">
              {link.n} · {link.name}
            </p>
            <p className="text-sm leading-snug text-ink">
              {link.carries}
              <span className="label-mono mt-1 block text-ink-faint">Chapter {link.ch}</span>
            </p>
            <p className="text-sm leading-snug text-ink-muted">
              <span className="label-mono mr-1 text-ink-faint md:hidden">Measure:</span>
              {link.measure}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-3 text-center text-sm text-accent" aria-hidden="true">
        ↩
      </p>
      <Card strong className="text-center text-sm text-ink">
        Reinvestment returns to attention and to delivery capability. The cycle closes at <strong className="font-semibold">delivered value</strong>.
      </Card>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="label-mono mb-2 text-ink-faint">Two forces push back</p>
          <div className="space-y-2">
            <Card dashed>
              <p className="text-sm text-ink">Trust debt</p>
              <p className="mt-1 text-sm text-ink-muted">Links 1–4 raised faster than link 5 can honour. Repaid in links 6 and 7.</p>
            </Card>
            <Card dashed>
              <p className="text-sm text-ink">Complexity debt</p>
              <p className="mt-1 text-sm text-ink-muted">Channels, offers, roles, and rules added faster than the operating system absorbs them.</p>
            </Card>
          </div>
        </div>
        <div>
          <p className="label-mono mb-2 text-ink-faint">Two limits apply at every link</p>
          <div className="space-y-2">
            <Card dashed>
              <p className="text-sm text-ink">Liquidity</p>
              <p className="mt-1 text-sm text-ink-muted">A firm must survive to compound. Runway can bind at any stage.</p>
            </Card>
            <Card dashed>
              <p className="text-sm text-ink">Integrity</p>
              <p className="mt-1 text-sm text-ink-muted">Conversion bought by misrepresenting the exchange is a loan against link 6.</p>
            </Card>
          </div>
        </div>
      </div>
    </Figure>
  )
}

/* ---------------------------------------------------------------- Figure 2 */

const GAP_PATHS = [
  {
    name: 'Legibility',
    summary: 'Perceived value rose because delivered value became visible. The gap did not widen.',
    rows: [
      ['Conversion rate', 'Up', 'up'],
      ['Refunds and cancellations', 'Unchanged', 'flat'],
      ['Referral rate', 'Up or unchanged', 'up'],
      ['Cost to acquire the next cohort', 'Unchanged or lower', 'flat'],
    ],
  },
  {
    name: 'Gap-widening',
    summary: 'Perceived value rose and delivered value did not. The gap widened, and the gap is what satisfaction tracks.',
    rows: [
      ['Conversion rate', 'Up', 'up'],
      ['Refunds and cancellations', 'Up, after one delivery cycle', 'down'],
      ['Referral rate', 'Down, after one delivery and one social cycle', 'down'],
      ['Cost to acquire the next cohort', 'Up, after two to four cycles', 'down'],
    ],
  },
] as const

function PerceptionDelivery() {
  const glyph = { up: '▲', flat: '–', down: '▼' } as const
  const word = { up: 'improves', flat: 'no change', down: 'deteriorates' } as const
  return (
    <Figure
      n={2}
      question="Two conversion gains that look identical on the day, and diverge a quarter later"
      evidence={['SYNTHESIS', 'EMPIRICAL']}
      note="The divergence follows from satisfaction tracking the gap between expectation and performance rather than the level of either (Oliver, 1980). Directions, not magnitudes."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {GAP_PATHS.map((path) => (
          <div key={path.name} className="rounded-sm border border-line-strong bg-paper px-4 py-4">
            <p className="label-mono text-accent">{path.name}</p>
            <p className="mt-2 text-sm leading-snug text-ink-muted">{path.summary}</p>
            <dl className="mt-4 space-y-2 border-t border-line pt-3">
              {path.rows.map(([measure, direction, tone]) => (
                <div key={measure} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2">
                  <dt className="text-accent" title={word[tone as keyof typeof word]} aria-hidden="true">
                    {glyph[tone as keyof typeof glyph]}
                  </dt>
                  <dd className="text-sm leading-snug">
                    <span className="text-ink">{measure}:</span>{' '}
                    <span className="text-ink-muted">{direction}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">
        Both columns start with the same observation — conversion improved. The measurement that separates them arrives one delivery cycle
        later and only if it is read by acquisition cohort, because a period average mixes the cohort repaying with the cohort still borrowing.
      </p>
    </Figure>
  )
}

/* ---------------------------------------------------------------- Figure 3 */

const GATES = [
  {
    n: 1,
    question: 'Is the represented constraint real?',
    passes: 'The deadline expires, the capacity is finite, the price does change, the bonus is withdrawn.',
    fails: 'A countdown that resets per visitor. A value attributed to a bonus with no standalone existence. A guarantee whose conditions are designed not to be met.',
  },
  {
    n: 2,
    question: 'Are material terms disclosed before commitment?',
    passes: 'Total cost, renewal, penalties, and cancellation are known before the buyer is bound.',
    fails: 'A card captured before the fee schedule is stated. Renewal terms that appear in the confirmation email.',
  },
  {
    n: 3,
    question: 'Is refusal reasonably easy?',
    passes: 'Declining costs the buyer the effort of saying no; leaving costs the effort of asking.',
    fails: 'A two-option close that omits "neither". Cancellation that requires a channel the sign-up did not.',
  },
]

function IntegrityTest() {
  return (
    <Figure
      n={3}
      question="Three gates a tactic passes or fails, decided before it ships"
      evidence={['SYNTHESIS']}
      note="A derived construct, not attributable to any source in the corpus. Deliberately indifferent to tone, intent, and intensity: it asks only what information and what choice the buyer is left with."
    >
      <ol className="space-y-3">
        {GATES.map((gate, index) => (
          <li key={gate.n}>
            <div className="rounded-sm border border-line-strong bg-paper px-4 py-4">
              <p className="label-mono text-accent">Gate {gate.n}</p>
              <p className="mt-1 font-serif text-lg leading-snug text-ink">{gate.question}</p>
              <dl className="mt-3 grid gap-x-6 gap-y-3 border-t border-line pt-3 sm:grid-cols-2">
                <div>
                  <dt className="label-mono text-ink-faint">Passes when</dt>
                  <dd className="mt-1 text-sm leading-snug text-ink-muted">{gate.passes}</dd>
                </div>
                <div>
                  <dt className="label-mono text-ink-faint">Fails when</dt>
                  <dd className="mt-1 text-sm leading-snug text-ink-muted">{gate.fails}</dd>
                </div>
              </dl>
            </div>
            {index < GATES.length - 1 ? (
              <p className="mt-2 text-center text-sm text-accent" aria-hidden="true">
                ↓
              </p>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-center text-sm text-accent" aria-hidden="true">
        ↓
      </p>
      <Card strong className="text-sm text-ink">
        <strong className="font-semibold">All three hold:</strong> the tactic is legibility. Failing any one: the tactic is trust debt being
        accrued at a rate the firm is not recording.
      </Card>
    </Figure>
  )
}

/* ---------------------------------------------------------------- Figure 4 */

const SENSITIVITIES = [
  { driver: 'Retention', effect: 'about 5%', width: '100%', rank: 'First order' },
  { driver: 'Margin', effect: 'about 1%', width: '20%', rank: 'Second order' },
  { driver: 'Acquisition cost', effect: 'about 0.1%', width: '2%', rank: 'Third order' },
]

function RetentionArithmetic() {
  return (
    <Figure
      n={4}
      question="What a one per cent improvement in each driver does to firm value"
      evidence={['EMPIRICAL']}
      note="Gupta, Lehmann and Stuart (2004), five firms with public data as of March 2002, subscription-like economics. The ordering is the transferable result; the magnitudes are not constants and should not be quoted as such."
    >
      <dl className="space-y-4">
        {SENSITIVITIES.map((s) => (
          <div key={s.driver} className="grid gap-x-4 gap-y-1 sm:grid-cols-[10rem_minmax(0,1fr)]">
            <dt className="text-sm text-ink">
              {s.driver}
              <span className="label-mono mt-0.5 block text-ink-faint">{s.rank}</span>
            </dt>
            <dd className="flex items-center gap-3">
              <span className="h-2.5 min-w-[2px] rounded-full bg-accent" style={{ width: s.width }} aria-hidden="true" />
              <span className="label-mono whitespace-nowrap text-ink-muted">{s.effect}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-sm leading-relaxed text-ink-muted">
        Retention sits in the denominator of lifetime gross profit, and lifetime gross profit sets what a customer may cost to acquire. It
        therefore does not compete with margin and acquisition cost; it multiplies both. A firm optimising acquisition cost while its
        retention is unexamined is working on the third-order term.
      </p>
    </Figure>
  )
}

/* ---------------------------------------------------------------- Figure 5 */

const CONSTRAINTS = [
  {
    n: 1,
    name: 'Value proof',
    question: 'Do customers who buy actually reach the outcome?',
    signature: 'Inconsistent results; high early refunds; no unprompted referrals; the founder rescuing deliveries',
    invest: 'Fix the outcome before anything else. Nothing downstream can compensate',
    ch: 5,
  },
  {
    n: 2,
    name: 'Attention and demand',
    question: 'Are there enough qualified buyers who know you exist?',
    signature: 'Idle delivery capacity alongside a high close rate on few leads; specific rather than generic objections',
    invest: 'Increase a proven activity to capacity before adding a channel',
    ch: 2,
  },
  {
    n: 3,
    name: 'Perceived value',
    question: 'Do qualified buyers understand what they would get?',
    signature: 'Objections cluster on believability and effort, not price; worse-delivering competitors win the same accounts',
    invest: 'Make delivered value legible. Do not enlarge the promise',
    ch: 3,
  },
  {
    n: 4,
    name: 'Conversion',
    question: 'Do qualified buyers commit at the rate the economics need?',
    signature: 'Many accepted leads, low close rate, lengthening cycles, one recurring objection',
    invest: 'Reduce friction and improve legibility, with downstream measures pre-registered',
    ch: 4,
  },
  {
    n: 5,
    name: 'Delivery',
    question: 'Can you produce the promised value for everyone you sell to?',
    signature: 'Backlogs; time-to-value spread widening faster than its mean; rising support load per account',
    invest: 'Capacity, or a lower intake rate. Distinguish capacity failures from selection failures',
    ch: 5,
  },
  {
    n: 6,
    name: 'Retention',
    question: 'Do customers keep receiving value and stay?',
    signature: 'Early-period churn high relative to later periods; low referral among satisfied customers; no expansion revenue',
    invest: 'Activation and realised value. This is the highest-leverage link in the model',
    ch: 6,
  },
  {
    n: 7,
    name: 'Unit economics',
    question: 'Does each customer return more cash than they cost, fast enough?',
    signature: 'Growth consuming cash; acquisition cost rising faster than lifetime value; payback beyond runway',
    invest: 'Retention first, then margin, then acquisition cost — in that order of effect',
    ch: 7,
  },
  {
    n: 8,
    name: 'Coordination and the operating system',
    question: 'Can the organisation run every link, and does throughput still depend on one person?',
    signature: 'Handoff defects; decisions queuing on one person; results degrading in an absence and recovering on return',
    invest: 'Interfaces before methods; then codification; then the four-part founder transition',
    ch: 13,
  },
]

function ConstraintMap() {
  return (
    <Figure
      n={5}
      question="Eight binding constraints, the signature that identifies each, and the investment each rewards"
      evidence={['SYNTHESIS']}
      note="The order is typical, not mandatory. A constraint can move backwards: a delivery failure creates a retention constraint, which creates a demand constraint through reputation a year later. Liquidity is not on this list because it is a gate that can close at any stage."
    >
      <ol className="space-y-2">
        {CONSTRAINTS.map((c) => (
          <li key={c.n} className="rounded-sm border border-line-strong bg-paper px-4 py-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="label-mono text-accent">
                {c.n} · {c.name}
              </span>
              <span className="label-mono text-ink-faint">Chapter {c.ch}</span>
            </div>
            <p className="mt-2 font-serif text-base leading-snug text-ink">{c.question}</p>
            <dl className="mt-3 grid gap-x-6 gap-y-3 border-t border-line pt-3 md:grid-cols-2">
              <div>
                <dt className="label-mono text-ink-faint">Signature</dt>
                <dd className="mt-1 text-sm leading-snug text-ink-muted">{c.signature}</dd>
              </div>
              <div>
                <dt className="label-mono text-ink-faint">What relieves it</dt>
                <dd className="mt-1 text-sm leading-snug text-ink-muted">{c.invest}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </Figure>
  )
}

/* ---------------------------------------------------------------- Figure 6 */

const TRUST_TIMELINE = [
  { when: 'Cycle 0', event: 'The push: perceived value or attention raised faster than delivery can honour', visible: 'Conversion up. Recorded as a win' },
  { when: 'Cycle 1', event: 'The cohort is delivered to', visible: 'Refunds, cancellations and support load up. Attributed to volume' },
  { when: 'Cycle 2', event: 'The cohort talks, or does not', visible: 'Referral rate down. Rarely tracked as a rate at all' },
  { when: 'Cycles 2–4', event: 'Reputation reaches the next cohort', visible: 'Acquisition cost up. Attributed to channel saturation' },
]

const COMPLEXITY_TIMELINE = [
  { when: 'Cycle 0', event: 'A channel, offer, role, metric or rule is added — each individually justified', visible: 'Local capability up. Recorded as a win' },
  { when: 'Cycle 1', event: 'New interfaces and handoffs appear', visible: 'Cycle time and handoff defects up. Attributed to growing pains' },
  { when: 'Cycle 2', event: 'Coordination consumes senior attention, which grows with pairs rather than parts', visible: 'Management time per unit of output up. Rarely measured' },
  { when: 'Cycles 2–4', event: 'Decisions queue; delivery slows and its variance rises', visible: 'Output per additional person hired down' },
]

function TwoDebts() {
  return (
    <Figure
      n={6}
      question="How this quarter's push becomes next year's binding constraint, and why nobody connects the two"
      evidence={['SYNTHESIS']}
      note="Cycle lengths are the firm's own delivery and renewal cycles, not calendar quarters. The attributions in the right-hand column are locally reasonable, which is why the pattern survives in competent organisations."
    >
      <div className="space-y-6">
        {[
          { title: 'Trust debt', rows: TRUST_TIMELINE },
          { title: 'Complexity debt', rows: COMPLEXITY_TIMELINE },
        ].map((debt) => (
          <div key={debt.title}>
            <p className="label-mono mb-3 text-accent">{debt.title}</p>
            <ol className="space-y-2">
              {debt.rows.map((row) => (
                <li
                  key={row.when}
                  className="grid gap-x-4 gap-y-1 rounded-sm border border-line-strong bg-paper px-4 py-3 md:grid-cols-[6rem_minmax(0,1.3fr)_minmax(0,1fr)]"
                >
                  <p className="label-mono text-ink-faint">{row.when}</p>
                  <p className="text-sm leading-snug text-ink">{row.event}</p>
                  <p className="text-sm leading-snug text-ink-muted">
                    <span className="label-mono mr-1 text-ink-faint md:hidden">Seen as:</span>
                    {row.visible}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <Card strong className="mt-6 text-sm leading-snug text-ink">
        <strong className="font-semibold">And they feed each other.</strong> Complexity debt slows delivery and raises its variance, which
        widens the perception–delivery gap without anyone changing the promise. Trust debt produces unplanned work — refunds, escalations,
        exceptions — which is absorbed by adding people and process.
      </Card>
    </Figure>
  )
}

/* ---------------------------------------------------------------- Figure 7 */

const CONTROL_POSITIONS = [
  {
    label: 'The method is unknown',
    target: 'Learning goal',
    why: 'The constraint is knowledge, not effort. An outcome goal directs attention to the person’s own adequacy and can impede performance',
    example: 'Characterise why this segment churns, by the end of the quarter',
  },
  {
    label: 'The method is known; the person controls little of the path',
    target: 'Activity target',
    why: 'Outcomes are noisy and lagged. Controllable inputs can be coached, and early intervention is possible',
    example: 'Five qualified discovery conversations a week',
  },
  {
    label: 'The method is known; the person controls most of the path',
    target: 'Outcome target',
    why: 'The person can own the result and choose the method. Activity targets here invite gaming and remove useful freedom',
    example: 'This quarter’s accepted pipeline value',
  },
]

function ControlSurface() {
  return (
    <Figure
      n={7}
      question="Which target belongs to a role, given how much of the path that role controls"
      evidence={['EMPIRICAL', 'SYNTHESIS']}
      note="The moderating role of task complexity and the learning-goal case are external findings (Locke and Latham, 2002; the Seijts and Latham work on learning versus performance goals). The placement rule and the counter-metric requirement are this article's."
    >
      <ol className="space-y-2">
        {CONTROL_POSITIONS.map((p, i) => (
          <li key={p.target} className="rounded-sm border border-line-strong bg-paper px-4 py-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="label-mono text-accent">{p.target}</span>
              <span className="label-mono text-ink-faint">Position {i + 1} of 3</span>
            </div>
            <p className="mt-2 text-sm leading-snug text-ink">{p.label}</p>
            <p className="mt-2 text-sm leading-snug text-ink-muted">{p.why}</p>
            <p className="mt-2 text-sm leading-snug text-ink-muted">
              <span className="label-mono mr-1 text-ink-faint">Example:</span>
              {p.example}
            </p>
          </li>
        ))}
      </ol>
      <Card strong className="mt-4 text-sm leading-snug text-ink">
        At every position, both are <em>measured</em>. Only the placement of accountability and reward moves. And every targeted metric
        carries a counter-metric that would detect the damage caused by optimising it — an unpaired target is where the next debt forms.
      </Card>
    </Figure>
  )
}

/* ---------------------------------------------------------------- Figure 8 */

const SIGNALS = [
  'Method stability: the last several cycles changed the execution, not the method',
  'Explained variance: differences in outcome come from skill or input quality, not from disagreement about the approach',
  'Stable inputs: the segment, offer and channel feeding the workflow have stopped changing materially',
  'Cost of inconsistency: errors and rework now cost more than the learning the variation still yields',
  'Transferability: a capable person other than the originator reaches an acceptable result from a written description plus a demonstration',
]

function CodificationWindow() {
  return (
    <Figure
      n={8}
      question="The window for codifying a workflow, and how to tell which side of it you are on"
      evidence={['SYNTHESIS']}
      note="A judgment under uncertainty, not a threshold. The five signals are evidence, not a score; the two signatures are how a firm identifies the error it has already made."
    >
      <div className="grid gap-3 md:grid-cols-3">
        <Card dashed>
          <p className="label-mono text-ink-faint">Too early</p>
          <p className="mt-2 text-sm leading-snug text-ink">Variation is still teaching</p>
          <p className="mt-2 text-sm leading-snug text-ink-muted">
            The process freezes a model of a market that is still moving. The organisation executes it correctly and fails.
          </p>
        </Card>
        <Card strong>
          <p className="label-mono text-accent">The window</p>
          <p className="mt-2 text-sm leading-snug text-ink">Variation has stopped teaching; inconsistency now costs more</p>
          <p className="mt-2 text-sm leading-snug text-ink-muted">
            Standardise the interface first — definitions, entry and exit criteria, who accepts a handoff and on what evidence — then the
            method.
          </p>
        </Card>
        <Card dashed>
          <p className="label-mono text-ink-faint">Too late</p>
          <p className="mt-2 text-sm leading-snug text-ink">Throughput is bounded by one person</p>
          <p className="mt-2 text-sm leading-snug text-ink-muted">
            Quality varies with that person's attention, onboarding happens by shadowing, and the enterprise has no value separable from
            them.
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p className="label-mono mb-3 text-accent">Five signals that the window is open</p>
          <ol className="space-y-2 text-sm leading-snug text-ink-muted">
            {SIGNALS.map((s, i) => (
              <li key={s} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2">
                <span className="label-mono text-ink-faint">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="label-mono mb-3 text-accent">Two signatures, if you already chose wrong</p>
          <dl className="space-y-3 text-sm leading-snug">
            <div>
              <dt className="text-ink">Codified too early</dt>
              <dd className="mt-1 text-ink-muted">
                Outcomes stall while the market moves; the process is followed and fails; the people executing it report that it does not
                fit the cases they see.
              </dd>
            </div>
            <div>
              <dt className="text-ink">Codified too late</dt>
              <dd className="mt-1 text-ink-muted">
                Throughput tracks one person's availability; quality varies with their attention; results degrade when they are absent.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Figure>
  )
}

export function BindingLinkVisual({ id }: { id: string }) {
  switch (id) {
    case 'value-loop':
      return <ValueLoop />
    case 'perception-delivery':
      return <PerceptionDelivery />
    case 'integrity-test':
      return <IntegrityTest />
    case 'retention-arithmetic':
      return <RetentionArithmetic />
    case 'constraint-map':
      return <ConstraintMap />
    case 'two-debts':
      return <TwoDebts />
    case 'control-surface':
      return <ControlSurface />
    case 'codification-window':
      return <CodificationWindow />
    default:
      return null
  }
}

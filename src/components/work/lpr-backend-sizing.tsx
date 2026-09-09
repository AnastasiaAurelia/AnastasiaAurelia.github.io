import { useId } from 'react'

// Annual RMB estimates for the 100-site configuration; quantities are aggregated.
const lprAnnualCosts = [
  { label: 'OSS storage', amount: 17406 },
  { label: 'MySQL RDS', amount: 8226 },
  { label: 'Application ECS ×2', amount: 8138.30 },
  { label: 'Nacos + RabbitMQ ECS ×3', amount: 6942.60 },
  { label: 'SLB', amount: 5000 },
  { label: 'NAT Gateway', amount: 5000 },
  { label: 'Testing + Monitoring ECS', amount: 4069.15 },
  { label: 'SSL', amount: 2000 },
  { label: 'Public Traffic', amount: 1332 },
  { label: 'Redis', amount: 816 },
  { label: 'API Calls', amount: 100 },
  { label: 'Domain', amount: 100 },
] as const

const annualTotal = lprAnnualCosts.reduce((sum, item) => sum + Math.round(item.amount * 100), 0) / 100
const formatRmb = (amount: number) => amount.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 })

function Node({ x, y, width, label, detail }: { x: number; y: number; width: number; label: string; detail?: string }) {
  return <g>
    <rect x={x} y={y} width={width} height="60" rx="2" fill="var(--color-paper)" stroke="var(--color-line-strong)" />
    <text x={x + width / 2} y={y + (detail ? 25 : 35)} textAnchor="middle" fill="var(--color-ink)" className="font-sans" fontSize="16">{label}</text>
    {detail ? <text x={x + width / 2} y={y + 45} textAnchor="middle" fill="var(--color-ink-muted)" className="font-mono" fontSize="13">{detail}</text> : null}
  </g>
}

export function LprInfrastructureDiagram() {
  const id = useId()
  return <figure className="breakout-wide my-8 min-w-0 max-w-full" aria-labelledby={`${id}-heading`}>
    <div className="rounded-sm border border-line bg-surface">
      <div className="border-b border-line px-4 py-4 sm:px-6">
        <p className="label-mono text-accent">100 sites / conceptual architecture</p>
        <h3 id={`${id}-heading`} className="mt-2 text-xl">Infrastructure behind the recognition event</h3>
      </div>
      <div className="max-w-full overflow-x-auto" tabIndex={0} role="region" aria-label="100-site infrastructure schematic; scroll horizontally to explore">
        <svg viewBox="0 0 780 620" role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`} className="block h-auto w-full min-w-[780px] lg:min-w-0">
          <title id={`${id}-title`}>100-site LPR infrastructure</title>
          <desc id={`${id}-desc`}>100 parking sites connect through a 10M server load balancer to two application ECS instances, each 4C / 32G / 100G. The application layer uses Redis HA, MySQL RDS HA, and a three-node Nacos and RabbitMQ cluster. OSS retains approximately 14 TB of images for one year. Connections show conceptual service relationships, not a serial request protocol.</desc>
          <defs>
            <marker id={`${id}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M1 1 L7 4 L1 7" fill="none" stroke="var(--color-ink-muted)" />
            </marker>
          </defs>
          <g aria-hidden="true" fill="none" stroke="var(--color-ink-muted)">
            {['M390 90 V126', 'M390 186 V226', 'M390 340 V380', 'M390 474 V528'].map((path) => (
              <path key={path} d={path} markerEnd={`url(#${id}-arrow)`} />
            ))}
          </g>
          <Node x={270} y={30} width={240} label="100 Parking Sites" />
          <Node x={250} y={126} width={280} label="Server Load Balancer" detail="10M" />
          <rect x="130" y="226" width="520" height="114" rx="2" fill="var(--color-paper)" stroke="var(--color-accent)" />
          <text x="390" y="250" textAnchor="middle" fill="var(--color-ink)" className="font-sans" fontSize="16">Application Layer · 2 × ECS</text>
          <Node x={146} y={264} width={236} label="Application ECS" detail="4C / 32G / 100G" />
          <Node x={398} y={264} width={236} label="Application ECS" detail="4C / 32G / 100G" />
          <rect x="20" y="380" width="740" height="94" rx="2" fill="none" stroke="var(--color-line-strong)" />
          <Node x={36} y={397} width={200} label="Redis HA" detail="1G · master–replica" />
          <Node x={252} y={397} width={220} label="MySQL RDS HA" detail="4C / 8G / 100G" />
          <Node x={488} y={397} width={256} label="Nacos + RabbitMQ" detail="Cluster ×3 · 4C / 8G / 100G" />
          <Node x={250} y={528} width={280} label="OSS Image Storage" detail="≈ 14 TB / year" />
        </svg>
      </div>
      <div className="border-t border-line px-4 py-4 sm:px-6">
        <p className="label-mono text-ink-muted">Supporting infrastructure</p>
        <ul className="mt-3 grid gap-x-6 gap-y-2 text-sm text-ink-muted sm:grid-cols-2">
          <li>Testing + Monitoring ECS <span className="block font-mono text-xs">4C / 32G / 100G</span></li>
          <li>NAT Gateway <span className="block font-mono text-xs">10M bandwidth</span></li>
          <li>Public traffic{' '}<span className="font-mono text-xs">~300 GB/month</span></li>
          <li>API calls{' '}<span className="font-mono text-xs">~5M/month</span></li>
        </ul>
      </div>
    </div>
    <figcaption className="mt-2 text-sm text-ink-muted">Conceptual sizing for 100 sites, with redundant application services and one-year image retention.</figcaption>
  </figure>
}

export function LprInfrastructureCosts() {
  const id = useId()
  const largest = lprAnnualCosts[0].amount
  return <figure className="breakout-wide my-8 min-w-0 max-w-full" aria-labelledby={`${id}-heading`}>
    <div className="rounded-sm border border-line bg-surface p-4 sm:p-6">
      <p className="label-mono text-ink-muted">Annual estimate / RMB</p>
      <h3 id={`${id}-heading`} className="mt-2 text-xl">Annual infrastructure cost breakdown</h3>
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4">
        <p className="font-mono text-lg text-ink">RMB {formatRmb(annualTotal)} <span className="text-xs text-ink-muted">/ year</span></p>
        <p className="text-sm text-ink-muted">OSS: <strong className="font-medium text-ink">{(largest / annualTotal * 100).toFixed(1)}% of total</strong></p>
      </div>
      <ol className="mt-4 space-y-3" aria-label="Annual costs in RMB, sorted largest first">
        {lprAnnualCosts.map(({ label, amount }, index) => <li key={label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className={index === 0 ? 'font-medium text-ink' : 'text-ink-muted'}>{label}</span>
            <span className="shrink-0 font-mono text-xs tabular-nums text-ink">{formatRmb(amount)}</span>
          </div>
          <div className="mt-1 h-1.5 w-full bg-paper" aria-hidden="true">
            <div className={`h-full ${index === 0 ? 'bg-ink' : 'bg-ink-muted'}`} style={{ width: `${amount / largest * 100}%` }} />
          </div>
        </li>)}
      </ol>
    </div>
    <figcaption className="mt-2 text-sm text-ink-muted">At this scale, image retention became the largest single infrastructure cost. The system problem was no longer only recognition accuracy; storage, availability, messaging, and network usage became part of product reliability.</figcaption>
  </figure>
}

export function LprBackendSizing() {
  return <>
    <p>The 100-site estimate pairs service redundancy with one-year image retention. Storage is the largest cost; compute is only one part of the reliability budget.</p>
    <LprInfrastructureDiagram />
    <LprInfrastructureCosts />
  </>
}

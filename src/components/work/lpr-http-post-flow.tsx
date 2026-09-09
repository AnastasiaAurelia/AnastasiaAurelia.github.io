import { useId } from 'react'

const nodes = [
  { label: 'Vehicle', x: 24, y: 214, width: 112 },
  { label: 'LPR Camera', x: 310, y: 214, width: 156 },
  { label: 'Application Server', x: 288, y: 32, width: 200 },
  { label: 'Gate Barrier', x: 608, y: 214, width: 148 },
  { label: 'Peripheral Controller', x: 278, y: 354, width: 220 },
  { label: 'LED Display', x: 176, y: 474, width: 148 },
  { label: 'Speaker', x: 452, y: 474, width: 148 },
]

/** A native, hand-authored schematic of the Capture → Transport boundary. */
export function LprHttpPostFlow() {
  const id = useId()

  return (
    <figure className="breakout-wide my-8 min-w-0 max-w-full" aria-labelledby={`${id}-heading`}>
      <div className="rounded-sm border border-line bg-surface">
        <div className="border-b border-line px-4 py-4 sm:px-6">
          <p className="label-mono text-accent">Capture → Transport</p>
          <h3 id={`${id}-heading`} className="mt-2 text-xl">Camera-side event delivery</h3>
        </div>
        <div className="max-w-full overflow-x-auto" tabIndex={0} role="region" aria-label="Camera-side schematic; scroll horizontally to explore">
          <svg viewBox="0 0 780 556" className="block h-auto w-full min-w-[780px] lg:min-w-0" role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`}>
            <title id={`${id}-title`}>Camera-side event delivery</title>
            <desc id={`${id}-desc`}>
              Vehicle recognition event reaches the LPR Camera. The camera sends HTTP POST to the
              Application Server, which returns an HTTP response. The camera controls the Gate Barrier
              via digital I/O and the Peripheral Controller via RS485. The controller drives the LED
              Display and Speaker. Server delivery and local actuation are distinct downstream paths.
            </desc>
            <defs>
              <marker id={`${id}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M1 1 L7 4 L1 7" fill="none" stroke="var(--color-ink-muted)" strokeWidth="1" />
              </marker>
            </defs>
            <g aria-hidden="true" fill="none" stroke="var(--color-ink-muted)" strokeWidth="1" markerEnd={`url(#${id}-arrow)`}>
              <path d="M136 242 H310" />
              <path d="M356 214 V88" />
              <path d="M420 88 V214" />
              <path d="M466 242 H608" />
              <path d="M388 270 V354" />
              <path d="M338 410 V442 H250 V474" />
              <path d="M438 410 V442 H526 V474" />
            </g>
            <g fill="var(--color-ink-muted)" className="font-mono" fontSize="12">
              <text x="223" y="226" textAnchor="middle">recognition event</text>
              <text x="340" y="148" textAnchor="end">HTTP POST</text>
              <text x="436" y="172">HTTP response</text>
              <text x="537" y="226" textAnchor="middle">digital I/O</text>
              <text x="404" y="318">RS485</text>
            </g>
            {nodes.map(({ label, x, y, width }) => (
              <g key={label}>
                <rect x={x} y={y} width={width} height="56" rx="2" fill="var(--color-paper)" stroke={label === 'LPR Camera' ? 'var(--color-accent)' : 'var(--color-line-strong)'} strokeWidth="1" />
                <text x={x + width / 2} y={y + 33} textAnchor="middle" fill="var(--color-ink)" className="font-sans" fontSize="16">{label}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      <figcaption className="mt-2 text-sm text-ink-muted">
        Camera-side event delivery. Recognition can trigger both a server-side transaction path and
        local gate peripherals; a successful camera read therefore does not guarantee that every
        downstream state transition succeeds.
      </figcaption>
      <p className="mt-3 text-sm text-ink-muted">
        This was an important diagnostic boundary: camera recognition, event delivery, local gate
        actuation, and downstream transaction state are related, but they are not the same failure layer.
      </p>
    </figure>
  )
}

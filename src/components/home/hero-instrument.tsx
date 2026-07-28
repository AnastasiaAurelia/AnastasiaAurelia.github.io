/**
 * The hero's right-column visual: a "precision dossier" instrument panel
 * combining four restrained technical motifs — a reticle frame (nodding
 * at computer vision), a document lattice (research), a workflow loop
 * (agentic systems), and a measurement-tick gauge (product reliability)
 * — plus exactly one rust-accent signal mark. Replaces HeroSignature as
 * the hero's one signature visual idea (see hero.tsx); that file stays
 * in the codebase, unimported, in case this composition is reverted.
 *
 * Pure CSS/SVG, no JavaScript: entrance is a one-shot stroke-dasharray
 * draw-in (see .instrument-* rules in index.css), gated to desktop widths
 * only — mobile and reduced-motion both render the completed state
 * immediately, never a loop. Purely decorative: aria-hidden, no numbers,
 * no claims, nothing a screen reader or no-motion visitor would miss.
 */
export function HeroInstrument() {
  const reticleCorners = [
    [0, 0, 'M0,16 L0,0 L16,0'],
    [184, 0, 'M0,0 L16,0 L16,16'],
    [0, 264, 'M0,0 L0,16 L16,16'],
    [184, 264, 'M0,16 L16,16 L16,0'],
  ] as const

  const latticeLines = [
    { y: 52, x2: 150 },
    { y: 66, x2: 170 },
    { y: 80, x2: 120 },
    { y: 94, x2: 145 },
  ]

  const loopPoints = [
    [100, 128],
    [139, 151],
    [139, 197],
    [100, 220],
    [61, 197],
    [61, 151],
  ] as const
  const loopPath = `M${loopPoints.map(([x, y]) => `${x},${y}`).join(' L')} Z`

  const ticks = [30, 62, 94, 126, 158, 190, 222, 254]

  return (
    <div aria-hidden="true" className="hero-instrument instrument-mark">
      <svg viewBox="0 0 200 280" className="h-auto w-full max-w-[9rem] sm:max-w-[11rem] lg:max-w-none">
        {/* Reticle frame */}
        {reticleCorners.map(([tx, ty, d], i) => (
          <path
            key={`corner-${i}`}
            d={d}
            transform={`translate(${tx}, ${ty})`}
            className="instrument-stroke"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Document lattice */}
        {latticeLines.map((line, i) => (
          <line
            key={`lattice-${i}`}
            x1={30}
            y1={line.y}
            x2={line.x2}
            y2={line.y}
            className="instrument-stroke"
            stroke="currentColor"
            strokeWidth="0.6"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <line
          x1={62}
          y1={52}
          x2={104}
          y2={94}
          className="instrument-stroke"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeOpacity={0.6}
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1={112}
          y1={66}
          x2={142}
          y2={94}
          className="instrument-stroke"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeOpacity={0.6}
          vectorEffect="non-scaling-stroke"
        />

        {/* Agent workflow loop — unlabeled nodes; no "plan/inspect/fix/
            test/review/ship" labels, since that sequence isn't published
            portfolio positioning, only this project's own tooling. */}
        <path
          d={loopPath}
          className="instrument-stroke"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
        />
        {loopPoints.map(([x, y], i) => (
          <circle
            key={`node-${i}`}
            cx={x}
            cy={y}
            r={i === 0 ? 3.75 : 3}
            className="instrument-node"
            fill={i === 0 ? 'var(--color-accent)' : 'currentColor'}
          />
        ))}

        {/* Measurement gauge */}
        <line
          x1={190}
          y1={18}
          x2={190}
          y2={262}
          className="instrument-stroke"
          stroke="currentColor"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        {ticks.map((y, i) => (
          <line
            key={`tick-${i}`}
            x1={190}
            y1={y}
            x2={i % 3 === 0 ? 179 : 184}
            y2={y}
            className="instrument-stroke"
            stroke="currentColor"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  )
}

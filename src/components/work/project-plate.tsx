import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { ProjectType } from '@/lib/sanity/types'

interface ProjectPlateProps {
  projectType: ProjectType
  tags?: string[]
  index: number
  className?: string
}

const RUST = 'var(--color-accent)'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** Corner brackets — the same reticle technique as HeroInstrument, at plate scale. */
function ReticleCorners({ inset = 0 }: { inset?: number }) {
  const arm = 12
  const right = 120 - inset - arm
  const bottom = 150 - inset - arm
  const corners = [
    [inset, inset, `M0,${arm} L0,0 L${arm},0`],
    [right, inset, `M0,0 L${arm},0 L${arm},${arm}`],
    [inset, bottom, `M0,0 L0,${arm} L${arm},${arm}`],
    [right, bottom, `M0,${arm} L${arm},${arm} L${arm},0`],
  ] as const
  return (
    <>
      {corners.map(([tx, ty, d], i) => (
        <path
          key={i}
          d={d}
          transform={`translate(${tx}, ${ty})`}
          className="instrument-stroke"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </>
  )
}

/** Computer Vision: an outer reticle plus an inner crop/detection frame with one signal corner. */
function ComputerVisionMark() {
  return (
    <>
      <ReticleCorners />
      <rect
        x={38}
        y={52}
        width={44}
        height={44}
        className="instrument-stroke"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={38}
        y1={40}
        x2={82}
        y2={40}
        className="instrument-stroke"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeOpacity={0.6}
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={82} cy={52} r={3} className="instrument-node" fill={RUST} />
    </>
  )
}

/** Research Intelligence: stacked document lines with citation-like connectors. */
function ResearchMark() {
  const lines = [
    { y: 46, x2: 92 },
    { y: 58, x2: 72 },
    { y: 70, x2: 84 },
  ]
  return (
    <>
      <ReticleCorners />
      {lines.map((line, i) => (
        <line
          key={i}
          x1={28}
          y1={line.y}
          x2={line.x2}
          y2={line.y}
          className="instrument-stroke"
          stroke="currentColor"
          strokeWidth="0.7"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <line
        x1={50}
        y1={46}
        x2={80}
        y2={70}
        className="instrument-stroke"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity={0.6}
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={80} cy={70} r={3} className="instrument-node" fill={RUST} />
    </>
  )
}

/** Agentic Workflow: a small closed loop of unlabeled nodes — no plan/inspect/fix/
    test/review/ship labels, since that sequence isn't published portfolio positioning. */
function AgenticLoopMark() {
  const points = [
    [60, 40],
    [86, 56],
    [76, 84],
    [44, 84],
    [34, 56],
  ] as const
  const path = `M${points.map(([x, y]) => `${x},${y}`).join(' L')} Z`
  return (
    <>
      <ReticleCorners />
      <path
        d={path}
        className="instrument-stroke"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        vectorEffect="non-scaling-stroke"
      />
      {points.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === 0 ? 3.25 : 2.5}
          className="instrument-node"
          fill={i === 0 ? RUST : 'currentColor'}
        />
      ))}
    </>
  )
}

/** Fallback for project types without a dedicated territory (Applied AI,
    Product Management, Other): a restrained neutral technical grid — no
    rust signal, deliberately the "nothing special" treatment. Grid
    density echoes the project's real tag count (honest, not invented). */
function NeutralGridMark({ tickCount }: { tickCount: number }) {
  const step = 60 / (tickCount + 1)
  const lines = Array.from({ length: tickCount }, (_, i) => 30 + step * (i + 1))
  return (
    <>
      <ReticleCorners />
      <rect
        x={34}
        y={40}
        width={52}
        height={52}
        className="instrument-stroke"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        vectorEffect="non-scaling-stroke"
      />
      {lines.map((pos, i) => (
        <line
          key={i}
          x1={34}
          y1={pos}
          x2={86}
          y2={pos}
          className="instrument-stroke"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeOpacity={0.5}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </>
  )
}

/**
 * A quiet, decorative technical-abstraction plate for one Selected Work
 * entry — never a screenshot, never invented evidence. Reuses the same
 * draw-once instrument system as HeroInstrument (see index.css's
 * .instrument-* rules): fully-drawn by default, animated in only at lg+
 * once the row's own scroll-reveal (.reveal[data-visible='true']) fires,
 * and always static on mobile / under reduced motion.
 */
export function ProjectPlate({ projectType, tags, index, className }: ProjectPlateProps) {
  const flipped = index % 2 === 1
  const tickCount = clamp(tags?.length ?? 0, 2, 5)

  let mark: ReactNode
  switch (projectType) {
    case 'Computer Vision':
      mark = <ComputerVisionMark />
      break
    case 'Research Intelligence':
      mark = <ResearchMark />
      break
    case 'Agentic Workflow':
      mark = <AgenticLoopMark />
      break
    default:
      mark = <NeutralGridMark tickCount={tickCount} />
  }

  return (
    <div aria-hidden="true" className={cn('project-plate instrument-mark', className)}>
      <svg
        viewBox="0 0 120 150"
        className={cn('h-auto w-24 sm:w-28', flipped && 'scale-x-[-1]')}
      >
        {mark}
      </svg>
    </div>
  )
}

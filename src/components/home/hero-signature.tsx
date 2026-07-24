import { useEffect, useRef } from 'react'

/**
 * The hero's one signature visual idea: a viewfinder/reticle motif —
 * corner brackets like a computer-vision detection frame — nodding at
 * her domain without simulating fake data or a dashboard. Pure CSS/SVG:
 *
 * - Entrance: brackets draw inward once on load (`--enter` keyframe,
 *   pure CSS so it plays with JS disabled). No looping/decorative
 *   movement after that, per the "no continuous motion" constraint.
 * - Progressive enhancement: on fine-pointer, non-reduced-motion
 *   devices, the frame drifts a few px toward the cursor. Never
 *   required for legibility — the frame is decorative and inert
 *   without it.
 *
 * Entirely `aria-hidden`; it carries no information a screen reader
 * or a no-JS/no-motion visitor would miss.
 */
export function HeroSignature() {
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    function handleMove(event: MouseEvent) {
      const { innerWidth, innerHeight } = window
      const x = (event.clientX / innerWidth - 0.5) * 2
      const y = (event.clientY / innerHeight - 0.5) * 2
      frame?.style.setProperty('--px', `${x * 8}px`)
      frame?.style.setProperty('--py', `${y * 6}px`)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      className="hero-reticle pointer-events-none absolute inset-0 -z-10"
      style={{ transform: 'translate(var(--px, 0), var(--py, 0))' }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
        {(
          [
            ['5', '5', 'M0,10 L0,0 L10,0'],
            ['95', '5', 'M0,0 L10,0 L10,10'],
            ['5', '95', 'M0,0 L0,10 L10,10'],
            ['95', '95', 'M0,0 L10,0 M10,0 L10,10'],
          ] as const
        ).map(([x, y, d], i) => (
          <g key={i} transform={`translate(${Number(x) - 5}, ${Number(y) - 5})`}>
            <path
              d={d}
              className="hero-reticle-mark"
              style={{ animationDelay: `${i * 90}ms` }}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>
    </div>
  )
}

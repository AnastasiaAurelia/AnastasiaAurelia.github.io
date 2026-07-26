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
        {/* Corner arm length in viewBox units — bumped from the original
            10 so the frame reads clearly around the (now much tighter)
            headline block it's mounted in, instead of as a faint tick
            lost in a much larger box. Each entry is [translateX,
            translateY, path] with every path drawn as one continuous
            arm-end → true-corner → other-arm-end stroke. */}
        {(
          [
            [0, 0, 'M0,13 L0,0 L13,0'],
            [87, 0, 'M0,0 L13,0 L13,13'],
            [0, 87, 'M0,0 L0,13 L13,13'],
            [87, 87, 'M0,13 L13,13 L13,0'],
          ] as const
        ).map(([tx, ty, d], i) => (
          <g key={i} transform={`translate(${tx}, ${ty})`}>
            <path
              d={d}
              className="hero-reticle-mark"
              style={{ animationDelay: `${i * 90}ms` }}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>
    </div>
  )
}

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectPlate } from '../project-plate'
import type { ProjectType } from '@/lib/sanity/types'

const NAMED_TERRITORIES: ProjectType[] = [
  'Computer Vision',
  'Research Intelligence',
  'Agentic Workflow',
  'Applied AI',
]

const FALLBACK_TERRITORIES: ProjectType[] = ['Product Management', 'Other']

describe('ProjectPlate', () => {
  it.each([...NAMED_TERRITORIES, ...FALLBACK_TERRITORIES])(
    'is decorative for %s — aria-hidden, no visible text',
    (projectType) => {
      const { container } = render(<ProjectPlate projectType={projectType} tags={['A', 'B']} index={0} />)
      expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
      expect(container.textContent).toBe('')
    },
  )

  it.each(FALLBACK_TERRITORIES)('renders the neutral fallback for %s', (projectType) => {
    const { container } = render(<ProjectPlate projectType={projectType} index={0} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    // The fallback's own bounded grid rect, present only in that variant.
    expect(container.querySelector('rect')).toBeInTheDocument()
    // The fallback is deliberately the "nothing special" case — no signal node.
    expect(container.querySelector('.instrument-node')).not.toBeInTheDocument()
  })

  it('uses the neutral fallback for a projectType outside the known union (defensive default)', () => {
    const unknown = 'Something Unpublished' as ProjectType
    const { container } = render(<ProjectPlate projectType={unknown} index={0} />)
    expect(container.querySelector('rect')).toBeInTheDocument()
    expect(container.querySelector('.instrument-node')).not.toBeInTheDocument()
  })

  it('does not crash with missing tags, for a named territory or a fallback', () => {
    expect(() => render(<ProjectPlate projectType="Applied AI" index={0} />)).not.toThrow()
    expect(() => render(<ProjectPlate projectType="Other" index={0} />)).not.toThrow()
  })

  it('Applied AI does not use the neutral fallback', () => {
    const appliedAi = render(<ProjectPlate projectType="Applied AI" index={0} />)
    const fallback = render(<ProjectPlate projectType="Other" index={0} />)
    expect(appliedAi.container.innerHTML).not.toBe(fallback.container.innerHTML)
    // Applied AI carries the one-signal-node convention every named
    // territory uses; the fallback deliberately never does.
    expect(appliedAi.container.querySelector('.instrument-node')).toBeInTheDocument()
  })

  it('renders a structurally distinct mark per named territory and the fallback', () => {
    const renders = [...NAMED_TERRITORIES, 'Other' as ProjectType].map((projectType) => ({
      projectType,
      html: render(<ProjectPlate projectType={projectType} index={0} />).container.innerHTML,
    }))
    for (let i = 0; i < renders.length; i++) {
      for (let j = i + 1; j < renders.length; j++) {
        expect(renders[i].html, `${renders[i].projectType} vs ${renders[j].projectType}`).not.toBe(
          renders[j].html,
        )
      }
    }
  })

  it('mirrors on alternating (flipped) rows without changing element count', () => {
    const straight = render(<ProjectPlate projectType="Applied AI" index={0} />)
    const flipped = render(<ProjectPlate projectType="Applied AI" index={1} />)
    expect(flipped.container.querySelectorAll('*').length).toBe(
      straight.container.querySelectorAll('*').length,
    )
    expect(flipped.container.querySelector('svg')?.className.baseVal).toContain('scale-x-[-1]')
  })

  it('clamps an empty tags array to a minimum grid density instead of rendering nothing extra', () => {
    const noTags = render(<ProjectPlate projectType="Other" tags={[]} index={0} />)
    const manyTags = render(
      <ProjectPlate projectType="Other" tags={['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']} index={0} />,
    )
    const noTagsLines = noTags.container.querySelectorAll('line').length
    const manyTagsLines = manyTags.container.querySelectorAll('line').length
    expect(noTagsLines).toBeGreaterThan(0)
    expect(manyTagsLines).toBeGreaterThanOrEqual(noTagsLines)
  })
})

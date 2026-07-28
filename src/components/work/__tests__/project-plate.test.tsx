import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectPlate } from '../project-plate'

describe('ProjectPlate', () => {
  it('renders the neutral fallback for a projectType with no dedicated territory', () => {
    const { container } = render(<ProjectPlate projectType="Product Management" index={0} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    // The fallback's own bounded grid rect, present only in that variant.
    expect(container.querySelector('rect')).toBeInTheDocument()
  })

  it('renders the neutral fallback for "Other" without crashing on missing tags', () => {
    const { container } = render(<ProjectPlate projectType="Other" index={1} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders a distinct mark per named territory', () => {
    const cv = render(<ProjectPlate projectType="Computer Vision" index={0} />)
    const research = render(<ProjectPlate projectType="Research Intelligence" index={0} />)
    const agentic = render(<ProjectPlate projectType="Agentic Workflow" index={0} />)
    expect(cv.container.innerHTML).not.toBe(research.container.innerHTML)
    expect(research.container.innerHTML).not.toBe(agentic.container.innerHTML)
    expect(cv.container.innerHTML).not.toBe(agentic.container.innerHTML)
  })

  it('is decorative — aria-hidden, no text content', () => {
    const { container } = render(<ProjectPlate projectType="Computer Vision" tags={['A', 'B']} index={0} />)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.textContent).toBe('')
  })

  it('mirrors on alternating (flipped) rows without changing element count', () => {
    const straight = render(<ProjectPlate projectType="Computer Vision" index={0} />)
    const flipped = render(<ProjectPlate projectType="Computer Vision" index={1} />)
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

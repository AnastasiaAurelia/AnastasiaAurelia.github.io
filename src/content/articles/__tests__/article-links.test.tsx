import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { parseInline, inlineText } from '../parse-article-markdown'
import { InlineContent } from '@/components/long-form/article-blocks'

describe('article reference links', () => {
  it('renders a timestamp citation as an accessible link while preserving its text', () => {
    const nodes = parseInline('[LT V02 04:53](https://youtu.be/7urwyHZwtEo?t=293)')
    render(<InlineContent nodes={nodes} />)
    expect(screen.getByRole('link', { name: '[LT V02 04:53]' })).toHaveAttribute('href', 'https://youtu.be/7urwyHZwtEo?t=293')
    expect(inlineText(nodes)).toBe('[LT V02 04:53]')
  })
  it('supports ordinary reference labels and fragment links', () => {
    render(<InlineContent nodes={parseInline('[paper](https://arxiv.org/abs/2104.09864) and [sources](#appendix-g)')} />)
    expect(screen.getByRole('link', { name: 'paper' })).toHaveAttribute('href', 'https://arxiv.org/abs/2104.09864')
    expect(screen.getByRole('link', { name: 'sources' })).toHaveAttribute('href', '#appendix-g')
  })
  it('does not make executable URLs or malformed markup clickable', () => {
    render(<InlineContent nodes={parseInline('[bad](javascript:alert(1)) [bad](data:text/html,bad) [unfinished](https://example.com')} />)
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })
})

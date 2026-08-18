import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ArticleEvidence } from '../article-evidence'

describe('ArticleEvidence', () => {
  it('links the WUZZ design artifact as a new-tab PDF', () => {
    render(<ArticleEvidence slug="wuzz-change-plate-transfer-system-design" />)

    const link = screen.getByRole('link', { name: /View Proposed Change Plate Flows/i })
    expect(link).toHaveAttribute('href', '/evidence/wuzz-change-plate-proposed-flows.pdf')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText(/a WUZZ\/CMS plate update is not complete/i)).toBeInTheDocument()
  })

  it('does not appear on unrelated articles', () => {
    const { container } = render(<ArticleEvidence slug="another-article" />)
    expect(container).toBeEmptyDOMElement()
  })
})

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { LatestWriting } from '../latest-writing'
import { fixtureArticles } from '@/test/fixtures'

describe('LatestWriting', () => {
  it('renders nothing when there are no published articles', () => {
    const { container } = render(
      <MemoryRouter>
        <LatestWriting articles={[]} />
      </MemoryRouter>,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders each article when articles exist', () => {
    render(
      <MemoryRouter>
        <LatestWriting articles={fixtureArticles} />
      </MemoryRouter>,
    )
    for (const article of fixtureArticles) {
      expect(screen.getByText(article.title)).toBeInTheDocument()
    }
  })
})

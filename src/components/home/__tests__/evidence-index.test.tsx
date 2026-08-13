import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { EvidenceIndex } from '../evidence-index'
import { fixtureProjects } from '@/test/fixtures'

describe('EvidenceIndex', () => {
  it('renders the Methods card with the published article count and links to /articles', () => {
    render(
      <MemoryRouter>
        <EvidenceIndex projects={fixtureProjects} publishedArticleCount={7} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Methods')).toBeInTheDocument()
    expect(screen.getByText(/07 PUBLISHED/i)).toBeInTheDocument()
    expect(screen.queryByText('Live product')).not.toBeInTheDocument()

    const methodsLink = screen.getByRole('link', { name: /methods/i })
    expect(methodsLink).toHaveAttribute('href', '/articles')
  })

  it('keeps repository counts based on real project data and leaves Methods independent from latest articles', () => {
    const projectsWithRepository = [
      { ...fixtureProjects[0], githubUrl: 'https://github.com/example/repo' },
      ...fixtureProjects.slice(1),
    ]

    render(
      <MemoryRouter>
        <EvidenceIndex projects={projectsWithRepository} publishedArticleCount={7} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Repository')).toBeInTheDocument()
    expect(screen.getByText(/01 LINKED/i)).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import App from '../../App'
import { projects } from '@/content/projects'

function renderAt(path: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('routing', () => {
  it('renders the homepage with the positioning statement', () => {
    renderAt('/')
    expect(screen.getByText('AI Product Manager')).toBeInTheDocument()
  })

  it('renders the work index with every project card', () => {
    renderAt('/work')
    for (const project of projects) {
      expect(screen.getByRole('heading', { name: project.title })).toBeInTheDocument()
    }
  })

  it('renders a project detail page for a known slug', () => {
    const [first] = projects
    renderAt(`/work/${first.slug}`)
    expect(screen.getByRole('heading', { level: 1, name: first.title })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument()
  })

  it('shows the 404 page for an unknown route', () => {
    renderAt('/this-route-does-not-exist')
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it('shows the 404 page for an unknown project slug', () => {
    renderAt('/work/this-slug-does-not-exist')
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })
})

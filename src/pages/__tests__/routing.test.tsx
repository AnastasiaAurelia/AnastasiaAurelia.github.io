import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import App from '../../App'
import { fixtureArticles, fixtureProjects } from '@/test/fixtures'

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
  it('renders the homepage with the positioning statement once site settings load', async () => {
    renderAt('/')
    // Appears in both the header micro-label and the hero eyebrow.
    expect((await screen.findAllByText('AI Product Manager')).length).toBeGreaterThan(0)
    expect(await screen.findByText(fixtureProjects[0].title)).toBeInTheDocument()
  })

  it('renders the work index with every project, in displayOrder', async () => {
    renderAt('/work')
    for (const project of fixtureProjects) {
      expect(await screen.findByRole('heading', { name: project.title })).toBeInTheDocument()
    }
    const headingOrder = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent)
    const expectedOrder = [...fixtureProjects]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((p) => p.title)
    // Each heading's text starts with the title (an arrow icon glyph may
    // trail it), so compare by prefix rather than exact equality.
    expectedOrder.forEach((title, i) => expect(headingOrder[i]).toContain(title))
  })

  it('only shows featured projects in the homepage Selected Work section', async () => {
    renderAt('/')
    expect(await screen.findByText(fixtureProjects[0].title)).toBeInTheDocument()
    expect(screen.queryByText('Unfeatured Experiment')).not.toBeInTheDocument()
  })

  it('renders a project detail page for a known slug, with missing chapters listed as in-progress', async () => {
    const [first] = fixtureProjects
    renderAt(`/work/${first.slug}`)
    expect(await screen.findByRole('heading', { level: 1, name: first.title })).toBeInTheDocument()
    // The fixture has no Portable Text content, so every canonical
    // section should show up in the consolidated "in progress" notice.
    expect(await screen.findByText('In progress')).toBeInTheDocument()
    expect(screen.getByText('Overview')).toBeInTheDocument()
  })

  it('renders visible experience entries on About and never a hidden one', async () => {
    renderAt('/about')
    expect(await screen.findByText('Example Co', { exact: false })).toBeInTheDocument()
    expect(screen.queryByText('Should Not Appear Co', { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByText('Hidden Role', { exact: false })).not.toBeInTheDocument()
  })

  it('shows the 404 page for an unknown route', async () => {
    renderAt('/this-route-does-not-exist')
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('shows the 404 page for an unknown project slug', async () => {
    renderAt('/work/this-slug-does-not-exist')
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('renders the Writing index with a featured article and the rest listed, newest first', async () => {
    renderAt('/articles')
    expect(await screen.findByText('Featured Test Article')).toBeInTheDocument()
    expect(screen.getByText('Second Test Article')).toBeInTheDocument()
    // The featured article shouldn't be duplicated in the list below.
    expect(screen.getAllByText('Featured Test Article')).toHaveLength(1)
  })

  it('renders an article detail page for a known slug', async () => {
    const [first] = fixtureArticles
    renderAt(`/articles/${first.slug}`)
    expect(await screen.findByRole('heading', { level: 1, name: first.title })).toBeInTheDocument()
    expect(screen.getByText('The article body renders here.')).toBeInTheDocument()
  })

  it('shows the 404 page for an unknown article slug', async () => {
    renderAt('/articles/this-slug-does-not-exist')
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('shows Writing in the primary nav and the homepage Latest Writing section', async () => {
    renderAt('/')
    expect((await screen.findAllByRole('link', { name: 'Writing' })).length).toBeGreaterThan(0)
    expect(await screen.findByText('Latest writing')).toBeInTheDocument()
    expect(screen.getByText('Featured Test Article')).toBeInTheDocument()
  })
})

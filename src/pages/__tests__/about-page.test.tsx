import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import App from '../../App'

function renderAbout() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('AboutPage', () => {
  it('renders the hero from Site Settings and orders primary experience with the current role first', async () => {
    renderAbout()
    expect(await screen.findByText('Profile', { selector: 'p' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Test Person — AI Product Manager | Test Positioning')
    expect(document.title).toBe('Profile · Anastasia Aurelia')
    expect(screen.getByText('Jakarta, Indonesia')).toBeInTheDocument()

    const experienceHeadings = screen.getAllByRole('heading', { level: 3 })
    expect(experienceHeadings[0]).toHaveTextContent('AI Product Manager')
    expect(screen.getAllByText(/Present/).length).toBeGreaterThan(0)
  })

  it('separates secondary experience into Additional Experience, muted, out of the primary list', async () => {
    renderAbout()
    expect(await screen.findByText('Additional Experience')).toBeInTheDocument()
    const pianoHeading = await screen.findByRole('heading', { name: /Piano Instructor/ })
    expect(pianoHeading.className).toContain('text-base')

    // The primary Experience section must not also list the secondary role.
    const experienceSection = screen.getByText('Experience', { selector: 'p' }).closest('div') as HTMLElement
    expect(experienceSection).not.toBeNull()
    expect(experienceSection.textContent).not.toContain('Piano Instructor')
  })

  it('links Selected Technical Work only when a case study article resolved', async () => {
    renderAbout()
    const linked = await screen.findByRole('link', { name: 'Linked Technical Work' })
    expect(linked).toHaveAttribute('href', '/articles/featured-test-article')
    expect(screen.getByText('Unlinked Technical Work')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Unlinked Technical Work' })).not.toBeInTheDocument()
  })

  it('renders Key Impact, Education, Publications, and Skills from Site Settings', async () => {
    renderAbout()
    expect(await screen.findByText('100,000+')).toBeInTheDocument()
    expect(screen.getByText('Production transactions reviewed')).toBeInTheDocument()
    expect(screen.getByText('Test Program', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Test Publication', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('SQL, Python')).toBeInTheDocument()
  })

  it('shows a subtle LinkedIn credentials link, not a dedicated certifications section', async () => {
    renderAbout()
    expect(await screen.findByRole('link', { name: /credentials on LinkedIn/ })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/test-profile',
    )
    // No standalone "Certifications" section label — only the subtle inline link above.
    expect(screen.queryByText('Certifications', { selector: 'p' })).not.toBeInTheDocument()
  })
})

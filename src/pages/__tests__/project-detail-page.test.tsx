import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it, vi } from 'vitest'
import { ProjectDetailPage } from '../project-detail-page'
import { fixtureProjects } from '@/test/fixtures'
import { useProject } from '@/hooks/use-project'

vi.mock('@/hooks/use-project', () => ({ useProject: vi.fn() }))

function renderProject(slug = 'computer-vision-lpr', identifier = 'technical-view') {
  const paragraph = (text: string) => ({ _type: 'block', _key: text, style: 'normal', markDefs: [], children: [{ _type: 'span', text, marks: [] }] })
  vi.mocked(useProject).mockReturnValue({
    status: 'success',
    data: {
      ...fixtureProjects[0], slug, caseStudyArticle: undefined,
      content: [
        { _type: 'projectSection', _key: 'technical', identifier, title: 'Technical view — where can the journey break?' },
        { _type: 'processDiagram', _key: 'chain', title: 'The transaction reliability chain', steps: [{ label: 'Capture' }, { label: 'Transport' }] },
        paragraph('The existing explanatory paragraph.'),
        { _type: 'processDiagram', _key: 'ttl', title: 'OCR succeeded; the transaction failed later', steps: [{ label: 'TTL expires' }] },
      ],
    },
  } as ReturnType<typeof useProject>)
  return render(<HelmetProvider><MemoryRouter initialEntries={[`/work/${slug}`]}><Routes><Route path="/work/:slug" element={<ProjectDetailPage />} /></Routes></MemoryRouter></HelmetProvider>)
}

describe('LPR camera-side schematic placement', () => {
  it('renders an accessible native figure after the chain paragraph and before the TTL timeline', () => {
    const { container } = renderProject()
    const chapter = container.querySelector('#technical-view')!
    const svg = within(chapter as HTMLElement).getByRole('img', { name: 'Camera-side event delivery' })
    const figure = svg.closest('figure')!
    expect(figure).toHaveClass('breakout-wide')
    expect(figure.querySelector('figcaption')).toHaveTextContent('a successful camera read therefore does not guarantee')
    expect(svg.querySelector('title')).toHaveTextContent('Camera-side event delivery')
    expect(svg.querySelector('desc')).toHaveTextContent('RS485')
    for (const label of ['Vehicle', 'LPR Camera', 'HTTP POST', 'HTTP response', 'Application Server', 'Gate Barrier', 'Peripheral Controller', 'LED Display', 'Speaker', 'digital I/O', 'RS485']) {
      expect(within(svg).getByText(label)).toBeInTheDocument()
    }
    expect(screen.getByText('The existing explanatory paragraph.').compareDocumentPosition(figure) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(figure.compareDocumentPosition(screen.getByRole('figure', { name: 'OCR succeeded; the transaction failed later' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(figure.querySelector('img, image, foreignObject, [href], [src]')).toBeNull()
    expect(figure.textContent).not.toMatch(/Downloads|vendor|Driver Board|\.png|\.jpg|\/home\//i)
    expect(svg).toHaveClass('min-w-[780px]', 'w-full')
    expect(svg.parentElement).toHaveClass('overflow-x-auto', 'max-w-full')
    expect(svg.parentElement).toHaveAttribute('tabindex', '0')
  })

  it('does not render for another project with the same chapter content', () => {
    renderProject('agentic-workflows')
    expect(screen.queryByRole('img', { name: 'Camera-side event delivery' })).not.toBeInTheDocument()
    expect(screen.getByRole('figure', { name: 'The transaction reliability chain' })).toBeInTheDocument()
  })

  it('uses the section identifier rather than its display title', () => {
    renderProject('computer-vision-lpr', 'other-chapter')
    expect(screen.queryByRole('img', { name: 'Camera-side event delivery' })).not.toBeInTheDocument()
  })
})

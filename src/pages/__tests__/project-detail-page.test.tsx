import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it, vi } from 'vitest'
import { ProjectDetailPage } from '../project-detail-page'
import { fixtureProjects } from '@/test/fixtures'
import { useProject } from '@/hooks/use-project'

vi.mock('@/hooks/use-project', () => ({ useProject: vi.fn() }))

function renderProject(slug = 'computer-vision-lpr', identifier = 'technical-view', incidentTitle: string | null = 'TTL incident', existingSizing = false) {
  const paragraph = (text: string) => ({ _type: 'block', _key: text, style: 'normal', markDefs: [], children: [{ _type: 'span', text, marks: [] }] })
  vi.mocked(useProject).mockReturnValue({
    status: 'success',
    data: {
      ...fixtureProjects[0], slug, caseStudyArticle: undefined,
      content: [
        { _type: 'projectSection', _key: 'program', identifier: 'program-loops', title: 'The program in three loops' },
        paragraph('Measure, diagnose, improve.'),
        { _type: 'projectSection', _key: 'management', identifier: 'management-view', title: 'Management view — where should we act?' },
        paragraph('Existing management diagnostics.'),
        { _type: 'projectSection', _key: 'technical', identifier, title: 'Technical view — where can the journey break?' },
        { _type: 'processDiagram', _key: 'chain', title: 'The transaction reliability chain', steps: [{ label: 'Capture' }, { label: 'Transport' }] },
        paragraph('The existing explanatory paragraph.'),
        { _type: 'processDiagram', _key: 'ttl', title: incidentTitle ?? undefined, steps: [{ label: 'TTL expires' }] },
        paragraph('Incident lesson.'),
        ...(existingSizing ? [
          { _type: 'projectSection', _key: 'sizing', identifier: 'capacity-planning', title: 'Sizing the backend for 100 sites' },
          paragraph('Previous detailed sizing prose.'),
        ] : []),
      ],
    },
  } as ReturnType<typeof useProject>)
  return render(<HelmetProvider><MemoryRouter initialEntries={[`/work/${slug}`]}><Routes><Route path="/work/:slug" element={<ProjectDetailPage />} /></Routes></MemoryRouter></HelmetProvider>)
}

describe('LPR camera-side schematic placement', () => {
  it.each(['TTL incident', null])('renders before the second process diagram with title %s', (title) => {
    const { container } = renderProject('computer-vision-lpr', 'technical-view', title)
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
    const ttlFigure = screen.getByText('TTL expires').closest('figure')!
    expect(figure.nextElementSibling).toBe(ttlFigure)
    expect(ttlFigure.nextElementSibling).toBe(screen.getByText('Incident lesson.'))
    expect(chapter.querySelectorAll('figure')).toHaveLength(3)
    expect(chapter.querySelector('figure')).toBe(screen.getByRole('figure', { name: 'The transaction reliability chain' }))
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


describe('LPR backend sizing chapter', () => {
  it('adds the visual chapter after technical-view with working chapter navigation', () => {
    const { container } = renderProject()
    const sizing = container.querySelector('#backend-sizing')!
    expect(container.querySelector('#technical-view')!.nextElementSibling).toBe(sizing)
    expect(within(sizing as HTMLElement).getByRole('img', { name: '100-site LPR infrastructure' })).toBeInTheDocument()
    expect(within(sizing as HTMLElement).getByText('RMB 59,130.05', { exact: false })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Sizing the backend for 100 sites/ })).toHaveAttribute('href', '#backend-sizing')
  })

  it('uses an existing sizing chapter without duplicating its title or long prose', () => {
    const { container } = renderProject('computer-vision-lpr', 'technical-view', 'TTL incident', true)
    expect(screen.getAllByRole('heading', { name: 'Sizing the backend for 100 sites' })).toHaveLength(1)
    expect(container.querySelector('#backend-sizing')).toBeNull()
    expect(container.querySelector('#capacity-planning')).toContainElement(screen.getByRole('img', { name: '100-site LPR infrastructure' }))
    expect(screen.queryByText('Previous detailed sizing prose.')).not.toBeInTheDocument()
  })

  it('preserves other projects even when they have a sizing chapter', () => {
    renderProject('agentic-workflows', 'technical-view', 'TTL incident', true)
    expect(screen.queryByRole('img', { name: '100-site LPR infrastructure' })).not.toBeInTheDocument()
    expect(screen.getByText('Previous detailed sizing prose.')).toBeInTheDocument()
  })
})


describe('LPR daily operating loop', () => {
  it('inserts the workflow and actual evidence between the program and diagnostics chapters', () => {
    const { container } = renderProject()
    const section = container.querySelector('#operating-loop')! as HTMLElement
    expect(container.querySelector('#program-loops')!.nextElementSibling).toBe(section)
    expect(section.nextElementSibling).toBe(container.querySelector('#management-view'))
    expect(screen.getByRole('link', { name: /Automating the operating loop/ })).toHaveAttribute('href', '#operating-loop')
    const diagram = within(section).getByRole('img', { name: 'Fail-closed daily LPR reporting automation' })
    for (const label of ['Daily 08:00 WIB', 'Metabase Card 512', 'Normalize', 'Fail-closed validation', 'PASS', 'FAIL', 'Render approved report', 'Failure notice only', 'WhatsApp delivery', 'Daily operating loop']) {
      expect(within(diagram).getByText(label)).toBeInTheDocument()
    }
    const evidence = within(section).getByRole('img', { name: 'Automated LPR accuracy report delivered in WhatsApp showing executive summary, location status, recent-day trends, and gate-level breakdowns.' })
    expect(evidence).toHaveAttribute('src', '/evidence/nano.png')
    expect(evidence).toHaveAttribute('width', '622')
    expect(evidence).toHaveAttribute('height', '1082')
    expect(evidence).toHaveClass('h-auto', 'w-full')
    expect(diagram.closest('figure')!.nextElementSibling).toBe(evidence.closest('figure'))
    expect(evidence.closest('figure')!.querySelector('figcaption')).toHaveTextContent('Production output. The automated workflow generated and delivered')
    expect(within(section).getByRole('complementary')).toHaveTextContent('FROM MONITORING TO OPERATING SYSTEM')
    expect(section.innerHTML).not.toMatch(/https?:|@g\.us|\.config\.json|lpr_validate|lpr_prompt|SKILL\.md/)
  })

  it('does not add the automation section or evidence to other projects', () => {
    const { container } = renderProject('agentic-workflows')
    expect(container.querySelector('#operating-loop')).toBeNull()
    expect(screen.queryByRole('img', { name: 'Fail-closed daily LPR reporting automation' })).not.toBeInTheDocument()
    expect(container.querySelector('img[src="/evidence/nano.png"]')).toBeNull()
    expect(container.querySelector('#program-loops')!.nextElementSibling).toBe(container.querySelector('#management-view'))
  })
})

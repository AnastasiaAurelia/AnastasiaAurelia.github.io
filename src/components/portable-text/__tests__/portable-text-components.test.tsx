import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { describe, expect, it } from 'vitest'
import { portableTextComponents } from '../portable-text-components'
import type { ArticleContentBlock, ProjectContentBlock } from '@/lib/sanity/types'

// A syntactically valid Sanity asset ref (image-<id>-<dimensions>-<format>)
// so @sanity/image-url can build a URL without a real uploaded asset.
const fixtureAssetRef = 'image-abc123def456-800x600-jpg'

const sampleContent: ProjectContentBlock[] = [
  {
    _type: 'block',
    _key: 'p1',
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: 's1', text: 'A normal paragraph.', marks: [] }],
  } as ProjectContentBlock,
  {
    _type: 'block',
    _key: 'h2',
    style: 'h2',
    markDefs: [],
    children: [{ _type: 'span', _key: 's2', text: 'A heading two', marks: [] }],
  } as ProjectContentBlock,
  {
    _type: 'block',
    _key: 'h3',
    style: 'h3',
    markDefs: [],
    children: [{ _type: 'span', _key: 's3', text: 'A heading three', marks: [] }],
  } as ProjectContentBlock,
  {
    _type: 'block',
    _key: 'bq',
    style: 'blockquote',
    markDefs: [],
    children: [{ _type: 'span', _key: 's4', text: 'A pull quote', marks: [] }],
  } as ProjectContentBlock,
  {
    _type: 'block',
    _key: 'marks',
    style: 'normal',
    markDefs: [{ _key: 'link1', _type: 'link', href: 'https://example.com', newTab: true }],
    children: [
      { _type: 'span', _key: 's5', text: 'Bold text', marks: ['strong'] },
      { _type: 'span', _key: 's6', text: ' and a link', marks: ['link1'] },
    ],
  } as ProjectContentBlock,
  {
    _type: 'block',
    _key: 'bullet1',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _type: 'span', _key: 's7', text: 'Bullet item one', marks: [] }],
  } as unknown as ProjectContentBlock,
  {
    _type: 'block',
    _key: 'number1',
    style: 'normal',
    listItem: 'number',
    level: 1,
    markDefs: [],
    children: [{ _type: 'span', _key: 's8', text: 'Numbered item one', marks: [] }],
  } as unknown as ProjectContentBlock,
  { _type: 'image', _key: 'img1', alt: 'A diagram of the pipeline', asset: { _ref: fixtureAssetRef, _type: 'reference' } } as ProjectContentBlock,
  {
    _type: 'metricHighlight',
    _key: 'metric1',
    label: 'Detection latency',
    value: '230ms',
    context: 'Median across the validation set.',
  } as ProjectContentBlock,
  {
    _type: 'decisionCallout',
    _key: 'decision1',
    decision: 'Use a two-stage detector',
    reasoning: 'Single-stage models missed too many edge cases.',
    consequence: 'Slightly higher latency.',
  } as ProjectContentBlock,
  {
    _type: 'architectureDiagram',
    _key: 'arch1',
    alt: 'System architecture overview',
    caption: 'End-to-end pipeline',
    asset: { _ref: fixtureAssetRef, _type: 'reference' },
  } as ProjectContentBlock,
  {
    _type: 'code',
    _key: 'code1',
    language: 'typescript',
    code: 'const x = 1',
  } as ProjectContentBlock,
]

describe('portableTextComponents', () => {
  it('renders every standard block style, mark, and list type', () => {
    render(<PortableText value={sampleContent} components={portableTextComponents} />)
    expect(screen.getByText('A normal paragraph.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'A heading two' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 4, name: 'A heading three' })).toBeInTheDocument()
    expect(screen.getByText('A pull quote')).toBeInTheDocument()
    expect(screen.getByText('Bold text')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: 'and a link' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText('Bullet item one').closest('ul')).toBeInTheDocument()
    expect(screen.getByText('Numbered item one').closest('ol')).toBeInTheDocument()
  })

  it('renders a standard inline image with a working responsive srcset', () => {
    render(<PortableText value={sampleContent} components={portableTextComponents} />)
    const img = screen.getByAltText('A diagram of the pipeline')
    expect(img).toBeInTheDocument()
    expect(img.getAttribute('src')).toContain('cdn.sanity.io')
    expect(img.getAttribute('srcset')?.split(',').length).toBeGreaterThan(1)
  })

  it('renders a metric highlight with its required context', () => {
    render(<PortableText value={sampleContent} components={portableTextComponents} />)
    expect(screen.getByText('230ms')).toBeInTheDocument()
    expect(screen.getByText('Detection latency')).toBeInTheDocument()
    expect(screen.getByText('Median across the validation set.')).toBeInTheDocument()
  })

  it('renders a decision callout with its trade-off', () => {
    render(<PortableText value={sampleContent} components={portableTextComponents} />)
    expect(screen.getByText('Use a two-stage detector')).toBeInTheDocument()
    expect(screen.getByText('Single-stage models missed too many edge cases.')).toBeInTheDocument()
    expect(screen.getByText(/Slightly higher latency/)).toBeInTheDocument()
  })

  it('renders an architecture diagram with alt text and caption', () => {
    render(<PortableText value={sampleContent} components={portableTextComponents} />)
    const image = screen.getByAltText('System architecture overview')
    expect(image).toBeInTheDocument()
    expect(screen.getByText('End-to-end pipeline')).toBeInTheDocument()
    expect(image.closest('figure')).toHaveClass('breakout-wide')
    expect(image.closest('a')).toHaveAttribute('target', '_blank')
  })

  it('renders a code block without a syntax-highlighter dependency', () => {
    render(<PortableText value={sampleContent} components={portableTextComponents} />)
    expect(screen.getByText('const x = 1')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
  })

  it('renders an accessible swimlane graph with ownership and branch labels', () => {
    const graph: ArticleContentBlock[] = [{
      _type: 'swimlaneDiagram', _key: 'swimlane-1', title: 'Change Plate flow', summary: 'A complete cross-system flow.',
      lanes: [
        { _key: 'lane-user', name: 'User', nodes: [{ _key: 'node-submit', label: 'Submit request', state: 'process', transitions: ['App validation'] }] },
        { _key: 'lane-app', name: 'App / Cloud', nodes: [{ _key: 'node-decision', label: 'Active parking?', state: 'decision', transitions: ['YES → Block', 'NO → Continue'] }] },
      ],
    }]
    render(<PortableText value={graph} components={portableTextComponents} />)
    expect(screen.getByRole('heading', { name: 'Change Plate flow' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /User/ })).toBeInTheDocument()
    expect(screen.getByText('→ YES → Block')).toBeInTheDocument()
    expect(screen.getByText('Decision')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Change Plate flow lanes' })).toHaveClass('overflow-x-auto')
  })

  it('keeps long process fields word-wrapped and exposes sequence without relying on arrows', () => {
    const diagram: ArticleContentBlock[] = [{
      _type: 'processDiagram', _key: 'process-1', title: 'Long process', variant: 'pipeline',
      steps: Array.from({ length: 9 }, (_, index) => ({
        _key: `step-${index}`,
        label: index === 0 ? 'Vehicle and plate visibility' : `Process node ${index + 1}`,
        field: index === 0 ? 'HTTP / SDK / replay' : undefined,
      })),
    }]
    const { container } = render(<PortableText value={diagram} components={portableTextComponents} />)
    expect(screen.getByText('Step 01')).toBeInTheDocument()
    expect(screen.getByText('Step 09')).toBeInTheDocument()
    expect(screen.getByText('HTTP / SDK / replay')).toHaveClass('break-words')
    expect(screen.getByText('HTTP / SDK / replay')).not.toHaveClass('break-all')
    expect(container.querySelector('.process-diagram-grid')).toBeInTheDocument()
  })

  it('sizes wide data tables by column count inside a contained scroll region', () => {
    const table: ArticleContentBlock[] = [{
      _type: 'dataTable', _key: 'table-1', caption: 'Six-column evidence matrix',
      headers: ['One', 'Two', 'Three', 'Four', 'Five', 'Six'],
      rows: [{ _key: 'row-1', cells: ['A', 'B', 'C', 'D', 'E', 'F'] }],
    }]
    render(<PortableText value={table} components={portableTextComponents} />)
    const region = screen.getByRole('region', { name: 'Six-column evidence matrix' })
    expect(region).toHaveClass('overflow-x-auto')
    expect(region.querySelector('table')).toHaveStyle({ minWidth: '72rem' })
  })
})

describe('articleImage rendering', () => {
  const articleBody: ArticleContentBlock[] = [
    {
      _type: 'block',
      _key: 'p1',
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: 's1', text: 'Paragraph before the image.', marks: [] }],
    } as ArticleContentBlock,
    {
      _type: 'articleImage',
      _key: 'img-normal',
      alt: 'A normal-layout test image',
      caption: 'Normal caption',
      source: 'Test Source',
      sourceUrl: 'https://example.com/credit',
      layout: 'normal',
      asset: { _ref: fixtureAssetRef, _type: 'reference' },
    } as ArticleContentBlock,
    {
      _type: 'block',
      _key: 'p2',
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: 's2', text: 'Paragraph after the image.', marks: [] }],
    } as ArticleContentBlock,
    {
      _type: 'articleImage',
      _key: 'img-wide',
      alt: 'A wide-layout test image',
      layout: 'wide',
      asset: { _ref: fixtureAssetRef, _type: 'reference' },
    } as ArticleContentBlock,
    {
      _type: 'articleImage',
      _key: 'img-full',
      alt: 'A full-width test image',
      layout: 'full',
      asset: { _ref: fixtureAssetRef, _type: 'reference' },
    } as ArticleContentBlock,
  ]

  it('renders alt text, caption, and a linked source credit', () => {
    render(<PortableText value={articleBody} components={portableTextComponents} />)
    expect(screen.getByAltText('A normal-layout test image')).toBeInTheDocument()
    expect(screen.getByText('Normal caption', { exact: false })).toBeInTheDocument()
    const credit = screen.getByRole('link', { name: 'Test Source' })
    expect(credit).toHaveAttribute('href', 'https://example.com/credit')
  })

  it('applies the correct breakout class per layout variant', () => {
    render(<PortableText value={articleBody} components={portableTextComponents} />)
    const normalFigure = screen.getByAltText('A normal-layout test image').closest('figure')
    const wideFigure = screen.getByAltText('A wide-layout test image').closest('figure')
    const fullFigure = screen.getByAltText('A full-width test image').closest('figure')
    expect(normalFigure?.className).not.toMatch(/breakout/)
    expect(wideFigure?.className).toContain('breakout-wide')
    expect(fullFigure?.className).toContain('breakout-full')
  })

  it('preserves body order: paragraph, image, paragraph, image, image', () => {
    const { container } = render(<PortableText value={articleBody} components={portableTextComponents} />)
    const topLevelNodes = Array.from(container.children)
    const kinds = topLevelNodes.map((node) => (node.tagName === 'FIGURE' ? 'image' : 'text'))
    expect(kinds).toEqual(['text', 'image', 'text', 'image', 'image'])
  })
})

describe('internal link rendering', () => {
  it('renders an internal-path link via React Router Link, not a plain anchor reload', () => {
    const content: ArticleContentBlock[] = [
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        markDefs: [{ _key: 'link1', _type: 'link', linkType: 'internal', internalPath: '/articles/other-post' }],
        children: [{ _type: 'span', _key: 's1', text: 'an internal link', marks: ['link1'] }],
      } as ArticleContentBlock,
    ]
    render(
      <MemoryRouter>
        <PortableText value={content} components={portableTextComponents} />
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: 'an internal link' })
    expect(link).toHaveAttribute('href', '/articles/other-post')
    // Internal links never get target=_blank — they're same-site navigation.
    expect(link).not.toHaveAttribute('target')
  })
})

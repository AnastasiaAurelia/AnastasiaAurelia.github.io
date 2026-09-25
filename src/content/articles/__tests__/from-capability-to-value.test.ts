import { describe, expect, it } from 'vitest'
import markdown from '../from-capability-to-value.md?raw'
import { countWords, parseArticle, type Block, type Inline } from '../parse-article-markdown'
import { CAPABILITY_VALUE_VISUALS } from '@/components/long-form/capability-value-visual-ids'

const sections = parseArticle(markdown)
const allBlocks = (blocks: Block[]): Block[] =>
  blocks.flatMap((b) => (b.type === 'callout' ? [b, ...allBlocks(b.blocks)] : [b]))
const blocks = sections.flatMap((s) => allBlocks(s.blocks))

describe('From Capability to Value (publication edition)', () => {
  it('has 17 numbered chapters in order, six parts, and nine appendices', () => {
    const chapters = sections.filter((s) => s.eyebrow?.startsWith('Chapter ')).map((s) => s.eyebrow)
    expect(chapters).toEqual(Array.from({ length: 17 }, (_, i) => `Chapter ${i + 1}`))
    expect(sections.filter((s) => s.eyebrow?.startsWith('Part '))).toHaveLength(6)
    expect(sections.filter((s) => s.eyebrow?.startsWith('Appendix '))).toHaveLength(9)
  })

  it('renders all sixteen equations as headings followed by display math', () => {
    const eq = blocks.filter((b) => b.type === 'heading' && b.level === 4 && b.text.startsWith('Equation '))
    expect(eq.map((b) => (b.type === 'heading' ? Number(b.text.match(/^Equation (\d+)/)?.[1]) : 0))).toEqual(
      Array.from({ length: 16 }, (_, i) => i + 1),
    )
    expect(blocks.filter((b) => b.type === 'math').length).toBeGreaterThanOrEqual(16)
  })

  it('only references implemented visuals, each exactly once', () => {
    const ids = blocks.filter((b) => b.type === 'visual').map((b) => (b.type === 'visual' ? b.id : ''))
    expect([...ids].sort()).toEqual([...CAPABILITY_VALUE_VISUALS].sort())
  })

  it('keeps no leftover ASCII diagrams or horizontal rules in prose', () => {
    const paragraphs = blocks.filter((b) => b.type === 'paragraph')
    expect(paragraphs.some((b) => b.type === 'paragraph' && b.children.some((n) => n.type === 'text' && n.value.trim() === '---'))).toBe(false)
  })

  it('parses every source citation, wherever it appears, as a citation mark', () => {
    const inlines = (b: Block): Inline[] => {
      switch (b.type) {
        case 'paragraph':
          return b.children
        case 'list':
          return b.items.flat()
        case 'table':
          return [...b.header.flat(), ...b.rows.flat(2)]
        case 'callout':
          return b.title ?? []
        default:
          return []
      }
    }
    const flatten = (nodes: Inline[]): Inline[] =>
      nodes.flatMap((n) => (n.type === 'strong' || n.type === 'em' || n.type === 'link' ? [n, ...flatten(n.children)] : [n]))
    const parsed = blocks.flatMap((b) => flatten(inlines(b))).filter((n) => n.type === 'cite').length
    const raw = (markdown.match(/\[(?:TH|LM|LT-full|LT|SA|slides|repo|docs|YC video|x\.ai)\b[^\]]*\]/g) ?? []).length
    expect(parsed).toBe(raw)
    expect(parsed).toBeGreaterThan(250)
  })

  it('is long-form', () => {
    expect(countWords(sections)).toBeGreaterThan(20000)
  })
})

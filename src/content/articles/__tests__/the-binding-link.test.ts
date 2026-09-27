import { describe, expect, it } from 'vitest'
import markdown from '../the-binding-link.md?raw'
import { countWords, parseArticle, type Block, type Inline } from '../parse-article-markdown'
import { BINDING_LINK_VISUALS } from '@/components/long-form/binding-link-visual-ids'

const sections = parseArticle(markdown)
const allBlocks = (blocks: Block[]): Block[] =>
  blocks.flatMap((b) => (b.type === 'callout' ? [b, ...allBlocks(b.blocks)] : [b]))
const blocks = sections.flatMap((s) => allBlocks(s.blocks))

/** The eighteen source keys used as citation marks throughout the article. */
const SOURCE_KEYS = [
  'Leads',
  'Offers',
  'Money',
  'Bezos',
  'Traction',
  'RFA',
  'Predictable',
  'SalesFormula',
  'WoL',
  'Motive',
  'Courage',
  'Influence',
  'PreSuasion',
  'Yes',
  'Expert',
  'OneMany',
  'Friends',
]

describe('The Binding Link', () => {
  it('has fourteen numbered chapters in order, four parts, and five appendices', () => {
    const chapters = sections.filter((s) => s.eyebrow?.startsWith('Chapter ')).map((s) => s.eyebrow)
    expect(chapters).toEqual(Array.from({ length: 14 }, (_, i) => `Chapter ${i + 1}`))
    expect(sections.filter((s) => s.eyebrow?.startsWith('Part '))).toHaveLength(4)
    expect(sections.filter((s) => s.eyebrow?.startsWith('Appendix '))).toHaveLength(5)
  })

  it('opens with the argument and closes with the glossary', () => {
    expect(sections[0].id).toBe('what-this-article-argues')
    expect(sections.at(-1)?.id).toBe('appendix-e')
  })

  it('renders all four equations as headings followed by display math', () => {
    const eq = blocks.filter((b) => b.type === 'heading' && b.level === 4 && b.text.startsWith('Equation '))
    expect(eq.map((b) => (b.type === 'heading' ? Number(b.text.match(/^Equation (\d+)/)?.[1]) : 0))).toEqual([1, 2, 3, 4])
    expect(blocks.filter((b) => b.type === 'math')).toHaveLength(4)
  })

  it('only references implemented visuals, each exactly once', () => {
    const ids = blocks.filter((b) => b.type === 'visual').map((b) => (b.type === 'visual' ? b.id : ''))
    expect([...ids].sort()).toEqual([...BINDING_LINK_VISUALS].sort())
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
    const raw = (markdown.match(new RegExp(`\\[(?:${SOURCE_KEYS.join('|')})\\b[^\\]]*\\]`, 'g')) ?? []).length
    expect(parsed).toBe(raw)
    expect(parsed).toBeGreaterThan(80)
  })

  it('cites every one of the eighteen sources at least once', () => {
    for (const key of SOURCE_KEYS) {
      expect(markdown, `missing citation for ${key}`).toMatch(new RegExp(`\\[${key}\\b[^\\]]*\\]`))
    }
  })

  it('labels the derived constructs as synthesis rather than attributing them to a source', () => {
    const integrity = markdown.slice(markdown.indexOf('### 4.3 The integrity test'))
    expect(integrity).toMatch(/derived synthesis construct/i)
    expect(integrity).toMatch(/not attributable to any source/i)
  })

  it('keeps no research-only material or leftover rules in prose', () => {
    expect(markdown).not.toMatch(/^# /m)
    expect(markdown).not.toMatch(/DERIVED SYNTHESIS|A-pending|claim-ledger|conflict-map|terminology-ledger/)
    const paragraphs = blocks.filter((b) => b.type === 'paragraph')
    expect(
      paragraphs.some((b) => b.type === 'paragraph' && b.children.some((n) => n.type === 'text' && n.value.trim() === '---')),
    ).toBe(false)
  })

  it('is long-form', () => {
    expect(countWords(sections)).toBeGreaterThan(20000)
  })
})

import { describe, expect, it } from 'vitest'
import markdown from '../the-control-plane-problem.md?raw'
import { countWords, parseArticle, type Block, type Inline } from '../parse-article-markdown'
import { CONTROL_PLANE_VISUALS } from '@/components/long-form/control-plane-visual-ids'

const sections = parseArticle(markdown)
const allBlocks = (blocks: Block[]): Block[] =>
  blocks.flatMap((b) => (b.type === 'callout' ? [b, ...allBlocks(b.blocks)] : [b]))
const blocks = sections.flatMap((s) => allBlocks(s.blocks))

describe('The Control Plane Problem (publication edition)', () => {
  it('has eleven numbered chapters in order plus a references section', () => {
    const chapters = sections.filter((s) => s.eyebrow?.startsWith('Chapter ')).map((s) => s.eyebrow)
    expect(chapters).toEqual(Array.from({ length: 11 }, (_, i) => `Chapter ${i + 1}`))
    expect(sections.find((s) => s.id === 'references')).toBeDefined()
  })

  it('only references implemented visuals, each exactly once', () => {
    const ids = blocks.filter((b) => b.type === 'visual').map((b) => (b.type === 'visual' ? b.id : ''))
    expect([...ids].sort()).toEqual([...CONTROL_PLANE_VISUALS].sort())
  })

  it('parses every FP/FA source citation as a citation mark', () => {
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
    const raw = (markdown.match(/\[(?:FP|FA)\b[^\]]*\]/g) ?? []).length
    expect(parsed).toBe(raw)
    expect(parsed).toBeGreaterThan(20)
  })

  it('never attributes a claim to the inaccessible Gartner source', () => {
    expect(markdown).not.toMatch(/\[Gartner\b/)
  })

  it('is long-form', () => {
    expect(countWords(sections)).toBeGreaterThan(4500)
  })
})

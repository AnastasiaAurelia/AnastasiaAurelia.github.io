import { describe, expect, it } from 'vitest'
import { EVIDENCE_LABELS, countWords, inlineText, parseArticle, parseInline, type Block } from '../parse-article-markdown'
import { IMPLEMENTED_VISUALS } from '@/components/long-form/hidden-structure-visual-ids'
import markdown from '../hidden-structure-of-work.md?raw'

const sections = parseArticle(markdown)

function allBlocks(blocks: Block[]): Block[] {
  return blocks.flatMap((block) => (block.type === 'callout' ? [block, ...allBlocks(block.blocks)] : [block]))
}

describe('The Hidden Structure of Work content', () => {
  it('has an introduction, twelve chapters in order, and references', () => {
    expect(sections[0].id).toBe('introduction')
    expect(sections.at(-1)?.id).toBe('references')
    const chapters = sections.filter((s) => s.eyebrow)
    expect(chapters.map((c) => c.id)).toEqual(Array.from({ length: 12 }, (_, i) => `chapter-${i + 1}`))
    expect(chapters[10].title).toBe('A Systems Diagnostic for Real Organizations')
  })

  it('contains no research-only material', () => {
    expect(markdown).not.toContain('Visual Implementation Plan')
    expect(markdown).not.toMatch(/EVIDENCE STATUS|MOBILE BEHAVIOR/i)
    expect(markdown).not.toMatch(/^# /m)
  })

  it('only uses directives the page can render', () => {
    const directives = [...markdown.matchAll(/<!--\s*(visual|variant):([\w-]+)\s*-->/g)]
    const allComments = markdown.match(/<!--/g) ?? []
    expect(directives).toHaveLength(allComments.length)
    for (const [, kind, id] of directives) {
      if (kind === 'visual') expect(IMPLEMENTED_VISUALS).toContain(id)
      else expect(['legend', 'grammar', 'matrix']).toContain(id)
    }
  })

  it('anchors all thirteen diagnostic dimensions for the systems map', () => {
    const chapter11 = sections.find((s) => s.id === 'chapter-11')!
    const ids = allBlocks(chapter11.blocks).flatMap((b) => (b.type === 'paragraph' && b.id ? [b.id] : []))
    expect(ids).toEqual(Array.from({ length: 13 }, (_, i) => `dimension-${i + 1}`))
  })

  it('parses evidence labels and never leaves bracketed labels as raw text', () => {
    const texts: string[] = []
    const collect = (blocks: Block[]) =>
      blocks.forEach((b) => {
        if (b.type === 'paragraph') texts.push(...b.children.filter((n) => n.type === 'text').map((n) => n.value))
        if (b.type === 'callout') collect(b.blocks)
      })
    sections.forEach((s) => collect(s.blocks))
    const raw = new RegExp(`\\[(${EVIDENCE_LABELS.join('|')})\\]`)
    expect(texts.some((t) => raw.test(t))).toBe(false)
    expect(parseInline('[SYNTHESIS] **Hypothetical example.** A *team*.')[0]).toEqual({ type: 'label', label: 'SYNTHESIS' })
  })

  it('renders the full article body, not a summary', () => {
    expect(countWords(sections)).toBeGreaterThan(15000)
    const references = sections.find((s) => s.id === 'references')!
    const refText = allBlocks(references.blocks)
      .map((b) => (b.type === 'list' ? b.items.map(inlineText).join(' ') : ''))
      .join(' ')
    for (const author of ['Ferris', 'Pfeffer', 'Yildiz', 'Claman', 'Omadeke', 'Babcock']) {
      expect(markdown).toContain(author)
    }
    expect(refText).toContain('Political Skill in Organizations')
  })
})

import { describe, expect, it } from 'vitest'
import { CANONICAL_SECTION_TITLES, splitProjectContent } from '../split-project-content'
import type { ProjectContentBlock } from '../types'

function textBlock(text: string): ProjectContentBlock {
  return {
    _type: 'block',
    _key: `b-${text}`,
    style: 'normal',
    children: [{ _type: 'span', _key: `s-${text}`, text, marks: [] }],
    markDefs: [],
  } as ProjectContentBlock
}

function sectionMarker(title: string, identifier: string): ProjectContentBlock {
  return { _type: 'projectSection', _key: `section-${identifier}`, title, identifier } as ProjectContentBlock
}

describe('splitProjectContent', () => {
  it('returns no chapters and every canonical title pending for empty content', () => {
    const { chapters, pendingTitles } = splitProjectContent([])
    expect(chapters).toHaveLength(0)
    expect(pendingTitles).toEqual(CANONICAL_SECTION_TITLES)
  })

  it('groups blocks under the preceding section marker', () => {
    const content: ProjectContentBlock[] = [
      sectionMarker('Overview', 'overview'),
      textBlock('overview body'),
      sectionMarker('Problem', 'problem'),
      textBlock('problem body'),
    ]
    const { chapters, pendingTitles } = splitProjectContent(content)

    expect(chapters).toHaveLength(2)
    expect(chapters[0]).toMatchObject({ id: 'overview', title: 'Overview' })
    expect(chapters[0].blocks).toHaveLength(1)
    expect(chapters[1]).toMatchObject({ id: 'problem', title: 'Problem' })
    expect(pendingTitles).not.toContain('Overview')
    expect(pendingTitles).not.toContain('Problem')
    expect(pendingTitles).toContain('Trade-offs')
  })

  it('keeps content before the first marker as an untitled preamble chapter', () => {
    const content: ProjectContentBlock[] = [textBlock('preamble'), sectionMarker('Overview', 'overview')]
    const { chapters } = splitProjectContent(content)
    expect(chapters[0].id).toBe('preamble')
    expect(chapters[0].title).toBe('')
  })

  it('is case-insensitive when matching titles against the canonical list', () => {
    const content: ProjectContentBlock[] = [sectionMarker('overview', 'overview')]
    const { pendingTitles } = splitProjectContent(content)
    expect(pendingTitles).not.toContain('Overview')
  })
})

import type { ProjectContentBlock, ProjectSectionBlock } from './types'

/**
 * The eleven case-study beats this portfolio is built around (mirrors
 * `studio/schemaTypes/objects/projectSection.ts`'s suggested titles).
 * Editors aren't forced to fill in a column per beat — they drop a
 * "Project section" marker inline wherever content exists — but the
 * detail page still needs to know which beats are missing to render
 * the one consolidated "in progress" notice.
 */
export const CANONICAL_SECTION_TITLES = [
  'Overview',
  'Problem',
  'Why it mattered',
  'My ownership',
  'Constraints',
  'System or workflow',
  'Key decisions',
  'Execution',
  'Evidence and outcomes',
  'Trade-offs',
  'Lessons learned',
]

export interface ProjectChapter {
  id: string
  title: string
  blocks: ProjectContentBlock[]
}

function isProjectSection(block: ProjectContentBlock): block is ProjectSectionBlock {
  return block._type === 'projectSection'
}

/**
 * Splits the flat `content` array into chapters at each `projectSection`
 * marker. Content appearing before the first marker (if an editor
 * doesn't lead with one) is kept as an untitled preamble chapter rather
 * than dropped.
 */
export function splitProjectContent(content: ProjectContentBlock[] | undefined): {
  chapters: ProjectChapter[]
  pendingTitles: string[]
} {
  const blocks = content ?? []
  const chapters: ProjectChapter[] = []
  let current: ProjectChapter | null = null

  for (const block of blocks) {
    if (isProjectSection(block)) {
      current = { id: block.identifier, title: block.title, blocks: [] }
      if (block.introText) {
        current.blocks.push({
          _type: 'block',
          _key: `${block._key}-intro`,
          style: 'normal',
          children: [{ _type: 'span', _key: `${block._key}-intro-span`, text: block.introText, marks: [] }],
          markDefs: [],
        } as ProjectContentBlock)
      }
      chapters.push(current)
      continue
    }

    if (!current) {
      current = { id: 'preamble', title: '', blocks: [] }
      chapters.push(current)
    }
    current.blocks.push(block)
  }

  const presentTitles = new Set(chapters.map((c) => c.title.trim().toLowerCase()).filter(Boolean))
  const pendingTitles = CANONICAL_SECTION_TITLES.filter((title) => !presentTitles.has(title.toLowerCase()))

  return { chapters: chapters.filter((c) => c.blocks.length > 0 || c.title), pendingTitles }
}

/**
 * A deliberately small Markdown parser for code-backed long-form
 * articles. It supports only the subset those articles use (headings,
 * paragraphs, lists, pipe tables, blockquote callouts, bold, italic,
 * inline code, and bracketed evidence labels) so the article text can
 * live in one Markdown file that stays diff-able against its research
 * source, without adding a Markdown dependency to the bundle.
 *
 * Two HTML-comment directives are recognised and never rendered:
 *   <!-- visual:ID -->   inserts a native visual component at that point
 *   <!-- variant:NAME --> tags the next block for alternate rendering
 */

export const EVIDENCE_LABELS = ['EMPIRICAL', 'FORMAL MODEL', 'CONCEPTUAL', 'PRACTITIONER', 'SYNTHESIS'] as const
export type EvidenceLabel = (typeof EVIDENCE_LABELS)[number]

export type Inline =
  | { type: 'text'; value: string }
  | { type: 'strong'; children: Inline[] }
  | { type: 'em'; children: Inline[] }
  | { type: 'code'; value: string }
  | { type: 'label'; label: EvidenceLabel }
  | { type: 'cite'; value: string }
  | { type: 'link'; href: string; children: Inline[] }

export type Block =
  | { type: 'heading'; level: 3 | 4; id: string; text: string }
  | { type: 'math'; latex: string }
  | { type: 'code'; value: string }
  | { type: 'paragraph'; id?: string; children: Inline[]; variant?: string }
  | { type: 'list'; ordered: boolean; items: Inline[][]; variant?: string }
  | { type: 'table'; header: Inline[][]; rows: Inline[][][]; variant?: string }
  | { type: 'callout'; title?: Inline[]; blocks: Block[] }
  | { type: 'visual'; id: string }

export interface ArticleSection {
  id: string
  /** e.g. "Chapter 4" — absent for the Introduction and References. */
  eyebrow?: string
  title: string
  blocks: Block[]
}

const LABEL_PATTERN = new RegExp(`^\\[(${EVIDENCE_LABELS.join('|')})\\]`)
/** Source citations such as "[TH 15:43]" or "[repo: pstack …]", rendered as quiet reference marks. */
const CITE_PATTERN = /^\[(?:TH|LM|LT-full|LT|SA|slides|repo|docs|YC video|x\.ai)\b[^\]]*\]/

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Inline tokens: **strong**, *em*, `code`, and [EVIDENCE LABEL]. */
export function parseInline(source: string): Inline[] {
  const out: Inline[] = []
  let buffer = ''
  const flush = () => {
    if (buffer) out.push({ type: 'text', value: buffer })
    buffer = ''
  }

  let i = 0
  while (i < source.length) {
    const rest = source.slice(i)

    // Only explicit HTTPS/HTTP and local fragment links are supported.
    // Reject executable schemes rather than passing author text to href.
    const link = rest.match(/^\[([^\]\n]+)\]\((https?:\/\/[^\s)]+|#[A-Za-z0-9_-]+)\)/)
    if (link) {
      flush()
      const citation = `[${link[1]}]`.match(CITE_PATTERN)
      out.push({ type: 'link', href: link[2], children: citation
        ? [{ type: 'cite', value: link[1] }]
        : parseInline(link[1]) })
      i += link[0].length
      continue
    }

    const label = rest.match(LABEL_PATTERN)
    if (label) {
      flush()
      out.push({ type: 'label', label: label[1] as EvidenceLabel })
      i += label[0].length
      continue
    }

    const cite = rest.match(CITE_PATTERN)
    if (cite) {
      flush()
      out.push({ type: 'cite', value: cite[0].slice(1, -1) })
      i += cite[0].length
      continue
    }

    if (rest.startsWith('**')) {
      const close = source.indexOf('**', i + 2)
      if (close > i + 2) {
        flush()
        out.push({ type: 'strong', children: parseInline(source.slice(i + 2, close)) })
        i = close + 2
        continue
      }
    }

    if (rest.startsWith('`')) {
      const close = source.indexOf('`', i + 1)
      if (close > i + 1) {
        flush()
        const value = source.slice(i + 1, close)
        const asLabel = value.match(new RegExp(`^\\[(${EVIDENCE_LABELS.join('|')})\\]$`))
        out.push(asLabel ? { type: 'label', label: asLabel[1] as EvidenceLabel } : { type: 'code', value })
        i = close + 1
        continue
      }
    }

    if (rest.startsWith('*') && !rest.startsWith('**')) {
      // Italic closes on the next single asterisk not part of a "**" pair.
      let close = i + 1
      while (close < source.length) {
        if (source[close] === '*' && source[close + 1] !== '*' && source[close - 1] !== '*') break
        close++
      }
      if (close < source.length && close > i + 1) {
        flush()
        out.push({ type: 'em', children: parseInline(source.slice(i + 1, close)) })
        i = close + 1
        continue
      }
    }

    buffer += source[i]
    i++
  }
  flush()
  return out
}

/** Plain text of inline nodes, for ids, word counts, and parity tests. */
export function inlineText(nodes: Inline[]): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case 'text':
        case 'code':
          return node.value
        case 'cite':
          return `[${node.value}]`
        case 'label':
          return `[${node.label}]`
        default:
          return inlineText(node.children)
      }
    })
    .join('')
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim())
}

function parseBlocks(lines: string[], sectionId: string): Block[] {
  const blocks: Block[] = []
  let pendingVariant: string | undefined
  let i = 0

  const takeVariant = () => {
    const v = pendingVariant
    pendingVariant = undefined
    return v
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i++
      continue
    }

    const directive = trimmed.match(/^<!--\s*(visual|variant):([\w-]+)\s*-->$/)
    if (directive) {
      if (directive[1] === 'visual') blocks.push({ type: 'visual', id: directive[2] })
      else pendingVariant = directive[2]
      i++
      continue
    }

    if (trimmed.startsWith('#### ')) {
      const text = trimmed.slice(5)
      blocks.push({ type: 'heading', level: 4, id: `${sectionId}-${slugify(text)}`, text })
      i++
      continue
    }

    if (trimmed.startsWith('$$')) {
      // Display math: a single "$$…$$" line, or "$$" … "$$" across lines.
      const inner: string[] = []
      if (trimmed.length > 4 && trimmed.endsWith('$$')) {
        inner.push(trimmed.slice(2, -2))
        i++
      } else {
        i++
        while (i < lines.length && !lines[i].trim().startsWith('$$')) inner.push(lines[i++])
        i++
      }
      blocks.push({ type: 'math', latex: inner.join('\n').trim() })
      continue
    }

    if (trimmed.startsWith('```')) {
      const inner: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) inner.push(lines[i++])
      i++
      blocks.push({ type: 'code', value: inner.join('\n') })
      continue
    }

    if (trimmed.startsWith('### ')) {
      const text = trimmed.slice(4)
      blocks.push({ type: 'heading', level: 3, id: `${sectionId}-${slugify(text)}`, text })
      i++
      continue
    }

    if (trimmed.startsWith('>')) {
      const inner: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        inner.push(lines[i].trim().replace(/^>\s?/, ''))
        i++
      }
      const innerBlocks = parseBlocks(inner, sectionId)
      let title: Inline[] | undefined
      const first = innerBlocks[0]
      // A callout whose first paragraph is a bold line (optionally with a
      // label) uses that line as its title.
      if (first?.type === 'paragraph' && first.children[0]?.type === 'strong') {
        const rest = first.children.slice(1).filter((n) => !(n.type === 'text' && !n.value.trim()))
        if (rest.every((n) => n.type === 'label')) {
          title = first.children
          innerBlocks.shift()
        }
      }
      blocks.push({ type: 'callout', title, blocks: innerBlocks })
      continue
    }

    if (trimmed.startsWith('|')) {
      const rows: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(lines[i])
        i++
      }
      const [headerLine, , ...bodyLines] = rows
      blocks.push({
        type: 'table',
        header: splitRow(headerLine).map(parseInline),
        rows: bodyLines.map((row) => splitRow(row).map(parseInline)),
        variant: takeVariant(),
      })
      continue
    }

    const bullet = /^[-*]\s+/
    const numbered = /^\d+\.\s+/
    if (bullet.test(trimmed) || numbered.test(trimmed)) {
      const ordered = numbered.test(trimmed)
      const marker = ordered ? numbered : bullet
      const items: Inline[][] = []
      while (i < lines.length && marker.test(lines[i].trim())) {
        items.push(parseInline(lines[i].trim().replace(marker, '')))
        i++
      }
      blocks.push({ type: 'list', ordered, items, variant: takeVariant() })
      continue
    }

    // Paragraph: consecutive non-structural lines.
    const paragraph: string[] = []
    while (i < lines.length) {
      const t = lines[i].trim()
      if (!t || t.startsWith('#') || t.startsWith('>') || t.startsWith('|') || t.startsWith('<!--') || t.startsWith('$$') || t.startsWith('```')) break
      if (paragraph.length > 0 && (bullet.test(t) || numbered.test(t))) break
      paragraph.push(t)
      i++
    }
    const children = parseInline(paragraph.join(' '))
    // Diagnostic dimensions ("**7. Credibility** (Chapter 5)") get stable
    // anchors so the systems map can link straight to each entry.
    const dimension = paragraph[0].match(/^\*\*(\d+)\.\s/)
    blocks.push({
      type: 'paragraph',
      children,
      id: dimension ? `dimension-${dimension[1]}` : undefined,
      variant: takeVariant(),
    })
  }

  return blocks
}

export function parseArticle(markdown: string): ArticleSection[] {
  const sections: ArticleSection[] = []
  const chunks = markdown.split(/^## /m).filter((chunk) => chunk.trim())

  for (const chunk of chunks) {
    const [headingLine, ...rest] = chunk.split('\n')
    const heading = headingLine.trim()
    const chapter = heading.match(/^Chapter (\d+)\.\s+(.+)$/)
    // "Part II — Context" and "Appendix C — …" get an eyebrow too.
    const division = chapter ? null : heading.match(/^(Part [IVX]+|Appendix [A-Z])\s+—\s+(.+)$/)
    const id = chapter ? `chapter-${chapter[1]}` : division ? slugify(division[1]) : slugify(heading)
    sections.push({
      id,
      eyebrow: chapter ? `Chapter ${chapter[1]}` : division ? division[1] : undefined,
      title: chapter ? chapter[2] : division ? division[2] : heading,
      blocks: parseBlocks(rest, id),
    })
  }

  return sections
}

function blockText(block: Block): string {
  switch (block.type) {
    case 'heading':
      return block.text
    case 'math':
      return ''
    case 'code':
      return block.value
    case 'paragraph':
      return inlineText(block.children)
    case 'list':
      return block.items.map(inlineText).join(' ')
    case 'table':
      return [...block.header, ...block.rows.flat()].map(inlineText).join(' ')
    case 'callout':
      return [block.title ? inlineText(block.title) : '', ...block.blocks.map(blockText)].join(' ')
    case 'visual':
      return ''
  }
}

/** Rendered prose word count (headings included, visuals excluded). */
export function countWords(sections: ArticleSection[]): number {
  return sections
    .map((section) => [section.title, ...section.blocks.map(blockText)].join(' '))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length
}

import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Seo } from '@/components/seo/seo'
import { SITE } from '@/content/site'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format-date'
import { useActiveSection } from '@/hooks/use-active-section'
import { ArticleBlock } from '@/components/long-form/article-blocks'
import { countWords, parseArticle, type ArticleSection } from '@/content/articles/parse-article-markdown'
import type { SanityArticleSummary } from '@/lib/sanity/types'

/**
 * The shared page shell for code-backed long-form articles: reading
 * progress, a sticky contents rail that collapses into a disclosure on
 * small screens, and the section renderer. Each article supplies its own
 * Markdown and its own figure renderer; everything else is identical
 * across them, so it lives here rather than being copied per page.
 */

interface TocEntry {
  id: string
  /** "01"… for chapters; the numeral or letter for parts and appendices. */
  number: string
  title: string
}

function buildToc(sections: ArticleSection[]): TocEntry[] {
  return sections.map((section) => ({
    id: section.id,
    number: section.eyebrow
      ? section.eyebrow.startsWith('Chapter ')
        ? section.eyebrow.replace('Chapter ', '').padStart(2, '0')
        : (section.eyebrow.split(' ')[1] ?? '')
      : '',
    title: section.title,
  }))
}

/**
 * Thin bar pinned to the top edge of the viewport showing how far the
 * reader is through the article body (not the whole page). Purely
 * visual, so it is hidden from assistive tech; it only moves in
 * response to scrolling, never animates on its own.
 */
function ReadingProgress({ target }: { target: RefObject<HTMLElement | null> }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = target.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const value = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
      setProgress(value)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [target])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5">
      <div className="h-full origin-left bg-accent" style={{ transform: `scaleX(${progress})` }} />
    </div>
  )
}

function TocLinks({ entries, active, onNavigate }: { entries: TocEntry[]; active?: string; onNavigate?: () => void }) {
  return (
    <ol className="space-y-2.5">
      {entries.map((entry) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            onClick={onNavigate}
            aria-current={active === entry.id ? 'location' : undefined}
            className={cn(
              'grid grid-cols-[1.75rem_1fr] gap-1 border-l-2 py-0.5 pl-3 text-sm leading-snug transition-colors',
              active === entry.id ? 'border-accent text-ink' : 'border-transparent text-ink-muted hover:text-ink',
            )}
          >
            <span className="label-mono pt-[0.2rem] text-accent">{entry.number}</span>
            <span>{entry.title}</span>
          </a>
        </li>
      ))}
    </ol>
  )
}

export interface LongFormArticleProps {
  summary: SanityArticleSummary
  subtitle: string
  /** Second half of the eyebrow, after the category: "AI systems", "Business systems". */
  kicker: string
  markdown: string
  renderVisual: (id: string) => ReactNode
  /**
   * Extra classes for the prose column. Articles with long unbreakable
   * tokens (equations, identifiers) opt into aggressive wrapping here.
   */
  bodyClassName?: string
}

export function LongFormArticle({ summary, subtitle, kicker, markdown, renderVisual, bodyClassName }: LongFormArticleProps) {
  const articleRef = useRef<HTMLElement>(null)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)

  const sections = useMemo(() => parseArticle(markdown), [markdown])
  const toc = useMemo(() => buildToc(sections), [sections])
  const ids = useMemo(() => toc.map((entry) => entry.id), [toc])
  const active = useActiveSection(ids)

  const wordCount = useMemo(() => countWords(sections), [sections])
  // A deliberately conservative reading pace for dense, argument-heavy prose.
  const readingMinutes = Math.round(wordCount / 230 / 5) * 5
  const chapterCount = sections.filter((section) => section.eyebrow?.startsWith('Chapter ')).length

  const path = `/articles/${summary.slug}`

  return (
    <>
      <Seo
        title={summary.title}
        description={summary.excerpt}
        path={path}
        ogType="article"
        publishedTime={summary.publishedAt}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: summary.title,
            alternativeHeadline: subtitle,
            description: summary.excerpt,
            datePublished: summary.publishedAt,
            wordCount,
            author: { '@type': 'Person', name: SITE.name },
            mainEntityOfPage: `${SITE.url}${path}`,
          },
        ]}
      />

      <ReadingProgress target={articleRef} />

      <article ref={articleRef} className="container-editorial section-y-tight pt-14">
        <div className="mb-8">
          <Link to="/articles" className="label-mono inline-flex items-center gap-2 text-ink-faint transition-colors hover:text-ink">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Methods
          </Link>
        </div>

        <header className="max-w-3xl">
          <p className="label-mono text-accent">
            {summary.category} · {kicker}
          </p>
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{summary.title}</h1>
          <p className="mt-5 font-serif text-2xl leading-snug text-ink-muted sm:text-3xl">{subtitle}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="label-mono text-ink-faint">{formatDate(summary.publishedAt)}</p>
            <p className="label-mono text-ink-faint">About {readingMinutes} min read</p>
            <p className="label-mono text-ink-faint">{summary.tags.join(' · ')}</p>
          </div>
        </header>

        <details
          className="mt-10 rounded-sm border border-line lg:hidden"
          open={mobileTocOpen}
          onToggle={(event) => setMobileTocOpen((event.target as HTMLDetailsElement).open)}
        >
          <summary className="label-mono cursor-pointer px-4 py-3 text-ink">Contents · {chapterCount} chapters</summary>
          <nav aria-label="Article contents" className="border-t border-line px-3 py-4">
            <TocLinks entries={toc} active={active} onNavigate={() => setMobileTocOpen(false)} />
          </nav>
        </details>

        <div className="mt-12 grid gap-12 border-t border-line pt-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block">
            <nav aria-label="Article contents" className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6">
              <p className="label-mono mb-4 text-ink-faint">Contents</p>
              <TocLinks entries={toc} active={active} />
            </nav>
          </aside>

          <div className={cn('long-form min-w-0', bodyClassName)}>
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="long-form-section scroll-mt-24"
              >
                <h2 id={`${section.id}-title`} className="text-3xl leading-tight sm:text-4xl">
                  {section.eyebrow ? <span className="label-mono mb-3 block text-accent">{section.eyebrow}</span> : null}
                  {section.title}
                </h2>
                <div className={cn('mt-6', section.id === 'references' && 'long-form-references')}>
                  {section.blocks.map((block, index) => (
                    <ArticleBlock key={index} block={block} renderVisual={renderVisual} />
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-16 border-t border-line pt-8">
              <Link to="/articles" className="label-mono inline-flex items-center gap-2 text-ink-faint transition-colors hover:text-ink">
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                Methods
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

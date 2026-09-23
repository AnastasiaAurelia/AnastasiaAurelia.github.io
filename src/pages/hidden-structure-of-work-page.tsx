import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Seo } from '@/components/seo/seo'
import { SITE } from '@/content/site'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format-date'
import { useActiveSection } from '@/hooks/use-active-section'
import { ArticleBlock } from '@/components/long-form/article-blocks'
import { HiddenStructureVisual } from '@/components/long-form/hidden-structure-visuals'
import { countWords, parseArticle } from '@/content/articles/parse-article-markdown'
import {
  HIDDEN_STRUCTURE_ARTICLE_SUMMARY as SUMMARY,
  HIDDEN_STRUCTURE_SUBTITLE,
} from '@/content/static-articles'
import articleMarkdown from '@/content/articles/hidden-structure-of-work.md?raw'

const sections = parseArticle(articleMarkdown)
const wordCount = countWords(sections)
// A deliberately conservative reading pace for dense, argument-heavy prose.
const readingMinutes = Math.round(wordCount / 230 / 5) * 5

const toc = sections.map((section) => ({
  id: section.id,
  number: section.eyebrow ? section.eyebrow.replace('Chapter ', '').padStart(2, '0') : '',
  title: section.title,
}))

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

function TocLinks({ active, onNavigate }: { active?: string; onNavigate?: () => void }) {
  return (
    <ol className="space-y-2.5">
      {toc.map((entry) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            onClick={onNavigate}
            aria-current={active === entry.id ? 'location' : undefined}
            className={cn(
              'grid grid-cols-[1.75rem_1fr] gap-1 border-l-2 py-0.5 pl-3 text-sm leading-snug transition-colors',
              active === entry.id
                ? 'border-accent text-ink'
                : 'border-transparent text-ink-muted hover:text-ink',
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

export function HiddenStructureOfWorkPage() {
  const articleRef = useRef<HTMLElement>(null)
  const ids = useMemo(() => toc.map((entry) => entry.id), [])
  const active = useActiveSection(ids)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)

  const path = `/articles/${SUMMARY.slug}`

  return (
    <>
      <Seo
        title={SUMMARY.title}
        description={SUMMARY.excerpt}
        path={path}
        ogType="article"
        publishedTime={SUMMARY.publishedAt}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: SUMMARY.title,
            alternativeHeadline: HIDDEN_STRUCTURE_SUBTITLE,
            description: SUMMARY.excerpt,
            datePublished: SUMMARY.publishedAt,
            wordCount,
            author: { '@type': 'Person', name: SITE.name },
            mainEntityOfPage: `${SITE.url}${path}`,
          },
        ]}
      />

      <ReadingProgress target={articleRef} />

      <article ref={articleRef} className="container-editorial section-y-tight pt-14">
        <div className="mb-8">
          <Link
            to="/articles"
            className="label-mono inline-flex items-center gap-2 text-ink-faint transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Methods
          </Link>
        </div>

        <header className="max-w-3xl">
          <p className="label-mono text-accent">{SUMMARY.category} · Organizations and power</p>
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{SUMMARY.title}</h1>
          <p className="mt-5 font-serif text-2xl leading-snug text-ink-muted sm:text-3xl">{HIDDEN_STRUCTURE_SUBTITLE}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="label-mono text-ink-faint">{formatDate(SUMMARY.publishedAt)}</p>
            <p className="label-mono text-ink-faint">About {readingMinutes} min read</p>
            <p className="label-mono text-ink-faint">{SUMMARY.tags.join(' · ')}</p>
          </div>
        </header>

        <details
          className="mt-10 rounded-sm border border-line lg:hidden"
          open={mobileTocOpen}
          onToggle={(event) => setMobileTocOpen((event.target as HTMLDetailsElement).open)}
        >
          <summary className="label-mono cursor-pointer px-4 py-3 text-ink">Contents · 12 chapters</summary>
          <nav aria-label="Article contents" className="border-t border-line px-3 py-4">
            <TocLinks active={active} onNavigate={() => setMobileTocOpen(false)} />
          </nav>
        </details>

        <div className="mt-12 grid gap-12 border-t border-line pt-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block">
            <nav aria-label="Article contents" className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6">
              <p className="label-mono mb-4 text-ink-faint">Contents</p>
              <TocLinks active={active} />
            </nav>
          </aside>

          <div className="long-form min-w-0">
            {sections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="long-form-section scroll-mt-24">
                <h2 id={`${section.id}-title`} className="text-3xl leading-tight sm:text-4xl">
                  {section.eyebrow ? (
                    <span className="label-mono mb-3 block text-accent">{section.eyebrow}</span>
                  ) : null}
                  {section.title}
                </h2>
                <div className={cn('mt-6', section.id === 'references' && 'long-form-references')}>
                  {section.blocks.map((block, index) => (
                    <ArticleBlock
                      key={index}
                      block={block}
                      renderVisual={(id) => <HiddenStructureVisual id={id} />}
                    />
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-16 border-t border-line pt-8">
              <Link
                to="/articles"
                className="label-mono inline-flex items-center gap-2 text-ink-faint transition-colors hover:text-ink"
              >
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

export default HiddenStructureOfWorkPage

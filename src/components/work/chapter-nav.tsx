import { cn } from '@/lib/utils'
import { useActiveSection } from '@/hooks/use-active-section'

interface Chapter {
  id: string
  number: string
  title: string
}

/**
 * Sticky chapter rail — desktop only. On a short case study a table of
 * contents is overhead, but these pages routinely carry a dozen
 * sections; the brief specifically calls for one where content depth
 * supports it.
 */
export function ChapterNav({ chapters }: { chapters: Chapter[] }) {
  const active = useActiveSection(chapters.map((c) => c.id))

  return (
    <nav aria-label="Chapters" className="sticky top-24 hidden self-start lg:block">
      <ul className="space-y-3 border-l border-line pl-5">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              className={cn(
                'label-mono -ml-5 flex items-baseline gap-2 border-l pl-5 transition-colors',
                active === chapter.id
                  ? 'border-accent text-ink'
                  : 'border-transparent text-ink-faint hover:text-ink',
              )}
            >
              <span>{chapter.number}</span>
              <span className="normal-case tracking-normal">{chapter.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

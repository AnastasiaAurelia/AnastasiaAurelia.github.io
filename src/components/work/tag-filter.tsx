import { tagLabel, type TagId } from '@/content/tags'
import { cn } from '@/lib/utils'

interface TagFilterProps {
  tags: TagId[]
  active: TagId | null
  onChange: (tag: TagId | null) => void
}

export function TagFilter({ tags, active, onChange }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter work by tag">
      <button
        type="button"
        onClick={() => onChange(null)}
        aria-pressed={active === null}
        className={cn(
          'rounded-sm border px-3 py-1.5 text-sm transition-colors',
          active === null ? 'border-ink bg-ink text-paper' : 'border-line text-ink-muted hover:text-ink',
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onChange(tag)}
          aria-pressed={active === tag}
          className={cn(
            'rounded-sm border px-3 py-1.5 text-sm transition-colors',
            active === tag ? 'border-ink bg-ink text-paper' : 'border-line text-ink-muted hover:text-ink',
          )}
        >
          {tagLabel(tag)}
        </button>
      ))}
    </div>
  )
}

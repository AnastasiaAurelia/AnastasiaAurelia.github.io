import { cn } from '@/lib/utils'

interface TagFilterProps {
  tags: string[]
  active: string | null
  onChange: (tag: string | null) => void
  label?: string
}

const base = 'label-mono border-b-2 pb-1 transition-colors'

export function TagFilter({ tags, active, onChange, label = 'Filter work by tag' }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-3" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(null)}
        aria-pressed={active === null}
        className={cn(base, active === null ? 'border-ink text-ink' : 'border-transparent text-ink-faint hover:text-ink')}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onChange(tag)}
          aria-pressed={active === tag}
          className={cn(base, active === tag ? 'border-ink text-ink' : 'border-transparent text-ink-faint hover:text-ink')}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}

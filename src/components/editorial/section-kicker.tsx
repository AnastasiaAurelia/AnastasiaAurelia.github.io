import { cn } from '@/lib/utils'

/**
 * The "01 — Title" chapter marker used above every major homepage
 * section and project-detail chapter. Mono numerals do the identity
 * work the brief asks for instead of icons or decoration.
 */
export function SectionKicker({
  index,
  title,
  className,
}: {
  index: string
  title: string
  className?: string
}) {
  return (
    <div className={cn('mb-5 flex items-baseline gap-4', className)}>
      <span className="label-mono text-accent">{index}</span>
      <span className="label-mono text-ink-faint">{title}</span>
    </div>
  )
}

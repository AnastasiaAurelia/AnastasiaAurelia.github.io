import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/content/types'
import { tagLabel } from '@/content/tags'
import { Badge } from '@/components/ui/badge'

export function WorkCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className="group flex flex-col justify-between gap-6 rounded-sm border border-line p-6 transition-colors hover:border-ink focus-visible:border-ink"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg leading-snug">{project.title}</h3>
          <ArrowUpRight
            className="size-5 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </div>
        <p className="text-sm text-ink-muted">{project.summary}</p>
      </div>
      {project.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Badge>{tagLabel(tag)}</Badge>
            </li>
          ))}
        </ul>
      ) : null}
    </Link>
  )
}

import { SectionKicker } from '@/components/editorial/section-kicker'
import { useReveal } from '@/hooks/use-reveal'
import type { CapabilityGroup } from '@/lib/sanity/types'
import { EmptyState } from '@/components/state/query-states'

/**
 * An editorial index, not icon cards: each capability group is a
 * numbered row with a serif title and a mono index mark. Replaces what
 * were three separate hard-coded sections (thesis / domains / capability
 * statement) — the CMS models this as one flexible array instead.
 */
export function Capabilities({ groups }: { groups: CapabilityGroup[] }) {
  const { ref, visible } = useReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      data-visible={visible}
      className="reveal container-editorial section-y-tight border-t border-line"
    >
      <SectionKicker index="02" title="What I make easier" />
      {groups.length === 0 ? (
        <EmptyState message="No capability groups published yet." />
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {groups.map((group, index) => (
            <li
              key={group.title}
              className="grid grid-cols-[3rem_1fr] gap-x-6 py-6 sm:grid-cols-[4rem_16rem_1fr] sm:gap-x-10"
            >
              <span className="label-mono pt-1 text-ink-faint">{String(index + 1).padStart(2, '0')}</span>
              <div className="sm:contents">
                <h3 className="text-xl sm:col-start-2">{group.title}</h3>
                <div className="mt-2 max-w-xl sm:col-start-3 sm:row-start-1 sm:mt-0 sm:border-l sm:border-line sm:pl-8">
                  <p className="text-ink-muted">{group.description}</p>
                  {group.capabilities && group.capabilities.length > 0 ? (
                    <p className="label-mono mt-2 text-ink-faint">{group.capabilities.join(' · ')}</p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

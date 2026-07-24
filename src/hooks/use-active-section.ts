import { useEffect, useState } from 'react'

/**
 * Tracks which chapter heading is currently nearest the top of the
 * viewport, for highlighting the matching entry in the sticky chapter
 * nav. Falls back to the first id when nothing has been observed yet
 * (initial paint, or an empty chapter list).
 */
export function useActiveSection(ids: string[]): string | undefined {
  const [active, setActive] = useState<string | undefined>(ids[0])

  useEffect(() => {
    if (ids.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    )

    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}

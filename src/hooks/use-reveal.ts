import { useEffect, useRef, useState } from 'react'

/**
 * Toggles `data-visible` once an element enters the viewport, for the
 * `.reveal` CSS transition (see index.css). Fires once — sections don't
 * re-hide on scroll-away, which would fight the reader rather than
 * guide them. Respects `prefers-reduced-motion` by skipping straight to
 * visible instead of observing at all.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

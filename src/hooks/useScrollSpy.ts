import { useEffect, useState } from 'react'

/**
 * Id of the section currently occupying the reading position.
 *
 * Deliberately not an IntersectionObserver: the sections here differ wildly in
 * height (the signature band is three viewports tall, the funding strip is a
 * fifth of one), so "most visible" picks the wrong one constantly. Comparing
 * each section's top against a fixed line a third of the way down the viewport
 * matches what a reader would say they are looking at.
 */
export function useScrollSpy(ids: Array<string>) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const line = window.innerHeight * 0.34
      let current: string | null = null

      for (const id of ids) {
        const element = document.getElementById(id)
        if (!element) continue
        if (element.getBoundingClientRect().top <= line) current = id
      }

      // At the very bottom the last section may never cross the line, so pin
      // it explicitly rather than leaving the previous item highlighted.
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      if (atEnd && ids.length) current = ids[ids.length - 1]

      setActive((previous) => (previous === current ? previous : current))
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids])

  return active
}

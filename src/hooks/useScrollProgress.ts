import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

/**
 * Normalised scroll progress (0..1) through a tall driver element.
 *
 * The raw value lives in a ref so the render loop can read it every frame
 * without re-rendering React. Only the coarse act index is exposed as state,
 * which is what the HTML overlay needs, so scrolling costs at most a handful
 * of re-renders across the whole band.
 */
export function useScrollProgress(
  driver: RefObject<HTMLElement | null>,
  actCount: number,
) {
  const progress = useRef(0)
  const [act, setAct] = useState(0)
  const [inView, setInView] = useState(false)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const element = driver.current
    if (!element) return

    let frame = 0

    const measure = () => {
      frame = 0
      const rect = element.getBoundingClientRect()
      const travel = rect.height - window.innerHeight

      const value =
        travel <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / travel))
      progress.current = value

      // Bias the boundaries slightly late so a caption never swaps while its
      // matching camera move is still settling.
      const next = Math.min(actCount - 1, Math.floor(value * actCount + 0.08))
      setAct((current) => (current === next ? current : next))

      setInView(rect.top < window.innerHeight && rect.bottom > 0)
      // Warm the renderer up a screen early so the stage is never empty when
      // the band finally scrolls in.
      setNear(
        rect.top < window.innerHeight * 2 && rect.bottom > -window.innerHeight,
      )
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
  }, [driver, actCount])

  return { progress, act, inView, near }
}

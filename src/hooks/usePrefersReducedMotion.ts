import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Returns true when the visitor has asked for reduced motion. Starts as `true`
 * so nothing animated can flash before the preference has been read.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(true)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const update = () => setReduced(media.matches)

    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}

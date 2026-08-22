import { useRef } from 'react'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * A card that tilts towards the pointer, with a specular highlight that tracks
 * it across the surface.
 *
 * The pointer position is written straight to CSS custom properties rather than
 * held in React state: this fires on every mouse move, and a re-render per move
 * would be the most expensive thing on the page. CSS then interpolates towards
 * each new value, which is what smooths a jumpy pointer into a glide.
 *
 * Coarse pointers get no tilt at all — there is nothing to hover with, and a
 * touch-driven tilt just fights the scroll.
 */
export function TiltCard({
  children,
  className,
  depth = 9,
  lift = 12,
}: {
  children: ReactNode
  className?: string
  /** Maximum rotation, in degrees, at the corners. */
  depth?: number
  /** Maximum parallax shift, in pixels, of the card inside its frame. */
  lift?: number
}) {
  const frame = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  const set = (x: number, y: number, active: boolean) => {
    const node = frame.current
    if (!node) return
    // Signs follow the reference comet card: the surface pivots away from the
    // pointer while sliding towards it, which is what sells it as a solid slab
    // being pressed rather than a flat image being skewed.
    node.style.setProperty('--tilt-x', `${(y * depth).toFixed(2)}deg`)
    node.style.setProperty('--tilt-y', `${(-x * depth).toFixed(2)}deg`)
    node.style.setProperty('--tilt-tx', `${(x * lift).toFixed(2)}px`)
    node.style.setProperty('--tilt-ty', `${(-y * lift).toFixed(2)}px`)
    node.style.setProperty('--glare-x', `${(50 + x * 100).toFixed(1)}%`)
    node.style.setProperty('--glare-y', `${(50 + y * 100).toFixed(1)}%`)
    node.style.setProperty('--tilt-on', active ? '1' : '0')
  }

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== 'mouse') return
    const node = frame.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    set(
      (event.clientX - rect.left) / rect.width - 0.5,
      (event.clientY - rect.top) / rect.height - 0.5,
      true,
    )
  }

  return (
    <div
      ref={frame}
      className={className ? `tilt ${className}` : 'tilt'}
      onPointerMove={onMove}
      onPointerLeave={() => set(0, 0, false)}
    >
      <div className="tilt-body">
        {children}
        <span className="tilt-glare" aria-hidden="true" />
      </div>
    </div>
  )
}

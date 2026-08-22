import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import type { SiteCopy } from '../i18n'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import type { PerfTier } from './three/brand'

const SignatureScene = lazy(() => import('./three/SignatureScene'))

const POSTER = '/assets/3d/wolf-poster.webp'

type NavigatorWithHints = Navigator & { deviceMemory?: number }

function detectTier(): PerfTier {
  const nav = navigator as NavigatorWithHints
  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 4
  if (window.innerWidth < 900 || cores <= 4 || memory <= 4) return 'low'
  return 'high'
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * The cinematic band that sits between the hero and the rest of the page.
 *
 * A tall driver section scrolls past a sticky stage; scroll position through
 * the driver is the single input to the 3D scene. All copy is real HTML on top
 * of the canvas, so the section still reads and indexes with WebGL disabled.
 */
export function SignatureBand({ copy }: { copy: SiteCopy }) {
  const driver = useRef<HTMLElement>(null)
  const acts = copy.signature.acts
  const { progress, act, inView, near } = useScrollProgress(driver, acts.length)

  const reducedMotion = usePrefersReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [tier, setTier] = useState<PerfTier>('low')

  useEffect(() => {
    if (reducedMotion) {
      setEnabled(false)
      return
    }
    if (!supportsWebGL()) return
    setTier(detectTier())
    setEnabled(true)
  }, [reducedMotion])

  // Only mount the renderer once the band is somewhere near the viewport.
  const [everSeen, setEverSeen] = useState(false)
  useEffect(() => {
    if (near) setEverSeen(true)
  }, [near])

  const style = useMemo(
    () => ({ '--acts': acts.length }) as React.CSSProperties,
    [acts.length],
  )

  return (
    <section
      className="signature"
      id="signature"
      ref={driver}
      style={style}
      aria-label={copy.signature.title}
    >
      <div className="signature-stage">
        {enabled && everSeen ? (
          <div className="signature-canvas" aria-hidden="true">
            {/* Sits behind the canvas and is covered as soon as the first
                frame is drawn, so a slow load never shows an empty stage. */}
            <img className="signature-poster" alt="" src={POSTER} />
            <Suspense fallback={null}>
              <SignatureScene progress={progress} tier={tier} active={inView} />
            </Suspense>
          </div>
        ) : (
          <div className="signature-canvas">
            <img
              className="signature-poster"
              alt={copy.signature.a11y}
              src={POSTER}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        <div className="wrap signature-copy">
          <span className="eyebrow">{copy.signature.eyebrow}</span>
          <h2>{copy.signature.title}</h2>
          <ol className="signature-acts">
            {acts.map(([label, line], index) => (
              <li
                key={label}
                className={index === act ? 'is-current' : undefined}
                aria-current={index === act ? 'step' : undefined}
              >
                <span className="signature-act-label">{label}</span>
                <span className="signature-act-line">{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/**
 * Colour and easing tokens for the signature 3D scene.
 *
 * Every colour here mirrors a custom property in `src/styles.css`. The scene
 * must never introduce a hue that is not already part of the site palette.
 */

export const brand = {
  nacht: '#0b101e',
  nacht2: '#0e1524',
  card: '#131a2b',
  orange: '#f9613a',
  orangeDeep: '#d9451f',
  text: '#edf0f6',
  dim: '#98a3b8',
  /** Cool key light: a desaturated lift of the night blue, never pure white. */
  key: '#cfd9ea',
  /** The gunmetal the wolf is machined from. */
  metal: '#161c28',
} as const

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/** Frame-rate independent approach to a target. */
export function damp(
  current: number,
  target: number,
  lambda: number,
  dt: number,
) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt))
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/** Deterministic PRNG so the scene layout is identical on every build. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type PerfTier = 'low' | 'high'

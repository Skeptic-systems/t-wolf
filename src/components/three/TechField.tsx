import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { RefObject } from 'react'
import { brand, clamp, damp, lerp, mulberry32, smoothstep } from './brand'
import type { PerfTier } from './brand'

/**
 * The technical layer the wolf stands in: a survey grid on the floor, a slow
 * drift of data motes in the air, and instrument rings that lock around the
 * animal as the story moves from "we look" to "we build".
 *
 * Everything is procedural. None of it is downloaded, all of it is a pure
 * function of scroll, and the whole layer is four draw calls.
 */
export function TechField({
  progress,
  tier,
}: {
  progress: RefObject<number>
  tier: PerfTier
}) {
  return (
    <>
      <GridFloor progress={progress} />
      <Motes progress={progress} tier={tier} />
      <HudRings progress={progress} tier={tier} />
    </>
  )
}

/* -------------------------------------------------------------------------- */

const gridVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

/**
 * Screen-space derivatives (`fwidth`) rather than a fixed line width: a grid
 * drawn at constant world thickness turns into aliased noise as it recedes,
 * because the lines end up thinner than a pixel. Measuring how fast the
 * coordinate changes per pixel keeps every line exactly one pixel wide all the
 * way to the horizon.
 */
const gridFragment = /* glsl */ `
  uniform float uOpacity;
  uniform float uPulse;
  uniform float uPulseOn;
  uniform vec3 uLine;
  uniform vec3 uGlow;
  varying vec3 vWorld;

  float grid(vec2 p, float scale) {
    vec2 c = p * scale;
    vec2 w = fwidth(c);
    vec2 d = abs(fract(c - 0.5) - 0.5) / w;
    float line = 1.0 - min(min(d.x, d.y), 1.0);

    // Once a cell is smaller than a pixel the test above is true almost
    // everywhere and the grid saturates into a flat wash — which at this
    // camera height is most of the floor. Fading the lines out exactly where
    // they stop being resolvable is what keeps it reading as a grid.
    return line * (1.0 - smoothstep(0.7, 2.4, max(w.x, w.y)));
  }

  void main() {
    vec2 p = vWorld.xz;
    float radius = length(p);

    float fine = grid(p, 0.5) * 0.55;
    float coarse = grid(p, 0.125) * 1.5;

    // Nothing is drawn under the wolf itself, or the grid fights the contact
    // shadow, and nothing survives past the fog line either.
    float fade = smoothstep(26.0, 6.0, radius) * smoothstep(1.1, 2.4, radius);

    // A survey pulse travelling outward from the wolf's feet.
    float ring = smoothstep(0.75, 0.0, abs(radius - uPulse)) * uPulseOn;

    float alpha = (fine + coarse) * fade + ring * fade * 0.5;
    vec3 colour = mix(uLine, uGlow, clamp(coarse * 0.55 + ring, 0.0, 1.0));

    gl_FragColor = vec4(colour * (1.0 + ring * 2.2), alpha * uOpacity);
    #include <colorspace_fragment>
  }
`

function GridFloor({ progress }: { progress: RefObject<number> }) {
  const uniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
      uPulse: { value: 0 },
      uPulseOn: { value: 0 },
      uLine: { value: new THREE.Color(brand.dim) },
      uGlow: { value: new THREE.Color(brand.orange) },
    }),
    [],
  )

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1)
    const time = state.clock.elapsedTime
    const p = progress.current ?? 0

    // The grid is the first thing to arrive: the ground is surveyed before
    // anything gets built on it.
    uniforms.uOpacity.value = damp(
      uniforms.uOpacity.value,
      clamp(smoothstep(0.06, 0.3, p) * (1 - 0.35 * smoothstep(0.8, 1, p))) *
        0.55,
      3,
      delta,
    )

    // Free-running rather than scroll-driven: a pulse that reverses when the
    // visitor scrolls up reads as a glitch, not as a scan.
    uniforms.uPulse.value = ((time * 2.4) % 26) + 1
    uniforms.uPulseOn.value = damp(
      uniforms.uPulseOn.value,
      clamp(smoothstep(0.1, 0.34, p)),
      3,
      delta,
    )
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
      <planeGeometry args={[56, 56]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={gridVertex}
        fragmentShader={gridFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

/* -------------------------------------------------------------------------- */

const moteVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uSize;
  varying float vSeed;
  varying float vFade;

  void main() {
    vSeed = aSeed;

    vec3 pos = position;
    // Rise, then wrap. Doing the wrap in the shader means the buffer is
    // uploaded once and never touched again.
    pos.y = mod(pos.y + uTime * (0.10 + aSeed * 0.16), 7.0);
    pos.x += sin(uTime * 0.25 + aSeed * 22.0) * 0.22;
    pos.z += cos(uTime * 0.21 + aSeed * 17.0) * 0.22;

    // Fade in off the floor and out again near the top, so motes never pop.
    vFade = smoothstep(0.0, 1.2, pos.y) * smoothstep(7.0, 4.6, pos.y);

    vec4 view = viewMatrix * modelMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * view;
    gl_PointSize = uSize * (1.0 + aSeed) / max(-view.z, 0.001);
  }
`

const moteFragment = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uWarm;
  uniform vec3 uCool;
  varying float vSeed;
  varying float vFade;

  void main() {
    // Round the point sprite off; a square mote reads as a dead pixel.
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);

    // A minority are brand-warm. An even split would tint the whole air orange.
    vec3 colour = mix(uCool, uWarm, step(0.82, vSeed));

    gl_FragColor = vec4(colour, core * core * vFade * uOpacity);
    #include <colorspace_fragment>
  }
`

function Motes({
  progress,
  tier,
}: {
  progress: RefObject<number>
  tier: PerfTier
}) {
  const count = tier === 'high' ? 520 : 200

  const geometry = useMemo(() => {
    const random = mulberry32(0x51de)
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)

    for (let i = 0; i < count; i += 1) {
      // A hollow column: motes fill the air around the wolf, not inside it.
      const angle = random() * Math.PI * 2
      const radius = 1.8 + random() * 9.5
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = random() * 7
      positions[i * 3 + 2] = Math.sin(angle) * radius
      seeds[i] = random()
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    return geo
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uSize: { value: 34 },
      uWarm: { value: new THREE.Color(brand.orange) },
      uCool: { value: new THREE.Color(brand.key) },
    }),
    [],
  )

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1)
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uOpacity.value = damp(
      uniforms.uOpacity.value,
      clamp(smoothstep(0.02, 0.28, progress.current ?? 0)) * 0.85,
      3,
      delta,
    )
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={moteVertex}
        fragmentShader={moteFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* -------------------------------------------------------------------------- */

type Ring = {
  radius: number
  tube: number
  /** Tilt away from horizontal, in radians, on X and Z. */
  tilt: [number, number]
  spin: number
  /** Fraction of a full circle the arc covers. A closed torus is rotationally
   *  symmetric, so spinning one is invisible — the gap is what shows motion. */
  arc: number
  /** Scroll position at which this ring locks into place. */
  at: number
  warm: boolean
}

const RINGS: Array<Ring> = [
  {
    radius: 1.75,
    tube: 0.007,
    tilt: [0.16, 0.1],
    spin: 0.34,
    arc: 0.62,
    at: 0.2,
    warm: true,
  },
  {
    radius: 2.4,
    tube: 0.005,
    tilt: [-0.2, -0.14],
    spin: -0.21,
    arc: 0.44,
    at: 0.44,
    warm: false,
  },
  {
    radius: 3.15,
    tube: 0.005,
    tilt: [0.1, 0.26],
    spin: 0.14,
    arc: 0.8,
    at: 0.64,
    warm: true,
  },
]

/**
 * Instrument rings that settle around the wolf one after another.
 *
 * They arrive from a wider radius and shrink into place rather than fading up,
 * because a ring that appears at its final size has no read of *locking on* —
 * which is the whole point of them.
 */
function HudRings({
  progress,
  tier,
}: {
  progress: RefObject<number>
  tier: PerfTier
}) {
  const rings = tier === 'high' ? RINGS : RINGS.slice(0, 2)
  const nodes = useRef<Array<THREE.Mesh | null>>([])
  const shown = useRef<Array<number>>(rings.map(() => 0))

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1)
    const time = state.clock.elapsedTime
    const p = progress.current ?? 0

    rings.forEach((ring, index) => {
      const node = nodes.current[index]
      if (!node) return

      const target = smoothstep(ring.at, ring.at + 0.14, p)
      shown.current[index] = damp(shown.current[index], target, 4.5, delta)
      const lock = shown.current[index]

      node.visible = lock > 0.004
      node.scale.setScalar(lerp(1.9, 1, lock))
      // A torus is authored standing in XY, so the quarter turn is what lays it
      // flat; the spin is then applied in the ring's own plane.
      node.rotation.set(
        -Math.PI / 2 + ring.tilt[0],
        0,
        ring.tilt[1] + time * ring.spin,
      )
      const material = node.material as THREE.MeshBasicMaterial
      material.opacity = lock * 0.55
    })
  })

  return (
    <group position={[0, 0.95, 0]}>
      {rings.map((ring, index) => (
        <mesh
          key={ring.radius}
          ref={(node) => {
            nodes.current[index] = node
          }}
          visible={false}
        >
          <torusGeometry
            args={[
              ring.radius,
              ring.tube,
              3,
              tier === 'high' ? 128 : 64,
              ring.arc * Math.PI * 2,
            ]}
          />
          <meshBasicMaterial
            color={ring.warm ? brand.orange : brand.key}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

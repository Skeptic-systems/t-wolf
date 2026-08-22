import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import type { RefObject } from 'react'
import { brand, clamp, damp, lerp, smoothstep } from './brand'
import type { PerfTier } from './brand'
import { Wolf } from './Wolf'
import { NodeField } from './NodeField'
import { Panels } from './Panels'
import { TechField } from './TechField'

/**
 * Camera choreography.
 *
 * Four keyframes describe a single continuous move: meet the wolf head-on,
 * push in, swing around to a tracking profile as it starts walking, then rise
 * and pull back until it sits small inside the network. Because the whole path
 * is a pure function of scroll progress, scrubbing backwards is exact.
 */
type Shot = {
  at: number
  position: [number, number, number]
  target: [number, number, number]
  fov: number
}

const SHOTS: Array<Shot> = [
  { at: 0.0, position: [3.7, 1.62, 6.2], target: [0, 0.85, 0.1], fov: 36 },
  { at: 0.26, position: [2.7, 1.5, 5.0], target: [0, 0.95, 0.3], fov: 34 },
  // The orbit has to cross the front; hold it wide and high there, because a
  // close head-on shot of a quadruped foreshortens badly.
  { at: 0.44, position: [-0.3, 2.0, 7.2], target: [0, 0.95, 0.1], fov: 33 },
  { at: 0.66, position: [-4.3, 1.5, 4.6], target: [0, 0.85, 0.0], fov: 38 },
  { at: 0.84, position: [-3.9, 2.6, 5.6], target: [0, 0.95, 0.05], fov: 40 },
  { at: 1.0, position: [0.5, 3.5, 8.9], target: [0, 1.05, 0.0], fov: 42 },
]

function sampleShots(p: number) {
  let index = 0
  while (index < SHOTS.length - 2 && p > SHOTS[index + 1].at) index += 1

  const a = SHOTS[index]
  const b = SHOTS[index + 1]
  const t = smoothstep(a.at, b.at, p)

  return {
    position: [
      lerp(a.position[0], b.position[0], t),
      lerp(a.position[1], b.position[1], t),
      lerp(a.position[2], b.position[2], t),
    ] as const,
    target: [
      lerp(a.target[0], b.target[0], t),
      lerp(a.target[1], b.target[1], t),
      lerp(a.target[2], b.target[2], t),
    ] as const,
    fov: lerp(a.fov, b.fov, t),
  }
}

function Rig({
  progress,
  pointer,
}: {
  progress: RefObject<number>
  pointer: RefObject<{ x: number; y: number }>
}) {
  const { camera, size } = useThree()
  const smoothed = useRef(0)
  const target = useMemo(() => new THREE.Vector3(0, 0.85, 0), [])

  // On a phone the copy stacks across the full width, so the subject has to be
  // smaller and sit high in the frame rather than off to one side.
  const narrow = size.width < 760
  const pullBack = narrow ? 1.28 : 1

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1)
    // Smoothing the scroll value is what turns a jumpy wheel into a dolly.
    smoothed.current = damp(smoothed.current, progress.current ?? 0, 4.2, delta)

    const shot = sampleShots(clamp(smoothed.current))
    const time = state.clock.elapsedTime
    const breathe = Math.sin(time * 0.22) * 0.07
    const parallax = pointer.current ?? { x: 0, y: 0 }

    camera.position.set(
      damp(
        camera.position.x,
        shot.position[0] * pullBack + breathe + parallax.x * 0.42,
        5,
        delta,
      ),
      damp(
        camera.position.y,
        shot.position[1] * pullBack + breathe * 0.35 + parallax.y * 0.22,
        5,
        delta,
      ),
      damp(camera.position.z, shot.position[2] * pullBack, 5, delta),
    )

    target.set(
      damp(target.x, shot.target[0], 5, delta),
      damp(target.y, shot.target[1], 5, delta),
      damp(target.z, shot.target[2], 5, delta),
    )
    camera.lookAt(target)

    // Nudge the subject off-centre so it sits clear of the copy on the left.
    // Doing it as a camera yaw after lookAt keeps the offset consistent no
    // matter where the orbit currently is. It relaxes for the closing wide
    // shot, where the network is meant to fill the frame symmetrically.
    if (narrow) {
      // Pitch down so the wolf rides high, clear of the stacked copy below.
      // The closing shot needs more of it, since the subject shrinks and would
      // otherwise settle right behind the headline.
      camera.rotateX(-(0.15 + 0.13 * clamp(smoothed.current)))
    } else {
      camera.rotateY(lerp(0.17, 0.04, smoothstep(0.62, 1.0, smoothed.current)))
    }

    if (camera instanceof THREE.PerspectiveCamera) {
      const next = damp(camera.fov, shot.fov, 5, delta)
      if (Math.abs(next - camera.fov) > 0.001) {
        camera.fov = next
        camera.updateProjectionMatrix()
      }
    }
  })

  return null
}

function Lighting({ tier }: { tier: PerfTier }) {
  const key = useRef<THREE.DirectionalLight>(null)
  const rim = useRef<THREE.DirectionalLight>(null)
  const fill = useRef<THREE.DirectionalLight>(null)

  // The camera travels a half circle, so fixed lights would leave the wolf
  // fully backlit for a third of the journey. Rotating the rig with the camera
  // keeps a cool key on the visible side and the warm rim behind, throughout.
  useFrame(({ camera, scene }) => {
    const azimuth = Math.atan2(camera.position.x, camera.position.z)
    const sin = Math.sin(azimuth)
    const cos = Math.cos(azimuth)

    key.current?.position.set(sin * 6.5 + cos * 2.2, 6.4, cos * 6.5 - sin * 2.2)
    rim.current?.position.set(
      -sin * 6.0 + cos * 1.5,
      2.6,
      -cos * 6.0 - sin * 1.5,
    )
    fill.current?.position.set(-sin * 5.4, 1.6, -cos * 5.4)

    // Metal reads mostly as a reflection, so the environment has to follow too.
    scene.environmentRotation.y = azimuth * 0.75
  })

  return (
    <>
      <ambientLight color={brand.nacht2} intensity={2.0} />
      <directionalLight
        ref={key}
        color={brand.key}
        intensity={4.4}
        castShadow={tier === 'high'}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0012}
      />
      {/* Warm brand rim from behind. Directional rather than a spot, because a
          spot pools a large orange blob on the floor and reads cheap. */}
      <directionalLight ref={rim} color={brand.orange} intensity={0.34} />
      {/* Cool fill lifting the shadow side just off black. */}
      <directionalLight ref={fill} color={brand.dim} intensity={0.5} />

      {/* A procedural environment: metal needs something to reflect, and this
          costs no download and stays inside the palette.

          This matters more than the lights above. At metalness 1 there is no
          diffuse term, so what the environment contains *is* the wolf's colour.
          It is therefore weighted heavily cool, with the warm source kept small
          and behind — that is what produces gunmetal with a copper edge rather
          than a red animal. */}
      <Environment resolution={tier === 'high' ? 128 : 64}>
        <Lightformer
          intensity={3.0}
          color={brand.key}
          position={[3, 6, 4]}
          scale={[12, 8, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          intensity={1.5}
          color={brand.key}
          position={[-6, 3, 2]}
          scale={[8, 8, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          intensity={1.0}
          color={brand.orange}
          position={[-3, 2.5, -6]}
          scale={[5, 3, 1]}
          target={[0, 0, 0]}
        />
        {/* A dim horizon band. Without something all the way around, the
            flanks of a metallic surface reflect pure black. */}
        {[0, 1, 2, 3].map((i) => (
          <Lightformer
            key={i}
            intensity={0.45}
            color={brand.nacht2}
            position={[
              Math.sin((i / 4) * Math.PI * 2) * 9,
              1.6,
              Math.cos((i / 4) * Math.PI * 2) * 9,
            ]}
            scale={[9, 5, 1]}
            target={[0, 1, 0]}
          />
        ))}
        <Lightformer
          intensity={0.2}
          color={brand.nacht2}
          position={[0, -4, 0]}
          scale={[16, 16, 1]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </Environment>
    </>
  )
}

function Floor({ tier }: { tier: PerfTier }) {
  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <circleGeometry args={[26, 64]} />
        {/* Kept metallic on purpose: a diffuse floor turns the warm rim into
            a broad orange wash, whereas metal only picks up a tight streak. */}
        <meshStandardMaterial
          color="#05080e"
          metalness={0.8}
          roughness={0.62}
          envMapIntensity={0.1}
        />
      </mesh>
      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.72}
        scale={9}
        blur={2.6}
        far={3.2}
        resolution={tier === 'high' ? 512 : 256}
        color="#000000"
        frames={tier === 'high' ? Infinity : 1}
      />
    </>
  )
}

export default function SignatureScene({
  progress,
  tier,
  active,
}: {
  progress: RefObject<number>
  tier: PerfTier
  active: boolean
}) {
  const pointer = useRef({ x: 0, y: 0 })

  return (
    <Canvas
      // Pausing the loop while the band is off-screen keeps the rest of the
      // page as cheap as it was before the 3D layer existed.
      frameloop={active ? 'always' : 'never'}
      dpr={tier === 'high' ? [1, 1.8] : [1, 1.35]}
      shadows={tier === 'high'}
      gl={{ antialias: tier === 'high', powerPreference: 'high-performance' }}
      camera={{
        position: SHOTS[0].position,
        fov: SHOTS[0].fov,
        near: 0.1,
        far: 60,
      }}
      onPointerMove={(event) => {
        if (tier !== 'high') return
        const { innerWidth, innerHeight } = window
        pointer.current.x = (event.clientX / innerWidth - 0.5) * 2
        pointer.current.y = (event.clientY / innerHeight - 0.5) * 2
      }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.25
        scene.fog = new THREE.Fog(brand.nacht, 8, 21)
      }}
    >
      <color attach="background" args={[brand.nacht]} />
      <Lighting tier={tier} />
      <Floor tier={tier} />
      <Suspense fallback={null}>
        <Wolf progress={progress} tier={tier} />
      </Suspense>
      <TechField progress={progress} tier={tier} />
      <NodeField progress={progress} tier={tier} />
      <Panels progress={progress} tier={tier} />
      <Rig progress={progress} pointer={pointer} />
    </Canvas>
  )
}

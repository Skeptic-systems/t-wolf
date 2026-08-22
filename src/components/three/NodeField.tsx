import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { RefObject } from 'react'
import { brand, clamp, damp, mulberry32, smoothstep } from './brand'

/**
 * The copper node constellation from the reference: emissive points joined by
 * thin lines with a pulse travelling along them.
 *
 * Built procedurally rather than imported as geometry — it is a handful of
 * numbers, it costs nothing to download, and it can respond to scroll.
 */

type Field = {
  points: Array<THREE.Vector3>
  positions: Float32Array
  along: Float32Array
  seeds: Float32Array
}

function buildField(count: number, maxLinks: number): Field {
  const random = mulberry32(0x7c01f)
  const points: Array<THREE.Vector3> = []

  for (let i = 0; i < count; i += 1) {
    // A hollow shell around the wolf: nothing spawns close enough to clip it.
    const angle = random() * Math.PI * 2
    const radius = 2.9 + random() * 4.3
    const height = 0.25 + random() * 4.1
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius * 0.82,
      ),
    )
  }

  const segments: Array<[THREE.Vector3, THREE.Vector3]> = []
  for (let i = 0; i < points.length && segments.length < maxLinks; i += 1) {
    for (
      let j = i + 1;
      j < points.length && segments.length < maxLinks;
      j += 1
    ) {
      if (points[i].distanceTo(points[j]) < 2.35) {
        segments.push([points[i], points[j]])
      }
    }
  }

  const positions = new Float32Array(segments.length * 6)
  const along = new Float32Array(segments.length * 2)
  const seeds = new Float32Array(segments.length * 2)

  segments.forEach(([a, b], index) => {
    positions.set([a.x, a.y, a.z, b.x, b.y, b.z], index * 6)
    along.set([0, 1], index * 2)
    const seed = random()
    seeds.set([seed, seed], index * 2)
  })

  return { points, positions, along, seeds }
}

const vertexShader = /* glsl */ `
  attribute float aAlong;
  attribute float aSeed;
  varying float vAlong;
  varying float vSeed;
  void main() {
    vAlong = aAlong;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;
  varying float vAlong;
  varying float vSeed;
  void main() {
    // A short bright head travelling from one end of each link to the other.
    float travel = fract(uTime * 0.16 + vSeed);
    float pulse = smoothstep(0.10, 0.0, abs(vAlong - travel));
    float alpha = uOpacity * (0.30 + pulse * 0.85);
    gl_FragColor = vec4(uColor * (0.85 + pulse * 1.5), alpha);
    #include <colorspace_fragment>
  }
`

export function NodeField({
  progress,
  tier,
}: {
  progress: RefObject<number>
  tier: 'low' | 'high'
}) {
  const count = tier === 'high' ? 78 : 36
  const maxLinks = tier === 'high' ? 165 : 70

  const field = useMemo(() => buildField(count, maxLinks), [count, maxLinks])
  const group = useRef<THREE.Group>(null)
  const nodes = useRef<THREE.InstancedMesh>(null)
  const lineMaterial = useRef<THREE.ShaderMaterial>(null)
  const nodeMaterial = useRef<THREE.MeshBasicMaterial>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(brand.orange) },
      uTime: { value: 0 },
      uOpacity: { value: 0 },
    }),
    [],
  )

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(field.positions, 3))
    geo.setAttribute('aAlong', new THREE.BufferAttribute(field.along, 1))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(field.seeds, 1))
    return geo
  }, [field])

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1)
    const time = state.clock.elapsedTime
    const p = progress.current ?? 0

    // The network is absent while the wolf is being introduced, arrives with
    // the walk, and owns the final wide shot.
    const presence =
      smoothstep(0.24, 0.52, p) * (0.55 + 0.45 * smoothstep(0.5, 0.9, p))

    if (lineMaterial.current) {
      uniforms.uTime.value = time
      uniforms.uOpacity.value = damp(
        uniforms.uOpacity.value,
        clamp(presence) * 0.55,
        4,
        delta,
      )
    }
    if (nodeMaterial.current) {
      nodeMaterial.current.opacity = damp(
        nodeMaterial.current.opacity,
        clamp(presence) * 0.9,
        4,
        delta,
      )
    }

    if (group.current) {
      group.current.rotation.y = time * 0.014 + p * 0.5
      group.current.visible = presence > 0.002
    }

    if (nodes.current) {
      for (let i = 0; i < field.points.length; i += 1) {
        const point = field.points[i]
        const bob = Math.sin(time * 0.5 + i * 1.7) * 0.06
        dummy.position.set(point.x, point.y + bob, point.z)
        const scale = 0.021 + Math.sin(time * 1.1 + i) * 0.005
        dummy.scale.setScalar(scale)
        dummy.updateMatrix()
        nodes.current.setMatrixAt(i, dummy.matrix)
      }
      nodes.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={group}>
      <lineSegments geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={lineMaterial}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <instancedMesh
        ref={nodes}
        args={[undefined, undefined, field.points.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 6, 5]} />
        <meshBasicMaterial
          ref={nodeMaterial}
          color={brand.orange}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  )
}

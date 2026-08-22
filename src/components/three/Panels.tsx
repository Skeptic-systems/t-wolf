import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { RefObject } from 'react'
import { brand, clamp, damp, lerp, mulberry32, smoothstep } from './brand'

/**
 * Abstract glass technical panels, matching the reference frames.
 *
 * They drift loosely while the wolf is walking, then settle into a clean
 * upright arc for the closing wide shot — the visual equivalent of the site's
 * "first look, then structure, then build" story.
 */

type Panel = {
  drift: THREE.Vector3
  settled: THREE.Vector3
  driftRotation: number
  settledRotation: number
  width: number
  height: number
  phase: number
}

function buildPanels(count: number): Array<Panel> {
  const random = mulberry32(0x9a1c)
  const panels: Array<Panel> = []

  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 + random() * 0.5
    const radius = 3.6 + random() * 2.6
    const width = 1.0 + random() * 1.05
    const height = width * (0.72 + random() * 0.5)

    // Settled pose: an even arc facing the centre, all sharing a baseline.
    const settledAngle = (i / count) * Math.PI * 2
    const settledRadius = 5.0

    panels.push({
      drift: new THREE.Vector3(
        Math.cos(angle) * radius,
        0.7 + random() * 2.7,
        Math.sin(angle) * radius * 0.85,
      ),
      settled: new THREE.Vector3(
        Math.cos(settledAngle) * settledRadius,
        1.25 + (i % 3) * 0.9,
        Math.sin(settledAngle) * settledRadius * 0.85,
      ),
      driftRotation: -angle + Math.PI / 2 + (random() - 0.5) * 0.7,
      settledRotation: -settledAngle + Math.PI / 2,
      width,
      height,
      phase: random() * Math.PI * 2,
    })
  }

  return panels
}

function PanelMesh({ panel, index }: { panel: Panel; index: number }) {
  const outline = useMemo(() => {
    const w = panel.width / 2
    const h = panel.height / 2
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-w, -h, 0),
      new THREE.Vector3(w, -h, 0),
      new THREE.Vector3(w, h, 0),
      new THREE.Vector3(-w, h, 0),
    ])
  }, [panel])

  return (
    <group>
      <mesh>
        <planeGeometry args={[panel.width, panel.height]} />
        <meshStandardMaterial
          color={brand.card}
          metalness={0.1}
          roughness={0.06}
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <lineLoop geometry={outline}>
        <lineBasicMaterial
          color={index % 3 === 0 ? brand.orange : brand.dim}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </lineLoop>
    </group>
  )
}

export function Panels({
  progress,
  tier,
}: {
  progress: RefObject<number>
  tier: 'low' | 'high'
}) {
  const panels = useMemo(() => buildPanels(tier === 'high' ? 9 : 5), [tier])
  const group = useRef<THREE.Group>(null)
  const items = useRef<Array<THREE.Group | null>>([])
  const shown = useRef(0)

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1)
    const time = state.clock.elapsedTime
    const p = progress.current ?? 0

    const presence = smoothstep(0.28, 0.5, p)
    shown.current = damp(shown.current, clamp(presence), 4, delta)
    // 0 while drifting, 1 once the closing shot has locked them into the arc.
    const settle = smoothstep(0.62, 0.92, p)

    if (group.current) {
      group.current.visible = shown.current > 0.004
    }

    panels.forEach((panel, index) => {
      const node = items.current[index]
      if (!node) return

      const float = Math.sin(time * 0.35 + panel.phase) * 0.16 * (1 - settle)
      node.position.set(
        lerp(panel.drift.x, panel.settled.x, settle),
        lerp(panel.drift.y, panel.settled.y, settle) + float,
        lerp(panel.drift.z, panel.settled.z, settle),
      )
      node.rotation.y = lerp(panel.driftRotation, panel.settledRotation, settle)
      node.rotation.z = lerp(Math.sin(panel.phase) * 0.14, 0, settle)
      node.scale.setScalar(shown.current)
    })
  })

  return (
    <group ref={group}>
      {panels.map((panel, index) => (
        <group
          key={index}
          ref={(node) => {
            items.current[index] = node
          }}
        >
          <PanelMesh panel={panel} index={index} />
        </group>
      ))}
    </group>
  )
}

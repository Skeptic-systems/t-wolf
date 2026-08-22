import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { RefObject } from 'react'
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { brand, clamp, damp, smoothstep } from './brand'

export const WOLF_URL = '/assets/3d/wolf.glb'

/**
 * The GLB faces -Z (Blender's +Y forward becomes -Z under the Y-up
 * conversion), so a half turn brings it to face the camera. The extra offset
 * makes the opening shot a three-quarter rather than a flat front-on view.
 */
const BASE_YAW = Math.PI - 0.42

/** Scroll position at which the wolf shifts from standing to walking. */
const WALK_IN = 0.3
const WALK_OUT = 0.76

export function Wolf({
  progress,
  tier,
}: {
  progress: RefObject<number>
  tier: 'low' | 'high'
}) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(WOLF_URL)

  // Must be SkeletonUtils.clone, not Object3D.clone: a plain clone leaves the
  // copied SkinnedMesh bound to the *original* bones, so both the transform
  // and the animations would silently apply to the cached graph instead.
  const model = useMemo(() => {
    const copy = cloneSkinned(scene)
    copy.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      child.castShadow = tier === 'high'
      child.receiveShadow = false

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]

      for (const material of materials) {
        if (!(material instanceof THREE.MeshStandardMaterial)) continue
        if (material.name === 'WolfEye') {
          material.emissive = new THREE.Color(brand.orange)
          material.emissiveIntensity = 2.4
          material.toneMapped = false
          continue
        }
        // Gunmetal. Held just below full metalness on purpose: at 1.0 there is
        // no diffuse term at all, so the flanks reflect only the dark parts of
        // the environment and the whole animal collapses into a silhouette.
        // A little diffuse lets the cool key model the facets.
        material.color = new THREE.Color('#232c3c')
        material.metalness = 0.85
        material.roughness = 0.36
        material.envMapIntensity = 1.7
        material.flatShading = true
        material.needsUpdate = true
      }
    })
    return copy
  }, [scene, tier])

  const { actions, mixer } = useAnimations(animations, model)
  const walkWeight = useRef(0)
  const turned = useRef(false)

  useEffect(() => {
    const idle = actions.idle
    const walk = actions.walk
    if (!idle || !walk) return

    idle.reset().play()
    walk.reset().play()
    walk.setEffectiveWeight(0)
    idle.setEffectiveWeight(1)

    return () => {
      idle.stop()
      walk.stop()
    }
  }, [actions])

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1)
    const p = progress.current ?? 0

    // Cross-fade idle -> walk -> idle. Weights are driven from scroll rather
    // than from a timer, so scrubbing backwards unwinds cleanly.
    const target =
      smoothstep(WALK_IN, WALK_IN + 0.12, p) *
      (1 - smoothstep(WALK_OUT, WALK_OUT + 0.14, p))
    walkWeight.current = damp(walkWeight.current, target, 6, delta)

    const idle = actions.idle
    const walk = actions.walk
    if (idle && walk) {
      const w = clamp(walkWeight.current)
      walk.setEffectiveWeight(w)
      idle.setEffectiveWeight(1 - w)
      walk.setEffectiveTimeScale(0.85)
    }

    // A single head turn towards the visitor as the opening shot settles.
    const turn = actions.headturn
    if (turn && !turned.current && p > 0.12 && p < WALK_IN) {
      turned.current = true
      turn.reset()
      turn.setLoop(THREE.LoopOnce, 1)
      turn.clampWhenFinished = true
      turn.setEffectiveWeight(0.85)
      turn.fadeIn(0.4).play()
    }
    if (turn && turned.current && p < 0.06) {
      turned.current = false
      turn.fadeOut(0.4)
    }

    mixer.timeScale = 1

    if (group.current) {
      // The wolf holds the centre of frame; the world drifts past it instead.
      // A slow yaw keeps the silhouette alive during the standing acts. The
      // base offset turns it off-axis so the opening shot is a three-quarter
      // rather than a flat front-on view.
      const yaw = BASE_YAW + Math.sin(p * Math.PI * 1.15) * 0.16
      group.current.rotation.y = damp(group.current.rotation.y, yaw, 3, delta)
    }
  })

  return (
    <group ref={group} position={[0, 0, 0]} rotation={[0, BASE_YAW, 0]}>
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload(WOLF_URL)

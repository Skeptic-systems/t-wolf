# Blender asset pipeline

Generates the 3D assets used by the signature band on the home page. The wolf
silhouette, material and lighting are derived from the reference video supplied
for the project.

Everything here runs headless, so the assets are reproducible from source
rather than being opaque binaries checked into `public/`.

## Requirements

Blender 5.x on `PATH`, or invoke `blender.exe` by full path.

## Regenerate

```bash
# public/assets/3d/wolf.glb  (mesh + rig + idle/walk/headturn clips)
blender --background --python tools/blender/wolf_rig.py

# public/assets/3d/wolf-poster.webp  (reduced-motion / no-WebGL still)
blender --background --python tools/blender/poster.py
```

`wolf_rig.py` imports `wolf_mesh.py`, so building the GLB always rebuilds the
mesh from the parameters at the top of that file.

## Files

| File           | Purpose                                                                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `wolf_mesh.py` | Skeleton-of-edges through the Skin modifier, then subdivide, decimate and flat-shade for the faceted look. Lower legs and paws are explicit geometry. |
| `wolf_rig.py`  | Armature, rigid weights for the machined limb parts, the three animation clips, and the GLB export.                                                   |
| `poster.py`    | Cycles still used as the fallback image.                                                                                                              |
| `preview.py`   | Renders orthogonal previews of a `.blend` while iterating on the mesh.                                                                                |

## Notes

- The mesh lands near 7,700 triangles and the GLB is uncompressed (~1.15 MB).
  Draco was deliberately not used: the decoder would have to be fetched from a
  third-party CDN, which this site does not do. The band lazy-loads the GLB only
  once it is roughly a screen away, so the cost never lands on first paint.
- `refine` subdivides well past the triangle budget and collapses back down.
  The collapse is curvature-aware, so the budget is spent on the skull, ears and
  joints instead of being spread evenly over flat flanks.
- `detail_pass` carves anatomy (brow ridge, stop, shoulder blade, haunch mass,
  brush tail, dorsal crest); `fur_pass` then breaks the outline into tufts by
  pushing _clustered_ vertices outward along the body radius. On a flat-shaded
  model the silhouette carries most of the perceived detail, so the tufts buy
  more than extra surface would.
- Limb hardware is bound rigidly via `HW_*` vertex groups written during the
  mesh build and replayed after the armature bind. Bone-heat weighting cannot
  handle those loose parts and lets the paws drift off the legs.
- Blender's `+Y` forward becomes `-Z` after the glTF Y-up conversion, which is
  why the runtime applies a half turn to face the camera.

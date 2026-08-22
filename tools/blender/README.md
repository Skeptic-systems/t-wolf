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

- The mesh is kept near 2,800 triangles and the GLB is uncompressed (~590 KB).
  Draco was deliberately not used: at this triangle count the decoder would cost
  more than it saves.
- Limb hardware is bound rigidly via `HW_*` vertex groups written during the
  mesh build and replayed after the armature bind. Bone-heat weighting cannot
  handle those loose parts and lets the paws drift off the legs.
- Blender's `+Y` forward becomes `-Z` after the glTF Y-up conversion, which is
  why the runtime applies a half turn to face the camera.

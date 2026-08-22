"""Builds the faceted low-poly metal wolf mesh for t-wolf.it.

Silhouette is derived from the supplied reference video: broad wedge skull,
erect triangular ears, thick ruffed neck, deep chest over a tucked loin,
strongly angulated hindquarters, segmented legs and a low brush tail. Geometry
comes from a skeleton of edges pushed through the Skin modifier, then decimated
and triangulated for the faceted look.

Canid proportions that matter, and that are easy to get wrong:
  - The highest point of the topline is the withers, not the middle of the
    back. A mid-back lift reads as a roach-backed rodent.
  - Skull and muzzle are roughly equal in length. A longer muzzle reads fox.
  - The neck is nearly as deep as the ribcage. A thin neck reads deer.
  - The rear leg is a pronounced Z: stifle well forward, hock well back.
    Straight rear posts are the single biggest give-away.
"""

import bpy
import os as _os


def out_path(relative):
    """Resolve a path relative to the repository root."""
    root = _os.path.dirname(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))))
    full = _os.path.join(root, *relative.split("/"))
    _os.makedirs(_os.path.dirname(full), exist_ok=True)
    return full

import bmesh
import math
from mathutils import Vector

# Y = forward (nose), Z = up, ground at Z = 0.
SPINE = [
    ("tail_tip", (0.0, -1.22, 0.20), 0.030),
    ("tail_3", (0.0, -1.07, 0.33), 0.086),
    ("tail_2", (0.0, -0.91, 0.50), 0.120),
    ("tail_1", (0.0, -0.72, 0.70), 0.136),
    ("hip", (0.0, -0.56, 0.86), 0.290),
    ("lumbar", (0.0, -0.32, 0.88), 0.248),
    ("mid", (0.0, -0.06, 0.90), 0.272),
    ("chest", (0.0, 0.20, 0.91), 0.318),
    ("withers", (0.0, 0.44, 0.93), 0.300),
    ("neck_low", (0.0, 0.60, 1.00), 0.278),
    ("neck_up", (0.0, 0.74, 1.10), 0.232),
    ("nape", (0.0, 0.86, 1.18), 0.206),
    ("head", (0.0, 0.99, 1.22), 0.210),
    ("stop", (0.0, 1.12, 1.18), 0.144),
    ("muzzle", (0.0, 1.24, 1.13), 0.100),
    ("nose", (0.0, 1.36, 1.09), 0.060),
]

# (name, parent point, chain) -- chain entries are (name, co, radius)
LIMBS = []
for side, sx in (("L", 1.0), ("R", -1.0)):
    LIMBS.append(
        (
            "withers",
            [
                ("upperarm_" + side, (sx * 0.200, 0.40, 0.84), 0.178),
                ("forearm_" + side, (sx * 0.225, 0.28, 0.55), 0.142),
                ("cannon_" + side, (sx * 0.230, 0.30, 0.38), 0.100),
            ],
        )
    )
    LIMBS.append(
        (
            "hip",
            [
                ("thigh_" + side, (sx * 0.195, -0.52, 0.82), 0.214),
                ("stifle_" + side, (sx * 0.222, -0.40, 0.52), 0.150),
                ("hock_" + side, (sx * 0.230, -0.60, 0.30), 0.098),
            ],
        )
    )
    LIMBS.append(
        (
            "head",
            [
                ("earbase_" + side, (sx * 0.105, 0.94, 1.36), 0.080),
                ("eartip_" + side, (sx * 0.128, 0.89, 1.60), 0.011),
            ],
        )
    )


def falloff(value, centre, width):
    """Triangular 1..0 weight, used to fence every shaping rule to a region."""
    return max(0.0, 1.0 - abs(value - centre) / width)


def spine_axis(y):
    """Height of the body centre line at a given depth along the wolf.

    Shaping rules that scale a vertex "outwards" need something to scale away
    from. Using the spine rather than z=0 is what keeps the ruff growing around
    the neck instead of sliding up it.
    """
    pts = sorted((co[1], co[2]) for _, co, _ in SPINE)
    if y <= pts[0][0]:
        return pts[0][1]
    if y >= pts[-1][0]:
        return pts[-1][1]
    for (y0, z0), (y1, z1) in zip(pts, pts[1:]):
        if y0 <= y <= y1 and y1 > y0:
            return z0 + (z1 - z0) * (y - y0) / (y1 - y0)
    return pts[-1][1]


def clump(co, cell):
    """Deterministic 0..1 value that is constant within a small cell.

    Quantising the position first is what turns per-vertex noise into tufts:
    neighbouring vertices land in the same cell and get pushed out together, so
    the outline breaks into clumps of guard hair rather than into sandpaper.
    """
    i = int(math.floor(co.x / cell)) * 73856093
    j = int(math.floor(co.y / cell)) * 19349663
    k = int(math.floor(co.z / cell)) * 83492791
    h = (i ^ j ^ k) & 0x7FFFFFFF
    h = (h * 1103515245 + 12345) & 0x7FFFFFFF
    return h / 0x7FFFFFFF


def build_skeleton_mesh():
    mesh = bpy.data.meshes.new("wolf_skin")
    obj = bpy.data.objects.new("Wolf", mesh)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()
    index = {}
    radii = []

    def add(name, co, r):
        v = bm.verts.new(Vector(co))
        bm.verts.index_update()
        index[name] = v
        radii.append((v, r))
        return v

    prev = None
    for name, co, r in SPINE:
        v = add(name, co, r)
        if prev is not None:
            bm.edges.new((prev, v))
        prev = v

    for parent, chain in LIMBS:
        prev = index[parent]
        for name, co, r in chain:
            v = add(name, co, r)
            bm.edges.new((prev, v))
            prev = v

    bm.verts.index_update()
    radius_by_index = {v.index: r for v, r in radii}
    bm.to_mesh(mesh)
    bm.free()
    return obj, radius_by_index


def apply_skin(obj, radius_by_index):
    bpy.context.view_layer.objects.active = obj
    skin = obj.modifiers.new("Skin", "SKIN")
    skin.use_smooth_shade = False
    skin.branch_smoothing = 0.30

    layer = obj.data.skin_vertices[0].data
    for i, entry in enumerate(layer):
        r = radius_by_index.get(i, 0.05)
        entry.radius = (r, r)
        entry.use_root = False
    # The root vertex emits a visible box, so keep it on the thinnest leaf.
    root_index = [n for n, _, _ in SPINE].index("tail_tip")
    layer[root_index].use_root = True

    bpy.ops.object.modifier_apply(modifier="Skin")


def refine(obj, target_tris=6800):
    """Round the blocky skin output, then collapse back to faceted triangles.

    Subdividing further than the budget and collapsing back is deliberate: the
    collapse is curvature-aware, so the extra triangles end up in the skull,
    ears and joints rather than being spread evenly over flat flanks.
    """
    bpy.context.view_layer.objects.active = obj

    sub = obj.modifiers.new("Subdivision", "SUBSURF")
    sub.levels = 3
    sub.render_levels = 3
    bpy.ops.object.modifier_apply(modifier="Subdivision")

    tri = obj.modifiers.new("Triangulate", "TRIANGULATE")
    tri.min_vertices = 4
    bpy.ops.object.modifier_apply(modifier="Triangulate")

    current = len(obj.data.polygons)
    if current > target_tris:
        dec = obj.modifiers.new("Decimate", "DECIMATE")
        dec.decimate_type = "COLLAPSE"
        dec.ratio = target_tris / current
        bpy.ops.object.modifier_apply(modifier="Decimate")

    # Flat shading is what gives the reference its faceted metal read.
    for poly in obj.data.polygons:
        poly.use_smooth = False


def shape_pass(obj):
    """Deepen the ribcage, build the skull and flatten the ears into blades."""
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    for v in bm.verts:
        # Deep chest. The scale is anchored *above* the topline so the ribcage
        # grows downwards; anchoring it at the middle lifts the back into a
        # roach and is what made this read as a rodent rather than a canid.
        chest = falloff(v.co.y, 0.14, 0.62)
        if chest > 0.0 and v.co.z > 0.32 and v.co.y < 0.56:
            v.co.z = 1.24 + (v.co.z - 1.24) * (1.0 + 0.15 * chest)
            v.co.x *= 1.0 - 0.06 * chest

        # Tucked loin behind the ribs.
        loin = falloff(v.co.y, -0.28, 0.26)
        if loin > 0.0 and v.co.z < 0.86:
            v.co.z += 0.105 * loin
            v.co.x *= 1.0 - 0.07 * loin

        # Broad cheeks and a flat skull table, so the head reads as a wedge
        # rather than a cone.
        if 0.84 < v.co.y < 1.14 and v.co.z > 1.06:
            v.co.x *= 1.13
            if v.co.z > 1.34:
                v.co.z = 1.34 + (v.co.z - 1.34) * 0.72

        # Taper everything ahead of the stop towards the nose.
        if v.co.y > 1.10:
            t = min(1.0, (v.co.y - 1.10) / 0.32)
            v.co.x *= 1.0 - 0.44 * t
            v.co.z = 1.15 + (v.co.z - 1.15) * (1.0 - 0.32 * t)

        # Ears: squash along Y so they read as thin triangular blades.
        if v.co.z > 1.36 and abs(v.co.x) > 0.03:
            t = min(1.0, (v.co.z - 1.36) / 0.24)
            centre = 0.925
            v.co.y = centre + (v.co.y - centre) * (1.0 - 0.58 * t)
            v.co.x *= 1.0 + 0.26 * t
    bm.to_mesh(obj.data)
    bm.free()


def detail_pass(obj):
    """Carve the features that separate a wolf from a generic four-legged dog.

    These rules only work because `refine` now leaves enough triangles in the
    skull and hindquarters to move independently; at the old budget the same
    offsets just dented the silhouette.
    """
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    for v in bm.verts:
        # Brow ridge. A wolf's eyes sit under a shelf, and that shelf is most
        # of what makes the face read as watchful rather than friendly.
        if 1.00 < v.co.y < 1.18 and v.co.z > 1.18 and abs(v.co.x) < 0.18:
            v.co.z += 0.026 * falloff(v.co.y, 1.09, 0.09)
            v.co.x *= 1.0 + 0.05 * falloff(v.co.y, 1.09, 0.09)

        # The stop: the dip between brow and muzzle. Without it the head is a
        # single cone and the eyes have nothing to sit against.
        if 1.13 < v.co.y < 1.25 and v.co.z > 1.12:
            v.co.z -= 0.034 * falloff(v.co.y, 1.19, 0.06)

        # Blunt nose pad, instead of letting the muzzle taper to a point.
        if v.co.y > 1.29:
            t = min(1.0, (v.co.y - 1.29) / 0.09)
            v.co.x *= 1.0 + 0.26 * t
            v.co.z -= 0.014 * t

        # Shoulder blade breaking the line of the ruff.
        blade = falloff(v.co.y, 0.38, 0.17) * falloff(v.co.z, 0.94, 0.26)
        if blade > 0.0 and abs(v.co.x) > 0.11:
            v.co.x *= 1.0 + 0.10 * blade

        # Heavier hindquarters: the rear is a wolf's engine and has to read as
        # mass, otherwise the walk looks like it is being dragged.
        haunch = falloff(v.co.y, -0.48, 0.26) * falloff(v.co.z, 0.72, 0.42)
        if haunch > 0.0:
            v.co.x *= 1.0 + 0.12 * haunch
            v.co.z += 0.022 * haunch

        # Brush tail: heavy through the middle, fine at the tip.
        if v.co.y < -0.58:
            t = falloff(v.co.y, -0.86, 0.34)
            axis = spine_axis(v.co.y)
            v.co.x *= 1.0 + 0.30 * t
            v.co.z = axis + (v.co.z - axis) * (1.0 + 0.30 * t)

        # Dorsal crest of raised guard hair along the topline.
        if abs(v.co.x) < 0.10 and -0.36 < v.co.y < 0.40:
            if v.co.z > spine_axis(v.co.y) + 0.15:
                v.co.z += 0.013 * falloff(v.co.x, 0.0, 0.10)
    bm.to_mesh(obj.data)
    bm.free()


def fur_pass(obj):
    """Break the outline into tufts of guard hair.

    On a flat-shaded model the silhouette carries almost all of the perceived
    detail, so pushing clustered vertices out along the body radius buys more
    than any amount of extra surface would. Facet normals are recomputed from
    the moved geometry, so the tufts catch the key light individually.
    """
    regions = (
        # (centre y, width, strength) -- neck and shoulder ruff, the widest
        # part of a wolf's outline, then cheeks, trousers and tail.
        (0.54, 0.36, 1.00),
        (0.94, 0.22, 0.60),
        (-0.46, 0.28, 0.70),
        (-0.95, 0.40, 0.45),
    )

    bm = bmesh.new()
    bm.from_mesh(obj.data)
    for v in bm.verts:
        weight = 0.0
        for centre, width, strength in regions:
            weight = max(weight, strength * falloff(v.co.y, centre, width))
        # Legs below the ruff stay machined: the contrast between smooth
        # hardware and shaggy body is the whole point of the design.
        if v.co.z < 0.42:
            weight *= falloff(v.co.z, 0.42, 0.42)
        if weight <= 0.002:
            continue

        out = v.co - Vector((0.0, v.co.y, spine_axis(v.co.y)))
        if out.length < 1e-4:
            continue
        out.normalize()

        tuft = clump(v.co, 0.078)
        v.co += out * weight * (0.008 + 0.058 * tuft * tuft)
    bm.to_mesh(obj.data)
    bm.free()


def _tube(bm, centres, radii, segments=8):
    """Vertical-ish tapered tube; rings are cut in the XY plane."""
    import math

    rings = []
    for centre, r in zip(centres, radii):
        ring = []
        for i in range(segments):
            a = 2.0 * math.pi * i / segments + math.pi / segments
            ring.append(
                bm.verts.new(
                    (centre[0] + math.cos(a) * r, centre[1] + math.sin(a) * r, centre[2])
                )
            )
        rings.append(ring)
    for lower, upper in zip(rings, rings[1:]):
        for i in range(segments):
            j = (i + 1) % segments
            bm.faces.new((lower[i], lower[j], upper[j], upper[i]))
    bm.faces.new(list(reversed(rings[0])))
    bm.faces.new(rings[-1])
    return rings


def _box(bm, centre, size, lift=0.0):
    cx, cy, cz = centre
    sx, sy, sz = (s * 0.5 for s in size)
    corners = []
    for dz in (-sz, sz):
        for dy, dx in ((-sy, -sx), (-sy, sx), (sy, sx), (sy, -sx)):
            corners.append(bm.verts.new((cx + dx, cy + dy, cz + dz + lift)))
    b, t = corners[:4], corners[4:]
    bm.faces.new(list(reversed(b)))
    bm.faces.new(t)
    for i in range(4):
        j = (i + 1) % 4
        bm.faces.new((b[i], b[j], t[j], t[i]))


def add_limb_hardware():
    """Segmented lower legs and articulated paws.

    The reference wolf reads as machined below the knee: crisp cylindrical
    shafts, a wider joint collar, then a wedge paw with separate toes. The
    Skin modifier cannot express that, so these parts are built explicitly.
    """
    mesh = bpy.data.meshes.new("wolf_hardware")
    obj = bpy.data.objects.new("WolfHardware", mesh)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()
    # These parts are rigid machined components, so they are bound rigidly to a
    # single bone each. Heat weighting cannot do that across loose geometry, so
    # the assignment is recorded here and replayed after the armature bind.
    assignment = {}

    def claim(verts, bone):
        assignment.setdefault("HW_" + bone, []).extend(v.index for v in verts)

    for sx in (1.0, -1.0):
        side = "L" if sx > 0 else "R"
        x = sx * 0.235
        for front in (True, False):
            if front:
                top, joint, bottom = 0.40, 0.275, 0.085
                ty, jy, by = 0.300, 0.312, 0.330
                upper_bone, lower_bone, paw_bone = (
                    "forearm." + side,
                    "foot." + side,
                    "toe." + side,
                )
                split = 0.295
            else:
                top, joint, bottom = 0.32, 0.230, 0.085
                ty, jy, by = -0.600, -0.585, -0.560
                upper_bone, lower_bone, paw_bone = (
                    "shin." + side,
                    "rfoot." + side,
                    "rtoe." + side,
                )
                split = 0.26

            rings = _tube(
                bm,
                [
                    (x, ty, top),
                    (x, (ty + jy) * 0.5, (top + joint) * 0.5),
                    (x, jy, joint),
                    (x, jy, joint - 0.055),
                    (x, by, bottom),
                ],
                [0.092, 0.062, 0.070, 0.070, 0.055],
            )
            bm.verts.index_update()
            for ring, centre_z in zip(
                rings,
                [top, (top + joint) * 0.5, joint, joint - 0.055, bottom],
            ):
                claim(ring, upper_bone if centre_z >= split else lower_bone)

            # Paw pad, then three toes fanned across the front edge.
            pad_y = by + 0.045
            start = len(bm.verts)
            _box(bm, (x, pad_y, 0.043), (0.148, 0.150, 0.062))
            for k, off in enumerate((-0.042, 0.0, 0.042)):
                length = 0.062 if k == 1 else 0.050
                _box(
                    bm,
                    (x + off, pad_y + 0.070 + length * 0.5, 0.032),
                    (0.044, length, 0.046),
                )
            bm.verts.ensure_lookup_table()
            bm.verts.index_update()
            claim(bm.verts[start:], paw_bone)

    bm.to_mesh(mesh)
    bm.free()
    for poly in mesh.polygons:
        poly.use_smooth = False

    for group_name, indices in assignment.items():
        group = obj.vertex_groups.new(name=group_name)
        group.add(sorted(set(indices)), 1.0, "REPLACE")
    return obj


def add_eyes():
    eyes = []
    for sx in (1.0, -1.0):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=0.032)
        eye = bpy.context.object
        eye.name = "WolfEye_%s" % ("L" if sx > 0 else "R")
        eye.location = (sx * 0.112, 1.088, 1.238)
        eye.scale = (0.7, 1.15, 0.62)
        for poly in eye.data.polygons:
            poly.use_smooth = False
        eyes.append(eye)
    return eyes


def make_materials(body, eyes):
    metal = bpy.data.materials.new("WolfMetal")
    metal.use_nodes = True
    bsdf = metal.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.055, 0.065, 0.082, 1.0)
    bsdf.inputs["Metallic"].default_value = 1.0
    bsdf.inputs["Roughness"].default_value = 0.34
    body.data.materials.append(metal)

    glow = bpy.data.materials.new("WolfEye")
    glow.use_nodes = True
    ebsdf = glow.node_tree.nodes["Principled BSDF"]
    ebsdf.inputs["Base Color"].default_value = (0.976, 0.380, 0.227, 1.0)
    ebsdf.inputs["Metallic"].default_value = 0.0
    ebsdf.inputs["Roughness"].default_value = 0.25
    ebsdf.inputs["Emission Color"].default_value = (0.976, 0.380, 0.227, 1.0)
    ebsdf.inputs["Emission Strength"].default_value = 2.0
    for eye in eyes:
        eye.data.materials.append(glow)


def build():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    obj, radii = build_skeleton_mesh()
    apply_skin(obj, radii)
    refine(obj)
    shape_pass(obj)
    detail_pass(obj)
    fur_pass(obj)

    hardware = add_limb_hardware()
    bpy.ops.object.select_all(action="DESELECT")
    hardware.select_set(True)
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.join()

    eyes = add_eyes()
    make_materials(obj, eyes)

    # One mesh with two material slots keeps the runtime draw calls minimal.
    bpy.ops.object.select_all(action="DESELECT")
    for eye in eyes:
        eye.select_set(True)
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.join()

    obj.name = "Wolf"
    return obj, eyes


if __name__ == "__main__":
    wolf, eyes = build()
    print("WOLF_TRIS", len(wolf.data.polygons), "VERTS", len(wolf.data.vertices))
    bpy.ops.wm.save_as_mainfile(
        filepath=out_path("build/wolf_mesh.blend")
    )

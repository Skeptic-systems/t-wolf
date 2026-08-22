"""Renders the reduced-motion / no-WebGL fallback still for the signature band."""
import bpy
import os as _os


def out_path(relative):
    """Resolve a path relative to the repository root."""
    root = _os.path.dirname(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))))
    full = _os.path.join(root, *relative.split("/"))
    _os.makedirs(_os.path.dirname(full), exist_ok=True)
    return full
, math, os
from mathutils import Vector

bpy.ops.wm.open_mainfile(filepath=out_path("build/wolf_rigged.blend"))
arm = bpy.data.objects["WolfRig"]
for tr in arm.animation_data.nla_tracks:
    tr.mute = (tr.name != "idle")
sc = bpy.context.scene
sc.frame_set(30)

sc.render.engine = "CYCLES"
sc.cycles.samples = 220
sc.cycles.use_denoising = True
sc.render.resolution_x = 1600
sc.render.resolution_y = 1000
sc.render.image_settings.file_format = "WEBP"
sc.render.image_settings.quality = 80
sc.view_settings.view_transform = "AgX"
sc.view_settings.look = "AgX - Base Contrast"

NACHT = (0.043, 0.062, 0.118, 1.0)
ORANGE = (0.976, 0.380, 0.227)
KEY = (0.812, 0.851, 0.918)

w = bpy.data.worlds.new("W"); w.use_nodes = True
w.node_tree.nodes["Background"].inputs[0].default_value = NACHT
w.node_tree.nodes["Background"].inputs[1].default_value = 0.12
sc.world = w

# Reflective studio floor, same read as the reference video.
bpy.ops.mesh.primitive_circle_add(radius=26, fill_type='NGON')
floor = bpy.context.object
m = bpy.data.materials.new("Floor"); m.use_nodes = True
b = m.node_tree.nodes["Principled BSDF"]
b.inputs["Base Color"].default_value = NACHT
b.inputs["Metallic"].default_value = 0.55
b.inputs["Roughness"].default_value = 0.38
floor.data.materials.append(m)

def area(loc, energy, color, size, target=(0, 0, 0.85)):
    d = bpy.data.lights.new("L", type="AREA")
    d.energy = energy; d.size = size; d.color = color
    o = bpy.data.objects.new("L", d); o.location = loc
    bpy.context.collection.objects.link(o)
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()

area((5.2, 3.0, 4.8), 720, KEY, 5.5)           # cool key, high and camera-side
area((-2.2, -4.4, 3.5), 300, ORANGE, 1.6)      # warm brand rim, well behind the subject
area((-4.2, 2.8, 1.3), 70, (0.36, 0.45, 0.68), 6)    # cool fill from the shadow side
area((0.0, -6.5, 2.4), 38, KEY, 8)             # gentle frontal lift

cd = bpy.data.cameras.new("C"); cd.angle = math.radians(40)
cam = bpy.data.objects.new("C", cd); bpy.context.collection.objects.link(cam); sc.camera = cam
tgt = Vector((0.0, 0.34, 0.82))
cam.location = (3.10, 4.95, 1.72)
cam.rotation_euler = (tgt - Vector(cam.location)).to_track_quat("-Z", "Y").to_euler()

out = out_path("public/assets/3d/wolf-poster")
os.makedirs(os.path.dirname(out), exist_ok=True)
sc.render.filepath = out
bpy.ops.render.render(write_still=True)
print("POSTER_DONE")

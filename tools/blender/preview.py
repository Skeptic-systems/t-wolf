"""Renders orthogonal + three-quarter previews of whatever .blend is loaded."""

import bpy
import sys
import math
import os
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1 :]
blend_path = argv[0]
out_dir = argv[1]
tag = argv[2] if len(argv) > 2 else "prev"
frame = int(argv[3]) if len(argv) > 3 else 0

bpy.ops.wm.open_mainfile(filepath=blend_path)

if frame:
    bpy.context.scene.frame_set(frame)

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 900
scene.render.resolution_y = 620
scene.render.film_transparent = False
scene.render.image_settings.file_format = "JPEG"
scene.render.image_settings.quality = 85
scene.view_settings.view_transform = "Standard"

world = bpy.data.worlds.new("W")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.06, 0.08, 0.12, 1)
world.node_tree.nodes["Background"].inputs[1].default_value = 1.4
scene.world = world


def add_light(loc, energy, color=(1, 1, 1)):
    data = bpy.data.lights.new("L", type="AREA")
    data.energy = energy
    data.size = 6
    data.color = color
    lamp = bpy.data.objects.new("L", data)
    lamp.location = loc
    bpy.context.collection.objects.link(lamp)
    lamp.rotation_euler = (Vector((0, 0, 1.0)) - Vector(loc)).to_track_quat(
        "-Z", "Y"
    ).to_euler()


add_light((3.5, 3.0, 4.0), 900)
add_light((-4.0, -1.5, 2.5), 420, (0.98, 0.45, 0.28))
add_light((0.0, -5.0, 3.0), 300)

target = Vector((0, 0.15, 0.85))
views = {
    "side": (90.0, 5.6),
    "front34": (140.0, 5.6),
    "rear34": (35.0, 5.6),
}

cam_data = bpy.data.cameras.new("C")
cam_data.lens = 62
cam = bpy.data.objects.new("C", cam_data)
bpy.context.collection.objects.link(cam)
scene.camera = cam

for name, (yaw, dist) in views.items():
    a = math.radians(yaw)
    cam.location = (
        target.x + math.sin(a) * dist,
        target.y - math.cos(a) * dist,
        target.z + 0.55,
    )
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene.render.filepath = os.path.join(out_dir, "%s_%s" % (tag, name))
    bpy.ops.render.render(write_still=True)
print("PREVIEW_DONE")

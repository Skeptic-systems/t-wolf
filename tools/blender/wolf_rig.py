"""Rigs the wolf mesh, authors the animation clips and exports wolf.glb."""

import bpy
import os as _os


def out_path(relative):
    """Resolve a path relative to the repository root."""
    root = _os.path.dirname(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))))
    full = _os.path.join(root, *relative.split("/"))
    _os.makedirs(_os.path.dirname(full), exist_ok=True)
    return full

import math
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import wolf_mesh  # noqa: E402

# name, head, tail, parent, connected -- must track SPINE/LIMBS in wolf_mesh.py
BONES = [
    ("pelvis", (0, -0.56, 0.86), (0, -0.06, 0.90), None, False),
    ("spine", (0, -0.06, 0.90), (0, 0.20, 0.91), "pelvis", True),
    ("chest", (0, 0.20, 0.91), (0, 0.44, 0.93), "spine", True),
    ("neck", (0, 0.44, 0.93), (0, 0.86, 1.18), "chest", True),
    ("head", (0, 0.86, 1.18), (0, 1.12, 1.18), "neck", True),
    ("muzzle", (0, 1.12, 1.18), (0, 1.36, 1.09), "head", True),
    ("tail1", (0, -0.56, 0.86), (0, -0.72, 0.70), "pelvis", False),
    ("tail2", (0, -0.72, 0.70), (0, -0.91, 0.50), "tail1", True),
    ("tail3", (0, -0.91, 0.50), (0, -1.22, 0.20), "tail2", True),
]
for side, sx in (("L", 1.0), ("R", -1.0)):
    BONES += [
        (
            "ear." + side,
            (sx * 0.105, 0.94, 1.36),
            (sx * 0.128, 0.89, 1.60),
            "head",
            False,
        ),
        (
            "shoulder." + side,
            (sx * 0.200, 0.40, 0.84),
            (sx * 0.225, 0.28, 0.55),
            "chest",
            False,
        ),
        (
            "forearm." + side,
            (sx * 0.225, 0.28, 0.55),
            (sx * 0.230, 0.312, 0.275),
            "shoulder." + side,
            True,
        ),
        (
            "foot." + side,
            (sx * 0.230, 0.312, 0.275),
            (sx * 0.230, 0.330, 0.085),
            "forearm." + side,
            True,
        ),
        (
            "toe." + side,
            (sx * 0.230, 0.330, 0.085),
            (sx * 0.230, 0.450, 0.055),
            "foot." + side,
            True,
        ),
        (
            "thigh." + side,
            (sx * 0.195, -0.52, 0.82),
            (sx * 0.222, -0.40, 0.52),
            "pelvis",
            False,
        ),
        (
            "shin." + side,
            (sx * 0.222, -0.40, 0.52),
            (sx * 0.230, -0.600, 0.320),
            "thigh." + side,
            True,
        ),
        (
            "rfoot." + side,
            (sx * 0.230, -0.600, 0.320),
            (sx * 0.230, -0.560, 0.085),
            "shin." + side,
            True,
        ),
        (
            "rtoe." + side,
            (sx * 0.230, -0.560, 0.085),
            (sx * 0.230, -0.450, 0.055),
            "rfoot." + side,
            True,
        ),
    ]

FRONT = {"L": ("shoulder.L", "forearm.L", "toe.L"), "R": ("shoulder.R", "forearm.R", "toe.R")}
REAR = {"L": ("thigh.L", "shin.L", "rtoe.L"), "R": ("thigh.R", "shin.R", "rtoe.R")}
# Lateral-sequence walk: front-left, rear-right, front-right, rear-left.
GAIT_PHASE = {"FL": 0.0, "RR": 0.25, "FR": 0.5, "RL": 0.75}


def build_armature():
    arm_data = bpy.data.armatures.new("WolfArmature")
    arm = bpy.data.objects.new("WolfRig", arm_data)
    bpy.context.collection.objects.link(arm)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode="EDIT")

    made = {}
    for name, head, tail, parent, connected in BONES:
        bone = arm_data.edit_bones.new(name)
        bone.head = head
        bone.tail = tail
        if parent:
            bone.parent = made[parent]
            bone.use_connect = connected
        made[name] = bone

    bpy.ops.object.mode_set(mode="OBJECT")
    return arm


def bind(mesh_obj, arm):
    bpy.ops.object.select_all(action="DESELECT")
    mesh_obj.select_set(True)
    arm.select_set(True)
    bpy.context.view_layer.objects.active = arm
    try:
        bpy.ops.object.parent_set(type="ARMATURE_AUTO")
        print("BIND auto")
    except RuntimeError as exc:
        print("BIND auto failed (%s); falling back to envelopes" % exc)
        bpy.ops.object.parent_set(type="ARMATURE_ENVELOPE")

    apply_rigid_groups(mesh_obj)


def apply_rigid_groups(mesh_obj):
    """Replay the HW_* markers from the mesh build as exclusive bone weights."""
    groups = mesh_obj.vertex_groups
    markers = [g for g in groups if g.name.startswith("HW_")]
    marker_indices = {g.index for g in markers}

    claimed = {}
    for vert in mesh_obj.data.vertices:
        for item in vert.groups:
            if item.group in marker_indices:
                claimed.setdefault(groups[item.group].name[3:], []).append(vert.index)

    all_claimed = {i for indices in claimed.values() for i in indices}
    for group in groups:
        if group.name.startswith("HW_"):
            continue
        group.remove(sorted(all_claimed))

    for bone_name, indices in claimed.items():
        target = groups.get(bone_name) or groups.new(name=bone_name)
        target.add(sorted(indices), 1.0, "REPLACE")

    for group in markers:
        groups.remove(group)
    print("RIGID", {k: len(v) for k, v in sorted(claimed.items())})


def new_action(arm, name):
    action = bpy.data.actions.new(name)
    action.use_fake_user = True
    arm.animation_data_create()
    arm.animation_data.action = action
    return action


def reset_pose(arm):
    for pb in arm.pose.bones:
        pb.rotation_mode = "XYZ"
        pb.rotation_euler = (0, 0, 0)
        pb.location = (0, 0, 0)


def key(pb, frame, rot=None, loc=None):
    if rot is not None:
        pb.rotation_euler = rot
        pb.keyframe_insert("rotation_euler", frame=frame)
    if loc is not None:
        pb.location = loc
        pb.keyframe_insert("location", frame=frame)


def leg_pose(phase, upper_amp, lower_amp):
    """Sinusoidal gait. Local X on these bones is the forward/back swing axis.

    Amplitudes are deliberately restrained: this wolf is a brand element on a
    company site, so a composed walk reads better than an athletic one, and it
    keeps the paws close to the floor without a full IK setup.
    """
    a = 2.0 * math.pi * phase
    upper = upper_amp * math.sin(a)
    # Flex peaks through the swing half so the paw clears the ground.
    lower = -lower_amp * (0.5 - 0.5 * math.cos(a)) - 0.04
    # Counter-rotate the paw so it stays level instead of pointing at the floor.
    toe = -(upper + lower) * 0.55
    return upper, lower, toe


def make_walk(arm, length=40):
    action = new_action(arm, "walk")
    reset_pose(arm)
    pb = arm.pose.bones
    steps = 16
    for i in range(steps + 1):
        t = i / steps
        frame = 1 + t * length
        for tag, (upper_name, lower_name, toe_name) in (
            ("FL", FRONT["L"]),
            ("FR", FRONT["R"]),
            ("RL", REAR["L"]),
            ("RR", REAR["R"]),
        ):
            phase = (t + GAIT_PHASE[tag]) % 1.0
            front = tag[0] == "F"
            upper, lower, toe = leg_pose(
                phase,
                0.22 if front else 0.20,
                0.34 if front else 0.46,
            )
            key(pb[upper_name], frame, rot=(upper, 0, 0))
            key(pb[lower_name], frame, rot=(lower, 0, 0))
            key(pb[toe_name], frame, rot=(toe, 0, 0))

        a = 2.0 * math.pi * t
        key(pb["pelvis"], frame, rot=(0.02 * math.sin(a), 0.035 * math.sin(a), 0), loc=(0, 0, 0.020 * math.sin(2 * a)))
        key(pb["spine"], frame, rot=(0, -0.03 * math.sin(a), 0))
        key(pb["chest"], frame, rot=(0.018 * math.sin(2 * a), 0.03 * math.sin(a), 0))
        key(pb["neck"], frame, rot=(-0.03 + 0.022 * math.sin(2 * a), 0, 0))
        key(pb["head"], frame, rot=(0.02 - 0.018 * math.sin(2 * a), 0, 0))
        key(pb["tail1"], frame, rot=(0.05 * math.sin(2 * a), 0, 0.10 * math.sin(a)))
        key(pb["tail2"], frame, rot=(0.04 * math.sin(2 * a), 0, 0.12 * math.sin(a + 0.6)))
        key(pb["tail3"], frame, rot=(0, 0, 0.13 * math.sin(a + 1.2)))
    return action, length


def make_idle(arm, length=140):
    action = new_action(arm, "idle")
    reset_pose(arm)
    pb = arm.pose.bones
    steps = 28
    for i in range(steps + 1):
        t = i / steps
        frame = 1 + t * length
        a = 2.0 * math.pi * t
        breath = math.sin(a)
        key(pb["pelvis"], frame, loc=(0, 0, 0.006 * breath))
        key(pb["spine"], frame, rot=(0.010 * breath, 0, 0))
        key(pb["chest"], frame, rot=(0.014 * breath, 0, 0))
        key(pb["neck"], frame, rot=(-0.012 * breath, 0, 0.030 * math.sin(a * 0.5)))
        key(pb["head"], frame, rot=(0.010 * breath, 0, 0.045 * math.sin(a * 0.5 + 0.9)))
        key(pb["tail1"], frame, rot=(0.03 * math.sin(a * 0.5), 0, 0.10 * math.sin(a * 0.5)))
        key(pb["tail2"], frame, rot=(0, 0, 0.13 * math.sin(a * 0.5 + 0.7)))
        key(pb["tail3"], frame, rot=(0, 0, 0.15 * math.sin(a * 0.5 + 1.4)))
        # A single, sparse ear flick keeps the idle from feeling mechanical.
        flick = max(0.0, math.sin((t - 0.62) * math.pi * 14)) if 0.62 < t < 0.72 else 0.0
        key(pb["ear.L"], frame, rot=(-0.30 * flick, 0, 0))
        key(pb["ear.R"], frame, rot=(-0.12 * flick, 0, 0))
    return action, length


def make_head_turn(arm, length=110):
    """Head turns out towards the viewer and settles back."""
    action = new_action(arm, "headturn")
    reset_pose(arm)
    pb = arm.pose.bones
    marks = [
        (1, 0.0, 0.0),
        (34, 0.62, 0.10),
        (70, 0.66, 0.12),
        (length, 0.0, 0.0),
    ]
    for frame, yaw, lift in marks:
        key(pb["neck"], frame, rot=(-lift * 0.5, 0, yaw * 0.45))
        key(pb["head"], frame, rot=(-lift, 0, yaw * 0.55))
        key(pb["ear.L"], frame, rot=(-0.16 * abs(yaw), 0, 0))
        key(pb["ear.R"], frame, rot=(-0.16 * abs(yaw), 0, 0))
        key(pb["tail1"], frame, rot=(0, 0, 0.18 * yaw))
        key(pb["tail2"], frame, rot=(0, 0, 0.20 * yaw))
    return action, length


def stash(arm, actions):
    """NLA tracks are what make the exporter emit every clip."""
    arm.animation_data.action = None
    for action, _ in actions:
        track = arm.animation_data.nla_tracks.new()
        track.name = action.name
        track.strips.new(action.name, 1, action)


def main():
    wolf, _ = wolf_mesh.build()
    arm = build_armature()
    bind(wolf, arm)

    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = arm
    arm.select_set(True)
    bpy.ops.object.mode_set(mode="POSE")

    actions = [make_idle(arm), make_walk(arm), make_head_turn(arm)]
    reset_pose(arm)
    bpy.ops.object.mode_set(mode="OBJECT")
    stash(arm, actions)

    bpy.ops.wm.save_as_mainfile(
        filepath=out_path("build/wolf_rigged.blend")
    )

    out = out_path("public/assets/3d/wolf.glb")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(
        filepath=out,
        export_format="GLB",
        export_apply=True,
        export_animations=True,
        export_animation_mode="ACTIONS",
        export_bake_animation=True,
        export_yup=True,
        export_cameras=False,
        export_lights=False,
    )
    print("EXPORTED", out, os.path.getsize(out))
    print("CLIPS", [a.name for a, _ in actions])


if __name__ == "__main__":
    main()

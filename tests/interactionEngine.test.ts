import { describe, it, expect } from "vitest";
import {
  distance3D,
  getNearbyInteractable,
  getClosestInteractable,
  canInteract,
} from "../src/engine/interactionEngine";
import type { SceneObject3D } from "../src/engine/types";

const testObjects: SceneObject3D[] = [
  {
    id: "obj_npc",
    name: "林叙",
    type: "npc",
    position: [0, 1, 0],
    interactable: true,
    visibleFromRound: 0,
    linkedNpcId: "lin_xu",
  },
  {
    id: "obj_evidence",
    name: "划痕",
    type: "evidence",
    position: [3, 1, 0],
    interactable: true,
    visibleFromRound: 0,
    linkedEvidenceId: "E1_WALL_SCRATCHES",
  },
  {
    id: "obj_far",
    name: "远处物证",
    type: "evidence",
    position: [10, 1, 10],
    interactable: true,
    visibleFromRound: 0,
    linkedEvidenceId: "E2_MEMORY_READER",
  },
  {
    id: "obj_hidden",
    name: "隐藏物证",
    type: "evidence",
    position: [0, 1, 1],
    interactable: true,
    visibleFromRound: 2,
    linkedEvidenceId: "E6_EXECUTION_ORDER",
  },
  {
    id: "obj_deco",
    name: "档案柜",
    type: "decoration",
    position: [0, 1, 0.5],
    interactable: false,
    visibleFromRound: 0,
  },
];

describe("interactionEngine", () => {
  it("距离计算正确", () => {
    const d = distance3D({ x: 0, y: 0, z: 0 }, { x: 3, y: 4, z: 0 });
    expect(d).toBe(5);
  });

  it("最近交互对象选择正确", () => {
    // 玩家在原点，obj_npc 距离 1, obj_evidence 距离 ~3.16
    const closest = getClosestInteractable(
      { x: 0, y: 1, z: 0 },
      testObjects,
      0,
    );
    expect(closest).not.toBeNull();
    expect(closest!.object.id).toBe("obj_npc");
  });

  it("超出距离不可交互", () => {
    const closest = getClosestInteractable(
      { x: 0, y: 1, z: -5 },
      testObjects,
      0,
    );
    // orig nearest is obj_npc at distance ~5.1, which is > 2.2
    expect(closest).toBeNull();
  });

  it("同距离时 NPC 优先于 evidence", () => {
    // 创建两个在相同位置的对象
    const objects: SceneObject3D[] = [
      {
        id: "a",
        name: "a",
        type: "evidence",
        position: [0, 1, 0],
        interactable: true,
        visibleFromRound: 0,
      },
      {
        id: "b",
        name: "b",
        type: "npc",
        position: [0, 1, 0],
        interactable: true,
        visibleFromRound: 0,
      },
    ];
    const targets = getNearbyInteractable({ x: 0, y: 1, z: 0 }, objects, 0);
    expect(targets[0].object.type).toBe("npc");
    expect(targets[1].object.type).toBe("evidence");
  });

  it("invisible round 对象不可交互", () => {
    const can = canInteract({ x: 0, y: 1, z: 1 }, testObjects[3], 0);
    expect(can).toBe(false);

    const can2 = canInteract({ x: 0, y: 1, z: 1 }, testObjects[3], 2);
    expect(can2).toBe(true);
  });

  it("decoration 不可交互", () => {
    const can = canInteract({ x: 0, y: 1, z: 0.5 }, testObjects[4], 0);
    expect(can).toBe(false);
  });

  it("getNearbyInteractable 返回按距离排序的列表", () => {
    const targets = getNearbyInteractable(
      { x: 0, y: 1, z: 0 },
      testObjects,
      0,
    );
    // obj_npc at dist 0, obj_deco excluded (not interactable), obj_evidence at dist 3 (out of range)
    // Only obj_npc should be in range
    expect(targets.length).toBe(1);
    expect(targets[0].object.id).toBe("obj_npc");
  });
});

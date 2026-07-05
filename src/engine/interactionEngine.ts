// src/engine/interactionEngine.ts
// 3D 接触交互引擎 — 邻近检测与交互解析
// 纯函数，不依赖 React / Three.js runtime
// 只做数据层面的距离计算和对象筛选

import type { SceneObject3D, RoundIndex, EvidenceId, NpcId } from "./types";

// ---- 类型 ----

export interface PlayerPosition {
  x: number;
  y: number;
  z: number;
}

export interface InteractionTarget {
  object: SceneObject3D;
  distance: number;
  label: string;
  action: "discover_evidence" | "ask_npc" | "open_board" | "none";
  evidenceId?: EvidenceId;
  npcId?: NpcId;
}

// ---- 常量 ----

/** 可交互距离阈值（米） */
const INTERACTION_RANGE = 2.2;

/** 交互标签模板 */
function getInteractionLabel(obj: SceneObject3D): string {
  switch (obj.type) {
    case "evidence":
      return `调查：${obj.name}`;
    case "npc":
      return `询问：${obj.name}`;
    case "terminal":
      return `打开：${obj.name}`;
    default:
      return obj.name;
  }
}

function getInteractionAction(obj: SceneObject3D): InteractionTarget["action"] {
  switch (obj.type) {
    case "evidence":
      return "discover_evidence";
    case "npc":
      return "ask_npc";
    case "terminal":
      return "open_board";
    default:
      return "none";
  }
}

// ---- 核心函数 ----

/** 计算两点之间的欧几里得距离 */
export function distance3D(a: PlayerPosition, b: { x: number; y: number; z: number }): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** 获取玩家附近可交互的对象列表（按距离排序） */
export function getNearbyInteractable(
  playerPosition: PlayerPosition,
  objects: SceneObject3D[],
  currentRound: RoundIndex,
): InteractionTarget[] {
  const targets: InteractionTarget[] = [];

  for (const obj of objects) {
    // 不可交互或轮次未到 → 跳过
    if (!obj.interactable || obj.visibleFromRound > currentRound) continue;

    const dist = distance3D(playerPosition, {
      x: obj.position[0],
      y: obj.position[1],
      z: obj.position[2],
    });

    if (dist <= INTERACTION_RANGE) {
      targets.push({
        object: obj,
        distance: dist,
        label: getInteractionLabel(obj),
        action: getInteractionAction(obj),
        evidenceId: obj.linkedEvidenceId,
        npcId: obj.linkedNpcId,
      });
    }
  }

  // 按距离排序，同距离时 NPC > evidence > terminal > decoration
  targets.sort((a, b) => {
    const d = a.distance - b.distance;
    if (Math.abs(d) > 0.01) return d;

    const priority: Record<string, number> = {
      npc: 0,
      evidence: 1,
      terminal: 2,
      decoration: 3,
    };
    return (
      (priority[a.object.type] ?? 99) - (priority[b.object.type] ?? 99)
    );
  });

  return targets;
}

/** 获取最近的可交互对象（null = 无） */
export function getClosestInteractable(
  playerPosition: PlayerPosition,
  objects: SceneObject3D[],
  currentRound: RoundIndex,
): InteractionTarget | null {
  const targets = getNearbyInteractable(playerPosition, objects, currentRound);
  return targets.length > 0 ? targets[0] : null;
}

/** 检查某对象是否可交互（距离 + 轮次检查） */
export function canInteract(
  playerPosition: PlayerPosition,
  obj: SceneObject3D,
  currentRound: RoundIndex,
): boolean {
  if (!obj.interactable || obj.visibleFromRound > currentRound) return false;
  return (
    distance3D(playerPosition, {
      x: obj.position[0],
      y: obj.position[1],
      z: obj.position[2],
    }) <= INTERACTION_RANGE
  );
}

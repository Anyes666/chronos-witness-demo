import type { EvidenceId, GameSaveData, PlayerActionLog } from "./types";

export type ObjectiveCategory =
  | "investigate"
  | "interrogate"
  | "compare"
  | "rewind"
  | "accuse";

export interface Objective {
  id: string;
  title: string;
  description: string;
  category: ObjectiveCategory;
  priority: number;
  completed: boolean;
  actionLabel: string;
  targetPanel?: "scene" | "npcs" | "evidence" | "board" | "rewind" | "accusation";
}

function hasEvidence(state: GameSaveData, evidenceId: EvidenceId): boolean {
  return state.discoveredEvidenceIds.includes(evidenceId);
}

function hasAskedNpc(state: GameSaveData, npcId: string): boolean {
  return state.testimonyHistory.some((record) => record.npcId === npcId);
}

function hasViewedBoard(actionLogs: PlayerActionLog[]): boolean {
  return actionLogs.some((log) => log.actionType === "view_board");
}

function makeObjective(params: Omit<Objective, "completed">, completed: boolean): Objective {
  return { ...params, completed };
}

export function getObjectiveList(state: GameSaveData): Objective[] {
  const hasE1 = hasEvidence(state, "E1_WALL_SCRATCHES");
  const hasE2 = hasEvidence(state, "E2_MEMORY_READER");
  const hasE3 = hasEvidence(state, "E3_LIGHT_LOG");
  const hasTestimony = state.testimonyHistory.length > 0;
  const askedLinXu = hasAskedNpc(state, "lin_xu");
  const viewedBoard = hasViewedBoard(state.actionLogs);
  const hasEnding = Boolean(state.endingId);

  return [
    makeObjective(
      {
        id: "investigate_memory_reader",
        title: "调查记忆读取器",
        description: "先确认中央读取器是否支持官方的自诱导结论。",
        category: "investigate",
        priority: 10,
        actionLabel: "前往现场",
        targetPanel: "scene",
      },
      hasE2,
    ),
    makeObjective(
      {
        id: "investigate_wall_scratches",
        title: "调查东墙七道划痕",
        description: "寻找墙面上和回溯次数有关的异常痕迹。",
        category: "investigate",
        priority: 20,
        actionLabel: "查看现场",
        targetPanel: "scene",
      },
      hasE1,
    ),
    makeObjective(
      {
        id: "interrogate_witness",
        title: "询问任一证人",
        description: "收集第一轮证词，再观察回溯后哪些说法会漂移。",
        category: "interrogate",
        priority: 30,
        actionLabel: "询问证人",
        targetPanel: "npcs",
      },
      hasTestimony,
    ),
    makeObjective(
      {
        id: "perform_first_rewind",
        title: "进行第一次回溯",
        description: "回溯会扰动证词，但不会改变真相核心。",
        category: "rewind",
        priority: 40,
        actionLabel: "打开回溯",
        targetPanel: "rewind",
      },
      state.currentRound >= 1,
    ),
    makeObjective(
      {
        id: "open_testimony_board",
        title: "打开证词对照板",
        description: "比较多轮证词，先看哪些信息没有改变。",
        category: "compare",
        priority: 50,
        actionLabel: "打开对照板",
        targetPanel: "board",
      },
      viewedBoard,
    ),
    makeObjective(
      {
        id: "compare_stable_facts",
        title: "比对稳定事实",
        description: "把 E1、E2、E3 和林叙证词放在一起看，寻找共同锚点。",
        category: "compare",
        priority: 60,
        actionLabel: "比对证词",
        targetPanel: "board",
      },
      hasE1 && hasE2 && hasE3 && askedLinXu,
    ),
    makeObjective(
      {
        id: "submit_incomplete_accusation",
        title: "提交不完全指控",
        description: "回溯额度已接近极限，用稳定事实支撑一个可固定的版本。",
        category: "accuse",
        priority: 70,
        actionLabel: "进入指控",
        targetPanel: "accusation",
      },
      hasEnding,
    ),
    makeObjective(
      {
        id: "review_ending_export_log",
        title: "查看结局并导出日志",
        description: "保留本次调查路径，方便复盘哪些漂移帮助了推理。",
        category: "accuse",
        priority: 80,
        actionLabel: "查看结局",
      },
      hasEnding,
    ),
  ];
}

export function getCurrentObjective(state: GameSaveData): Objective {
  const objectives = getObjectiveList(state);

  if (state.endingId) return objectives.find((o) => o.id === "review_ending_export_log")!;
  if (state.currentRound >= 3) {
    return objectives.find((o) => o.id === "submit_incomplete_accusation")!;
  }
  if (!hasEvidence(state, "E2_MEMORY_READER")) {
    return objectives.find((o) => o.id === "investigate_memory_reader")!;
  }
  if (!hasEvidence(state, "E1_WALL_SCRATCHES")) {
    return objectives.find((o) => o.id === "investigate_wall_scratches")!;
  }
  if (state.testimonyHistory.length === 0) {
    return objectives.find((o) => o.id === "interrogate_witness")!;
  }
  if (state.currentRound === 0) {
    return objectives.find((o) => o.id === "perform_first_rewind")!;
  }
  if (state.currentRound >= 1 && !hasViewedBoard(state.actionLogs)) {
    return objectives.find((o) => o.id === "open_testimony_board")!;
  }
  if (
    hasEvidence(state, "E1_WALL_SCRATCHES") &&
    hasEvidence(state, "E2_MEMORY_READER") &&
    hasEvidence(state, "E3_LIGHT_LOG") &&
    hasAskedNpc(state, "lin_xu")
  ) {
    return objectives.find((o) => o.id === "compare_stable_facts")!;
  }
  return objectives.find((o) => !o.completed) ?? objectives[objectives.length - 1];
}

export function getObjectiveProgress(state: GameSaveData): {
  completed: number;
  total: number;
  percent: number;
} {
  const objectives = getObjectiveList(state);
  const completed = objectives.filter((objective) => objective.completed).length;
  return {
    completed,
    total: objectives.length,
    percent: objectives.length > 0 ? Math.round((completed / objectives.length) * 100) : 0,
  };
}

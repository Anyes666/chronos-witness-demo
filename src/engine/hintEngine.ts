import type { GameSaveData } from "./types";
import type { Objective } from "./objectiveEngine";

export type HintLevel = 1 | 2 | 3;

export interface Hint {
  id: string;
  level: HintLevel;
  text: string;
  targetPanel?: string;
}

const HINTS: Record<string, Omit<Hint, "id">[]> = {
  investigate_memory_reader: [
    { level: 1, text: "先看最像案发核心的装置。", targetPanel: "scene" },
    { level: 2, text: "主室中央的工作台附近有关键设备。", targetPanel: "scene" },
    { level: 3, text: "调查主室中央的记忆读取器。", targetPanel: "scene" },
  ],
  investigate_wall_scratches: [
    { level: 1, text: "现场有一处数量异常的痕迹。", targetPanel: "scene" },
    { level: 2, text: "去东墙看看，那里的痕迹不像普通磨损。", targetPanel: "scene" },
    { level: 3, text: "调查东墙七道划痕。", targetPanel: "scene" },
  ],
  interrogate_witness: [
    { level: 1, text: "物证需要证词来形成对照。", targetPanel: "npcs" },
    { level: 2, text: "任选一名证人，先建立第一轮说法。", targetPanel: "npcs" },
    { level: 3, text: "打开证人面板，询问林叙、老何或陆医生。", targetPanel: "npcs" },
  ],
  perform_first_rewind: [
    { level: 1, text: "只有变化之后，漂移才会显形。", targetPanel: "rewind" },
    { level: 2, text: "进行一次回溯，再回头看证词变化。", targetPanel: "rewind" },
    { level: 3, text: "打开回溯面板，执行第一次回溯。", targetPanel: "rewind" },
  ],
  open_testimony_board: [
    { level: 1, text: "不要只看单句证词，比较才有意义。", targetPanel: "board" },
    { level: 2, text: "对照板会把稳定、变化、新增和消失的信息分开。", targetPanel: "board" },
    { level: 3, text: "打开证词对照板，查看多轮证词差异。", targetPanel: "board" },
  ],
  compare_stable_facts: [
    { level: 1, text: "先找没有变的东西，再解释变化。", targetPanel: "board" },
    { level: 2, text: "把 23:17、读取器异常和证词锚点放在一起看。", targetPanel: "board" },
    { level: 3, text: "在对照板中优先查看稳定事实覆盖。", targetPanel: "board" },
  ],
  submit_incomplete_accusation: [
    { level: 1, text: "你不需要掌握完整真相，也可以固定一个版本。", targetPanel: "accusation" },
    { level: 2, text: "用稳定事实支撑指控，接受它仍然不完整。", targetPanel: "accusation" },
    { level: 3, text: "进入最终指控，选择你愿意固定的版本。", targetPanel: "accusation" },
  ],
  review_ending_export_log: [
    { level: 1, text: "调查结束后，复盘路径同样重要。" },
    { level: 2, text: "日志会保留你发现物证、询问和回溯的顺序。" },
    { level: 3, text: "查看结局页并导出 Playtest 日志。" },
  ],
};

function clampLevel(level: number): HintLevel {
  if (level <= 1) return 1;
  if (level >= 3) return 3;
  return 2;
}

export function getHintForObjective(objectiveId: string, level: number): Hint {
  const hints = HINTS[objectiveId] ?? HINTS.investigate_memory_reader;
  const hintLevel = clampLevel(level);
  const hint = hints[hintLevel - 1] ?? hints[hints.length - 1];
  return {
    id: `${objectiveId}_${hint.level}`,
    ...hint,
  };
}

export function getProgressiveHints(_state: GameSaveData, objective: Objective): Hint[] {
  return [1, 2, 3].map((level) => getHintForObjective(objective.id, level));
}

export function getNextHint(
  state: GameSaveData,
  objective: Objective,
  usedHintCount: number,
): Hint {
  const hints = getProgressiveHints(state, objective);
  const index = Math.min(Math.max(usedHintCount, 0), hints.length - 1);
  return hints[index];
}

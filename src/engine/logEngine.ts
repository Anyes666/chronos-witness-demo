// ============================================================
// logEngine.ts — 日志与 Playtest 导出
// 纯函数部分不依赖 DOM
// ============================================================

import type {
  PlayerActionLog,
  GameSaveData,
  PlaytestLog,
  EvidenceId,
  RoundIndex,
} from "./types";

/** 创建行为日志 */
export function createActionLog(params: {
  actionType: PlayerActionLog["actionType"];
  detail: string;
  currentRound: RoundIndex;
}): PlayerActionLog {
  return {
    timestamp: new Date().toISOString(),
    round: params.currentRound,
    actionType: params.actionType,
    detail: params.detail,
  };
}

/** 追加行为日志到状态 */
export function appendActionLog(
  state: GameSaveData,
  log: PlayerActionLog,
): GameSaveData {
  return {
    ...state,
    actionLogs: [...state.actionLogs, log],
    savedAt: new Date().toISOString(),
  };
}

/** 导出 Playtest 日志（纯数据，不依赖 DOM） */
export function exportPlaytestLog(state: GameSaveData): PlaytestLog {
  const evidenceDiscoveries = state.actionLogs
    .filter((log) => log.actionType === "discover_evidence")
    .map((log) => {
      // 从 detail 中提取 evidenceId
      const match = log.detail.match(/(E\d_[A-Z_]+)/);
      return {
        evidenceId: (match?.[1] ?? "unknown") as EvidenceId,
        discoveredAtRound: log.round,
        timestamp: log.timestamp,
      };
    });

  const rewinds = state.actionLogs
    .filter((log) => log.actionType === "rewind")
    .map((log) => {
      const match = log.detail.match(/round (\d) to round (\d)/);
      return {
        fromRound: (match?.[1] ? parseInt(match[1]) : 0) as RoundIndex,
        toRound: (match?.[2] ? parseInt(match[2]) : 0) as RoundIndex,
        timestamp: log.timestamp,
        entropyAtTime: state.entropy,
      };
    });

  const accusationLog = state.actionLogs.find(
    (log) => log.actionType === "accuse",
  );
  let accusationResult;
  if (accusationLog) {
    try {
      const parsed = JSON.parse(accusationLog.detail);
      accusationResult = {
        whoCausedDeath: parsed.whoCausedDeath ?? "",
        whichVersionToFix: parsed.whichVersionToFix ?? "",
        endingId: parsed.endingId ?? "",
      };
    } catch {
      accusationResult = {
        whoCausedDeath: "",
        whichVersionToFix: "",
        endingId: "",
      };
    }
  } else {
    accusationResult = {
      whoCausedDeath: "",
      whichVersionToFix: "",
      endingId: "",
    };
  }

  const firstLog = state.actionLogs[0];
  const lastLog = state.actionLogs[state.actionLogs.length - 1];

  return {
    sessionId: state.sessionId,
    startedAt: firstLog?.timestamp ?? state.savedAt,
    endedAt: lastLog?.timestamp ?? new Date().toISOString(),
    deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    actions: state.actionLogs,
    evidenceDiscoveries,
    rewinds,
    accusation: accusationResult,
  };
}

/** 下载 Playtest 日志（依赖浏览器 Blob API） */
export function downloadPlaytestLog(state: GameSaveData): void {
  const log = exportPlaytestLog(state);
  const json = JSON.stringify(log, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chronos-playtest-log-${state.sessionId}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

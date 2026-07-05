// ============================================================
// sessionEngine.ts — 会话管理
// 纯函数，不依赖浏览器 API
// ============================================================

import type { GameSaveData } from "./types";

let sessionCounter = 0;

/** 生成唯一 sessionId */
export function generateSessionId(): string {
  sessionCounter += 1;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `CHRONOS_${timestamp}_${random}_${sessionCounter}`;
}

/** 创建全新游戏会话 */
export function createNewSession(): GameSaveData {
  return {
    sessionId: generateSessionId(),
    currentRound: 0,
    entropy: 0,
    discoveredEvidenceIds: [],
    testimonyHistory: [],
    playerMarks: [],
    actionLogs: [],
    endingId: undefined,
    savedAt: new Date().toISOString(),
  };
}

/** 重置会话（保留 sessionId，清空进度） */
export function resetSession(sessionId?: string): GameSaveData {
  return {
    sessionId: sessionId ?? generateSessionId(),
    currentRound: 0,
    entropy: 0,
    discoveredEvidenceIds: [],
    testimonyHistory: [],
    playerMarks: [],
    actionLogs: [],
    endingId: undefined,
    savedAt: new Date().toISOString(),
  };
}

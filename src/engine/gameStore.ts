// ============================================================
// gameStore.ts — Zustand 全局游戏状态
// 包装所有 engine，管理 localStorage 存档
// ============================================================

import { create } from "zustand";
import type {
  GameSaveData,
  PlayerMark,
  EndingId,
  AccusationResult,
  NpcId,
  EvidenceId,
  PlaytestLog,
} from "./types";
import { createNewSession } from "./sessionEngine";
import { performRewind, canRewind, getRemainingRewinds } from "./rewindEngine";
import { askNpc, type AskNpcParams } from "./testimonyEngine";
import { discoverEvidence, getEvidenceDescription, inspectLocation, getEvidenceCoverage } from "./evidenceEngine";
import { generateTestimonyBoard, getNpcRoundComparison, getStableFactCoverage } from "./diffEngine";
import { submitAccusation, evaluateEvidenceCoverage, type AccusationParams } from "./accusationEngine";
import { exportPlaytestLog, downloadPlaytestLog } from "./logEngine";

const STORAGE_KEY = "chronos_save";

// ---- Zustand Store ----

interface GameStore {
  // 状态
  sessionId: string;
  currentRound: number;
  entropy: number;
  discoveredEvidenceIds: EvidenceId[];
  testimonyHistory: GameSaveData["testimonyHistory"];
  playerMarks: PlayerMark[];
  actionLogs: GameSaveData["actionLogs"];
  endingId: EndingId | undefined;
  accusationResult: AccusationResult | null;

  // 动作
  newGame: () => void;
  loadGame: () => boolean;
  saveGame: () => void;
  clearSave: () => void;
  canRewind: () => boolean;
  getRemainingRewinds: () => number;
  rewind: () => void;
  askNpc: (params: AskNpcParams) => ReturnType<typeof askNpc>["testimony"];
  inspectLocation: (locationId: string) => ReturnType<typeof inspectLocation>;
  discoverEvidence: (evidenceId: EvidenceId) => void;
  getEvidenceDescription: (evidenceId: EvidenceId) => string;
  addPlayerMark: (mark: PlayerMark) => void;
  submitAccusation: (params: AccusationParams) => AccusationResult;
  getTestimonyBoard: () => ReturnType<typeof generateTestimonyBoard>;
  getNpcComparison: (npcId: NpcId) => ReturnType<typeof getNpcRoundComparison>;
  getStableFactCoverage: () => ReturnType<typeof getStableFactCoverage>;
  getEvidenceCoverage: () => ReturnType<typeof getEvidenceCoverage>;
  evaluateEvidenceCoverage: () => ReturnType<typeof evaluateEvidenceCoverage>;
  exportLog: () => PlaytestLog;
  downloadLog: () => void;
  getRawState: () => GameSaveData;
}

function loadFromStorage(): GameSaveData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameSaveData;
  } catch {
    return null;
  }
}

function saveToStorage(state: GameSaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage 满或不可用
  }
}

function toGameSaveData(store: GameStore): GameSaveData {
  return {
    sessionId: store.sessionId,
    currentRound: store.currentRound as GameSaveData["currentRound"],
    entropy: store.entropy,
    discoveredEvidenceIds: store.discoveredEvidenceIds,
    testimonyHistory: store.testimonyHistory,
    playerMarks: store.playerMarks,
    actionLogs: store.actionLogs,
    endingId: store.endingId,
    savedAt: new Date().toISOString(),
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  // 初始状态
  sessionId: "",
  currentRound: 0,
  entropy: 0,
  discoveredEvidenceIds: [],
  testimonyHistory: [],
  playerMarks: [],
  actionLogs: [],
  endingId: undefined,
  accusationResult: null,

  // ---- 新游戏 ----
  newGame: () => {
    const session = createNewSession();
    set({
      sessionId: session.sessionId,
      currentRound: session.currentRound,
      entropy: session.entropy,
      discoveredEvidenceIds: [],
      testimonyHistory: [],
      playerMarks: [],
      actionLogs: session.actionLogs,
      endingId: undefined,
      accusationResult: null,
    });
  },

  // ---- 读档 ----
  loadGame: () => {
    const saved = loadFromStorage();
    if (!saved) return false;
    set({
      sessionId: saved.sessionId,
      currentRound: saved.currentRound,
      entropy: saved.entropy,
      discoveredEvidenceIds: saved.discoveredEvidenceIds,
      testimonyHistory: saved.testimonyHistory,
      playerMarks: saved.playerMarks ?? [],
      actionLogs: saved.actionLogs ?? [],
      endingId: saved.endingId,
      accusationResult: null,
    });
    return true;
  },

  // ---- 存档 ----
  saveGame: () => {
    const state = toGameSaveData(get());
    saveToStorage(state);
  },

  // ---- 清除存档 ----
  clearSave: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // ---- 回溯 ----
  canRewind: () => canRewind(get().currentRound as GameSaveData["currentRound"]),
  getRemainingRewinds: () => getRemainingRewinds(get().currentRound as GameSaveData["currentRound"]),

  rewind: () => {
    const rawState = toGameSaveData(get());
    const newState = performRewind(rawState);
    set({
      currentRound: newState.currentRound,
      entropy: newState.entropy,
      actionLogs: newState.actionLogs,
    });
    saveToStorage(toGameSaveData(get()));
  },

  // ---- 询问 NPC ----
  askNpc: (params: AskNpcParams) => {
    const rawState = toGameSaveData(get());
    const { state: newState, testimony } = askNpc(params, rawState);
    set({
      entropy: newState.entropy,
      testimonyHistory: newState.testimonyHistory,
      actionLogs: newState.actionLogs,
    });
    saveToStorage(toGameSaveData(get()));
    return testimony;
  },

  // ---- 调查地点 ----
  inspectLocation: (locationId: string) => inspectLocation(locationId),

  // ---- 发现物证 ----
  discoverEvidence: (evidenceId: EvidenceId) => {
    const rawState = toGameSaveData(get());
    const newState = discoverEvidence(rawState, evidenceId);
    set({
      discoveredEvidenceIds: newState.discoveredEvidenceIds,
      actionLogs: newState.actionLogs,
    });
    saveToStorage(toGameSaveData(get()));
  },

  // ---- 获取物证描述 ----
  getEvidenceDescription: (evidenceId: EvidenceId) =>
    getEvidenceDescription(evidenceId, get().currentRound as GameSaveData["currentRound"]),

  // ---- 玩家标记 ----
  addPlayerMark: (mark: PlayerMark) => {
    set((s) => ({
      playerMarks: [...s.playerMarks, mark],
    }));
    saveToStorage(toGameSaveData(get()));
  },

  // ---- 最终指控 ----
  submitAccusation: (params: AccusationParams) => {
    const rawState = toGameSaveData(get());
    const { state: newState, result } = submitAccusation(params, rawState);
    set({
      endingId: newState.endingId,
      actionLogs: newState.actionLogs,
      accusationResult: result,
    });
    saveToStorage(toGameSaveData(get()));
    return result;
  },

  // ---- 证词对照板 ----
  getTestimonyBoard: () =>
    generateTestimonyBoard(get().testimonyHistory, get().playerMarks),

  getNpcComparison: (npcId: NpcId) =>
    getNpcRoundComparison(npcId, get().testimonyHistory),

  getStableFactCoverage: () =>
    getStableFactCoverage(get().testimonyHistory),

  // ---- 证据覆盖 ----
  getEvidenceCoverage: () => getEvidenceCoverage(toGameSaveData(get())),

  evaluateEvidenceCoverage: () => evaluateEvidenceCoverage(toGameSaveData(get())),

  // ---- 日志导出 ----
  exportLog: () => exportPlaytestLog(toGameSaveData(get())),

  downloadLog: () => downloadPlaytestLog(toGameSaveData(get())),

  // ---- 获取原始状态 ----
  getRawState: () => toGameSaveData(get()),
}));

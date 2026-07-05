// ============================================================
// types.ts — 时序证人 · 全局核心类型定义
// ============================================================

// ---- 基础枚举 / 联合类型 ----

/** 回溯轮次索引：0=初次调查，1/2/3=第1/2/3次回溯后 */
export type RoundIndex = 0 | 1 | 2 | 3;

/** Demo 版 3 名 NPC 的 ID */
export type NpcId = "lin_xu" | "lao_he" | "doctor_lu";

/** 6 个核心物证的 ID */
export type EvidenceId =
  | "E1_WALL_SCRATCHES"
  | "E2_MEMORY_READER"
  | "E3_LIGHT_LOG"
  | "E4_TEMPERATURE_LOG"
  | "E5_SHEN_NOTE"
  | "E6_EXECUTION_ORDER";

/** 5 种提问方式 */
export type QuestionStyle =
  | "confirm"           // 确认式 — 封闭提问，信息少漂移小
  | "press"             // 逼问式 — 施压，信息强但可能说谎
  | "empathize"         // 共情式 — 解锁情绪记忆，偏离事实
  | "silent_observe"    // 沉默观察 — 不污染，靠环境线索
  | "present_evidence"; // 出示证据 — 锁定一段，破坏另一段

/** NPC 证词情绪状态 */
export type TestimonyEmotion =
  | "calm"
  | "defensive"
  | "fearful"
  | "hostile"
  | "evasive";

/** 物证标签 */
export type EvidenceTag =
  | "truth-kernel"
  | "environment-witness"
  | "drift-noise"
  | "timing"
  | "device"
  | "document";

/** 结局 ID */
export type EndingId = "obey_closure" | "refuse_closure";

/** 玩家手动标记类型 */
export type PlayerMarkType = "suspicious" | "trusted" | "key";

// ---- Truth Kernel（真相核心，永不漂移） ----

/** 稳定事实 —— 每 NPC 每轮至少 1 条，推理公平性底线 */
export interface StableFact {
  id: string;
  npcId: NpcId;
  content: string;
  /** 从第几轮开始对玩家可见 */
  roundVisibleFrom: RoundIndex;
  linkedEvidenceIds: EvidenceId[];
  driftLocked: true;
}

/** 物证核心 —— 物证的存在性与不可漂移属性 */
export interface EvidenceKernel {
  evidenceId: EvidenceId;
  exists: true;
  /** 该物证从第几轮开始可被发现 */
  discoverableFrom: RoundIndex;
  /** 不可漂移的内核描述 */
  kernelDescription: string;
}

/** 关键时间线事件 */
export interface TimelineEvent {
  time: string;
  event: string;
  location: string;
  npcIds: NpcId[];
}

/** 完整 Truth Kernel —— 仅开发者可见，玩家不可见 */
export interface TruthKernel {
  caseId: string;
  victim: {
    id: string;
    name: string;
    deathTime: string;
    deathLocation: string;
    deathCauseKernel: string;
  };
  hiddenTruth: {
    killerId: NpcId;
    method: string;
    motive: string;
  };
  stableFacts: StableFact[];
  evidenceExistence: EvidenceKernel[];
  keyTimeline: TimelineEvent[];
}

// ---- Testimony Shell（证词外壳，受控漂移） ----

/** 单条证词 Shell —— 规则系统选择，第一版人工手写 */
export interface TestimonyShell {
  id: string;
  npcId: NpcId;
  round: RoundIndex;
  /** 该证词最适合的提问方式（可选提示） */
  questionStyleHint?: QuestionStyle;
  /** 证词摘要（简短版） */
  summary: string;
  /** 证词完整文本 */
  fullText: string;
  /** 关联的稳定事实 ID */
  stableFactIds: string[];
  /** 相对于上一轮发生变化的 token/短语 */
  changedTokens: string[];
  /** 本轮新出现的 token/短语 */
  newTokens: string[];
  /** 上一轮出现但本轮消失的 token/短语 */
  omittedTokens: string[];
  /** NPC 在说出此证词时的情绪状态 */
  emotion: TestimonyEmotion;
  /** 漂移幅度 0-100 */
  driftLevel: number;
}

// ---- Evidence（物证） ----

/** 物证 */
export interface Evidence {
  id: EvidenceId;
  name: string;
  locationId: string;
  /** 是否初始即被发现（无需调查即可见） */
  discoveredByDefault: boolean;
  /** 内核描述（不随轮次变化） */
  kernelDescription: string;
  /** 各轮次的描述文本（随熵值/轮次可能有轻微变化） */
  roundDescriptions: Record<RoundIndex, string>;
  /** 关联的稳定事实 ID */
  linkedStableFactIds: string[];
  tags: EvidenceTag[];
}

// ---- Scene（场景） ----

/** 场景地点 */
export interface SceneLocation {
  id: string;
  name: string;
  description: string;
  /** 该地点可发现的物证 ID 列表 */
  evidenceIds: EvidenceId[];
  /** 该地点关联的 NPC（可为空） */
  npcId?: NpcId;
}

// ---- NPC 基础数据 ----

/** NPC 基础数据 */
export interface NpcData {
  id: NpcId;
  name: string;
  /** 表面身份 */
  surfaceRole: string;
  /** 真实身份（开发者可见） */
  hiddenRole: string;
  /** 语音支柱 */
  speechTraits: string;
  /** 口头禅 */
  catchphrase: string;
  /** 该 NPC 在场景中的位置 ID */
  locationId: string;
}

// ---- Ending（结局） ----

/** 指控选项 */
export interface AccusationOption {
  id: string;
  label: string;
  description: string;
}

/** 结局定义 */
export interface EndingDefinition {
  id: EndingId;
  title: string;
  description: string;
  /** 触发条件（两步指控的组合） */
  condition: {
    whoCausedDeath: string;
    whichVersionToFix: string;
  };
  /** 结局正文 */
  fullText: string;
}

// ---- Game State（全局游戏状态） ----

/** 玩家行为日志条目 */
export interface PlayerActionLog {
  timestamp: string;
  round: RoundIndex;
  actionType:
    | "ask_npc"
    | "inspect_location"
    | "discover_evidence"
    | "rewind"
    | "mark_testimony"
    | "view_board"
    | "accuse";
  detail: string;
}

/** 证词记录（含玩家提问上下文） */
export interface TestimonyRecord {
  shellId: string;
  npcId: NpcId;
  round: RoundIndex;
  questionStyle: QuestionStyle;
  /** 出示的物证 ID（仅 present_evidence 时有值） */
  evidenceId?: EvidenceId;
  fullText: string;
  emotion: TestimonyEmotion;
  driftLevel: number;
}

/** 玩家对证词的标记 */
export interface PlayerMark {
  testimonyShellId: string;
  markType: PlayerMarkType;
  note?: string;
}

/** 证词对比快照（供对照板用） */
export interface TestimonyDiffSnapshot {
  npcId: NpcId;
  /** 跨轮次的证词对比 token 映射 */
  stableTokens: string[];
  changedTokens: string[];
  newTokens: string[];
  omittedTokens: string[];
}

/** 最终指控结果 */
export interface AccusationResult {
  whoCausedDeath: string;
  whichVersionToFix: string;
  endingId: EndingId;
}

/** Playtest 日志导出格式 */
export interface PlaytestLog {
  sessionId: string;
  startedAt: string;
  endedAt: string;
  deviceInfo: string;
  actions: PlayerActionLog[];
  evidenceDiscoveries: {
    evidenceId: EvidenceId;
    discoveredAtRound: RoundIndex;
    timestamp: string;
  }[];
  rewinds: {
    fromRound: RoundIndex;
    toRound: RoundIndex;
    timestamp: string;
    entropyAtTime: number;
  }[];
  accusation: AccusationResult;
}

// ---- 案件元信息 ----

/** 案件元信息 */
export interface CaseMeta {
  caseId: string;
  title: string;
  subtitle: string;
  briefing: string;
  npcIds: NpcId[];
  maxRewinds: number;
  locations: string[];
}

// ---- Session（存档用） ----

/** 游戏存档（localStorage 序列化格式） */
export interface GameSaveData {
  sessionId: string;
  currentRound: RoundIndex;
  entropy: number;
  discoveredEvidenceIds: EvidenceId[];
  testimonyHistory: TestimonyRecord[];
  playerMarks: PlayerMark[];
  actionLogs: PlayerActionLog[];
  endingId?: EndingId;
  savedAt: string;
}

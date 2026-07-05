// ============================================================
// truthKernel.ts — Truth Kernel（真相核心，永不漂移）
// 案件：沈鹤鸣死亡案 (demo_shm_001)
//
// ⚠️ 此文件仅开发者可见。玩家不可直接看到以下内容。
//    玩家只能通过证词比对 + 环境证据间接推理。
// ============================================================

import type { TruthKernel, StableFact, EvidenceKernel, TimelineEvent } from "../../../engine/types";

// ---- 稳定事实 ----

const stableFacts: StableFact[] = [
  {
    id: "F_LIN_2317_SIGNAL",
    npcId: "lin_xu",
    content: "23:17，档案馆主记录仪信号中断 0.4 秒。",
    roundVisibleFrom: 0,
    linkedEvidenceIds: ["E3_LIGHT_LOG"],
    driftLocked: true,
  },
  {
    id: "F_HE_2317_LIGHT",
    npcId: "lao_he",
    content: "23:17，那盏主灯闪了一下。就一下。",
    roundVisibleFrom: 0,
    linkedEvidenceIds: ["E3_LIGHT_LOG", "E4_TEMPERATURE_LOG"],
    driftLocked: true,
  },
  {
    id: "F_LU_2330_EXIT",
    npcId: "doctor_lu",
    content: "我 23:30 从侧室门离开档案馆。",
    roundVisibleFrom: 0,
    linkedEvidenceIds: ["E3_LIGHT_LOG", "E6_EXECUTION_ORDER"],
    driftLocked: true,
  },
];

// ---- 物证核心（不可漂移的存在性） ----

const evidenceExistence: EvidenceKernel[] = [
  {
    evidenceId: "E1_WALL_SCRATCHES",
    exists: true,
    discoverableFrom: 0,
    kernelDescription:
      "七道平行划痕，位于主室东墙，指甲痕迹，间距均匀，深度从浅到深递增。数量固定为 7，对应第 7 次回溯。",
  },
  {
    evidenceId: "E2_MEMORY_READER",
    exists: true,
    discoverableFrom: 0,
    kernelDescription:
      "记忆读取器已损坏，电路板有超频烧灼痕迹（overclock burn）。自诱导碎裂不会产生超频痕迹——超频必须由外部操作者手动启动。证明非自杀。",
  },
  {
    evidenceId: "E3_LIGHT_LOG",
    exists: true,
    discoverableFrom: 0,
    kernelDescription:
      "档案馆主电箱日志：23:17:00，主灯电路中断 0.4 秒，自动恢复。时间戳不可篡改。",
  },
  {
    evidenceId: "E4_TEMPERATURE_LOG",
    exists: true,
    discoverableFrom: 0,
    kernelDescription:
      "档案馆温控系统记录：23:17:00，主室温度骤降 2°C。回溯碎裂的物理伴生现象——大量突触放电瞬间吸收环境热量。",
  },
  {
    evidenceId: "E5_SHEN_NOTE",
    exists: true,
    discoverableFrom: 0,
    kernelDescription:
      "沈鹤鸣的笔记本最后一页，笔迹潦草，写有\"VII 会记住的\"。纸页有指甲压痕，显示写于极度痛苦中。藏于读取器底座缝隙。",
  },
  {
    evidenceId: "E6_EXECUTION_ORDER",
    exists: true,
    discoverableFrom: 0,
    kernelDescription:
      "撕碎的执行令，残留字迹：\"……永久终止……记忆访问……\"，加盖真相庭正式印章。碎片在垃圾桶中发现。",
  },
];

// ---- 关键时间线 ----

const keyTimeline: TimelineEvent[] = [
  {
    time: "21:00",
    event: "沈鹤鸣独自抵达档案馆，调取\"原始记忆\"文件",
    location: "主室",
    npcIds: ["lao_he"],
  },
  {
    time: "21:30",
    event: "老何值班，注意到沈鹤鸣，未干扰",
    location: "值班室",
    npcIds: ["lao_he"],
  },
  {
    time: "22:00",
    event: "陆医生从侧门进入侧室，开始反向锚定准备",
    location: "侧室",
    npcIds: ["doctor_lu"],
  },
  {
    time: "22:15",
    event: "林叙抵达档案馆主入口，出示执行令",
    location: "主入口",
    npcIds: ["lin_xu", "lao_he"],
  },
  {
    time: "22:20",
    event: "林叙进入主室，与沈鹤鸣对话——要求停止研究，沈拒绝",
    location: "主室",
    npcIds: ["lin_xu"],
  },
  {
    time: "22:30",
    event: "林叙启动记忆读取器，强制超频，第 7 次回溯开始",
    location: "主室",
    npcIds: ["lin_xu"],
  },
  {
    time: "23:00",
    event: "老何听到异常响动，进入主室查看，被林叙制止",
    location: "主室",
    npcIds: ["lao_he", "lin_xu"],
  },
  {
    time: "23:17",
    event: "主灯中断 0.4 秒，温度骤降 2°C，沈鹤鸣记忆碎裂，死亡",
    location: "主室",
    npcIds: ["lin_xu", "lao_he", "doctor_lu"],
  },
  {
    time: "23:20",
    event: "老何退回值班室，藏匿沈鹤鸣掉落的笔记碎片",
    location: "值班室",
    npcIds: ["lao_he"],
  },
  {
    time: "23:25",
    event: "陆医生收拾反向锚定设备，恐惧加剧",
    location: "侧室",
    npcIds: ["doctor_lu"],
  },
  {
    time: "23:30",
    event: "陆医生从侧室侧门离开档案馆",
    location: "侧门",
    npcIds: ["doctor_lu"],
  },
  {
    time: "23:45",
    event: "林叙离开，向真相庭报告\"自诱导碎裂\"",
    location: "主入口",
    npcIds: ["lin_xu"],
  },
  {
    time: "00:10",
    event: "老何在墙面划痕旁留下一枚漂移者标记（暗号\"VII 会来\"）",
    location: "主室",
    npcIds: ["lao_he"],
  },
];

// ---- 完整 Truth Kernel ----

export const DEMO_TRUTH_KERNEL: TruthKernel = {
  caseId: "demo_shm_001",

  victim: {
    id: "shen_heming",
    name: "沈鹤鸣",
    deathTime: "23:17",
    deathLocation: "废弃档案馆主室",
    deathCauseKernel:
      "被强制启动记忆读取器第 7 次回溯程序，导致记忆碎裂死亡。身体无外伤，脑波呈典型\"7 次碎裂\"态。设备有超频痕迹→排除自诱导。",
  },

  hiddenTruth: {
    killerId: "lin_xu",
    method:
      "22:30 启动记忆读取器强制超频，持续至 23:17 沈鹤鸣碎裂。使用记忆读取器的第 7 次回溯程序——这是\"终止访问\"的官方话术：把人回溯到碎裂，记忆永久消失，死因记为\"自诱导\"。",
    motive:
      "真相庭高层命令。沈鹤鸣正在调取\"原始记忆\"文件——该文件记录了断层日是真相庭前身\"记忆稳定委员会\"实验失控的真相。真相庭下令\"永久终止沈鹤鸣对该文件的记忆访问\"。林叙认为这是\"按程序执行\"，不认为是谋杀。",
  },

  stableFacts,
  evidenceExistence,
  keyTimeline,
};

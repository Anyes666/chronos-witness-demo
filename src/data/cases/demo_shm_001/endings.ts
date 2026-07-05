// ============================================================
// endings.ts — Demo 版 2 个结局
// ============================================================

import type { EndingDefinition } from "../../../engine/types";

// ---- 指控选项 ----

/** 第一问：谁造成了沈鹤鸣的死亡？ */
export const ACCUSATION_WHO = [
  {
    id: "lin_xu",
    label: "林叙",
    description: "真相庭调查官。他承认亲临现场，执行了程序。",
  },
  {
    id: "lao_he",
    label: "老何",
    description: "档案馆夜班管理员。他承认进入了主室，但没有动手。",
  },
  {
    id: "doctor_lu",
    label: "陆医生",
    description: "私人诊所神经科医生。他在侧室，听到了声音。",
  },
  {
    id: "shen_heming_self",
    label: "沈鹤鸣自己",
    description: "自诱导记忆碎裂——官方结论。",
  },
  {
    id: "cannot_confirm",
    label: "无法确认",
    description: "证据不足以判定任何一个人。",
  },
] as const;

/** 第二问：你愿意把哪个版本固定为真相？ */
export const ACCUSATION_VERSION = [
  {
    id: "official_self_induced",
    label: "官方自诱导版本",
    description: "接受真相庭的结论：沈鹤鸣研究过深，自诱导记忆碎裂。归档。",
  },
  {
    id: "forced_rewind",
    label: "强制回溯版本",
    description: "固定林叙强制启动第7次回溯导致沈鹤鸣碎裂。这是事实，但不完整——你无法证明动机。",
  },
  {
    id: "suspend_archive",
    label: "暂缓归档",
    description: "现有证据不足以定案。保留案卷，等待进一步调查。",
  },
  {
    id: "refuse_to_fix",
    label: "拒绝固定",
    description: "真相本身不完整。你不愿用一个残缺的版本覆盖全部。",
  },
] as const;

// ---- 结局定义 ----

export const DEMO_ENDINGS: EndingDefinition[] = [
  // ---- 服从结案 ----
  {
    id: "obey_closure",
    title: "服从结案",
    description: "你选择了官方结论，或是在证据不足的情况下仍选择了归档。",
    condition: {
      // 触发条件：选择「自诱导」或「无法确认」+ 任一版本（除拒绝固定外）
      whoCausedDeath: "shen_heming_self|cannot_confirm",
      whichVersionToFix: "official_self_induced|suspend_archive",
    },
    fullText: `结案报告已归档。

沈鹤鸣，真相庭高级仲裁官，于废弃档案馆主室因自诱导记忆碎裂死亡。死因：自诱导。案件编号：SHM-001-CLOSED。

你的名字也签在了下面。

但你签字的时候停顿了三秒。因为你知道自己并不确定。

23:17 的信号中断是日志写的。那道 0.4 秒的中断没人质疑——但它的因果，你选择了最安全的那个版本。

老何后来被调离了档案馆。听人说他走的时候看了一眼东墙，数了数划痕。

陆医生的诊所关了。他没有解释为什么。也许他知道得太多了，也许他只是怕了。

林叙继续上班。他还是你的上级。他从不提那晚的事。但每次你整理证词对照板的时候，他都绕道走。

沉没档案库又多了一卷案卷。那卷案卷封面上写的不是真相，是结论。

有时候你半夜想起来，你会想：如果真相在别处，那么结论是什么？`,
  },

  // ---- 拒绝结案 ----
  {
    id: "refuse_closure",
    title: "拒绝结案",
    description: "你选择了暂缓归档或拒绝固定真相。案件未结，真相仍在。",
    condition: {
      // 触发条件：选择「强制回溯版本」或「暂缓归档」或「拒绝固定」
      whoCausedDeath: "lin_xu|lao_he|doctor_lu|shen_heming_self|cannot_confirm",
      whichVersionToFix: "forced_rewind|suspend_archive|refuse_to_fix",
    },
    fullText: `案件编号 SHM-001 未归档。

你在结案报告的签名栏画了一条横线。那条横线划穿了结论栏，但没有写任何人名。

你没有固定的版本。但你有了一个比版本更坚固的东西——「比对的习惯」。

23:17，你不是相信某一句话。你是相信三次变化里的共同点。23:17 的信号中断 / 主灯闪烁 / 「啪」的一声——三个互不认识的人，在四次回溯里，用三种不同的方式，确认了同一个时刻。

你不再问「谁说的是真的」。你问「什么从未改变」。

林叙的防御、老何的愧疚、陆医生的恐惧——这三者你都看到了。你看到的不只是证词，而是证词背后的重量。

老何在值班室坐了很久。他最后递给你一张纸条：「VII 会来的。」

陆医生在你离开时说了一句：「他们还会这样做。下个档案馆。下个仲裁官。」

你知道这不是结束。

你合上文件夹。封面写的是：SHM-001 — 待续。

真相庭的人问你：「你的结论呢？」

你说：「我没有结论。但我有一个问题。」

「什么从未改变？」

他们在自己的沉默里听到了答案。`,
  },
];

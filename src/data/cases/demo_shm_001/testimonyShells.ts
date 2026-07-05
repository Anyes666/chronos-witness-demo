// ============================================================
// testimonyShells.ts — 3 NPC × 4 轮共 12 条手写证词 Shell
//
// 证词矩阵来源：时序证人_Demo案件设计_证词漂移矩阵.md
// 第 0-2 轮严格按案件矩阵设计
// 第 3 轮（最终确认轮）：根据角色弧光手写补充
// ============================================================

import type { TestimonyShell } from "../../../engine/types";

// ============================================================
// 林叙 (lin_xu) — 4 轮证词
// 漂移方向：未到场 -> 派人去 -> 亲自去 -> 亲临
// 稳定事实：F_LIN_2317_SIGNAL "23:17 信号中断"
// ============================================================

const LIN_XU_SHELLS: TestimonyShell[] = [
  // ---- 第 0 轮：初次询问，防御最强 ----
  {
    id: "SH_LIN_00",
    npcId: "lin_xu",
    round: 0,
    questionStyleHint: "confirm",
    summary: "林叙声称在分部远程监控，死因已记录为自诱导碎裂。",
    fullText:
      "我在真相庭分部，通过远程监控调度。沉淀区的停留上限是四十分钟，VII，这不是建议。死因已记录：自诱导记忆碎裂。档案已封存。你的任务是确认，不是质疑。\n\n23:17，档案馆主记录仪信号中断0.4秒。可能是设备故障。我没有进入沉淀区。这是程序。时序证人不该问已经结案的部分。",
    stableFactIds: ["F_LIN_2317_SIGNAL"],
    changedTokens: [],
    newTokens: [],
    omittedTokens: [],
    emotion: "calm",
    driftLevel: 0,
  },

  // ---- 第 1 次回溯后：记忆被扰动，细节开始漂移 ----
  {
    id: "SH_LIN_01",
    npcId: "lin_xu",
    round: 1,
    questionStyleHint: "press",
    summary: "林叙承认授权了外勤组，透露沈鹤鸣提到过「原始记忆」文件。",
    fullText:
      "我在分部……但22:15我授权了一支外勤组去沉淀区送执行文件。他们没有进入档案室本身。\n\n沈鹤鸣？他21:00的通讯……其实提到了「第七次」这个词。我记错了，应该是「第七页」。他说「快找到了」——一份「原始记忆」文件。研究过深。\n\n23:17信号中断。这次我确认是档案馆内部的能量异常。自诱导碎裂——沈仲裁官……他自己回溯了太多次。",
    stableFactIds: ["F_LIN_2317_SIGNAL"],
    changedTokens: ["是否到场", "自诱导"],
    newTokens: ["第七次", "原始记忆", "外勤组"],
    omittedTokens: ["没进入沉淀区"],
    emotion: "defensive",
    driftLevel: 35,
  },

  // ---- 第 2 次回溯后：被多证人逼出，承认亲临 ----
  {
    id: "SH_LIN_02",
    npcId: "lin_xu",
    round: 2,
    questionStyleHint: "present_evidence",
    summary: "林叙承认亲临档案馆、与沈鹤鸣对话、执行了程序。",
    fullText:
      "我22:00亲自去过沉淀区。进入过档案馆。简短。这是程序需要。\n\n我和沈仲裁官谈过。关于停止研究。我要求他停止。他说「VII会来的，我留了足够的裂缝」。然后我执行了程序。\n\n23:17信号中断。那不是故障。是碎裂的瞬间。但死因仍然是自诱导碎裂——这是官方结论。你的工作不是质疑结论。按程序。\n\n他21:00的报告……我不记得具体内容了。那是常规通讯。",
    stableFactIds: ["F_LIN_2317_SIGNAL"],
    changedTokens: ["自诱导", "执行程序"],
    newTokens: ["亲临", "执行令", "VII会来的", "我留了足够的裂缝"],
    omittedTokens: ["没进入", "第七次"],
    emotion: "hostile",
    driftLevel: 70,
  },

  // ---- 第 3 次回溯后（最终确认）：疲惫但咬死结论 ----
  {
    id: "SH_LIN_03",
    npcId: "lin_xu",
    round: 3,
    questionStyleHint: "press",
    summary: "林叙疲惫但坚持「程序」辩护，拒绝讨论动机。",
    fullText:
      "……你还要问什么。我已经说过了：我执行了程序。按程序。\n\n23:17信号中断——这是碎裂的瞬间，我知道。我一直在看着日志。他留下的裂缝……我不是没看到。但程序就是程序。\n\n第七章、第七条。命令来自上面。我不讨论动机。这不是你的权限。\n\n（沉默）\n\n如果你要固定版本——固定自诱导。这是对大家都好的结局。按程序。",
    stableFactIds: ["F_LIN_2317_SIGNAL"],
    changedTokens: ["自诱导"],
    newTokens: ["第七章", "命令来自上面", "对大家都好的结局"],
    omittedTokens: ["VII会来的"],
    emotion: "defensive",
    driftLevel: 65,
  },
];

// ============================================================
// 老何 (lao_he) — 4 轮证词
// 漂移方向：没进 -> 门口 -> 进入看到 -> 承认没救下
// 稳定事实：F_HE_2317_LIGHT "23:17 主灯闪了一下"
// ============================================================

const LAO_HE_SHELLS: TestimonyShell[] = [
  // ---- 第 0 轮：初次询问，极力否认在场 ----
  {
    id: "SH_HE_00",
    npcId: "lao_he",
    round: 0,
    questionStyleHint: "confirm",
    summary: "老何自称看门的，否认进入主房间，没注意到异常。",
    fullText:
      "我就是个看门的，那晚在值班室。没动过。没进。我没事不进主房间，那是仲裁官们的地界。\n\n沈先生……他是仲裁官，我就是看门的，没什么交集。\n\n23:17？那盏主灯闪了一下。就一下。我一个看门的懂什么。仲裁官们说是自诱导，那就是吧。\n\n墙？墙上没什么。就是老房子的裂缝。",
    stableFactIds: ["F_HE_2317_LIGHT"],
    changedTokens: [],
    newTokens: [],
    omittedTokens: [],
    emotion: "evasive",
    driftLevel: 0,
  },

  // ---- 第 1 次回溯后：松动，承认去了门口 ----
  {
    id: "SH_HE_01",
    npcId: "lao_he",
    round: 1,
    questionStyleHint: "empathize",
    summary: "老何承认23:00去主室门口看了一眼，透露沈鹤鸣每次来都与他点头。",
    fullText:
      "我在值班室……23点的时候去主房间门口看了一眼。沈先生在里面。门开着。我没进去。就路过。\n\n沈先生那晚21点来的时候，跟我点了个头。他每次来都点头。\n\n23:17，主灯闪了一下。然后沈先生就没声音了。自诱导？沈先生……他不是那种人。他不会自己回溯到碎裂。\n\n那个墙……墙上有几道印子。可能是沈先生……不，我不确定。",
    stableFactIds: ["F_HE_2317_LIGHT"],
    changedTokens: ["是否进入", "对死因的判断"],
    newTokens: ["去门口看了一眼", "跟我点了个头", "不是那种人"],
    omittedTokens: ["没交集", "老房子的裂缝"],
    emotion: "defensive",
    driftLevel: 30,
  },

  // ---- 第 2 次回溯后：坦白进入 + 试图阻止 + 划痕数量 ----
  {
    id: "SH_HE_02",
    npcId: "lao_he",
    round: 2,
    questionStyleHint: "present_evidence",
    summary: "老何承认进入主室、看到机器运转、试图关掉但关不掉。",
    fullText:
      "我进去了。沈先生……他在喊。我试过关那台机器。关不掉。\n\n23:17，主灯闪了一下。碎裂的声音，我听过。不是自杀。那台机器是别人开的。我没救下他。\n\n沈先生知道我。他……他要是出事，让我「记住」。我记住了。\n\n七道。墙上有七道划痕。我数过。他抓的。他知道那是第几次。我也知道。\n\n（反复擦手）那晚的事……我没有选择。",
    stableFactIds: ["F_HE_2317_LIGHT"],
    changedTokens: ["是否进入", "对死因的判断", "划痕数量"],
    newTokens: ["关不掉", "碎裂的声音", "让我记住", "七道", "没有选择"],
    omittedTokens: ["路过", "印子", "不确定"],
    emotion: "fearful",
    driftLevel: 65,
  },

  // ---- 第 3 次回溯后（最终确认）：愧疚 + 渴望被理解 ----
  {
    id: "SH_HE_03",
    npcId: "lao_he",
    round: 3,
    questionStyleHint: "empathize",
    summary: "老何解释为什么没有拼命阻止，留下漂移者标记。",
    fullText:
      "23:17，那盏灯闪了。每次回想，我都能听见碎裂的声音。七道划痕——他抓了七次。每道我都听见了。\n\n你想问我为什么没拼命？因为……我还有别的事要做。我在墙上留了标记——「VII会来」。沈先生说过，要我记住。我记住了。但我不只是档案馆的老何。\n\n（长时间沉默）\n\n如果你要定案——不要定自杀。他不是自杀。那台机器是别人开的。至于是谁……你们自己去判断。我已经说了太多了。",
    stableFactIds: ["F_HE_2317_LIGHT"],
    changedTokens: ["对死因的判断"],
    newTokens: ["VII会来", "别的事要做", "我不只是档案馆的老何"],
    omittedTokens: ["关不掉"],
    emotion: "calm",
    driftLevel: 50,
  },
];

// ============================================================
// 陆医生 (doctor_lu) — 4 轮证词
// 漂移方向：否认在场 -> 承认附近 -> 承认在侧室听到 -> 精确声音记忆
// 稳定事实：F_LU_2330_EXIT "23:30 从侧室离开"
// ============================================================

const DOCTOR_LU_SHELLS: TestimonyShell[] = [
  // ---- 第 0 轮：初次询问，完全否认 ----
  {
    id: "SH_LU_00",
    npcId: "doctor_lu",
    round: 0,
    questionStyleHint: "confirm",
    summary: "陆医生声称只是顺路拜访扑空了，完全否认当晚在档案馆。",
    fullText:
      "我当晚没去过档案馆。我是沈先生的老朋友，顺路想拜访，但他不在。扑空了。没进过。我说了，他不在。\n\n没什么异常。我就是扑空了。我是医生，不是仲裁官。扑空了就是扑空了，我不评价。\n\n声音？没什么声音。我扑空了就走了。\n\n（手指不自觉地敲了两下桌面）",
    stableFactIds: ["F_LU_2330_EXIT"],
    changedTokens: [],
    newTokens: [],
    omittedTokens: [],
    emotion: "evasive",
    driftLevel: 0,
  },

  // ---- 第 1 次回溯后：松口但模糊 ----
  {
    id: "SH_LU_01",
    npcId: "doctor_lu",
    round: 1,
    questionStyleHint: "silent_observe",
    summary: "陆医生承认去过附近，听到一声响但模糊化。",
    fullText:
      "我……那晚去过档案馆附近。但我没进去。我在……外面。侧室也没进。我23:30就走了。\n\n沈先生……我那天没见到他。但我听人说他21点来过。\n\n23:17……我听到一声响。像灯泡爆了。不，我不确定。\n\n我好像听到……机器运转的声音？侧室隔音不好。不，我可能记错了。\n\n我得对病人的隐私负责。那天晚上我没进过主房间。",
    stableFactIds: ["F_LU_2330_EXIT"],
    changedTokens: ["是否在场", "是否听到声音"],
    newTokens: ["23:30", "附近", "灯泡爆了", "机器运转"],
    omittedTokens: ["扑空了"],
    emotion: "fearful",
    driftLevel: 40,
  },

  // ---- 第 2 次回溯后：关键解锁 —— 听到两个人 + 专业判断 ----
  {
    id: "SH_LU_02",
    npcId: "doctor_lu",
    round: 2,
    questionStyleHint: "present_evidence",
    summary: "陆医生承认在侧室，听到两人对话、碎裂声，给出强制超频的专业判断。",
    fullText:
      "我在侧室。23:30从侧室门离开。我得对病人的隐私负责。\n\n我没进主房间。一直在侧室。主房间和侧室之间有隔墙。我没看到……但我听到了。沈先生……我最后没见到他。但我听到他了。他在说话。和另一个人。\n\n23:17，「啪」的一声。然后是安静。那种安静不对。\n\n两个人说话。一个嗓门低沉，像下命令。一个在喊「停」。然后是「啪」。\n\n不是自诱导。碎裂的声音我听过——我做神经科的。那是被强制超频的碎裂。自诱导的设备不会有这种声音——自诱导是衰减式的，不是「啪」的一声切断。\n\n（语速加快，手指快速敲桌面）但我没看到脸。我不能正式出证词。",
    stableFactIds: ["F_LU_2330_EXIT"],
    changedTokens: ["是否在场", "是否听到", "对死因的判断"],
    newTokens: [
      "隔墙",
      "两个人说话",
      "下命令",
      "喊停",
      "强制超频",
      "衰减式",
    ],
    omittedTokens: ["附近", "没进", "灯泡爆了"],
    emotion: "fearful",
    driftLevel: 75,
  },

  // ---- 第 3 次回溯后（最终确认）：记忆更清晰但自保更强 ----
  {
    id: "SH_LU_03",
    npcId: "doctor_lu",
    round: 3,
    questionStyleHint: "empathize",
    summary: "陆医生的反向锚定副作用使记忆更清晰，但仍拒绝直接指认。",
    fullText:
      "23:30。我从侧室侧门离开。这一点我从来没改过。\n\n我再想了一遍——那道声音。「啪」的一声。在那之前，有一个人说了「第七条，执行」。声音低沉，像念判决书。然后沈先生在喊「不」。然后「啪」。\n\n我是神经科医生。我知道第七次回溯意味着什么——那是极限。自诱导到第七次是不可能的。人的自我保护机制会阻止——除非有人强制。\n\n但我不能出证词。我的侧室里……有一些设备。不是合法的。如果你们追究我，就别指望我作证。\n\n（停止敲桌，双手放在膝上，直视）\n\n真相不是一个人的。你们自己去拼吧。我已经把能说的都说了。",
    stableFactIds: ["F_LU_2330_EXIT"],
    changedTokens: ["声音记忆"],
    newTokens: ["第七条，执行", "自我保护机制", "非法设备"],
    omittedTokens: ["不能正式出证词"],
    emotion: "defensive",
    driftLevel: 60,
  },
];

// ============================================================
// 汇总导出
// ============================================================

/** Demo 版全部 12 条证词 Shell */
export const DEMO_TESTIMONY_SHELLS: TestimonyShell[] = [
  ...LIN_XU_SHELLS,
  ...LAO_HE_SHELLS,
  ...DOCTOR_LU_SHELLS,
];

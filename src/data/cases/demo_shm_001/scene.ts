// ============================================================
// scene.ts — Demo 版场景：废弃档案馆
// ============================================================

import type { SceneLocation } from "../../../engine/types";

export const DEMO_LOCATIONS: SceneLocation[] = [
  // ---- 主室 ----
  {
    id: "main_room",
    name: "档案馆主室",
    description:
      "宽敞但破败的大厅。中央是一张金属桌，桌面摆放着一台已损坏的记忆读取器。东墙灰泥剥落，隐约可见抓痕。北侧是电箱和温控面板。空气中弥漫着臭氧烧焦的味道。档案柜靠西墙排列，部分柜门敞开，文件散落一地。",
    evidenceIds: [
      "E1_WALL_SCRATCHES",
      "E2_MEMORY_READER",
      "E3_LIGHT_LOG",
      "E4_TEMPERATURE_LOG",
      "E5_SHEN_NOTE",
      "E6_EXECUTION_ORDER",
    ],
  },

  // ---- 主室东墙（划痕位置） ----
  {
    id: "main_room_east_wall",
    name: "主室东墙",
    description:
      "东墙靠近档案柜的一侧。墙面有几道不寻常的痕迹。地面上散落着剥落的灰泥碎片。",
    evidenceIds: ["E1_WALL_SCRATCHES"],
  },

  // ---- 主室桌面 ----
  {
    id: "main_room_desk",
    name: "主室桌面",
    description:
      "金属桌面上摆放着一台沉默的记忆读取器。屏幕漆黑，接口边缘有焦痕。桌面有一些散落的文件碎片。",
    evidenceIds: ["E2_MEMORY_READER"],
  },

  // ---- 主室桌底 ----
  {
    id: "main_room_desk_underside",
    name: "读取器底座",
    description:
      "读取器的底座有一条细小的缝隙。似乎有什么东西被塞在了里面。",
    evidenceIds: ["E5_SHEN_NOTE"],
  },

  // ---- 电箱 ----
  {
    id: "main_room_power_box",
    name: "电箱",
    description:
      "北墙的电箱门半掩着。数据屏上滚动显示着运行日志。最后一条异常记录在 23:17。",
    evidenceIds: ["E3_LIGHT_LOG"],
  },

  // ---- 温控面板 ----
  {
    id: "main_room_thermostat",
    name: "温控面板",
    description:
      "墙上的温控面板。数字在微微闪烁——似乎近期有过异常的温度波动记录。",
    evidenceIds: ["E4_TEMPERATURE_LOG"],
  },

  // ---- 垃圾桶 ----
  {
    id: "main_room_trash",
    name: "垃圾桶",
    description:
      "桌子旁边的金属垃圾桶。桶底有一些撕碎的纸张。",
    evidenceIds: ["E6_EXECUTION_ORDER"],
  },

  // ---- 侧室 ----
  {
    id: "side_room",
    name: "档案馆侧室",
    description:
      "主室东侧的一间较小房间，通过一扇厚重的隔墙门与主室相连。这里原本是档案分类处理室，但已被改造成临时的医疗准备间。桌上摆放着一些神经科的便携设备——不是档案馆的标准配置。侧室有独立的侧门通向建筑外部。",
    evidenceIds: [],
    npcId: "doctor_lu",
  },

  // ---- 侧室门口 ----
  {
    id: "side_room_door",
    name: "侧室门口",
    description:
      "侧室的门紧闭着。门缝下面透出一丝光线。门牌上贴着「档案处理室 · 非请勿入」。",
    evidenceIds: [],
    npcId: "doctor_lu",
  },

  // ---- 值班室 ----
  {
    id: "duty_room",
    name: "值班室",
    description:
      "入口旁的小隔间，有一张旧转椅和一台监控终端。桌上放着一只旧茶杯和一本值班日志。老何坐在转椅上，看起来有些不安。",
    evidenceIds: [],
    npcId: "lao_he",
  },

  // ---- 主入口 ----
  {
    id: "main_entrance",
    name: "档案馆主入口",
    description:
      "厚重的金属门，门锁系统显示最后开锁时间是 22:15——持真相庭执行令。门上方的监控摄像头指示灯微微闪烁。",
    evidenceIds: [],
  },

  // ---- 侧门 ----
  {
    id: "side_door",
    name: "侧室侧门",
    description:
      "侧室通向建筑外部的门。门锁系统显示 23:30 有一次开门记录。门外是一条窄巷。",
    evidenceIds: [],
  },

  // ---- 通讯终端（林叙远程对话） ----
  {
    id: "main_room_comms",
    name: "通讯终端",
    description:
      "主室桌上的通讯终端。屏幕亮着，显示「真相庭分部 · 调查官林叙 · 在线」。",
    evidenceIds: [],
    npcId: "lin_xu",
  },
];

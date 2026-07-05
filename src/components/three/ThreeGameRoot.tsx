// src/components/three/ThreeGameRoot.tsx
// 3D 档案馆场景主入口 — 处理交互、键盘快捷键
import { useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { ArchiveHallScene } from "./ArchiveHallScene";
import { SceneLighting } from "./SceneLighting";
import { ThirdPersonController } from "./ThirdPersonController";
import { InteractionPrompt } from "./InteractionPrompt";
import { MemoryDriftEffect } from "./MemoryDriftEffect";
import { useGameStore } from "../../engine/gameStore";
import { feedbackStore } from "../../engine/feedbackStore";
import { getClosestInteractable } from "../../engine/interactionEngine";
import { DEMO_SCENE_3D } from "../../data/cases/demo_shm_001/scene3d";
import { playerPositionRef } from "./ThirdPersonController";
import type { InteractionTarget } from "../../engine/interactionEngine";

// 全局交互状态供 InteractionPrompt 和外部读取
export const interactionState = {
  current: null as InteractionTarget | null,
  listener: null as ((t: InteractionTarget | null) => void) | null,
  setTarget(t: InteractionTarget | null) {
    this.current = t;
    this.listener?.(t);
  },
};

// 暴露给外部：是否正在显示 overlay（用于判断 E 键是否要触发交互）
export let overlayOpen = false;
export function setOverlayOpen(v: boolean) { overlayOpen = v; }

export function ThreeGameRoot() {
  const currentRound = useGameStore((s) => s.currentRound);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const rewind = useGameStore((s) => s.rewind);
  const canRewind = useGameStore((s) => s.canRewind);

  // 每 120ms 检测最近可交互对象
  useEffect(() => {
    const interval = setInterval(() => {
      const target = getClosestInteractable(
        playerPositionRef.current,
        DEMO_SCENE_3D.objects,
        currentRound as 0 | 1 | 2 | 3,
      );
      interactionState.setTarget(target);
    }, 120);
    return () => clearInterval(interval);
  }, [currentRound]);

  // E 键交互处理 — 支持物证/NPC/终端
  const handleInteract = useCallback(
    (target: InteractionTarget | null) => {
      if (!target) {
        feedbackStore.warning("当前没有可交互对象");
        return;
      }

      switch (target.action) {
        case "discover_evidence":
          if (target.evidenceId) {
            discoverEvidence(target.evidenceId);
            feedbackStore.success(`已发现物证：${target.object.name}`);
          }
          break;
        case "ask_npc":
          // NPC 交互 — 由 DesktopInvestigationScreen 监听并打开面板
          if (target.npcId) {
            feedbackStore.info(`与 ${target.object.name} 对话`);
            // 发布自定义事件让 DesktopInvestigationScreen 打开 NPC 面板
            window.dispatchEvent(
              new CustomEvent("chronos:open_npc", { detail: { npcId: target.npcId } }),
            );
          }
          break;
        case "open_board":
          feedbackStore.info("打开真相终端");
          window.dispatchEvent(new CustomEvent("chronos:open_board"));
          break;
        default:
          feedbackStore.info(`交互：${target.object.name}`);
      }
    },
    [discoverEvidence],
  );

  // 键盘快捷键
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();

      // R = 回溯
      if (key === "r" && !overlayOpen) {
        if (canRewind()) {
          rewind();
          feedbackStore.success(`已回溯至第 ${currentRound + 1} 轮`);
        } else {
          feedbackStore.warning("回溯次数已用尽 — 请进入最终指控");
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [rewind, canRewind, currentRound]);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 5, 12], fov: 60, near: 0.1, far: 50 }}
        style={{ background: "#0f172a" }}
      >
        <SceneLighting />
        <ArchiveHallScene />
        <ThirdPersonController onInteract={handleInteract} />
        <MemoryDriftEffect />
      </Canvas>
      <InteractionPrompt />
    </>
  );
}

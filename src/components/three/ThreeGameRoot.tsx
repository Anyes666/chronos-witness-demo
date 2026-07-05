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
import { getClosestInteractable } from "../../engine/interactionEngine";
import { DEMO_SCENE_3D } from "../../data/cases/demo_shm_001/scene3d";
import { playerPositionRef } from "./ThirdPersonController";
import type { InteractionTarget } from "../../engine/interactionEngine";

// 全局交互状态供 InteractionPrompt 读取
export const interactionState = {
  current: null as InteractionTarget | null,
  listener: null as ((t: InteractionTarget | null) => void) | null,
  setTarget(t: InteractionTarget | null) {
    this.current = t;
    this.listener?.(t);
  },
};

export function ThreeGameRoot() {
  const currentRound = useGameStore((s) => s.currentRound);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const rewind = useGameStore((s) => s.rewind);
  const canRewind = useGameStore((s) => s.canRewind);

  // 每帧检测最近可交互对象
  useEffect(() => {
    const interval = setInterval(() => {
      const target = getClosestInteractable(
        playerPositionRef.current,
        DEMO_SCENE_3D.objects,
        currentRound as 0 | 1 | 2 | 3,
      );
      interactionState.setTarget(target);
    }, 150);
    return () => clearInterval(interval);
  }, [currentRound]);

  // E 键交互处理
  const handleInteract = useCallback(
    (target: InteractionTarget | null) => {
      if (!target) return;
      if (target.action === "discover_evidence" && target.evidenceId) {
        discoverEvidence(target.evidenceId);
      }
    },
    [discoverEvidence],
  );

  // 键盘快捷键
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // 不处理输入框中的按键
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const key = e.key.toLowerCase();

      // R = 回溯
      if (key === "r" && canRewind()) {
        rewind();
      }

      // Tab = 证词对照板（暂由 DesktopInvestigationScreen 处理）
      // Esc = 释放 pointer lock
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [rewind, canRewind]);

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

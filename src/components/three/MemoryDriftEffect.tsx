// src/components/three/MemoryDriftEffect.tsx
// 回溯视觉变化：灯光闪烁、颜色偏移、粒子效果
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../engine/gameStore";
import * as THREE from "three";

export function MemoryDriftEffect() {
  const currentRound = useGameStore((s) => s.currentRound);

  useFrame(({ scene }) => {
    // 第 1 轮：轻微灯光频率变化
    // 第 2 轮：场景色调偏移
    // 第 3 轮：全局蓝色调 + 雾气
    if (currentRound >= 2) {
      scene.fog = new THREE.Fog(
        "#0a1628",
        8,
        18,
      );
    } else if (currentRound >= 1) {
      scene.fog = new THREE.Fog(
        "#0f1a2e",
        10,
        20,
      );
    } else {
      scene.fog = new THREE.Fog(
        "#0f172a",
        12,
        22,
      );
    }

    // 调整环境光强度（第 3 轮变暗）
    scene.traverse((child) => {
      if (child instanceof THREE.AmbientLight) {
        child.intensity = 0.3 - currentRound * 0.06;
      }
    });
  });

  return null;
}

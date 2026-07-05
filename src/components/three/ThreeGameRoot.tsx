// src/components/three/ThreeGameRoot.tsx
// 3D 档案馆场景主入口 — 组合所有 3D 子组件
import { Canvas } from "@react-three/fiber";
import { ArchiveHallScene } from "./ArchiveHallScene";
import { SceneLighting } from "./SceneLighting";
import { ThirdPersonController } from "./ThirdPersonController";
import { InteractionPrompt } from "./InteractionPrompt";
import { MemoryDriftEffect } from "./MemoryDriftEffect";

export function ThreeGameRoot() {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 5, 12], fov: 60, near: 0.1, far: 50 }}
        style={{ background: "#0f172a" }}
      >
        <SceneLighting />
        <ArchiveHallScene />
        <ThirdPersonController />
        <MemoryDriftEffect />
      </Canvas>
      <InteractionPrompt />
    </>
  );
}

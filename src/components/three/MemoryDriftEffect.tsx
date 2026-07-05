import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../engine/gameStore";
import * as THREE from "three";

const FOG_BY_ROUND = [
  { color: "#172033", near: 18, far: 42 },
  { color: "#14213a", near: 16, far: 38 },
  { color: "#111b35", near: 14, far: 34 },
  { color: "#101633", near: 12, far: 30 },
] as const;

export function MemoryDriftEffect() {
  const currentRound = useGameStore((s) => s.currentRound);

  useFrame(({ scene }) => {
    const fog = FOG_BY_ROUND[Math.min(currentRound, FOG_BY_ROUND.length - 1)];
    scene.fog = new THREE.Fog(fog.color, fog.near, fog.far);
  });

  return null;
}

// src/components/three/InteractableObject.tsx
// 3D 可交互物证 / 终端 — 带发光效果
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useGameStore } from "../../engine/gameStore";
import type { SceneObject3D } from "../../engine/types";
import * as THREE from "three";

interface InteractableObjectProps {
  obj: SceneObject3D;
}

export function InteractableObject({ obj }: InteractableObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);

  const isDiscovered =
    obj.linkedEvidenceId && discoveredEvidenceIds.includes(obj.linkedEvidenceId);

  const color = obj.type === "terminal"
    ? "#4da6ff"
    : isDiscovered
      ? "#10b981"
      : "#f59e0b";

  // 发光脉冲
  useFrame((_, _delta) => {
    if (meshRef.current && !isDiscovered) {
      const scale = 1 + Math.sin(Date.now() * 0.003) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={obj.position}>
      <mesh
        ref={meshRef}
        scale={obj.scale ?? [1, 1, 1]}
        castShadow
      >
        {obj.type === "terminal" ? (
          <boxGeometry args={[1, 1, 1]} />
        ) : (
          <icosahedronGeometry args={[0.4, 1]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isDiscovered ? 0.3 : 0.6}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      <Text
        position={[0, 0.8 + (obj.scale?.[1] ?? 1) * 0.5, 0]}
        fontSize={0.2}
        color={isDiscovered ? "#10b981" : "#f59e0b"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {obj.name}
      </Text>
    </group>
  );
}

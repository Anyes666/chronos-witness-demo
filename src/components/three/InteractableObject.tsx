import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import { useGameStore } from "../../engine/gameStore";
import type { SceneObject3D } from "../../engine/types";
import { playerPositionRef } from "./ThirdPersonController";
import * as THREE from "three";

interface InteractableObjectProps {
  obj: SceneObject3D;
}

const LABELS: Record<string, string> = {
  E1_WALL_SCRATCHES: "七道划痕",
  E2_MEMORY_READER: "损坏的记忆读取器",
  E3_LIGHT_LOG: "电箱日志",
  E4_TEMPERATURE_LOG: "温控面板",
  E5_SHEN_NOTE: "沈鹤鸣笔记",
  E6_EXECUTION_ORDER: "执行令碎片",
};

const CRITICAL_EVIDENCE = new Set(["E2_MEMORY_READER", "E3_LIGHT_LOG", "E6_EXECUTION_ORDER"]);

function GlowMaterial({ color, intensity }: { color: string; intensity: number }) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={intensity}
      roughness={0.38}
      metalness={0.18}
    />
  );
}

function WallScratches({ color, intensity }: { color: string; intensity: number }) {
  return (
    <group rotation={[0, 0, -0.18]}>
      {Array.from({ length: 7 }).map((_, index) => (
        <mesh
          key={index}
          position={[(index - 3) * 0.11, 0.05 * (index % 2), 0]}
          rotation={[0, 0, 0.24 + index * 0.025]}
          castShadow
        >
          <boxGeometry args={[0.035, 1.05, 0.035]} />
          <GlowMaterial color={color} intensity={intensity + 0.12} />
        </mesh>
      ))}
      <mesh position={[0, -0.58, -0.015]}>
        <boxGeometry args={[1.05, 0.04, 0.035]} />
        <meshStandardMaterial color="#526071" roughness={0.7} />
      </mesh>
    </group>
  );
}

function MemoryReader({ color, intensity }: { color: string; intensity: number }) {
  return (
    <group>
      <mesh position={[0, -0.22, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.85, 0.22, 36]} />
        <meshStandardMaterial color="#2f3b52" roughness={0.52} metalness={0.28} />
      </mesh>
      <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.58, 0.055, 12, 52]} />
        <GlowMaterial color={color} intensity={intensity + 0.18} />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <GlowMaterial color="#5cc8ff" intensity={intensity + 0.45} />
      </mesh>
      {[-0.48, 0.48].map((x) => (
        <mesh key={x} position={[x, -0.02, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.7, 10]} />
          <meshStandardMaterial color="#9aa7bd" roughness={0.45} metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function ElectricPanel({ color, intensity }: { color: string; intensity: number }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.75, 0.9, 0.12]} />
        <meshStandardMaterial color="#334155" roughness={0.65} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.18, 0.07]}>
        <boxGeometry args={[0.48, 0.16, 0.02]} />
        <GlowMaterial color={color} intensity={intensity + 0.2} />
      </mesh>
      <mesh position={[0.25, -0.22, 0.08]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <GlowMaterial color="#ff6b4a" intensity={0.65} />
      </mesh>
    </group>
  );
}

function TemperaturePanel({ color, intensity }: { color: string; intensity: number }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.58, 0.58, 0.1]} />
        <meshStandardMaterial color="#2f3b52" roughness={0.62} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.05, 0.065]}>
        <boxGeometry args={[0.38, 0.18, 0.02]} />
        <GlowMaterial color="#6ee7d8" intensity={intensity + 0.16} />
      </mesh>
      <mesh position={[0, -0.2, 0.07]}>
        <boxGeometry args={[0.26, 0.035, 0.02]} />
        <GlowMaterial color={color} intensity={intensity} />
      </mesh>
    </group>
  );
}

function Notebook({ color, intensity }: { color: string; intensity: number }) {
  return (
    <group position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, -0.2]}>
      <mesh castShadow>
        <boxGeometry args={[0.75, 0.5, 0.035]} />
        <meshStandardMaterial color="#cdbf93" roughness={0.9} />
      </mesh>
      <mesh position={[0.18, 0, 0.025]}>
        <boxGeometry args={[0.025, 0.46, 0.012]} />
        <GlowMaterial color={color} intensity={intensity} />
      </mesh>
    </group>
  );
}

function OrderFragments({ color, intensity }: { color: string; intensity: number }) {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {[
        [-0.12, 0.08, 0.18],
        [0.12, -0.05, -0.12],
        [0.02, 0.14, -0.24],
      ].map(([x, y, rz], index) => (
        <mesh key={index} position={[x, y, 0]} rotation={[0, 0, rz]} castShadow>
          <boxGeometry args={[0.34, 0.18, 0.018]} />
          <GlowMaterial color={index === 0 ? color : "#d7caa0"} intensity={intensity} />
        </mesh>
      ))}
    </group>
  );
}

function TerminalObject({ color, intensity }: { color: string; intensity: number }) {
  return (
    <group>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.25, 0.48, 0.78]} />
        <meshStandardMaterial color="#2f3b52" roughness={0.58} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.78, -0.12]} rotation={[-0.16, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 0.55, 0.08]} />
        <meshStandardMaterial color="#182133" roughness={0.35} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.8, -0.075]} rotation={[-0.16, 0, 0]}>
        <boxGeometry args={[0.72, 0.35, 0.025]} />
        <GlowMaterial color={color} intensity={intensity + 0.2} />
      </mesh>
    </group>
  );
}

export function InteractableObject({ obj }: InteractableObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nearRef = useRef(false);
  const [nearby, setNearby] = useState(false);
  const [hovered, setHovered] = useState(false);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);

  const evidenceId = obj.linkedEvidenceId;
  const isDiscovered = Boolean(evidenceId && discoveredEvidenceIds.includes(evidenceId));
  const isCritical = Boolean(evidenceId && CRITICAL_EVIDENCE.has(evidenceId));
  const focused = nearby || hovered;
  const color = obj.type === "terminal" ? "#4da6ff" : isDiscovered ? "#22c55e" : "#d1a64a";
  const intensity = focused ? 0.85 : isDiscovered ? 0.35 : isCritical ? 0.62 : 0.48;
  const label = evidenceId ? LABELS[evidenceId] ?? obj.name : "通讯终端";

  useFrame(() => {
    if (!groupRef.current) return;

    const player = playerPositionRef.current;
    const distance = groupRef.current.position.distanceTo(new THREE.Vector3(player.x, player.y, player.z));
    const nextNearby = distance < 3;
    if (nearRef.current !== nextNearby) {
      nearRef.current = nextNearby;
      setNearby(nextNearby);
    }

    const pulse = !isDiscovered ? 1 + Math.sin(Date.now() * 0.004) * 0.025 : 1;
    groupRef.current.scale.setScalar(focused ? pulse * 1.08 : pulse);
  });

  return (
    <group
      ref={groupRef}
      position={obj.position}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {obj.type === "terminal" && <TerminalObject color="#4da6ff" intensity={focused ? 0.75 : 0.45} />}
      {evidenceId === "E1_WALL_SCRATCHES" && <WallScratches color={color} intensity={intensity} />}
      {evidenceId === "E2_MEMORY_READER" && <MemoryReader color="#4da6ff" intensity={focused ? 0.95 : 0.68} />}
      {evidenceId === "E3_LIGHT_LOG" && <ElectricPanel color={color} intensity={intensity} />}
      {evidenceId === "E4_TEMPERATURE_LOG" && <TemperaturePanel color={color} intensity={intensity} />}
      {evidenceId === "E5_SHEN_NOTE" && <Notebook color={color} intensity={intensity} />}
      {evidenceId === "E6_EXECUTION_ORDER" && <OrderFragments color={color} intensity={intensity} />}

      {focused && (
        <Billboard position={[0, obj.type === "terminal" ? 1.35 : 0.95, 0]}>
          <Text
            fontSize={0.18}
            color={isDiscovered ? "#5eead4" : "#f6c65b"}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.012}
            outlineColor="#020617"
          >
            {label}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

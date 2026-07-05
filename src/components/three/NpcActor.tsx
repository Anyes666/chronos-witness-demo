import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import type { SceneObject3D } from "../../engine/types";
import { playerPositionRef } from "./ThirdPersonController";
import * as THREE from "three";

interface NpcActorProps {
  obj: SceneObject3D;
}

const NPC_META: Record<string, { name: string; role: string; coat: string; accent: string; light: string }> = {
  lin_xu: {
    name: "林叙",
    role: "调查官",
    coat: "#60738e",
    accent: "#9fb9d8",
    light: "#9cc7ff",
  },
  lao_he: {
    name: "老何",
    role: "档案管理员",
    coat: "#8a7354",
    accent: "#d0b172",
    light: "#d1a64a",
  },
  doctor_lu: {
    name: "陆医生",
    role: "记忆科医生",
    coat: "#d7e2e8",
    accent: "#68d8bf",
    light: "#9ff5d0",
  },
};

function Limb({ position, rotation, color }: { position: [number, number, number]; rotation: [number, number, number]; color: string }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <cylinderGeometry args={[0.055, 0.07, 0.62, 10]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}

export function NpcActor({ obj }: NpcActorProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nearRef = useRef(false);
  const [nearby, setNearby] = useState(false);
  const [hovered, setHovered] = useState(false);
  const meta = obj.linkedNpcId ? NPC_META[obj.linkedNpcId] ?? NPC_META.lin_xu : NPC_META.lin_xu;
  const focused = nearby || hovered;

  useFrame(() => {
    if (!groupRef.current) return;
    const player = playerPositionRef.current;
    const distance = groupRef.current.position.distanceTo(new THREE.Vector3(player.x, player.y, player.z));
    const nextNearby = distance < 3.2;
    if (nearRef.current !== nextNearby) {
      nearRef.current = nextNearby;
      setNearby(nextNearby);
    }
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
      <pointLight position={[0, 1.35, 0.3]} intensity={focused ? 0.5 : 0.22} color={meta.light} distance={2.5} />

      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.42, 0.82, 0.24]} />
        <meshStandardMaterial
          color={meta.coat}
          emissive={meta.light}
          emissiveIntensity={focused ? 0.12 : 0.04}
          roughness={0.58}
        />
      </mesh>
      <mesh position={[0, 1.28, 0]} castShadow>
        <sphereGeometry args={[0.22, 18, 18]} />
        <meshStandardMaterial color="#c7b299" roughness={0.62} />
      </mesh>
      <mesh position={[0, 1.06, 0.125]} castShadow>
        <boxGeometry args={[0.32, 0.08, 0.035]} />
        <meshStandardMaterial color={meta.accent} emissive={meta.accent} emissiveIntensity={focused ? 0.18 : 0.06} />
      </mesh>

      <Limb position={[-0.31, 0.66, 0]} rotation={[0.2, 0, 0.25]} color={meta.coat} />
      <Limb position={[0.31, 0.66, 0]} rotation={[0.2, 0, -0.25]} color={meta.coat} />
      <Limb position={[-0.12, 0.12, 0]} rotation={[0.05, 0, 0.04]} color="#2f3b52" />
      <Limb position={[0.12, 0.12, 0]} rotation={[0.05, 0, -0.04]} color="#2f3b52" />

      <mesh position={[0, -0.24, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.48, 24]} />
        <meshBasicMaterial color={meta.light} transparent opacity={focused ? 0.2 : 0.08} />
      </mesh>

      {focused && (
        <Billboard position={[0, 1.75, 0]}>
          <Text
            fontSize={0.2}
            color="#e2e8f0"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.014}
            outlineColor="#020617"
          >
            {meta.name} · {meta.role}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

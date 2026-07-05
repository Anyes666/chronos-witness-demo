// src/components/three/NpcActor.tsx
// 3D NPC 角色 — 二次元低多边形风格占位
import { Text } from "@react-three/drei";
import type { SceneObject3D } from "../../engine/types";

interface NpcActorProps {
  obj: SceneObject3D;
}

export function NpcActor({ obj }: NpcActorProps) {
  const npcColors: Record<string, string> = {
    lin_xu: "#4a5568",    // 灰蓝 — 林叙
    lao_he: "#8b7355",    // 暗棕 — 老何
    doctor_lu: "#2d5a4b", // 暗绿 — 陆医生
  };

  const npcNames: Record<string, string> = {
    lin_xu: "林叙",
    lao_he: "老何",
    doctor_lu: "陆医生",
  };

  const color = obj.linkedNpcId ? npcColors[obj.linkedNpcId] ?? "#6b7280" : "#6b7280";
  const name = obj.linkedNpcId ? npcNames[obj.linkedNpcId] ?? "???" : "???";

  return (
    <group position={obj.position}>
      {/* 身体 */}
      <mesh position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* 头部 */}
      <mesh position={[0, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* 名字标签 */}
      <Text
        position={[0, 2.4, 0]}
        fontSize={0.3}
        color="#c9b44b"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {name}
      </Text>
    </group>
  );
}

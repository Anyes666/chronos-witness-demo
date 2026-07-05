// src/components/three/ArchiveHallScene.tsx
// 3D 档案馆场景 — 主室 + 侧室几何体
import { useGameStore } from "../../engine/gameStore";
import { DEMO_SCENE_3D } from "../../data/cases/demo_shm_001/scene3d";
import { NpcActor } from "./NpcActor";
import { InteractableObject } from "./InteractableObject";

export function ArchiveHallScene() {
  const currentRound = useGameStore((s) => s.currentRound);

  const visibleObjects = DEMO_SCENE_3D.objects.filter(
    (obj) => obj.visibleFromRound <= currentRound,
  );

  return (
    <group>
      {/* === 地面 === */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#1a1f2e" roughness={0.9} />
      </mesh>

      {/* === 主室地板 === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#1e2433" roughness={0.8} />
      </mesh>

      {/* === 后墙 === */}
      <mesh position={[0, 2, -8]} receiveShadow>
        <boxGeometry args={[16, 4, 0.2]} />
        <meshStandardMaterial color="#252d3f" roughness={0.7} />
      </mesh>

      {/* === 左墙 === */}
      <mesh position={[-8, 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4, 16]} />
        <meshStandardMaterial color="#252d3f" roughness={0.7} />
      </mesh>

      {/* === 右墙 === */}
      <mesh position={[8, 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4, 16]} />
        <meshStandardMaterial color="#252d3f" roughness={0.7} />
      </mesh>

      {/* === 天花板 === */}
      <mesh position={[0, 4, 0]} receiveShadow>
        <boxGeometry args={[16, 0.1, 16]} />
        <meshStandardMaterial color="#1a1f2e" roughness={0.9} />
      </mesh>

      {/* === 隔墙（主室到侧室） === */}
      <mesh position={[5.5, 2, -6]} castShadow>
        <boxGeometry args={[0.2, 4, 4]} />
        <meshStandardMaterial color="#2a3350" roughness={0.7} />
      </mesh>

      {/* === 场景对象 === */}
      {visibleObjects.map((obj) => {
        if (obj.type === "npc" && obj.linkedNpcId) {
          return <NpcActor key={obj.id} obj={obj} />;
        }
        if (obj.type === "evidence" || obj.type === "terminal") {
          return <InteractableObject key={obj.id} obj={obj} />;
        }
        if (obj.type === "decoration") {
          return (
            <mesh
              key={obj.id}
              position={obj.position}
              scale={obj.scale ?? [1, 1, 1]}
              castShadow
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#2a3045" roughness={0.6} />
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
}

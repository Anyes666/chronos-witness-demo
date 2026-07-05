import { useGameStore } from "../../engine/gameStore";
import { DEMO_SCENE_3D } from "../../data/cases/demo_shm_001/scene3d";
import { NpcActor } from "./NpcActor";
import { InteractableObject } from "./InteractableObject";

function ArchiveCabinet({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.15, 2.6, 0.5]} />
        <meshStandardMaterial color="#3a4358" roughness={0.75} metalness={0.15} />
      </mesh>
      {[0.72, 0.18, -0.36, -0.9].map((y) => (
        <mesh key={y} position={[0, y, 0.265]}>
          <boxGeometry args={[0.9, 0.04, 0.025]} />
          <meshStandardMaterial color="#9aa7bd" emissive="#2b3448" emissiveIntensity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function FilePile({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 0.05, 0.1].map((y, index) => (
        <mesh key={y} position={[index * 0.03, y, index * -0.025]} rotation={[0, index * 0.18, 0]} castShadow>
          <boxGeometry args={[0.55, 0.035, 0.38]} />
          <meshStandardMaterial color={index === 1 ? "#d7caa0" : "#aeb7c7"} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Cable({ position, rotation, length }: { position: [number, number, number]; rotation: [number, number, number]; length: number }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <cylinderGeometry args={[0.035, 0.035, length, 10]} />
      <meshStandardMaterial color="#111827" roughness={0.6} metalness={0.2} />
    </mesh>
  );
}

function InvestigationTable() {
  return (
    <group position={[0, 0, -2]}>
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.22, 1.7]} />
        <meshStandardMaterial color="#42506a" roughness={0.62} metalness={0.2} />
      </mesh>
      {[[-1.35, 0.2, -0.65], [1.35, 0.2, -0.65], [-1.35, 0.2, 0.65], [1.35, 0.2, 0.65]].map((pos) => (
        <mesh key={pos.join(":")} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.12, 0.55, 0.12]} />
          <meshStandardMaterial color="#263244" roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.05, 48]} />
        <meshStandardMaterial color="#235a80" emissive="#1d8cff" emissiveIntensity={0.18} roughness={0.35} />
      </mesh>
    </group>
  );
}

function StaticArchiveProps() {
  return (
    <group>
      <ArchiveCabinet position={[-6.7, 1.3, -5.9]} />
      <ArchiveCabinet position={[-5.45, 1.3, -5.9]} />
      <ArchiveCabinet position={[5.6, 1.3, -6.9]} />
      <ArchiveCabinet position={[6.85, 1.3, -6.9]} />

      <InvestigationTable />
      <FilePile position={[-1.2, 0.65, -1.65]} />
      <FilePile position={[2.7, 0.14, -4.2]} />
      <FilePile position={[-6.1, 0.14, 4.5]} />

      <Cable position={[-0.95, 0.08, -2.4]} rotation={[Math.PI / 2, 0, 0.4]} length={2.6} />
      <Cable position={[1.05, 0.08, -2.5]} rotation={[Math.PI / 2, 0, -0.7]} length={2.4} />
      <Cable position={[0.35, 0.08, -0.8]} rotation={[Math.PI / 2, 0, 0.05]} length={1.8} />

      <mesh position={[-2.25, 0.035, -3.35]} rotation={[-Math.PI / 2, 0, 0.25]}>
        <boxGeometry args={[1.2, 0.055, 0.08]} />
        <meshStandardMaterial color="#d1a64a" emissive="#5c3b00" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[2.25, 0.035, -3.35]} rotation={[-Math.PI / 2, 0, -0.25]}>
        <boxGeometry args={[1.2, 0.055, 0.08]} />
        <meshStandardMaterial color="#d1a64a" emissive="#5c3b00" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

export function ArchiveHallScene() {
  const currentRound = useGameStore((s) => s.currentRound);

  const visibleObjects = DEMO_SCENE_3D.objects.filter(
    (obj) => obj.visibleFromRound <= currentRound,
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#263247" roughness={0.86} />
      </mesh>
      <gridHelper args={[20, 20, "#516176", "#303b4e"]} position={[0, 0.005, 0]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1]} receiveShadow>
        <planeGeometry args={[15.5, 14]} />
        <meshStandardMaterial color="#2d3850" roughness={0.82} />
      </mesh>

      <mesh position={[0, 2, -8]} receiveShadow>
        <boxGeometry args={[16, 4, 0.28]} />
        <meshStandardMaterial color="#3a465e" roughness={0.72} />
      </mesh>
      <mesh position={[-8, 2, 0]} receiveShadow>
        <boxGeometry args={[0.28, 4, 16]} />
        <meshStandardMaterial color="#344057" roughness={0.72} />
      </mesh>
      <mesh position={[8, 2, 0]} receiveShadow>
        <boxGeometry args={[0.28, 4, 16]} />
        <meshStandardMaterial color="#344057" roughness={0.72} />
      </mesh>
      <mesh position={[0, 4, 0]} receiveShadow>
        <boxGeometry args={[16, 0.1, 16]} />
        <meshStandardMaterial color="#243047" roughness={0.9} />
      </mesh>

      <mesh position={[5.5, 2, -5.9]} castShadow receiveShadow>
        <boxGeometry args={[0.24, 4, 4.2]} />
        <meshStandardMaterial color="#41506a" roughness={0.72} />
      </mesh>
      <mesh position={[6.85, 2.05, -3.75]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.1, 0.22]} />
        <meshStandardMaterial color="#6f86b8" emissive="#243b63" emissiveIntensity={0.15} />
      </mesh>

      <StaticArchiveProps />

      {visibleObjects.map((obj) => {
        if (obj.type === "npc" && obj.linkedNpcId) {
          return <NpcActor key={obj.id} obj={obj} />;
        }
        if (obj.type === "evidence" || obj.type === "terminal") {
          return <InteractableObject key={obj.id} obj={obj} />;
        }
        if (obj.type === "decoration") {
          return null;
        }
        return null;
      })}
    </group>
  );
}

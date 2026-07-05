// src/components/three/ThirdPersonController.tsx
// 第三人称 WASD + 鼠标 + E 交互控制器
import { useState, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { DEMO_SCENE_3D } from "../../data/cases/demo_shm_001/scene3d";
import { getClosestInteractable } from "../../engine/interactionEngine";
import { useGameStore } from "../../engine/gameStore";
import * as THREE from "three";
import type { PlayerPosition } from "../../engine/interactionEngine";

// 全局 ref 供外部读取玩家位置
export const playerPositionRef: { current: PlayerPosition } = {
  current: { x: 0, y: 1.6, z: 8 },
};

// 全局事件：外部可设置是否锁定（overlay 打开时解锁）
export const controllerEvents = {
  unlock: () => {},
  lock: () => {},
};

interface ThirdPersonControllerProps {
  onInteract?: (target: ReturnType<typeof getClosestInteractable>) => void;
}

export function ThirdPersonController({ onInteract }: ThirdPersonControllerProps) {
  const { camera, gl } = useThree();
  const playerPos = useRef(new THREE.Vector3(...DEMO_SCENE_3D.spawnPoint));
  const [locked, setLocked] = useState(false);
  const keys = useRef<Set<string>>(new Set());
  const ePressed = useRef(false);

  const moveSpeed = 5;
  const currentRound = useGameStore((s) => s.currentRound);

  // 暴露 unlock/lock
  useEffect(() => {
    controllerEvents.unlock = () => {
      if (typeof document !== "undefined") {
        document.exitPointerLock();
      }
      setLocked(false);
    };
    controllerEvents.lock = () => {
      if (typeof document !== "undefined") {
        gl.domElement.requestPointerLock();
      }
    };
  }, [gl]);

  // 同步全局位置
  useFrame(() => {
    playerPositionRef.current = {
      x: playerPos.current.x,
      y: playerPos.current.y,
      z: playerPos.current.z,
    };
  });

  // 键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase());
      if (e.key.toLowerCase() === "e") ePressed.current = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key.toLowerCase());
      if (e.key.toLowerCase() === "e") ePressed.current = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // E 键交互检测
  useEffect(() => {
    if (!onInteract) return;
    const interval = setInterval(() => {
      if (ePressed.current) {
        ePressed.current = false;
        const pos: PlayerPosition = {
          x: playerPos.current.x,
          y: playerPos.current.y,
          z: playerPos.current.z,
        };
        const target = getClosestInteractable(
          pos,
          DEMO_SCENE_3D.objects,
          currentRound as 0 | 1 | 2 | 3,
        );
        if (target) {
          onInteract(target);
        }
      }
    }, 200);
    return () => clearInterval(interval);
  }, [onInteract, currentRound]);

  useFrame((_, delta) => {
    if (!locked) return;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3()
      .crossVectors(forward, new THREE.Vector3(0, 1, 0))
      .normalize();

    const direction = new THREE.Vector3();
    if (keys.current.has("w")) direction.add(forward);
    if (keys.current.has("s")) direction.sub(forward);
    if (keys.current.has("a")) direction.sub(right);
    if (keys.current.has("d")) direction.add(right);

    if (direction.length() > 0) {
      direction.normalize();
      playerPos.current.addScaledVector(direction, moveSpeed * delta);
    }

    // 边界限制
    const b = DEMO_SCENE_3D.bounds;
    playerPos.current.x = Math.max(b.minX, Math.min(b.maxX, playerPos.current.x));
    playerPos.current.z = Math.max(b.minZ, Math.min(b.maxZ, playerPos.current.z));
    playerPos.current.y = 1.6;

    camera.position.copy(playerPos.current);
  });

  return (
    <>
      <PointerLockControls
        onLock={() => setLocked(true)}
        onUnlock={() => setLocked(false)}
      />
      {!locked && (
        <mesh
          position={[camera.position.x, camera.position.y - 0.5, camera.position.z - 1]}
          onClick={() => {
            gl.domElement.requestPointerLock();
          }}
        >
          <planeGeometry args={[5, 2.5]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.5} />
        </mesh>
      )}
    </>
  );
}

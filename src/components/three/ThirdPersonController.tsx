// src/components/three/ThirdPersonController.tsx
// 第三人称 WASD 移动 + 鼠标视角控制器
import { useState, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { DEMO_SCENE_3D } from "../../data/cases/demo_shm_001/scene3d";
import * as THREE from "three";

export function ThirdPersonController() {
  const { camera } = useThree();
  const playerPos = useRef(new THREE.Vector3(...DEMO_SCENE_3D.spawnPoint));
  const [locked, setLocked] = useState(false);
  const keys = useRef<Set<string>>(new Set());

  const moveSpeed = 5;

  // 键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const handleKeyUp = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

  useFrame((_, delta) => {
    if (!locked) return;

    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

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
            document.body.requestPointerLock();
          }}
        >
          <planeGeometry args={[4, 2]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} />
        </mesh>
      )}
    </>
  );
}

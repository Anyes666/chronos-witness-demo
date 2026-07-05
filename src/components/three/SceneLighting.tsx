// src/components/three/SceneLighting.tsx

export function SceneLighting() {
  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.3} color="#3b4a6b" />
      {/* 主方向光 — 冷蓝 */}
      <directionalLight
        position={[5, 10, 0]}
        intensity={0.6}
        color="#a0c4ff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* 补光 — 暖金 */}
      <pointLight position={[-3, 3, -4]} intensity={0.4} color="#c9a44b" />
      {/* 读取器蓝光 */}
      <pointLight position={[0, 1.5, -2]} intensity={0.5} color="#4da6ff" />
    </>
  );
}

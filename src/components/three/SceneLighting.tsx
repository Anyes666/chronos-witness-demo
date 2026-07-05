export function SceneLighting() {
  return (
    <>
      <hemisphereLight args={["#9cc7ff", "#1e293b", 0.8]} />
      <ambientLight intensity={0.55} color="#6f86b8" />

      <directionalLight
        position={[4, 9, 5]}
        intensity={1.45}
        color="#c7dcff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <pointLight position={[0, 2.3, -2]} intensity={2.1} color="#4da6ff" distance={9} />
      <pointLight position={[-4, 2.2, -5]} intensity={0.9} color="#d1a64a" distance={6} />
      <pointLight position={[1.6, 1.3, -1.4]} intensity={0.55} color="#d1a64a" distance={4} />
      <pointLight position={[-6, 2.5, 3]} intensity={0.55} color="#9cc7ff" distance={5} />
      <pointLight position={[5, 2.5, -4]} intensity={0.65} color="#9cc7ff" distance={5} />
      <pointLight position={[6, 2.5, -7]} intensity={0.65} color="#9ff5d0" distance={5} />
    </>
  );
}

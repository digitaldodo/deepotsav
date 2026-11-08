import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Decorations: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);

  // 120 Floating golden firefly motes / festive dust particles
  const particleCount = 120;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = 0.5 + Math.random() * 8;
      pos[i * 3 + 2] = -12 + Math.random() * 52;
    }
    return pos;
  }, []);

  useFrame(state => {
    if (!particlesRef.current) return;
    const time = state.clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      positions[idx + 1] += Math.sin(time + i) * 0.003;
      positions[idx] += Math.cos(time * 0.6 + i) * 0.002;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Night Sky Stars Dome */}
      <mesh position={[0, 15, 10]}>
        <sphereGeometry args={[75, 24, 24]} />
        <meshBasicMaterial color="#0A0B1A" side={THREE.BackSide} />
      </mesh>

      {/* Floating Golden Fireflies / Motes */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.065} color="#FFD700" transparent opacity={0.75} />
      </points>

      {/* ==============================================================
          WARM ILLUMINATION SYSTEM — ENSURES VIBRANT VISIBILITY ON ALL SCREENS
          ============================================================== */}
      <ambientLight intensity={1.1} color="#FFF1DB" />
      <directionalLight position={[15, 30, 20]} intensity={0.85} color="#FFE6AA" />
      <hemisphereLight args={['#FFE4B5', '#2B1810', 0.8]} />
    </group>
  );
};

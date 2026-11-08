import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Decorations: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);

  // 140 Floating golden firefly motes / festive dust particles
  const particleCount = 140;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 55;
      pos[i * 3 + 1] = 0.6 + Math.random() * 8.5;
      pos[i * 3 + 2] = -12 + Math.random() * 54;
    }
    return pos;
  }, []);

  useFrame(state => {
    if (!particlesRef.current) return;
    const time = state.clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      positions[idx + 1] += Math.sin(time * 0.9 + i) * 0.0035;
      positions[idx] += Math.cos(time * 0.5 + i) * 0.0025;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* ==============================================================
          1. FESTIVE DIWALI NIGHT SKY DOME & CRESCENT MOON
          ============================================================== */}
      {/* Deep Royal Midnight Blue Sky Dome */}
      <mesh position={[0, 20, 15]}>
        <sphereGeometry args={[85, 32, 32]} />
        <meshBasicMaterial color="#0C1024" side={THREE.BackSide} />
      </mesh>

      {/* Auspicious Golden Diwali Crescent Moon in the Night Sky */}
      <group position={[28, 42, -15]} rotation={[0, -0.6, 0.4]}>
        <mesh>
          <sphereGeometry args={[2.8, 24, 24]} />
          <meshBasicMaterial color="#FFF2D6" />
        </mesh>
        <mesh position={[-0.9, 0.2, 0.6]}>
          <sphereGeometry args={[2.7, 24, 24]} />
          <meshBasicMaterial color="#0C1024" />
        </mesh>
        <pointLight color="#FFEBD0" intensity={0.8} distance={60} decay={2} />
      </group>

      {/* Floating Golden Fireflies / Festive Dust Motes */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.075} color="#FFD700" transparent opacity={0.85} />
      </points>

      {/* ==============================================================
          2. WARM BALANCED FESTIVE ILLUMINATION SYSTEM
          ============================================================== */}
      {/* Rich Amber Ambient Light (Guarantees zero pitch-black dead zones) */}
      <ambientLight intensity={1.3} color="#FFE6C7" />

      {/* Directional Soft Golden Moonlight Casting Architectural Highlights */}
      <directionalLight
        position={[25, 38, 24]}
        intensity={1.1}
        color="#FFF2DC"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Warm Terracotta-to-Golden Sky Hemisphere Fill */}
      <hemisphereLight args={['#FFE4C4', '#422213', 0.95]} />
    </group>
  );
};

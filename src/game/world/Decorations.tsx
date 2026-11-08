import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Decorations: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);

  // Generate 150 glowing floating festive particles (golden fireflies / diya motes)
  const [particlePositions, particleSpeeds] = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = 0.5 + Math.random() * 7;
      positions[i * 3 + 2] = -12 + Math.random() * 52;
      speeds[i] = 0.2 + Math.random() * 0.5;
    }
    return [positions, speeds];
  }, []);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < 150; i++) {
      // Gentle floating upward & sinusoidal sway
      pos[i * 3 + 1] += particleSpeeds[i] * delta * 0.4;
      pos[i * 3] += Math.sin(Date.now() * 0.001 + i) * delta * 0.15;

      // Wrap around if too high
      if (pos[i * 3 + 1] > 8) {
        pos[i * 3 + 1] = 0.5;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Night Sky Stars Dome */}
      <mesh position={[0, 15, 10]}>
        <sphereGeometry args={[75, 24, 24]} />
        <meshBasicMaterial color="#030511" side={THREE.BackSide} />
      </mesh>

      {/* Floating Golden Fireflies / Motes */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#FFD700" transparent opacity={0.7} />
      </points>

      {/* Ambient Night Lights */}
      <ambientLight intensity={0.28} color="#1A1C30" />
      <directionalLight position={[10, 25, 15]} intensity={0.22} color="#8DA9C4" />
      {/* Warm Ground Bounce Light */}
      <hemisphereLight args={['#2A1B4E', '#160F29', 0.25]} />
    </group>
  );
};

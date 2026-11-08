import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

interface FireworkBurst {
  id: number;
  center: THREE.Vector3;
  color: THREE.Color;
  particles: Float32Array;
  velocities: Float32Array;
  life: number;
  maxLife: number;
}

export const FireworksDisplay: React.FC = () => {
  const { playerPosition, setActivePrompt, fireworksLaunchCount, triggerFirework } = useGameState();
  const burstsRef = useRef<FireworkBurst[]>([]);
  const pointsRef = useRef<THREE.Points>(null);
  const flashLightRef = useRef<THREE.PointLight>(null);

  const burstColors = [
    new THREE.Color('#FFD700'), // Gold
    new THREE.Color('#FF4500'), // Saffron / Orange
    new THREE.Color('#E63946'), // Crimson Red
    new THREE.Color('#9D4EDD'), // Royal Purple
    new THREE.Color('#00E5FF'), // Turquoise Blue
    new THREE.Color('#22C55E'), // Emerald Green
  ];

  // Function to create a burst in 3D sky
  const spawnBurst = (pos?: THREE.Vector3) => {
    audioManager.playFirework();

    const center = pos || new THREE.Vector3(
      (Math.random() - 0.5) * 50,
      22 + Math.random() * 14,
      Math.random() * 40 + 10
    );

    const count = 70;
    const particles = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const color = burstColors[Math.floor(Math.random() * burstColors.length)];

    for (let i = 0; i < count; i++) {
      particles[i * 3] = center.x;
      particles[i * 3 + 1] = center.y;
      particles[i * 3 + 2] = center.z;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 4 + Math.random() * 6;

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;
    }

    burstsRef.current.push({
      id: Math.random(),
      center,
      color,
      particles,
      velocities,
      life: 0,
      maxLife: 1.8,
    });

    if (flashLightRef.current) {
      flashLightRef.current.position.copy(center);
      flashLightRef.current.color = color;
      flashLightRef.current.intensity = 4.0;
    }
  };

  // Periodic ambient distant fireworks in night sky (every 4-7 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      spawnBurst();
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // When state triggerFirework occurs, launch immediate burst
  const prevCount = useRef(fireworksLaunchCount);
  useEffect(() => {
    if (fireworksLaunchCount > prevCount.current) {
      prevCount.current = fireworksLaunchCount;
      // Launch 3 consecutive bursts for grand show
      spawnBurst(new THREE.Vector3(0, 24, 34));
      setTimeout(() => spawnBurst(new THREE.Vector3(-10, 28, 30)), 300);
      setTimeout(() => spawnBurst(new THREE.Vector3(10, 26, 38)), 600);
    }
  }, [fireworksLaunchCount]);

  // Proximity check in park near fireworks launch box at [ 0, 0, 36 ]
  useFrame((_, delta) => {
    const dist = Math.hypot(playerPosition[0] - 0, playerPosition[2] - 36);
    if (dist < 3.0) {
      setActivePrompt({
        id: 'launch-fireworks',
        label: 'Ignite Grand Fireworks Show 🎆',
        subtext: 'Press [E] or Tap for Sky Celebration',
        action: () => {
          triggerFirework();
        },
      });
    }

    // Decay sky flash light
    if (flashLightRef.current && flashLightRef.current.intensity > 0) {
      flashLightRef.current.intensity = Math.max(0, flashLightRef.current.intensity - delta * 4);
    }

    // Update active particle bursts
    burstsRef.current.forEach(burst => {
      burst.life += delta;
      const count = burst.particles.length / 3;
      for (let i = 0; i < count; i++) {
        burst.particles[i * 3] += burst.velocities[i * 3] * delta;
        burst.particles[i * 3 + 1] += burst.velocities[i * 3 + 1] * delta;
        burst.particles[i * 3 + 2] += burst.velocities[i * 3 + 2] * delta;
        // Gravity
        burst.velocities[i * 3 + 1] -= 3.2 * delta;
      }
    });

    // Remove finished bursts
    burstsRef.current = burstsRef.current.filter(b => b.life < b.maxLife);

    // Update Points geometry buffer if there are active bursts
    if (pointsRef.current) {
      const allPositions = burstsRef.current.flatMap(b => Array.from(b.particles));
      if (allPositions.length > 0) {
        pointsRef.current.geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(allPositions, 3)
        );
        pointsRef.current.visible = true;
      } else {
        pointsRef.current.visible = false;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Fireworks Launcher Pad Box in Park Grounds at [0, 0, 36] */}
      <group position={[0, 0, 36]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.8, 0.4, 0.8]} />
          <meshStandardMaterial color="#2B2D42" roughness={0.6} />
        </mesh>
        {/* Launcher Mortar Tubes */}
        {[-0.2, 0, 0.2].map((x, i) =>
          [-0.2, 0, 0.2].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.45, z]}>
              <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
              <meshStandardMaterial color="#111111" metalness={0.7} />
            </mesh>
          ))
        )}
        <mesh position={[0, 0.8, 0]}>
          <octahedronGeometry args={[0.1, 0]} />
          <meshBasicMaterial color="#FF4500" />
        </mesh>
      </group>

      {/* Sky Flash Point Light */}
      <pointLight ref={flashLightRef} intensity={0} distance={90} decay={1.5} />

      {/* Sky Fireworks Points Cloud */}
      <points ref={pointsRef}>
        <bufferGeometry />
        <pointsMaterial size={0.35} color="#FFD700" transparent opacity={0.9} />
      </points>
    </group>
  );
};

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

export const SparklerStation: React.FC = () => {
  const { camera } = useThree();
  const {
    playerPosition,
    setActivePrompt,
    sparklerHolding,
    sparklerIgnited,
    pickupSparkler,
    igniteSparkler,
    dropSparkler,
    addSparklerTrailPoint,
    updateSparklerTrails,
    sparklerTrails,
  } = useGameState();

  const sparkParticlesRef = useRef<THREE.Points>(null);

  // Spark shower particle count
  const sparkCount = 60;
  const { sparkPositions, sparkVelocities } = useMemo(() => {
    const pos = new Float32Array(sparkCount * 3);
    const vel = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;

      vel[i * 3] = (Math.random() - 0.5) * 1.8;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
    }
    return { sparkPositions: pos, sparkVelocities: vel };
  }, []);

  // Proximity check to sparkler station at [ 0, 0, 31 ]
  useFrame((_, delta) => {
    updateSparklerTrails(delta);

    const distToStation = Math.hypot(playerPosition[0] - 0, playerPosition[2] - 31);

    if (distToStation < 2.5) {
      if (!sparklerHolding) {
        setActivePrompt({
          id: 'pickup-sparkler',
          label: 'Pick up Phuljhadi (Sparkler) ✨',
          subtext: 'Press [E] or Tap to take in hand',
          action: () => {
            audioManager.playDiyaLight();
            pickupSparkler();
          },
        });
      } else if (!sparklerIgnited) {
        setActivePrompt({
          id: 'ignite-sparkler',
          label: 'Ignite Sparkler! 💥',
          subtext: 'Press [E] or Tap to light',
          action: () => {
            audioManager.startSparklerLoop();
            igniteSparkler();
          },
        });
      } else {
        setActivePrompt({
          id: 'drop-sparkler',
          label: 'Put Down Sparkler (Draw in Air) 🪄',
          subtext: 'Press [E] or Tap to finish',
          action: () => {
            audioManager.stopSparklerLoop();
            dropSparkler();
          },
        });
      }
    }

    // When holding ignited sparkler, record tip trail in 3D world space
    if (sparklerHolding && sparklerIgnited) {
      // Hand sparkler tip in front of camera
      const tipOffset = new THREE.Vector3(0.24, -0.15, -0.7).applyQuaternion(camera.quaternion);
      const tipWorldPos = camera.position.clone().add(tipOffset);

      addSparklerTrailPoint({
        x: tipWorldPos.x,
        y: tipWorldPos.y,
        z: tipWorldPos.z,
        color: '#FFD700',
      });

      // Update particle spark shower
      if (sparkParticlesRef.current) {
        sparkParticlesRef.current.position.copy(tipWorldPos);
        const positions = sparkParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < sparkCount; i++) {
          positions[i * 3] += sparkVelocities[i * 3] * delta;
          positions[i * 3 + 1] += sparkVelocities[i * 3 + 1] * delta;
          positions[i * 3 + 2] += sparkVelocities[i * 3 + 2] * delta;

          // Reset particle to center
          if (Math.hypot(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]) > 0.35) {
            positions[i * 3] = (Math.random() - 0.5) * 0.04;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
          }
        }
        sparkParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Wooden Sparkler Stand Table in Community Park at [0, 0, 31] */}
      <group position={[0, 0, 31]}>
        {/* Table Top */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.08, 0.9]} />
          <meshStandardMaterial color="#4A2511" roughness={0.6} />
        </mesh>
        {/* Table Legs */}
        {[-0.65, 0.65].map((x, i) =>
          [-0.32, 0.32].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.37, z]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.74, 8]} />
              <meshStandardMaterial color="#2E170A" roughness={0.7} />
            </mesh>
          ))
        )}

        {/* Traditional Diwali Sparkler Box */}
        <group position={[-0.35, 0.85, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.12, 0.5]} />
            <meshStandardMaterial color="#D90429" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.065, 0]}>
            <planeGeometry args={[0.26, 0.44]} />
            <meshStandardMaterial color="#FFD700" roughness={0.3} />
          </mesh>
        </group>

        {/* Bundle of Metallic Sparkler Sticks Standing in a Brass Pot */}
        <group position={[0.35, 0.79, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.08, 0.2, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
          {[-0.04, 0, 0.04].map((ox, i) => (
            <mesh key={i} position={[ox, 0.22, (i - 1) * 0.03]} rotation={[0.1 * i, 0, 0.08 * i]}>
              <cylinderGeometry args={[0.005, 0.005, 0.45, 6]} />
              <meshStandardMaterial color="#888888" metalness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Signboard */}
        <mesh position={[0, 1.25, -0.38]}>
          <boxGeometry args={[1.2, 0.25, 0.04]} />
          <meshStandardMaterial color="#FFB703" roughness={0.5} />
        </mesh>
      </group>

      {/* Spark shower particle emitter when ignited */}
      {sparklerHolding && sparklerIgnited && (
        <points ref={sparkParticlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[sparkPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial size={0.03} color="#FFFFFF" transparent opacity={0.95} />
        </points>
      )}

      {/* 3D Glowing Spark Trails drawn in the air */}
      {sparklerTrails.map((pt, idx) => (
        <mesh key={idx} position={[pt.x, pt.y, pt.z]}>
          <sphereGeometry args={[0.025 * pt.life, 6, 6]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={pt.life} />
        </mesh>
      ))}
    </group>
  );
};

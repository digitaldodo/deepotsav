import React, { useRef } from 'react';
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
    sparklerBurnTime,
  } = useGameState();

  const sparklerStickRef = useRef<THREE.Group>(null);
  const sparkParticlesRef = useRef<THREE.Points>(null);

  // Proximity check to sparkler station at [ 0, 0, 31 ]
  useFrame((_, delta) => {
    updateSparklerTrails(delta);

    const distToStation = Math.hypot(playerPosition[0] - 0, playerPosition[2] - 31);

    if (distToStation < 2.5) {
      if (!sparklerHolding) {
        setActivePrompt({
          id: 'pickup-sparkler',
          label: 'Pick up Phuljhadi (Sparkler) ✨',
          subtext: 'Press [E] or Tap',
          action: () => {
            audioManager.playDiyaLight();
            pickupSparkler();
          },
        });
      } else if (!sparklerIgnited) {
        setActivePrompt({
          id: 'ignite-sparkler',
          label: 'Ignite Sparkler! 💥',
          subtext: 'Press [E] or Tap to Light',
          action: () => {
            audioManager.startSparklerLoop();
            igniteSparkler();
          },
        });
      } else {
        setActivePrompt({
          id: 'drop-sparkler',
          label: 'Put Down Sparkler (Draw in air) 🪄',
          subtext: 'Press [E] or Tap',
          action: () => {
            audioManager.stopSparklerLoop();
            dropSparkler();
          },
        });
      }
    }

    // If holding sparkler, position the sparkler stick right in front of the camera in first-person!
    if (sparklerHolding && sparklerStickRef.current) {
      // Calculate position ~0.4m right, -0.3m down, and 0.7m in front of camera
      const offset = new THREE.Vector3(0.3, -0.25, -0.65).applyQuaternion(camera.quaternion);
      sparklerStickRef.current.position.copy(camera.position).add(offset);
      sparklerStickRef.current.quaternion.copy(camera.quaternion);

      // If ignited, add glowing trail point at tip
      if (sparklerIgnited) {
        const tipOffset = new THREE.Vector3(0, 0.25, 0).applyQuaternion(camera.quaternion);
        const tipPos = sparklerStickRef.current.position.clone().add(tipOffset);
        addSparklerTrailPoint({
          x: tipPos.x,
          y: tipPos.y,
          z: tipPos.z,
          color: '#FFD700',
        });
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Wooden Sparkler Table in Community Park at [0, 0, 31] */}
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

        {/* Traditional Diwali Sparkler Box (Murga Brand / Peacock Brand Box) */}
        <group position={[-0.35, 0.85, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.12, 0.5]} />
            <meshStandardMaterial color="#D90429" roughness={0.4} />
          </mesh>
          {/* Label print on box */}
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
          {/* Several sparkler wire stems standing */}
          {[-0.04, 0, 0.04].map((ox, i) => (
            <mesh key={i} position={[ox, 0.22, (i - 1) * 0.03]} rotation={[0.1 * i, 0, 0.08 * i]}>
              <cylinderGeometry args={[0.005, 0.005, 0.45, 6]} />
              <meshStandardMaterial color="#888888" metalness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Signboard: "SPARKLER STATION" */}
        <mesh position={[0, 1.25, -0.38]}>
          <boxGeometry args={[1.2, 0.25, 0.04]} />
          <meshStandardMaterial color="#FFB703" roughness={0.5} />
        </mesh>
      </group>

      {/* First-Person Handheld Sparkler Model (attached near camera when holding) */}
      {sparklerHolding && (
        <group ref={sparklerStickRef}>
          {/* Wire Stem */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.006, 0.006, 0.55, 8]} />
            <meshStandardMaterial color="#B0B0B0" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Grey Pyrotechnic Powder Chemical Coating */}
          <mesh position={[0.07, 0.12, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.014, 0.014, 0.35, 8]} />
            <meshStandardMaterial color="#4A4A4A" roughness={0.9} />
          </mesh>

          {/* Sparkler Flame & Dynamic Sparks Emitter */}
          {sparklerIgnited && (
            <group position={[0.16, 0.26, 0]}>
              {/* Glowing Core */}
              <mesh>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              {/* Point Light illuminating player hand & surroundings */}
              <pointLight color="#FFD700" intensity={2.5} distance={4.5} decay={2} />

              {/* Sparks Particles Sprayed outward */}
              <points ref={sparkParticlesRef}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[
                      new Float32Array(
                        [...Array(30)].flatMap(() => [
                          (Math.random() - 0.5) * 0.4,
                          (Math.random() - 0.5) * 0.4,
                          (Math.random() - 0.5) * 0.4,
                        ])
                      ),
                      3,
                    ]}
                  />
                </bufferGeometry>
                <pointsMaterial size={0.03} color="#FFA500" transparent opacity={0.9} />
              </points>
            </group>
          )}
        </group>
      )}

      {/* Render 3D Glowing Spark Trails drawn in air */}
      {sparklerTrails.length > 1 && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(sparklerTrails.flatMap(p => [p.x, p.y, p.z])),
                3,
              ]}
            />
          </bufferGeometry>
          <pointsMaterial size={0.045} color="#FFD700" transparent opacity={0.8} />
        </points>
      )}
    </group>
  );
};

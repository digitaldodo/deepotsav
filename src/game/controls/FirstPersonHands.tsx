import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState, SweetType } from '../state/useGameState';

export const FirstPersonHands: React.FC = () => {
  const { camera } = useThree();
  const {
    handItem,
    handAnim,
    heldSweetType,
    heldPowderColor,
    sparklerIgnited,
  } = useGameState();

  const containerRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const sprinkleParticlesRef = useRef<THREE.Points>(null);

  // Position and target transforms for animation lerping
  const targetPos = useRef(new THREE.Vector3(0.24, -0.22, -0.48));
  const targetRot = useRef(new THREE.Euler(-0.15, 0.2, -0.1));
  const currentPos = useRef(new THREE.Vector3(0.24, -0.45, -0.48));
  const currentRot = useRef(new THREE.Euler(-0.15, 0.2, -0.1));

  // Particle positions for powder sprinkling effect
  const powderParticleCount = 45;
  const { powderPositions, powderVelocities } = useMemo(() => {
    const pos = new Float32Array(powderParticleCount * 3);
    const vel = new Float32Array(powderParticleCount * 3);
    for (let i = 0; i < powderParticleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.05;
      pos[i * 3 + 1] = -Math.random() * 0.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.05;

      vel[i * 3] = (Math.random() - 0.5) * 0.05;
      vel[i * 3 + 1] = -0.4 - Math.random() * 0.6;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    return { powderPositions: pos, powderVelocities: vel };
  }, []);

  useFrame((state, delta) => {
    if (!containerRef.current || !armRef.current) return;

    // Fast tracking of camera orientation & position
    containerRef.current.position.copy(camera.position);
    containerRef.current.quaternion.copy(camera.quaternion);

    const time = state.clock.getElapsedTime();

    // Natural breathing / idle sway
    const breatheY = Math.sin(time * 2.2) * 0.006;
    const breatheX = Math.cos(time * 1.5) * 0.004;

    // Define target position based on hand animation state
    switch (handAnim) {
      case 'idle':
        // If not holding anything, drop arm lower down off-screen
        if (handItem === 'none') {
          targetPos.current.set(0.32, -0.48, -0.45);
          targetRot.current.set(-0.4, 0.2, -0.1);
        } else {
          targetPos.current.set(0.24, -0.25 + breatheY, -0.46 + breatheX);
          targetRot.current.set(-0.2, 0.15, -0.05);
        }
        break;

      case 'holding':
        // Presenting held object clearly into viewport
        targetPos.current.set(0.22 + breatheX, -0.18 + breatheY, -0.44);
        targetRot.current.set(-0.15, 0.1, -0.05);
        break;

      case 'eating': {
        // Bring sweet towards mouth / camera
        const eatProgress = (Math.sin(time * 12) + 1) * 0.5;
        targetPos.current.set(0.04, -0.04 + eatProgress * 0.03, -0.28);
        targetRot.current.set(0.35, -0.15, 0.2);
        break;
      }

      case 'sprinkling': {
        // Oscillating sprinkle gesture over rangoli
        const sprinkleShake = Math.sin(time * 28) * 0.025;
        targetPos.current.set(0.18 + sprinkleShake, -0.22, -0.46);
        targetRot.current.set(0.4, 0.0, 0.25 + Math.cos(time * 28) * 0.08);
        break;
      }

      case 'lighting':
        // Reaching forward towards diya wick
        targetPos.current.set(0.12, -0.12, -0.62);
        targetRot.current.set(0.1, 0.05, 0.0);
        break;

      case 'ringing_bell': {
        // Striking forward to push the bell
        const strike = Math.sin(time * 16) * 0.08;
        targetPos.current.set(0.1, -0.05, -0.58 + strike);
        targetRot.current.set(0.25, 0.0, 0.1);
        break;
      }
    }

    // Smooth lerp to target
    currentPos.current.lerp(targetPos.current, Math.min(delta * 12, 1));
    armRef.current.position.copy(currentPos.current);

    armRef.current.rotation.x = THREE.MathUtils.lerp(armRef.current.rotation.x, targetRot.current.x, delta * 12);
    armRef.current.rotation.y = THREE.MathUtils.lerp(armRef.current.rotation.y, targetRot.current.y, delta * 12);
    armRef.current.rotation.z = THREE.MathUtils.lerp(armRef.current.rotation.z, targetRot.current.z, delta * 12);

    // Update powder sprinkling particles
    if (handAnim === 'sprinkling' && sprinkleParticlesRef.current) {
      const positions = sprinkleParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < powderParticleCount; i++) {
        positions[i * 3 + 1] += powderVelocities[i * 3 + 1] * delta;
        // Reset when fallen too low
        if (positions[i * 3 + 1] < -0.8) {
          positions[i * 3] = (Math.random() - 0.5) * 0.06;
          positions[i * 3 + 1] = -0.05;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
        }
      }
      sprinkleParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={containerRef}>
      <group ref={armRef}>
        {/* Forearm */}
        <mesh position={[0.06, -0.18, 0.18]} rotation={[0.45, -0.15, 0.2]}>
          <cylinderGeometry args={[0.042, 0.056, 0.38, 12]} />
          <meshStandardMaterial color="#BD7B4D" roughness={0.65} />
        </mesh>

        {/* Traditional Auspicious Gold Kada / Bangle at Wrist */}
        <mesh position={[0.038, -0.07, 0.08]} rotation={[0.45, -0.15, 0.2]}>
          <torusGeometry args={[0.054, 0.012, 10, 24]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Palm */}
        <mesh position={[0.02, 0, 0]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.068, 0.032, 0.085]} />
          <meshStandardMaterial color="#BD7B4D" roughness={0.65} />
        </mesh>

        {/* Fingers curved */}
        <mesh position={[0.02, 0.015, -0.055]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.062, 0.025, 0.05]} />
          <meshStandardMaterial color="#BD7B4D" roughness={0.65} />
        </mesh>

        {/* Thumb */}
        <mesh position={[-0.03, 0.01, -0.02]} rotation={[0.2, 0.4, -0.3]}>
          <boxGeometry args={[0.025, 0.022, 0.048]} />
          <meshStandardMaterial color="#BD7B4D" roughness={0.65} />
        </mesh>

        {/* ==============================================================
            HELD ITEM: SWEET
            ============================================================== */}
        {handItem === 'sweet' && heldSweetType && (
          <group position={[0, 0.035, -0.06]}>
            {heldSweetType === 'laddoo' && (
              <mesh castShadow>
                <sphereGeometry args={[0.034, 16, 16]} />
                <meshStandardMaterial color="#FFB300" roughness={0.7} />
              </mesh>
            )}
            {heldSweetType === 'kajuKatli' && (
              <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
                <boxGeometry args={[0.042, 0.016, 0.042]} />
                <meshStandardMaterial color="#E8E8E8" metalness={0.6} roughness={0.25} />
              </mesh>
            )}
            {heldSweetType === 'gulabJamun' && (
              <mesh castShadow>
                <sphereGeometry args={[0.032, 16, 16]} />
                <meshStandardMaterial color="#4A1806" roughness={0.3} metalness={0.1} />
              </mesh>
            )}
            {heldSweetType === 'barfi' && (
              <mesh castShadow>
                <boxGeometry args={[0.036, 0.022, 0.036]} />
                <meshStandardMaterial color="#2E7D32" roughness={0.5} />
              </mesh>
            )}
            {heldSweetType === 'modak' && (
              <mesh rotation={[0, 0, 0]} castShadow>
                <coneGeometry args={[0.028, 0.05, 12]} />
                <meshStandardMaterial color="#FFF8E7" roughness={0.4} />
              </mesh>
            )}
          </group>
        )}

        {/* ==============================================================
            HELD ITEM: RANGOLI POWDER (BRASS KATORI + COLORED POWDER)
            ============================================================== */}
        {handItem === 'powder' && (
          <group position={[-0.01, 0.03, -0.06]}>
            {/* Miniature Brass Katori */}
            <mesh>
              <cylinderGeometry args={[0.042, 0.028, 0.028, 16]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Mounded Colored Powder */}
            <mesh position={[0, 0.012, 0]}>
              <coneGeometry args={[0.038, 0.025, 16]} />
              <meshStandardMaterial color={heldPowderColor || '#FFC107'} roughness={0.9} />
            </mesh>

            {/* Sprinkling Particle Stream */}
            {handAnim === 'sprinkling' && (
              <points ref={sprinkleParticlesRef}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[powderPositions, 3]}
                  />
                </bufferGeometry>
                <pointsMaterial
                  size={0.018}
                  color={heldPowderColor || '#FFC107'}
                  transparent
                  opacity={0.85}
                />
              </points>
            )}
          </group>
        )}

        {/* ==============================================================
            HELD ITEM: BRASS DIYA LIGHTING STICK (Deepak Shalaaka)
            ============================================================== */}
        {handItem === 'diya_stick' && (
          <group position={[0, 0.02, -0.08]} rotation={[0.3, 0, 0]}>
            {/* Long carved brass wand */}
            <mesh position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.006, 0.008, 0.32, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Glowing flame at tip */}
            <group position={[0, 0, -0.32]}>
              <mesh>
                <sphereGeometry args={[0.022, 8, 8]} />
                <meshBasicMaterial color="#FF5722" />
              </mesh>
              <mesh position={[0, 0.015, 0]}>
                <coneGeometry args={[0.014, 0.035, 8]} />
                <meshBasicMaterial color="#FFEB3B" />
              </mesh>
              <pointLight color="#FFA500" intensity={1.8} distance={2.5} decay={2} />
            </group>
          </group>
        )}

        {/* ==============================================================
            HELD ITEM: PHULJHADI SPARKLER
            ============================================================== */}
        {handItem === 'sparkler' && (
          <group position={[0, 0.02, -0.06]} rotation={[0.4, 0, 0]}>
            {/* Wire handle */}
            <mesh position={[0, 0, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.32, 8]} />
              <meshStandardMaterial color="#A0A0A0" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Magnesium coating */}
            <mesh position={[0, 0, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.16, 8]} />
              <meshStandardMaterial color="#555555" roughness={0.9} />
            </mesh>

            {/* Sparkler Flame Tip */}
            {sparklerIgnited && (
              <group position={[0, 0, -0.34]}>
                <mesh>
                  <sphereGeometry args={[0.025, 8, 8]} />
                  <meshBasicMaterial color="#FFFFFF" />
                </mesh>
                <pointLight color="#FFE57F" intensity={2.5} distance={3.5} decay={2} />
              </group>
            )}
          </group>
        )}
      </group>
    </group>
  );
};

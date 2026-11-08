import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import {
  getMotichoorTexture,
  getSilverVarkTexture,
} from '../utils/textureGenerator';

export const FirstPersonHands: React.FC = () => {
  const { camera } = useThree();
  const {
    cinematicActive,
    handItem,
    handAnim,
    heldSweetType,
    heldPowderColor,
    heldFireworkType,
    sparklerIgnited,
    sparklerTrails,
    addSparklerTrailPoint,
    updateSparklerTrails,
  } = useGameState();

  const containerRef = useRef<THREE.Group>(null);
  const handRootRef = useRef<THREE.Group>(null);

  // Finger joint refs for procedural posing
  const thumbRef = useRef<THREE.Group>(null);
  const indexRef = useRef<THREE.Group>(null);
  const middleRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const pinkyRef = useRef<THREE.Group>(null);

  // Spark shower particles
  const sparkParticlesRef = useRef<THREE.Points>(null);
  const powderParticlesRef = useRef<THREE.Points>(null);

  // Lerp transform targets
  const targetPos = useRef(new THREE.Vector3(0.24, -0.22, -0.46));
  const targetRot = useRef(new THREE.Euler(-0.15, 0.2, -0.08));
  const currentPos = useRef(new THREE.Vector3(0.24, -0.45, -0.46));
  const currentRot = useRef(new THREE.Euler(-0.15, 0.2, -0.08));

  // Textures
  const motichoorTex = useMemo(() => getMotichoorTexture(), []);
  const silverVarkTex = useMemo(() => getSilverVarkTexture(), []);

  // Sparkler spark particles
  const sparkCount = 70;
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

  // Powder sprinkling particles
  const powderCount = 50;
  const powderPositions = useMemo(() => new Float32Array(powderCount * 3), []);

  useFrame((state, delta) => {
    if (cinematicActive || !containerRef.current || !handRootRef.current) return;

    // Follow camera strictly
    containerRef.current.position.copy(camera.position);
    containerRef.current.quaternion.copy(camera.quaternion);

    const time = state.clock.getElapsedTime();

    // Natural breathing sway
    const breatheY = Math.sin(time * 2.2) * 0.005;
    const breatheX = Math.cos(time * 1.6) * 0.003;

    // Finger curl targets based on animation
    let fingerCurl = 0.35; // slightly curved rest pose
    let thumbCurl = 0.2;

    switch (handAnim) {
      case 'idle':
        if (handItem === 'none') {
          targetPos.current.set(0.32, -0.42, -0.42);
          targetRot.current.set(-0.35, 0.2, -0.1);
          fingerCurl = 0.25;
        } else {
          targetPos.current.set(0.24, -0.24 + breatheY, -0.46 + breatheX);
          targetRot.current.set(-0.15, 0.15, -0.05);
          fingerCurl = 0.75;
          thumbCurl = 0.6;
        }
        break;

      case 'reach':
        targetPos.current.set(0.18, -0.16, -0.56);
        targetRot.current.set(0.1, -0.05, 0.0);
        fingerCurl = 0.15; // fingers open
        thumbCurl = 0.1;
        break;

      case 'holding':
        targetPos.current.set(0.22 + breatheX, -0.18 + breatheY, -0.44);
        targetRot.current.set(-0.12, 0.1, -0.05);
        fingerCurl = 0.8;
        thumbCurl = 0.65;
        break;

      case 'eating': {
        const eatWave = (Math.sin(time * 12) + 1) * 0.5;
        targetPos.current.set(0.06, -0.06 + eatWave * 0.02, -0.28);
        targetRot.current.set(0.4, -0.15, 0.2);
        fingerCurl = 0.9;
        thumbCurl = 0.8;
        break;
      }

      case 'sprinkling': {
        const sprinkleShake = Math.sin(time * 26) * 0.02;
        targetPos.current.set(0.18 + sprinkleShake, -0.22, -0.46);
        targetRot.current.set(0.35, 0.0, 0.2 + Math.cos(time * 26) * 0.06);
        fingerCurl = 0.85; // pinch
        thumbCurl = 0.9;
        break;
      }

      case 'lighting':
        targetPos.current.set(0.14, -0.14, -0.6);
        targetRot.current.set(0.08, 0.05, 0.0);
        fingerCurl = 0.75;
        thumbCurl = 0.65;
        break;

      case 'ringing_bell': {
        const strike = Math.sin(time * 14) * 0.06;
        targetPos.current.set(0.12, -0.06, -0.56 + strike);
        targetRot.current.set(0.2, 0.0, 0.08);
        fingerCurl = 0.3;
        break;
      }
    }

    // Smooth transform lerping
    currentPos.current.lerp(targetPos.current, Math.min(delta * 12, 1));
    handRootRef.current.position.copy(currentPos.current);

    currentRot.current.x = THREE.MathUtils.lerp(currentRot.current.x, targetRot.current.x, delta * 12);
    currentRot.current.y = THREE.MathUtils.lerp(currentRot.current.y, targetRot.current.y, delta * 12);
    currentRot.current.z = THREE.MathUtils.lerp(currentRot.current.z, targetRot.current.z, delta * 12);
    handRootRef.current.rotation.copy(currentRot.current);

    // Procedural finger curling
    if (thumbRef.current) thumbRef.current.rotation.z = thumbCurl;
    if (indexRef.current) indexRef.current.rotation.x = fingerCurl;
    if (middleRef.current) middleRef.current.rotation.x = fingerCurl * 1.05;
    if (ringRef.current) ringRef.current.rotation.x = fingerCurl * 1.02;
    if (pinkyRef.current) pinkyRef.current.rotation.x = fingerCurl * 0.95;

    // Sparkler spark shower update
    if (handItem === 'sparkler' && sparklerIgnited) {
      updateSparklerTrails(delta);

      // Sparkler tip world position
      const tipOffset = new THREE.Vector3(0.22, -0.15, -0.68).applyQuaternion(camera.quaternion);
      const tipWorldPos = camera.position.clone().add(tipOffset);

      addSparklerTrailPoint({
        x: tipWorldPos.x,
        y: tipWorldPos.y,
        z: tipWorldPos.z,
        color: '#FFD700',
      });

      if (sparkParticlesRef.current) {
        sparkParticlesRef.current.position.copy(tipWorldPos);
        const positions = sparkParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < sparkCount; i++) {
          positions[i * 3] += sparkVelocities[i * 3] * delta;
          positions[i * 3 + 1] += sparkVelocities[i * 3 + 1] * delta;
          positions[i * 3 + 2] += sparkVelocities[i * 3 + 2] * delta;

          if (Math.hypot(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]) > 0.45) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
          }
        }
        sparkParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }

    // Powder sprinkle particle update
    if (handAnim === 'sprinkling' && powderParticlesRef.current) {
      const positions = powderParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < powderCount; i++) {
        positions[i * 3 + 1] -= 0.65 * delta;
        if (positions[i * 3 + 1] < -0.6) {
          positions[i * 3] = (Math.random() - 0.5) * 0.05;
          positions[i * 3 + 1] = -0.05;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
        }
      }
      powderParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (cinematicActive) return null;

  return (
    <>
      <group ref={containerRef}>
        <group ref={handRootRef}>
          {/* ==============================================================
              1. ARTICULATED HUMAN FIRST-PERSON HAND & ARM
              ============================================================== */}
          {/* Festive Silk Kurta Sleeve (Deep Ruby Silk with Gold Embroidered Zari Trim) */}
          <mesh position={[0.08, -0.26, 0.28]} rotation={[0.42, -0.15, 0.2]}>
            <cylinderGeometry args={[0.058, 0.068, 0.32, 16]} />
            <meshStandardMaterial color="#8B0000" roughness={0.65} />
          </mesh>
          {/* Zari Gold Brocade Sleeve Trim */}
          <mesh position={[0.06, -0.16, 0.16]} rotation={[0.42, -0.15, 0.2]}>
            <torusGeometry args={[0.06, 0.012, 10, 24]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Forearm (Realistic Indian Skin Tone) */}
          <mesh position={[0.05, -0.12, 0.12]} rotation={[0.42, -0.15, 0.2]}>
            <cylinderGeometry args={[0.042, 0.052, 0.24, 16]} />
            <meshStandardMaterial color="#BD7B4D" roughness={0.65} />
          </mesh>

          {/* Traditional Auspicious 24K Gold Kada (Bangle) on Wrist */}
          <mesh position={[0.038, -0.05, 0.06]} rotation={[0.42, -0.15, 0.2]}>
            <torusGeometry args={[0.052, 0.012, 12, 28]} />
            <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.18} />
          </mesh>

          {/* Hand Palm */}
          <mesh position={[0.02, 0, 0]} rotation={[0.08, 0, 0]}>
            <boxGeometry args={[0.068, 0.03, 0.082]} />
            <meshStandardMaterial color="#BD7B4D" roughness={0.65} />
          </mesh>

          {/* Thumb */}
          <group ref={thumbRef} position={[-0.024, -0.005, -0.015]} rotation={[0.15, -0.4, 0.2]}>
            <mesh position={[-0.015, 0, -0.02]}>
              <cylinderGeometry args={[0.011, 0.013, 0.045, 10]} />
              <meshStandardMaterial color="#BD7B4D" roughness={0.65} />
            </mesh>
          </group>

          {/* 4 Articulated Fingers */}
          {/* Index Finger */}
          <group ref={indexRef} position={[0.028, 0.002, -0.045]}>
            <mesh position={[0, -0.008, -0.025]} rotation={[0.2, 0, 0]}>
              <cylinderGeometry args={[0.009, 0.011, 0.052, 10]} />
              <meshStandardMaterial color="#BD7B4D" roughness={0.65} />
            </mesh>
          </group>

          {/* Middle Finger */}
          <group ref={middleRef} position={[0.01, 0.002, -0.048]}>
            <mesh position={[0, -0.01, -0.028]} rotation={[0.2, 0, 0]}>
              <cylinderGeometry args={[0.0095, 0.011, 0.058, 10]} />
              <meshStandardMaterial color="#BD7B4D" roughness={0.65} />
            </mesh>
          </group>

          {/* Ring Finger */}
          <group ref={ringRef} position={[-0.008, 0.001, -0.045]}>
            <mesh position={[0, -0.008, -0.025]} rotation={[0.2, 0, 0]}>
              <cylinderGeometry args={[0.009, 0.01, 0.052, 10]} />
              <meshStandardMaterial color="#BD7B4D" roughness={0.65} />
            </mesh>
          </group>

          {/* Pinky Finger */}
          <group ref={pinkyRef} position={[-0.024, 0, -0.04]}>
            <mesh position={[0, -0.006, -0.02]} rotation={[0.2, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.009, 0.042, 10]} />
              <meshStandardMaterial color="#BD7B4D" roughness={0.65} />
            </mesh>
          </group>

          {/* ==============================================================
              2. PHYSICAL HELD ITEMS (SWEET, POWDER BOWL, DIYA STICK, SPARKLER)
              ============================================================== */}
          {/* A. HELD SWEET */}
          {handItem === 'sweet' && heldSweetType && (
            <group position={[0.01, 0.025, -0.05]}>
              {heldSweetType === 'laddoo' && (
                <mesh castShadow>
                  <sphereGeometry args={[0.028, 16, 16]} />
                  <meshStandardMaterial map={motichoorTex} roughness={0.7} />
                </mesh>
              )}
              {heldSweetType === 'kajuKatli' && (
                <mesh castShadow rotation={[0.2, Math.PI / 4, 0]}>
                  <boxGeometry args={[0.038, 0.012, 0.038]} />
                  <meshStandardMaterial
                    map={silverVarkTex}
                    metalness={0.75}
                    roughness={0.25}
                  />
                </mesh>
              )}
              {heldSweetType === 'gulabJamun' && (
                <mesh castShadow>
                  <sphereGeometry args={[0.026, 16, 16]} />
                  <meshStandardMaterial
                    color="#4A1C0A"
                    roughness={0.25}
                    metalness={0.1}
                  />
                </mesh>
              )}
              {heldSweetType === 'barfi' && (
                <mesh castShadow>
                  <boxGeometry args={[0.036, 0.016, 0.036]} />
                  <meshStandardMaterial color="#66BB6A" roughness={0.5} />
                </mesh>
              )}
              {heldSweetType === 'modak' && (
                <mesh castShadow rotation={[-Math.PI / 2, 0, 0]}>
                  <coneGeometry args={[0.024, 0.042, 14]} />
                  <meshStandardMaterial color="#FFF9E6" roughness={0.6} />
                </mesh>
              )}
            </group>
          )}

          {/* B. HELD RANGOLI POWDER BOWL */}
          {handItem === 'powder' && (
            <group position={[0.01, 0.02, -0.05]}>
              {/* Brass Katori (Bowl) */}
              <mesh castShadow>
                <cylinderGeometry args={[0.034, 0.022, 0.026, 16]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.25} />
              </mesh>
              {/* Powder Heap */}
              <mesh position={[0, 0.01, 0]}>
                <sphereGeometry args={[0.028, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                <meshStandardMaterial
                  color={heldPowderColor || '#FFD54F'}
                  roughness={0.9}
                />
              </mesh>
              {/* Powder Sprinkling Particle System */}
              {handAnim === 'sprinkling' && (
                <points ref={powderParticlesRef} position={[0, -0.02, 0]}>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      args={[powderPositions, 3]}
                    />
                  </bufferGeometry>
                  <pointsMaterial
                    size={0.015}
                    color={heldPowderColor || '#FFD54F'}
                    transparent
                    opacity={0.9}
                  />
                </points>
              )}
            </group>
          )}

          {/* C. HELD BRASS DIYA LIGHTING STICK */}
          {handItem === 'diya_stick' && (
            <group position={[0.01, 0.01, -0.06]} rotation={[0.4, 0, 0]}>
              {/* Long Brass Wand */}
              <mesh castShadow position={[0, 0, -0.16]}>
                <cylinderGeometry args={[0.004, 0.005, 0.34, 10]} />
                <meshStandardMaterial color="#DAA520" metalness={0.88} roughness={0.25} />
              </mesh>
              {/* Glowing Flame Tip */}
              <mesh position={[0, 0, -0.34]}>
                <coneGeometry args={[0.012, 0.028, 8]} />
                <meshBasicMaterial color="#FFB300" />
              </mesh>
              <pointLight position={[0, 0, -0.34]} color="#FFA500" intensity={1.5} distance={1.8} decay={2} />
            </group>
          )}

          {/* D. HELD PHULJHADI (SPARKLER) */}
          {handItem === 'sparkler' && (
            <group position={[0.01, 0.01, -0.06]} rotation={[0.3, 0, 0]}>
              {/* Sparkler Wire Stem */}
              <mesh position={[0, 0, -0.14]}>
                <cylinderGeometry args={[0.003, 0.003, 0.32, 8]} />
                <meshStandardMaterial color="#A9A9A9" metalness={0.9} roughness={0.3} />
              </mesh>
              {/* Pyrotechnic Chemical Coating Zone */}
              <mesh position={[0, 0, -0.24]}>
                <cylinderGeometry args={[0.006, 0.006, 0.16, 8]} />
                <meshStandardMaterial
                  color={sparklerIgnited ? '#FFE082' : '#616161'}
                  roughness={0.85}
                  emissive={sparklerIgnited ? '#FF9800' : '#000000'}
                  emissiveIntensity={sparklerIgnited ? 2.5 : 0}
                />
              </mesh>
              {/* Burning Core Light */}
              {sparklerIgnited && (
                <pointLight position={[0, 0, -0.32]} color="#FFD700" intensity={2.8} distance={3.5} decay={2} />
              )}
            </group>
          )}

          {/* E. HELD FIREWORK BOX */}
          {handItem === 'firework' && heldFireworkType && (
            <group position={[0.01, 0.04, -0.08]} rotation={[0.2, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.08, 0.06, 0.08]} />
                <meshStandardMaterial color="#D32F2F" roughness={0.5} />
              </mesh>
              {/* Fuse */}
              <mesh position={[0, 0.038, 0]}>
                <cylinderGeometry args={[0.003, 0.003, 0.02, 6]} />
                <meshStandardMaterial color="#FFF" roughness={0.8} />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* Global Sparkler Particles */}
      {handItem === 'sparkler' && sparklerIgnited && (
        <points ref={sparkParticlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[sparkPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.032}
            color="#FFF176"
            transparent
            opacity={0.95}
          />
        </points>
      )}

      {/* Sparkler 3D Air-Drawing Light Ribbon Trails */}
      {sparklerTrails.length > 1 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(
                  sparklerTrails.flatMap(pt => [pt.x, pt.y, pt.z])
                ),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#FFD700" linewidth={2.5} transparent opacity={0.85} />
        </line>
      )}
    </>
  );
};

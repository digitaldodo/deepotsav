import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState, HandAnimationState, HandItemType } from '../state/useGameState';
import {
  getMotichoorTexture,
  getSilverVarkTexture,
} from '../utils/textureGenerator';
import { FirecrackerModel } from '../world/FirecrackerModels';
import { ArticulatedHandMesh, HandPoseAngles } from './ArticulatedHandModel';

// Active spark/flame source tracker for physical fuse contact ignition
export const activeSparkSource = {
  active: false,
  position: new THREE.Vector3(),
  type: 'sparkler' as 'sparkler' | 'diya_stick',
};

// Target poses calculation based on activity and held object
function calculateTargetPose(anim: HandAnimationState, item: HandItemType, time: number): HandPoseAngles {
  if (item === 'sweet') {
    if (anim === 'eating') {
      return {
        thumb: { mcp: 0.5, pip: 0.55, dip: 0.4, spread: 0.3 },
        index: { mcp: 0.65, pip: 0.85, dip: 0.55, spread: 0.06 },
        middle: { mcp: 0.7, pip: 0.9, dip: 0.6, spread: 0.02 },
        ring: { mcp: 0.8, pip: 1.0, dip: 0.75, spread: 0.04 },
        pinky: { mcp: 0.9, pip: 1.1, dip: 0.85, spread: 0.08 },
      };
    }
    // Delicate fingertip pinch
    return {
      thumb: { mcp: 0.42, pip: 0.48, dip: 0.32, spread: 0.35 },
      index: { mcp: 0.52, pip: 0.72, dip: 0.48, spread: 0.08 },
      middle: { mcp: 0.58, pip: 0.78, dip: 0.52, spread: 0.02 },
      ring: { mcp: 0.72, pip: 0.92, dip: 0.68, spread: 0.04 },
      pinky: { mcp: 0.82, pip: 1.02, dip: 0.78, spread: 0.09 },
    };
  }

  if (item === 'powder') {
    // Right hand pinching powder between fingertips
    const sprinkleVibe = anim === 'sprinkling' ? Math.sin(time * 26) * 0.12 : 0;
    return {
      thumb: { mcp: 0.45 + sprinkleVibe, pip: 0.5, dip: 0.35, spread: 0.32 },
      index: { mcp: 0.55 + sprinkleVibe, pip: 0.75, dip: 0.5, spread: 0.06 },
      middle: { mcp: 0.6, pip: 0.8, dip: 0.55, spread: 0.02 },
      ring: { mcp: 0.7, pip: 0.9, dip: 0.65, spread: 0.04 },
      pinky: { mcp: 0.8, pip: 1.0, dip: 0.75, spread: 0.08 },
    };
  }

  if (item === 'sparkler') {
    // Power grip wrapping around wire handle
    return {
      thumb: { mcp: 0.65, pip: 0.75, dip: 0.55, spread: 0.15 },
      index: { mcp: 0.85, pip: 1.15, dip: 0.85, spread: -0.02 },
      middle: { mcp: 0.9, pip: 1.2, dip: 0.9, spread: 0.01 },
      ring: { mcp: 0.92, pip: 1.22, dip: 0.92, spread: 0.03 },
      pinky: { mcp: 0.95, pip: 1.25, dip: 0.95, spread: 0.06 },
    };
  }

  if (item === 'diya_stick') {
    // Holding brass stick
    return {
      thumb: { mcp: 0.55, pip: 0.65, dip: 0.45, spread: 0.2 },
      index: { mcp: 0.75, pip: 0.95, dip: 0.65, spread: 0.02 },
      middle: { mcp: 0.8, pip: 1.05, dip: 0.75, spread: 0.01 },
      ring: { mcp: 0.82, pip: 1.08, dip: 0.78, spread: 0.03 },
      pinky: { mcp: 0.85, pip: 1.1, dip: 0.8, spread: 0.06 },
    };
  }

  if (item === 'firework') {
    // Cupped supportive grip
    return {
      thumb: { mcp: 0.35, pip: 0.45, dip: 0.3, spread: 0.25 },
      index: { mcp: 0.5, pip: 0.65, dip: 0.45, spread: -0.02 },
      middle: { mcp: 0.55, pip: 0.7, dip: 0.5, spread: 0.01 },
      ring: { mcp: 0.6, pip: 0.75, dip: 0.55, spread: 0.03 },
      pinky: { mcp: 0.65, pip: 0.8, dip: 0.6, spread: 0.06 },
    };
  }

  if (anim === 'ringing_bell') {
    return {
      thumb: { mcp: 0.6, pip: 0.7, dip: 0.5, spread: 0.18 },
      index: { mcp: 0.8, pip: 1.1, dip: 0.8, spread: 0.0 },
      middle: { mcp: 0.85, pip: 1.15, dip: 0.85, spread: 0.01 },
      ring: { mcp: 0.88, pip: 1.18, dip: 0.88, spread: 0.03 },
      pinky: { mcp: 0.9, pip: 1.2, dip: 0.9, spread: 0.06 },
    };
  }

  if (anim === 'reach') {
    return {
      thumb: { mcp: 0.05, pip: 0.05, dip: 0.05, spread: 0.25 },
      index: { mcp: 0.08, pip: 0.08, dip: 0.05, spread: -0.1 },
      middle: { mcp: 0.05, pip: 0.05, dip: 0.05, spread: 0 },
      ring: { mcp: 0.08, pip: 0.08, dip: 0.05, spread: 0.08 },
      pinky: { mcp: 0.12, pip: 0.12, dip: 0.08, spread: 0.15 },
    };
  }

  // Idle relaxed hand
  return {
    thumb: { mcp: 0.18, pip: 0.22, dip: 0.16, spread: 0.12 },
    index: { mcp: 0.28, pip: 0.38, dip: 0.24, spread: -0.04 },
    middle: { mcp: 0.32, pip: 0.42, dip: 0.26, spread: 0.0 },
    ring: { mcp: 0.36, pip: 0.46, dip: 0.28, spread: 0.04 },
    pinky: { mcp: 0.42, pip: 0.52, dip: 0.32, spread: 0.08 },
  };
}

// Left hand cupped pose holding the brass powder bowl
const leftHandCupPose: HandPoseAngles = {
  thumb: { mcp: 0.18, pip: 0.22, dip: 0.14, spread: 0.26 },
  index: { mcp: 0.32, pip: 0.42, dip: 0.22, spread: -0.04 },
  middle: { mcp: 0.28, pip: 0.38, dip: 0.2, spread: 0.0 },
  ring: { mcp: 0.32, pip: 0.42, dip: 0.22, spread: 0.04 },
  pinky: { mcp: 0.38, pip: 0.48, dip: 0.26, spread: 0.08 },
};

export const FirstPersonHands: React.FC = () => {
  const { camera } = useThree();
  const cinematicActive = useGameState(s => s.cinematicActive);
  const handItem = useGameState(s => s.handItem);
  const handAnim = useGameState(s => s.handAnim);
  const heldSweetType = useGameState(s => s.heldSweetType);
  const heldPowderColor = useGameState(s => s.heldPowderColor);
  const heldFireworkType = useGameState(s => s.heldFireworkType);
  const sparklerIgnited = useGameState(s => s.sparklerIgnited);
  const dropSparkler = useGameState(s => s.dropSparkler);

  const containerRef = useRef<THREE.Group>(null);
  const handRootRef = useRef<THREE.Group>(null);

  // Spark shower particles & 3D ribbon trail
  const sparkParticlesRef = useRef<THREE.Points>(null);
  const powderParticlesRef = useRef<THREE.Points>(null);
  const trailLineRef = useRef<THREE.Line>(null);
  const maxTrailPoints = 60;
  const trailPositions = useMemo(() => new Float32Array(maxTrailPoints * 3), []);
  const trailCount = useRef(0);
  const burnTimerRef = useRef(0);

  // Lerp transform targets
  const targetPos = useRef(new THREE.Vector3(0.24, -0.22, -0.46));
  const targetRot = useRef(new THREE.Euler(-0.15, 0.2, -0.08));
  const currentPos = useRef(new THREE.Vector3(0.24, -0.45, -0.46));
  const currentRot = useRef(new THREE.Euler(-0.15, 0.2, -0.08));

  // Current animated hand pose
  const [currentPose, setCurrentPose] = useState<HandPoseAngles>(() =>
    calculateTargetPose('idle', 'none', 0)
  );

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

    // Transform positioning based on animation
    switch (handAnim) {
      case 'idle':
        if (handItem === 'none') {
          targetPos.current.set(0.32, -0.42, -0.42);
          targetRot.current.set(-0.35, 0.2, -0.1);
        } else {
          targetPos.current.set(0.24, -0.24 + breatheY, -0.46 + breatheX);
          targetRot.current.set(-0.15, 0.15, -0.05);
        }
        break;

      case 'reach':
        targetPos.current.set(0.18, -0.16, -0.56);
        targetRot.current.set(0.1, -0.05, 0.0);
        break;

      case 'holding':
        targetPos.current.set(0.22 + breatheX, -0.18 + breatheY, -0.44);
        targetRot.current.set(-0.12, 0.1, -0.05);
        break;

      case 'eating': {
        const eatWave = (Math.sin(time * 12) + 1) * 0.5;
        targetPos.current.set(0.06, -0.06 + eatWave * 0.02, -0.28);
        targetRot.current.set(0.4, -0.15, 0.2);
        break;
      }

      case 'sprinkling': {
        const sprinkleShake = Math.sin(time * 26) * 0.02;
        targetPos.current.set(0.18 + sprinkleShake, -0.22, -0.46);
        targetRot.current.set(0.35, 0.0, 0.2 + Math.cos(time * 26) * 0.06);
        break;
      }

      case 'lighting':
        targetPos.current.set(0.14, -0.14, -0.6);
        targetRot.current.set(0.08, 0.05, 0.0);
        break;

      case 'ringing_bell': {
        const strike = Math.sin(time * 14) * 0.06;
        targetPos.current.set(0.12, -0.06, -0.56 + strike);
        targetRot.current.set(0.2, 0.0, 0.08);
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

    // Compute target anatomical finger pose
    const nextPose = calculateTargetPose(handAnim, handItem, time);
    setCurrentPose(nextPose);

    // Sparkler spark shower update
    if (handItem === 'sparkler' && sparklerIgnited) {
      burnTimerRef.current += delta;
      // Auto burnout after 25s
      if (burnTimerRef.current > 25) {
        dropSparkler();
        burnTimerRef.current = 0;
      }

      // Sparkler tip world position
      const tipOffset = new THREE.Vector3(0.22, -0.15, -0.68).applyQuaternion(camera.quaternion);
      const tipWorldPos = camera.position.clone().add(tipOffset);

      activeSparkSource.active = true;
      activeSparkSource.position.copy(tipWorldPos);
      activeSparkSource.type = 'sparkler';

      // Update 3D ribbon trail in GPU buffer (no React re-renders)
      const n = Math.min(trailCount.current, maxTrailPoints - 1);
      for (let i = n; i > 0; i--) {
        trailPositions[i * 3] = trailPositions[(i - 1) * 3];
        trailPositions[i * 3 + 1] = trailPositions[(i - 1) * 3 + 1];
        trailPositions[i * 3 + 2] = trailPositions[(i - 1) * 3 + 2];
      }
      trailPositions[0] = tipWorldPos.x;
      trailPositions[1] = tipWorldPos.y;
      trailPositions[2] = tipWorldPos.z;
      if (trailCount.current < maxTrailPoints) {
        trailCount.current++;
      }
      if (trailLineRef.current) {
        trailLineRef.current.geometry.attributes.position.needsUpdate = true;
        trailLineRef.current.geometry.setDrawRange(0, Math.max(trailCount.current, 2));
        trailLineRef.current.visible = true;
      }

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
    } else {
      burnTimerRef.current = 0;
      if (trailLineRef.current) {
        trailLineRef.current.visible = false;
        trailCount.current = 0;
      }
      if (handItem === 'diya_stick') {
        const tipOffset = new THREE.Vector3(0.14, -0.14, -0.65).applyQuaternion(camera.quaternion);
        const tipWorldPos = camera.position.clone().add(tipOffset);
        activeSparkSource.active = true;
        activeSparkSource.position.copy(tipWorldPos);
        activeSparkSource.type = 'diya_stick';
      } else {
        activeSparkSource.active = false;
      }
    }

    // Powder sprinkle particle update
    if (handAnim === 'sprinkling' && powderParticlesRef.current) {
      const positions = powderParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < powderCount; i++) {
        positions[i * 3 + 1] -= delta * 0.45;
        if (positions[i * 3 + 1] < -0.25) {
          positions[i * 3] = (Math.random() - 0.5) * 0.04;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
        }
      }
      powderParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (cinematicActive) return null;

  return (
    <>
      <group ref={containerRef}>
        {/* ==============================================================
            RIGHT ARTICULATED HUMAN HAND & HELD ITEMS
            ============================================================== */}
        <group ref={handRootRef}>
          {/* Anatomical Human Hand with 5 Articulated Fingers */}
          <ArticulatedHandMesh isLeft={false} pose={currentPose} />

          {/* ==============================================================
              PHYSICAL HELD ITEMS (Relative to actual natural grip point)
              ============================================================== */}
          {/* A. HELD SWEET (Pinched between thumb and index fingertip) */}
          {handItem === 'sweet' && heldSweetType && (
            <group position={[-0.012, 0.015, -0.065]}>
              {heldSweetType === 'laddoo' && (
                <mesh castShadow>
                  <sphereGeometry args={[0.022, 16, 16]} />
                  <meshStandardMaterial map={motichoorTex} roughness={0.7} />
                </mesh>
              )}
              {heldSweetType === 'kajuKatli' && (
                <mesh castShadow rotation={[0.2, Math.PI / 4, 0]}>
                  <boxGeometry args={[0.032, 0.01, 0.032]} />
                  <meshStandardMaterial
                    map={silverVarkTex}
                    metalness={0.75}
                    roughness={0.25}
                  />
                </mesh>
              )}
              {heldSweetType === 'gulabJamun' && (
                <mesh castShadow>
                  <sphereGeometry args={[0.022, 16, 14]} />
                  <meshStandardMaterial color="#3E1C0A" roughness={0.4} />
                </mesh>
              )}
              {heldSweetType === 'barfi' && (
                <mesh castShadow>
                  <boxGeometry args={[0.03, 0.016, 0.03]} />
                  <meshStandardMaterial color="#FFF8DC" roughness={0.6} />
                </mesh>
              )}
              {heldSweetType === 'modak' && (
                <mesh castShadow>
                  <coneGeometry args={[0.022, 0.034, 16]} />
                  <meshStandardMaterial color="#FFFFF0" roughness={0.5} />
                </mesh>
              )}
            </group>
          )}

          {/* B. HELD RANGOLI POWDER (Right Hand Fine Powder Pinch) */}
          {handItem === 'powder' && (
            <group position={[-0.012, 0.012, -0.062]}>
              {/* Fine pinch of colored powder grains */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.007, 8, 8]} />
                <meshStandardMaterial
                  color={heldPowderColor || '#FFD54F'}
                  roughness={0.95}
                />
              </mesh>
              {/* Fine Falling Powder Sprinkling Stream */}
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
            <group position={[-0.005, 0.01, -0.06]} rotation={[0.4, 0, 0]}>
              {/* Long Brass Wand */}
              <mesh castShadow position={[0, 0, -0.16]}>
                <cylinderGeometry args={[0.004, 0.005, 0.34, 10]} />
                <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.25} />
              </mesh>
              {/* Glowing Auspicious Diya Flame at Tip */}
              <group position={[0, 0, -0.34]}>
                <mesh>
                  <sphereGeometry args={[0.014, 8, 8]} />
                  <meshBasicMaterial color="#FFD700" />
                </mesh>
                <pointLight color="#FFA500" intensity={1.8} distance={3.0} decay={2} />
              </group>
            </group>
          )}

          {/* D. HELD PHULJHADI (SPARKLER) */}
          {handItem === 'sparkler' && (
            <group position={[-0.005, 0.01, -0.06]} rotation={[0.45, 0.1, 0]}>
              {/* Steel Wire Handle held inside curled fingers */}
              <mesh position={[0, 0, -0.08]} castShadow>
                <cylinderGeometry args={[0.0025, 0.0025, 0.22, 8]} />
                <meshStandardMaterial color="#C0C0C0" metalness={0.95} roughness={0.2} />
              </mesh>
              {/* Gunpowder Pyrotechnic Coating */}
              <mesh position={[0, 0, -0.22]} castShadow>
                <cylinderGeometry args={[0.0055, 0.0055, 0.18, 10]} />
                <meshStandardMaterial
                  color={sparklerIgnited ? '#333333' : '#616161'}
                  roughness={0.95}
                />
              </mesh>
              {/* Burning Core Light */}
              {sparklerIgnited && (
                <pointLight position={[0, 0, -0.32]} color="#FFD700" intensity={2.8} distance={3.5} decay={2} />
              )}
            </group>
          )}

          {/* E. HELD FIREWORK MODEL */}
          {handItem === 'firework' && heldFireworkType && (
            <group position={[0, 0.025, -0.09]} rotation={[0.2, 0.1, 0]} scale={0.48}>
              <FirecrackerModel type={heldFireworkType} />
            </group>
          )}
        </group>

        {/* ==============================================================
            LEFT ARTICULATED HUMAN HAND (Two-Hand Interaction for Rangoli Bowl)
            ============================================================== */}
        {handItem === 'powder' && (
          <group position={[-0.22, -0.24, -0.44]} rotation={[0.25, 0.35, -0.1]}>
            {/* Articulated Left Human Hand */}
            <ArticulatedHandMesh isLeft={true} pose={leftHandCupPose} />

            {/* Held Brass Katori (Bowl) sitting naturally on palm */}
            <group position={[0.008, 0.028, -0.025]}>
              {/* Heavy Hammered Brass Bowl */}
              <mesh castShadow>
                <cylinderGeometry args={[0.044, 0.028, 0.034, 20]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.22} />
              </mesh>
              {/* Engraved Auspicious Rim */}
              <mesh position={[0, 0.017, 0]}>
                <torusGeometry args={[0.045, 0.005, 8, 22]} />
                <meshStandardMaterial color="#FFD700" metalness={0.96} roughness={0.15} />
              </mesh>
              {/* Vibrant Colored Powder Mound */}
              <mesh position={[0, 0.014, 0]}>
                <sphereGeometry args={[0.04, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                <meshStandardMaterial
                  color={heldPowderColor || '#FFD54F'}
                  roughness={0.95}
                />
              </mesh>
            </group>
          </group>
        )}
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

      {/* Sparkler 3D Air-Drawing Light Ribbon Trails (Fixed GPU buffer, zero React re-renders) */}
      <line ref={trailLineRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailPositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#FFD700" linewidth={2.5} transparent opacity={0.85} />
      </line>
    </>
  );
};

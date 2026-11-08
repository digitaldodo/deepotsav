import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

// 7 Physical Powder Bowls arranged neatly around the rangoli
export const POWDER_BOWLS = [
  { id: 'red', name: 'Sindoor Red', color: '#E53935', pos: [-1.7, 0.04, 6.7] as [number, number, number] },
  { id: 'yellow', name: 'Marigold Yellow', color: '#FFD54F', pos: [-1.1, 0.04, 7.1] as [number, number, number] },
  { id: 'orange', name: 'Saffron Orange', color: '#FF6D00', pos: [-0.4, 0.04, 7.3] as [number, number, number] },
  { id: 'white', name: 'Rice Flour White', color: '#FFFFFF', pos: [0.2, 0.04, 7.35] as [number, number, number] },
  { id: 'blue', name: 'Peacock Turquoise', color: '#00E5FF', pos: [0.8, 0.04, 7.2] as [number, number, number] },
  { id: 'green', name: 'Emerald Green', color: '#00E676', pos: [1.4, 0.04, 6.95] as [number, number, number] },
  { id: 'magenta', name: 'Gulal Magenta', color: '#FF4081', pos: [1.9, 0.04, 6.55] as [number, number, number] },
];

export const CourtyardRangoli: React.FC = () => {
  const { camera } = useThree();
  const {
    rangoliSections,
    rangoliCompleted,
    heldPowderColor,
    heldPowderName,
    pickUpPowder,
    sprinklePowderOnRangoli,
    setActivePrompt,
    activePrompt,
  } = useGameState();

  const rangoliCenter = useMemo(() => new THREE.Vector3(0, 0.02, 5), []);
  const lastTargetedPetalRef = useRef<number>(0);

  // Completed celebration particles
  const particlesRef = useRef<THREE.Points>(null);
  const celebrationPositions = useMemo(() => {
    const pos = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.8;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 0.05 + Math.random() * 0.8;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame(state => {
    const playerPos = camera.position;

    // Rotate celebration sparkles if completed
    if (rangoliCompleted && particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }

    // 1. Check proximity to physical powder bowls first
    let nearestBowl: typeof POWDER_BOWLS[0] | null = null;
    let minBowlDist = Infinity;

    for (const bowl of POWDER_BOWLS) {
      const bVec = new THREE.Vector3(...bowl.pos);
      const d = playerPos.distanceTo(bVec);
      if (d < 1.9 && d < minBowlDist) {
        minBowlDist = d;
        nearestBowl = bowl;
      }
    }

    if (nearestBowl) {
      if (activePrompt?.id !== `take-powder-${nearestBowl.id}`) {
        setActivePrompt({
          id: `take-powder-${nearestBowl.id}`,
          label: `Take ${nearestBowl.name}`,
          subtext: 'Press [E] or Tap to scoop into hand',
          action: () => {
            pickUpPowder(nearestBowl!.color, nearestBowl!.name);
            audioManager.playPowderPickup();
          },
        });
      }
      return;
    }

    // 2. Check proximity to Rangoli mandala
    const distToRangoli = playerPos.distanceTo(rangoliCenter);
    if (distToRangoli < 3.2) {
      // Determine targeted petal based on angle from player to rangoli
      const angleToPlayer = Math.atan2(playerPos.z - rangoliCenter.z, playerPos.x - rangoliCenter.x);
      // Normalized petal index 0..5
      let petalIdx = Math.floor(((angleToPlayer + Math.PI) / (Math.PI * 2)) * 6) % 6;
      if (petalIdx < 0) petalIdx += 6;
      lastTargetedPetalRef.current = petalIdx;

      // Check if inner or outer
      const targetKey = distToRangoli < 2.0 ? `inner-${petalIdx}` : `outer-${petalIdx}`;

      if (heldPowderColor) {
        if (activePrompt?.id !== `sprinkle-rangoli-${targetKey}`) {
          setActivePrompt({
            id: `sprinkle-rangoli-${targetKey}`,
            label: `Sprinkle ${heldPowderName || 'Powder'}`,
            subtext: `Press [E] or Tap to color Petal ${petalIdx + 1}`,
            action: () => {
              sprinklePowderOnRangoli(targetKey);
              audioManager.playPowderSprinkle();
              if (rangoliCompleted) {
                audioManager.playRangoliCompleteChime();
              }
            },
          });
        }
      } else {
        if (activePrompt?.id !== 'rangoli-need-powder') {
          setActivePrompt({
            id: 'rangoli-need-powder',
            label: 'Courtyard Rangoli Artwork',
            subtext: 'Pick up a coloured powder bowl nearby to create',
            action: () => {
              // Automatically pick up nearest bowl as convenience
              pickUpPowder(POWDER_BOWLS[1].color, POWDER_BOWLS[1].name);
              audioManager.playPowderPickup();
            },
          });
        }
      }
      return;
    }

    // Clear prompt if moved away
    if (
      activePrompt &&
      (activePrompt.id.startsWith('take-powder') || activePrompt.id.startsWith('sprinkle-rangoli') || activePrompt.id === 'rangoli-need-powder')
    ) {
      setActivePrompt(null);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ==============================================================
          PHYSICAL 3D RANGOLI MANDALA ON COURTYARD FLOOR
          ============================================================== */}
      <group position={[0, 0.02, 5]}>
        {/* Outer Circular Base Sand Layer */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.85, 36]} />
          <meshStandardMaterial color="#501815" roughness={0.7} />
        </mesh>

        {/* Decorative Golden Border Ring */}
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.65, 1.82, 36]} />
          <meshStandardMaterial
            color={rangoliSections['border'] || '#D4AF37'}
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>

        {/* 6 Outer Fan Petals */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * Math.PI) / 3 + Math.PI / 6;
          const color = rangoliSections[`outer-${i}`] || '#DDD0B8';
          const x = Math.cos(angle) * 1.25;
          const z = Math.sin(angle) * 1.25;
          return (
            <mesh
              key={`outer-${i}`}
              position={[x, 0.01, z]}
              rotation={[-Math.PI / 2, 0, -angle]}
            >
              <coneGeometry args={[0.32, 0.55, 16]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
          );
        })}

        {/* 6 Inner Lotus Petals */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * Math.PI) / 3;
          const color = rangoliSections[`inner-${i}`] || '#E8DCC4';
          const x = Math.cos(angle) * 0.72;
          const z = Math.sin(angle) * 0.72;
          return (
            <group key={`inner-${i}`} position={[x, 0.015, z]} rotation={[0, -angle, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.22, 0.16, 0.02, 16]} />
                <meshStandardMaterial color={color} roughness={0.5} />
              </mesh>
              {/* White Chalk Outline Flourish */}
              <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.18, 0.22, 16]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
              </mesh>
            </group>
          );
        })}

        {/* Center Floral Bindu */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.34, 24]} />
          <meshStandardMaterial
            color={rangoliSections['center'] || '#FF6B35'}
            roughness={0.4}
          />
        </mesh>

        {/* Center Brass Diya */}
        <group position={[0, 0.03, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.08, 0.06, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Flame */}
          <group position={[0, 0.06, 0]}>
            <mesh>
              <sphereGeometry args={[0.032, 8, 8]} />
              <meshBasicMaterial color="#FF5722" />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <coneGeometry args={[0.02, 0.05, 8]} />
              <meshBasicMaterial color="#FFD700" />
            </mesh>
          </group>
        </group>

        {/* 4 Cardinal Corner Diyas */}
        {[
          [1.55, 1.55],
          [-1.55, 1.55],
          [1.55, -1.55],
          [-1.55, -1.55],
        ].map(([cx, cz], idx) => (
          <group key={idx} position={[cx, 0.02, cz]}>
            <mesh>
              <cylinderGeometry args={[0.08, 0.05, 0.04, 12]} />
              <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <sphereGeometry args={[0.02, 6, 6]} />
              <meshBasicMaterial color="#FF9800" />
            </mesh>
          </group>
        ))}

        {/* Completed Artwork Celebration Sparkles */}
        {rangoliCompleted && (
          <points ref={particlesRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[celebrationPositions, 3]}
              />
            </bufferGeometry>
            <pointsMaterial size={0.035} color="#FFD700" transparent opacity={0.8} />
          </points>
        )}
      </group>

      {/* ==============================================================
          7 PHYSICAL BRASS POWDER BOWLS ON THE COURTYARD FLOOR
          ============================================================== */}
      {POWDER_BOWLS.map(bowl => {
        const isCurrentHeld = heldPowderColor === bowl.color;
        return (
          <group key={bowl.id} position={bowl.pos}>
            {/* Polished Teak Wood Octagonal Pedestal */}
            <mesh position={[0, 0.015, 0]} receiveShadow>
              <cylinderGeometry args={[0.18, 0.2, 0.03, 8]} />
              <meshStandardMaterial color="#4A2511" roughness={0.6} />
            </mesh>

            {/* Brass Katori (Indian Bowl) */}
            <mesh position={[0, 0.055, 0]} castShadow>
              <cylinderGeometry args={[0.13, 0.08, 0.07, 16]} />
              <meshStandardMaterial
                color="#E5C158"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>

            {/* Mounded Rangoli Powder */}
            <mesh position={[0, 0.085, 0]}>
              <coneGeometry args={[0.12, 0.08, 16]} />
              <meshStandardMaterial
                color={bowl.color}
                roughness={0.85}
              />
            </mesh>

            {/* Indicator ring if player is currently holding this powder */}
            {isCurrentHeld && (
              <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.22, 0.26, 24]} />
                <meshBasicMaterial color="#FFD700" />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

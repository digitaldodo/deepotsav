import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState, RangoliDesignType } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

// 12 Vibrant Festive Indian Rangoli Powder Shades
export const POWDER_PALETTE = [
  { id: 'sindoor', name: 'Sindoor Red', color: '#E53935', pos: [-2.2, 0.04, 6.2] as [number, number, number] },
  { id: 'marigold', name: 'Marigold Yellow', color: '#FFD54F', pos: [-1.8, 0.04, 6.7] as [number, number, number] },
  { id: 'saffron', name: 'Kesari Saffron', color: '#FF6D00', pos: [-1.2, 0.04, 7.1] as [number, number, number] },
  { id: 'tangerine', name: 'Auspicious Tangerine', color: '#FF9800', pos: [-0.6, 0.04, 7.35] as [number, number, number] },
  { id: 'white', name: 'Rice Flour White', color: '#FFFFFF', pos: [0.0, 0.04, 7.45] as [number, number, number] },
  { id: 'peacock', name: 'Peacock Turquoise', color: '#00BCD4', pos: [0.6, 0.04, 7.35] as [number, number, number] },
  { id: 'indigo', name: 'Deep Indigo Blue', color: '#1E88E5', pos: [1.2, 0.04, 7.1] as [number, number, number] },
  { id: 'emerald', name: 'Mehendi Green', color: '#4CAF50', pos: [1.8, 0.04, 6.7] as [number, number, number] },
  { id: 'pista', name: 'Pistachio Green', color: '#8BC34A', pos: [2.2, 0.04, 6.2] as [number, number, number] },
  { id: 'gulal', name: 'Rani Pink / Gulal', color: '#E91E63', pos: [2.5, 0.04, 5.6] as [number, number, number] },
  { id: 'purple', name: 'Royal Jamuni Purple', color: '#9C27B0', pos: [-2.5, 0.04, 5.6] as [number, number, number] },
  { id: 'coral', name: 'Coral Rose', color: '#FF5252', pos: [0.0, 0.04, 7.85] as [number, number, number] },
];

// 8 Distinct 3D Physical Stencil Designs
export const DESIGN_TEMPLATES: Array<{
  id: RangoliDesignType;
  title: string;
  icon: string;
  desc: string;
  pos: [number, number, number];
}> = [
  { id: 'mandala', title: 'Circular Mandala', icon: '☸️', desc: 'Concentric 12-petal sacred mandala', pos: [-4.2, 0.6, 3.8] },
  { id: 'lotus', title: 'Sacred Lotus', icon: '🪷', desc: 'Kamal tiered blooming lotus petals', pos: [-4.2, 0.6, 4.4] },
  { id: 'peacock', title: 'Mayur Peacock', icon: '🦚', desc: 'Auspicious feathered dancing peacock', pos: [-4.2, 0.6, 5.0] },
  { id: 'diya', title: 'Deepak Diya', icon: '🪔', desc: 'Radiating oil lamps with golden flames', pos: [-4.2, 0.6, 5.6] },
  { id: 'geometric', title: 'Star Kolam', icon: '⭐', desc: 'Geometric overlapping star yantra', pos: [-4.2, 0.6, 6.2] },
  { id: 'floral', title: 'Floral Garland', icon: '🌺', desc: 'Traditional marigold floral wreath', pos: [-4.2, 0.6, 6.8] },
  { id: 'symmetry', title: 'Alpona Symmetry', icon: '💠', desc: '8-fold symmetrical folk pattern', pos: [-4.2, 0.6, 7.4] },
  { id: 'freehand', title: 'Freehand Studio', icon: '✨', desc: 'Draw custom lines, dots & curves', pos: [-4.2, 0.6, 8.0] },
];

export const CourtyardRangoli: React.FC = () => {
  const { camera } = useThree();
  const {
    rangoliDesign,
    rangoliMode,
    rangoliSymmetry,
    rangoliSections,
    freehandPoints,
    placedRangoliDiyas,
    placedRangoliPetals,
    rangoliCompleted,
    heldPowderColor,
    heldPowderName,
    pickUpPowder,
    setRangoliDesign,
    setRangoliSymmetry,
    sprinklePowderOnRangoli,
    addFreehandPowder,
    placeRangoliDecorationDiya,
    placeRangoliFlowerPetals,
    resetRangoliComplete,
    setActivePrompt,
    activePrompt,
  } = useGameState();

  const rangoliCenter = useMemo(() => new THREE.Vector3(0, 0.02, 5), []);
  const celebrationRef = useRef<THREE.Points>(null);

  // Completed celebration particles
  const celebrationPositions = useMemo(() => {
    const pos = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2.0;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 0.05 + Math.random() * 1.0;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame(state => {
    const playerPos = camera.position;

    if (rangoliCompleted && celebrationRef.current) {
      celebrationRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    }

    // 1. Proximity to Design Reference Stencil Tablets at [ -4.2, 0.6, Z ]
    for (const tpl of DESIGN_TEMPLATES) {
      const tVec = new THREE.Vector3(...tpl.pos);
      if (playerPos.distanceTo(tVec) < 1.6) {
        if (activePrompt?.id !== `select-design-${tpl.id}`) {
          setActivePrompt({
            id: `select-design-${tpl.id}`,
            label: `${tpl.icon} Select ${tpl.title}`,
            subtext: tpl.desc + ' — Press [E] or Tap',
            action: () => {
              setRangoliDesign(tpl.id);
              audioManager.playPowderPickup();
            },
          });
        }
        return;
      }
    }

    // 2. Proximity to Tool Station: Symmetry Stone at [ 3.4, 0.4, 5.0 ]
    const symmetryStonePos = new THREE.Vector3(3.4, 0.4, 5.0);
    if (playerPos.distanceTo(symmetryStonePos) < 1.6) {
      const nextSymmetry = (rangoliSymmetry === 8 ? 4 : rangoliSymmetry === 4 ? 6 : rangoliSymmetry === 6 ? 1 : 8) as 1 | 4 | 6 | 8;
      if (activePrompt?.id !== 'toggle-symmetry') {
        setActivePrompt({
          id: 'toggle-symmetry',
          label: `💠 Symmetry Tool: ${rangoliSymmetry}x Folds`,
          subtext: `Press [E] or Tap to cycle (Current: ${rangoliSymmetry}x)`,
          action: () => {
            setRangoliSymmetry(nextSymmetry);
            audioManager.playPowderPickup();
          },
        });
      }
      return;
    }

    // 3. Proximity to Flower Petal Basket at [ 3.4, 0.4, 6.0 ]
    const petalBasketPos = new THREE.Vector3(3.4, 0.4, 6.0);
    if (playerPos.distanceTo(petalBasketPos) < 1.6) {
      if (activePrompt?.id !== 'place-flower-petals') {
        setActivePrompt({
          id: 'place-flower-petals',
          label: '🌸 Marigold Petal Basket',
          subtext: 'Press [E] or Tap to scatter floral border',
          action: () => {
            const angle = Math.random() * Math.PI * 2;
            const r = 1.7 + Math.random() * 0.25;
            placeRangoliFlowerPetals(Math.cos(angle) * r, 5 + Math.sin(angle) * r, Math.random() > 0.5 ? '#FF9800' : '#FFD54F');
            audioManager.playPowderSprinkle();
          },
        });
      }
      return;
    }

    // 4. Proximity to Mini Brass Diya Tray at [ 3.4, 0.4, 7.0 ]
    const diyaTrayPos = new THREE.Vector3(3.4, 0.4, 7.0);
    if (playerPos.distanceTo(diyaTrayPos) < 1.6) {
      if (activePrompt?.id !== 'place-mini-diya') {
        setActivePrompt({
          id: 'place-mini-diya',
          label: '🪔 Brass Diyas Tray',
          subtext: 'Press [E] or Tap to place glowing diya on edge',
          action: () => {
            const angle = (placedRangoliDiyas.length * Math.PI) / 4;
            const r = 1.95;
            placeRangoliDecorationDiya(Math.cos(angle) * r, 5 + Math.sin(angle) * r);
            audioManager.playDiyaLight();
          },
        });
      }
      return;
    }

    // 5. Proximity to Undo & Reset Table at [ 3.4, 0.4, 4.0 ]
    const resetTablePos = new THREE.Vector3(3.4, 0.4, 4.0);
    if (playerPos.distanceTo(resetTablePos) < 1.6) {
      if (activePrompt?.id !== 'undo-reset-rangoli') {
        setActivePrompt({
          id: 'undo-reset-rangoli',
          label: '🧹 Clear & Start Fresh',
          subtext: 'Press [E] to Reset Rangoli Canvas',
          action: () => {
            resetRangoliComplete();
            audioManager.playDoorToggle();
          },
        });
      }
      return;
    }

    // 6. Proximity to 12 Physical Powder Bowls
    let nearestBowl: typeof POWDER_PALETTE[0] | null = null;
    let minBowlDist = Infinity;

    for (const bowl of POWDER_PALETTE) {
      const bVec = new THREE.Vector3(...bowl.pos);
      const d = playerPos.distanceTo(bVec);
      if (d < 1.8 && d < minBowlDist) {
        minBowlDist = d;
        nearestBowl = bowl;
      }
    }

    if (nearestBowl) {
      if (activePrompt?.id !== `take-powder-${nearestBowl.id}`) {
        setActivePrompt({
          id: `take-powder-${nearestBowl.id}`,
          label: `Take ${nearestBowl.name} 🎨`,
          subtext: 'Press [E] or Tap to scoop powder in hand',
          action: () => {
            pickUpPowder(nearestBowl!.color, nearestBowl!.name);
            audioManager.playPowderPickup();
          },
        });
      }
      return;
    }

    // 7. Proximity to the Rangoli Ground Canvas at [0, 0, 5]
    const distToRangoli = playerPos.distanceTo(rangoliCenter);
    if (distToRangoli < 3.2) {
      if (rangoliMode === 'freehand') {
        // Freehand drawing mode
        if (activePrompt?.id !== 'draw-freehand-powder') {
          setActivePrompt({
            id: 'draw-freehand-powder',
            label: `✨ Sprinkle ${heldPowderName || 'Powder'} (${rangoliSymmetry}x Symmetry)`,
            subtext: 'Press [E] or Tap to deposit powder on ground',
            action: () => {
              const forward = new THREE.Vector3();
              camera.getWorldDirection(forward);
              const groundY = 0.02;
              const t = (groundY - camera.position.y) / forward.y;
              const hitX = camera.position.x + forward.x * t;
              const hitZ = camera.position.z + forward.z * t;

              const drawX = isFinite(hitX) && Math.abs(hitX) < 2.2 ? hitX : playerPos.x + forward.x * 1.5;
              const drawZ = isFinite(hitZ) && Math.abs(hitZ - 5) < 2.2 ? hitZ : playerPos.z + forward.z * 1.5;

              addFreehandPowder(drawX, drawZ);
              audioManager.playPowderSprinkle();
            },
          });
        }
      } else {
        // Stencil filling mode
        const angleToPlayer = Math.atan2(playerPos.z - rangoliCenter.z, playerPos.x - rangoliCenter.x);
        let petalIdx = Math.floor(((angleToPlayer + Math.PI) / (Math.PI * 2)) * 6) % 6;
        if (petalIdx < 0) petalIdx += 6;
        const targetKey = distToRangoli < 2.0 ? `inner-${petalIdx}` : `outer-${petalIdx}`;

        if (activePrompt?.id !== `sprinkle-rangoli-${targetKey}`) {
          setActivePrompt({
            id: `sprinkle-rangoli-${targetKey}`,
            label: `Sprinkle ${heldPowderName || 'Powder'} on Section`,
            subtext: `Press [E] or Tap to color Section ${petalIdx + 1}`,
            action: () => {
              sprinklePowderOnRangoli(targetKey);
              audioManager.playPowderSprinkle();
              if (rangoliCompleted) {
                audioManager.playRangoliCompleteChime();
              }
            },
          });
        }
      }
      return;
    }

    // Clear prompt if moved away
    if (
      activePrompt &&
      (activePrompt.id.startsWith('take-powder') ||
        activePrompt.id.startsWith('select-design') ||
        activePrompt.id.startsWith('sprinkle-rangoli') ||
        activePrompt.id === 'draw-freehand-powder' ||
        activePrompt.id === 'toggle-symmetry' ||
        activePrompt.id === 'place-flower-petals' ||
        activePrompt.id === 'place-mini-diya' ||
        activePrompt.id === 'undo-reset-rangoli')
    ) {
      setActivePrompt(null);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ==============================================================
          PHYSICAL 3D DESIGN SELECTION TABLET RACK (Left of Rangoli)
          ============================================================== */}
      <group position={[-4.2, 0, 5.9]}>
        {/* Tiered Sandstone Supply Bench */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.9, 4.6]} />
          <meshStandardMaterial color="#3E2723" roughness={0.7} />
        </mesh>
        {/* Signboard */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[0.9, 0.25, 4.4]} />
          <meshStandardMaterial color="#FFB300" roughness={0.5} />
        </mesh>

        {/* 8 Physical 3D Design Stencil References */}
        {DESIGN_TEMPLATES.map((tpl, i) => {
          const isSelected = rangoliDesign === tpl.id;
          return (
            <group key={tpl.id} position={[0, 0.52, (i - 3.5) * 0.55]}>
              {/* Carved Wooden Tablet Stand */}
              <mesh rotation={[0, 0, 0.25]} castShadow>
                <boxGeometry args={[0.35, 0.35, 0.05]} />
                <meshStandardMaterial
                  color={isSelected ? '#FFD700' : '#8D6E63'}
                  metalness={isSelected ? 0.8 : 0.1}
                  roughness={0.4}
                />
              </mesh>
              {/* Decorative Stencil Pattern Emblem */}
              <mesh position={[0, 0.08, 0.04]}>
                <circleGeometry args={[0.12, 16]} />
                <meshStandardMaterial
                  color={isSelected ? '#D84315' : '#D7CCC8'}
                  roughness={0.5}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ==============================================================
          PHYSICAL 3D ARTISTIC TOOLS TABLE (Right of Rangoli)
          ============================================================== */}
      <group position={[3.4, 0, 5.5]}>
        {/* Tool Bench */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.8, 3.6]} />
          <meshStandardMaterial color="#3E2723" roughness={0.7} />
        </mesh>

        {/* 1. Symmetry Stone Plinth at relative Z: -0.5 */}
        <group position={[0, 0.45, -0.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.22, 0.12, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <octahedronGeometry args={[0.08, 0]} />
            <meshBasicMaterial color="#FF5722" />
          </mesh>
        </group>

        {/* 2. Marigold Petal Woven Basket at relative Z: 0.5 */}
        <group position={[0, 0.45, 0.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.16, 0.14, 16]} />
            <meshStandardMaterial color="#8D6E63" roughness={0.9} />
          </mesh>
          {/* Petals pile */}
          <mesh position={[0, 0.06, 0]}>
            <sphereGeometry args={[0.18, 12, 8]} />
            <meshStandardMaterial color="#FF9800" roughness={0.6} />
          </mesh>
        </group>

        {/* 3. Brass Diya Placement Tray at relative Z: 1.5 */}
        <group position={[0, 0.44, 1.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.24, 0.24, 0.04, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <coneGeometry args={[0.08, 0.08, 8]} />
            <meshBasicMaterial color="#FF5722" />
          </mesh>
        </group>

        {/* 4. Ganga Jal Sacred Water Vessel (Reset/Clear) at relative Z: -1.5 */}
        <group position={[0, 0.45, -1.5]}>
          <mesh castShadow>
            <sphereGeometry args={[0.14, 14, 14]} />
            <meshStandardMaterial color="#B8860B" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.08, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ==============================================================
          PHYSICAL 3D RANGOLI CANVAS ON COURTYARD SANDSTONE FLOOR [0, 0.02, 5]
          ============================================================== */}
      <group position={[0, 0.02, 5]}>
        {/* Outer Circular Ground Terracotta Base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[2.0, 36]} />
          <meshStandardMaterial color="#4A1C17" roughness={0.8} />
        </mesh>

        {/* Decorative Golden Border Ring */}
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.75, 1.95, 36]} />
          <meshStandardMaterial
            color={rangoliSections['border'] || '#D4AF37'}
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>

        {/* ==============================================================
            ACTIVE DESIGN PATTERNS (Mandala, Lotus, Peacock, Diya, etc.)
            ============================================================== */}

        {/* DESIGN 1: Mandala & Symmetry Pattern */}
        {(rangoliDesign === 'mandala' || rangoliDesign === 'symmetry') && (
          <group>
            {/* 6 Outer Fan Petals */}
            {[...Array(6)].map((_, i) => {
              const angle = (i * Math.PI) / 3 + Math.PI / 6;
              const color = rangoliSections[`outer-${i}`] || '#DDD0B8';
              const x = Math.cos(angle) * 1.32;
              const z = Math.sin(angle) * 1.32;
              return (
                <mesh
                  key={`outer-${i}`}
                  position={[x, 0.01, z]}
                  rotation={[-Math.PI / 2, 0, -angle]}
                >
                  <coneGeometry args={[0.34, 0.58, 16]} />
                  <meshStandardMaterial color={color} roughness={0.6} />
                </mesh>
              );
            })}

            {/* 6 Inner Lotus Petals */}
            {[...Array(6)].map((_, i) => {
              const angle = (i * Math.PI) / 3;
              const color = rangoliSections[`inner-${i}`] || '#E8DCC4';
              const x = Math.cos(angle) * 0.75;
              const z = Math.sin(angle) * 0.75;
              return (
                <group key={`inner-${i}`} position={[x, 0.015, z]} rotation={[0, -angle, 0]}>
                  <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.24, 0.18, 0.02, 16]} />
                    <meshStandardMaterial color={color} roughness={0.5} />
                  </mesh>
                </group>
              );
            })}
          </group>
        )}

        {/* DESIGN 2: Sacred Lotus (Kamal) */}
        {rangoliDesign === 'lotus' && (
          <group>
            {[...Array(8)].map((_, i) => {
              const angle = (i * Math.PI) / 4;
              const color = rangoliSections[`inner-${i % 6}`] || '#E8DCC4';
              const x = Math.cos(angle) * 0.95;
              const z = Math.sin(angle) * 0.95;
              return (
                <mesh
                  key={`lotus-${i}`}
                  position={[x, 0.012, z]}
                  rotation={[-Math.PI / 2, 0, -angle]}
                >
                  <coneGeometry args={[0.28, 0.7, 16]} />
                  <meshStandardMaterial color={color} roughness={0.5} />
                </mesh>
              );
            })}
          </group>
        )}

        {/* DESIGN 3: Mayur Peacock */}
        {rangoliDesign === 'peacock' && (
          <group>
            {[...Array(7)].map((_, i) => {
              const angle = -Math.PI * 0.4 + (i * Math.PI * 0.8) / 6;
              const color = rangoliSections[`outer-${i % 6}`] || '#00BCD4';
              const x = Math.cos(angle) * 1.25;
              const z = Math.sin(angle) * 1.25 - 0.2;
              return (
                <group key={`peacock-${i}`} position={[x, 0.012, z]}>
                  <mesh rotation={[-Math.PI / 2, 0, -angle]}>
                    <cylinderGeometry args={[0.18, 0.12, 0.02, 12]} />
                    <meshStandardMaterial color={color} roughness={0.5} />
                  </mesh>
                  <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.08, 12]} />
                    <meshStandardMaterial color="#FFD54F" roughness={0.4} />
                  </mesh>
                </group>
              );
            })}
            <mesh position={[0, 0.02, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.14, 0.025, 16]} />
              <meshStandardMaterial color="#1E88E5" roughness={0.4} />
            </mesh>
          </group>
        )}

        {/* DESIGN 4: Deepak Diya Pattern */}
        {rangoliDesign === 'diya' && (
          <group>
            {[...Array(8)].map((_, i) => {
              const angle = (i * Math.PI) / 4;
              const color = rangoliSections[`inner-${i % 6}`] || '#FF9800';
              const x = Math.cos(angle) * 1.1;
              const z = Math.sin(angle) * 1.1;
              return (
                <group key={`diya-pat-${i}`} position={[x, 0.015, z]}>
                  <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.18, 0.12, 0.02, 12]} />
                    <meshStandardMaterial color={color} roughness={0.5} />
                  </mesh>
                  <mesh position={[0, 0.02, -0.15]}>
                    <coneGeometry args={[0.06, 0.12, 8]} />
                    <meshBasicMaterial color="#FF5722" />
                  </mesh>
                </group>
              );
            })}
          </group>
        )}

        {/* DESIGN 5: Geometric Star Kolam */}
        {rangoliDesign === 'geometric' && (
          <group>
            {[0, Math.PI / 4].map((rot, idx) => (
              <mesh key={`star-${idx}`} position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, rot]}>
                <ringGeometry args={[0.6, 1.4, 4]} />
                <meshStandardMaterial
                  color={idx === 0 ? rangoliSections['inner-0'] || '#FFD54F' : rangoliSections['inner-1'] || '#E91E63'}
                  roughness={0.5}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* DESIGN 6: Floral Wreath */}
        {rangoliDesign === 'floral' && (
          <group>
            {[...Array(12)].map((_, i) => {
              const angle = (i * Math.PI) / 6;
              const color = rangoliSections[`outer-${i % 6}`] || '#FF6D00';
              const x = Math.cos(angle) * 1.35;
              const z = Math.sin(angle) * 1.35;
              return (
                <mesh key={`flora-${i}`} position={[x, 0.012, z]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[0.18, 12]} />
                  <meshStandardMaterial color={color} roughness={0.6} />
                </mesh>
              );
            })}
          </group>
        )}

        {/* Center Floral Bindu (Core) */}
        <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.36, 24]} />
          <meshStandardMaterial
            color={rangoliSections['center'] || '#FF6B35'}
            roughness={0.4}
          />
        </mesh>

        {/* Center Brass Diya */}
        <group position={[0, 0.035, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.08, 0.06, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
          </mesh>
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

        {/* ==============================================================
            FREEHAND 3D POWDER PARTICLES & STROKES ON CANVAS
            ============================================================== */}
        {freehandPoints.map(pt => (
          <mesh key={pt.id} position={[pt.x, 0.018, pt.z - 5]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[pt.size || 0.05, 8]} />
            <meshStandardMaterial color={pt.color} roughness={0.8} />
          </mesh>
        ))}

        {/* ==============================================================
            PLACED CUSTOM DECORATIONS: FLOWER PETALS & MINI DIYAS
            ============================================================== */}
        {placedRangoliPetals.map(pet => (
          <mesh key={pet.id} position={[pet.x, 0.022, pet.z - 5]} rotation={[-Math.PI / 2, 0, Math.random()]}>
            <circleGeometry args={[0.045, 6]} />
            <meshStandardMaterial color={pet.color} roughness={0.7} />
          </mesh>
        ))}

        {placedRangoliDiyas.map(diy => (
          <group key={diy.id} position={[diy.x, 0.02, diy.z - 5]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.065, 0.04, 0.035, 10]} />
              <meshStandardMaterial color="#B8860B" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.035, 0]}>
              <sphereGeometry args={[0.02, 6, 6]} />
              <meshBasicMaterial color="#FF9800" />
            </mesh>
          </group>
        ))}

        {/* Completed Artwork Celebration Sparkles */}
        {rangoliCompleted && (
          <points ref={celebrationRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[celebrationPositions, 3]}
              />
            </bufferGeometry>
            <pointsMaterial size={0.038} color="#FFD700" transparent opacity={0.85} />
          </points>
        )}
      </group>

      {/* ==============================================================
          12 PHYSICAL BRASS POWDER BOWLS ON THE COURTYARD FLOOR
          ============================================================== */}
      {POWDER_PALETTE.map(bowl => {
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

            {/* Selection Aura if currently held */}
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

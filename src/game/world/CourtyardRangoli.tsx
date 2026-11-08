import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState, RangoliDesignType } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';
import { registerInteractive, unregisterInteractive } from '../controls/FirstPersonController';

// 8 Vibrant Indian Rangoli Powders in Brass Bowls arranged along courtyard plinth
export const RANGOLI_POWDERS = [
  { id: 'sindoor', name: 'Sindoor Red', color: '#D32F2F', pos: [-1.8, 0.08, 6.2] as [number, number, number] },
  { id: 'marigold', name: 'Marigold Yellow', color: '#FFD54F', pos: [-1.2, 0.08, 6.6] as [number, number, number] },
  { id: 'saffron', name: 'Kesari Saffron', color: '#FF6D00', pos: [-0.6, 0.08, 6.8] as [number, number, number] },
  { id: 'white', name: 'Rice Flour White', color: '#FFFFFF', pos: [0.0, 0.08, 6.9] as [number, number, number] },
  { id: 'peacock', name: 'Peacock Turquoise', color: '#00BCD4', pos: [0.6, 0.08, 6.8] as [number, number, number] },
  { id: 'gulal', name: 'Rani Pink / Gulal', color: '#E91E63', pos: [1.2, 0.08, 6.6] as [number, number, number] },
  { id: 'mehendi', name: 'Mehendi Green', color: '#4CAF50', pos: [1.8, 0.08, 6.2] as [number, number, number] },
];

export const CourtyardRangoli: React.FC = () => {
  const {
    rangoliDesign,
    setRangoliDesign,
    rangoliSections,
    sprinklePowderOnRangoli,
    heldPowderColor,
    heldPowderName,
    pickUpPowder,
    handItem,
  } = useGameState();

  const celebrationRef = useRef<THREE.Points>(null);
  const rangoliCenter = useMemo(() => new THREE.Vector3(0, 0.05, 5.0), []);

  // Register interactive powder bowls and central rangoli
  useEffect(() => {
    // 1. Powder Bowls
    RANGOLI_POWDERS.forEach(pwd => {
      registerInteractive({
        id: `pwd-${pwd.id}`,
        label: `Take ${pwd.name} Powder 🎨`,
        subtext: 'Press [E] or Tap to take bowl into hand',
        position: new THREE.Vector3(...pwd.pos),
        maxDistance: 2.4,
        action: () => {
          pickUpPowder(pwd.color, pwd.name);
          audioManager.playPowderPickup();
        },
      });
    });

    // 2. Central Rangoli Canvas
    registerInteractive({
      id: 'sprinkle-rangoli',
      label: handItem === 'powder' ? `Sprinkle ${heldPowderName || 'Powder'} on Rangoli ✨` : 'Examine Rangoli Artwork 🪷',
      subtext: handItem === 'powder' ? 'Press [E] or Tap to add colors & petals' : 'Take a powder bowl to add vibrant color',
      position: rangoliCenter,
      maxDistance: 2.8,
      action: () => {
        if (handItem === 'powder' && heldPowderColor) {
          // Sprinkle on next section
          const sections = Object.keys(rangoliSections);
          const randSec = sections[Math.floor(Math.random() * sections.length)];
          sprinklePowderOnRangoli(randSec);
          audioManager.playPowderSprinkle();
        } else {
          // Cycle design
          const designs: RangoliDesignType[] = ['mandala', 'lotus', 'peacock', 'diya'];
          const nextIdx = (designs.indexOf(rangoliDesign) + 1) % designs.length;
          setRangoliDesign(designs[nextIdx]);
          audioManager.playManjiraChime();
        }
      },
    });

    return () => {
      RANGOLI_POWDERS.forEach(pwd => unregisterInteractive(`pwd-${pwd.id}`));
      unregisterInteractive('sprinkle-rangoli');
    };
  }, [handItem, heldPowderColor, heldPowderName, rangoliSections, rangoliDesign, pickUpPowder, sprinklePowderOnRangoli, setRangoliDesign, rangoliCenter]);

  // Gentle particle rotation
  useFrame((state) => {
    if (celebrationRef.current) {
      celebrationRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group position={[0, 0, 5.0]}>
      {/* ==============================================================
          1. RAISED CIRCULAR SANDSTONE PLINTH IN COURTYARD CENTER
          ============================================================== */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[2.0, 2.08, 0.04, 36]} />
        <meshStandardMaterial color="#B87333" roughness={0.7} />
      </mesh>
      {/* Gold Trim Inlay */}
      <mesh position={[0, 0.042, 0]}>
        <torusGeometry args={[1.98, 0.015, 8, 36]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.25} />
      </mesh>

      {/* ==============================================================
          2. RANGOLI ARTWORK MOTIFS (CONCENTRIC PETALS & MANDALA)
          ============================================================== */}
      {/* Base White Rice Flour Border Circle */}
      <mesh position={[0, 0.044, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.85, 36]} />
        <meshStandardMaterial
          color={rangoliSections['border'] || '#FFF'}
          roughness={0.9}
        />
      </mesh>

      {/* Outer Floral Petal Ring (12 Petals) */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const color = rangoliSections[`outer-${i % 6}`] || (i % 2 === 0 ? '#E91E63' : '#FFD54F');
        return (
          <group
            key={`outer-petal-${i}`}
            position={[Math.cos(angle) * 1.35, 0.046, Math.sin(angle) * 1.35]}
            rotation={[0, -angle, 0]}
          >
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.32, 16]} />
              <meshStandardMaterial color={color} roughness={0.85} />
            </mesh>
          </group>
        );
      })}

      {/* Mid Turquoise / Saffron Lotus Petals (8 Petals) */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const color = rangoliSections[`inner-${i % 6}`] || (i % 2 === 0 ? '#00BCD4' : '#FF6D00');
        return (
          <group
            key={`mid-petal-${i}`}
            position={[Math.cos(angle) * 0.78, 0.048, Math.sin(angle) * 0.78]}
            rotation={[0, -angle, 0]}
          >
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.26, 14]} />
              <meshStandardMaterial color={color} roughness={0.85} />
            </mesh>
          </group>
        );
      })}

      {/* Center Sacred Golden Mandala Disc */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.36, 24]} />
        <meshStandardMaterial
          color={rangoliSections['center'] || '#FFD700'}
          roughness={0.7}
        />
      </mesh>
      {/* Center Auspicious Floral Star Motif */}
      <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.32, 8]} />
        <meshStandardMaterial color="#D32F2F" roughness={0.8} />
      </mesh>

      {/* ==============================================================
          3. SURROUNDING CLAY DIYAS WITH FLICKERING FLAMES
          ============================================================== */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dx = Math.cos(angle) * 1.88;
        const dz = Math.sin(angle) * 1.88;
        return (
          <group key={`rangoli-diya-${i}`} position={[dx, 0.045, dz]}>
            {/* Terracotta Clay Cup */}
            <mesh castShadow>
              <cylinderGeometry args={[0.065, 0.04, 0.038, 10]} />
              <meshStandardMaterial color="#A35334" roughness={0.75} />
            </mesh>
            {/* Glowing Flame */}
            <mesh position={[0, 0.032, 0]}>
              <coneGeometry args={[0.016, 0.045, 8]} />
              <meshBasicMaterial color="#FF9900" />
            </mesh>
          </group>
        );
      })}

      {/* Warm Illuminating Light casting over Rangoli */}
      <pointLight position={[0, 0.45, 0]} color="#FFA500" intensity={2.8} distance={4.5} decay={2} />

      {/* ==============================================================
          4. BRASS POWDER BOWLS ARRANGED ALONG ARC FOR PLAYER INTERACTION
          ============================================================== */}
      {RANGOLI_POWDERS.map(pwd => (
        <group key={`bowl-${pwd.id}`} position={[pwd.pos[0], pwd.pos[1] - 0.02, pwd.pos[2] - 5.0]}>
          {/* Polished Brass Katori (Bowl) */}
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.07, 0.06, 16]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.25} />
          </mesh>
          {/* Mounded Rich Vibrant Color Powder */}
          <mesh position={[0, 0.03, 0]}>
            <sphereGeometry args={[0.088, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={pwd.color} roughness={0.92} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

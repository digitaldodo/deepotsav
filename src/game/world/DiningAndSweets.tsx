import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState, SweetType } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

export const DiningAndSweets: React.FC = () => {
  const {
    playerPosition,
    setActivePrompt,
    sweetsRemaining,
    pickUpSweet,
    consumeHeldSweet,
    handItem,
    heldSweetType,
  } = useGameState();

  const platterRef = useRef<THREE.Group>(null);

  // Proximity check to dining table at [ 4.5, 0, -5 ]
  useFrame(() => {
    const dist = Math.hypot(playerPosition[0] - 4.5, playerPosition[2] - (-5));
    if (dist < 2.5) {
      // If already holding a sweet in hand, offer action to eat it!
      if (handItem === 'sweet' && heldSweetType) {
        const sweetNames: Record<SweetType, string> = {
          laddoo: 'Motichoor Laddoo',
          kajuKatli: 'Kaju Katli',
          gulabJamun: 'Gulab Jamun',
          barfi: 'Pista Barfi',
          modak: 'Mawa Modak',
        };

        setActivePrompt({
          id: `consume-held-${heldSweetType}`,
          label: `Eat ${sweetNames[heldSweetType]} 😋`,
          subtext: 'Press [E] or Tap to bring to mouth and savor',
          action: () => {
            consumeHeldSweet();
            audioManager.playEatSweet();
          },
        });
        return;
      }

      // Otherwise, find an available sweet on the platter to pick up
      const sweetTypes: SweetType[] = ['laddoo', 'kajuKatli', 'gulabJamun', 'barfi', 'modak'];
      const available = sweetTypes.find(t => sweetsRemaining[t] > 0);

      if (available) {
        const labels: Record<SweetType, string> = {
          laddoo: 'Pick up Motichoor Laddoo 🟡',
          kajuKatli: 'Pick up Kaju Katli 💎',
          gulabJamun: 'Pick up Gulab Jamun 🟤',
          barfi: 'Pick up Pista Barfi 🟩',
          modak: 'Pick up Mawa Modak 🥟',
        };

        setActivePrompt({
          id: `pickup-${available}`,
          label: labels[available],
          subtext: 'Press [E] or Tap to pick into your hand',
          action: () => {
            pickUpSweet(available);
            audioManager.playPowderPickup();
          },
        });
        return;
      }
    }
  });

  return (
    <group position={[4.5, 0, -5]}>
      {/* Sheesham Dining Table */}
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.1, 1.8]} />
        <meshStandardMaterial color="#422212" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Table Legs */}
      {[-1.4, 1.4].map((x, i) =>
        [-0.7, 0.7].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.42, z]} castShadow>
            <cylinderGeometry args={[0.06, 0.04, 0.84, 12]} />
            <meshStandardMaterial color="#30180B" roughness={0.5} />
          </mesh>
        ))
      )}

      {/* Decorative Silk Table Runner */}
      <mesh position={[0, 0.91, 0]} receiveShadow>
        <boxGeometry args={[3.0, 0.01, 0.8]} />
        <meshStandardMaterial color="#9B111E" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.915, 0]}>
        <boxGeometry args={[2.9, 0.01, 0.1]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Traditional Brass Sweets Thali (Platter) */}
      <group position={[0, 0.94, 0]} ref={platterRef}>
        {/* Round Brass Platter with Engraved Lip */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.65, 0.6, 0.04, 32]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <ringGeometry args={[0.55, 0.64, 32]} />
          <meshStandardMaterial color="#B8860B" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>

        {/* 1. Laddoos (Golden Boondi Spheres with Pistachio bits) */}
        {[...Array(sweetsRemaining.laddoo)].map((_, i) => (
          <mesh
            key={`laddoo-${i}`}
            position={[-0.25 + (i % 2) * 0.15, 0.06, -0.2 + Math.floor(i / 2) * 0.15]}
            castShadow
          >
            <sphereGeometry args={[0.055, 14, 14]} />
            <meshStandardMaterial color="#FFB300" roughness={0.65} />
          </mesh>
        ))}

        {/* 2. Kaju Katli (Silver-leaf diamond rhombus slices) */}
        {[...Array(sweetsRemaining.kajuKatli)].map((_, i) => (
          <mesh
            key={`kaju-${i}`}
            position={[0.2 + (i % 2) * 0.14, 0.04, -0.2 + Math.floor(i / 2) * 0.14]}
            rotation={[0, Math.PI / 4, 0]}
            castShadow
          >
            <boxGeometry args={[0.08, 0.02, 0.08]} />
            <meshStandardMaterial color="#ECECEC" metalness={0.65} roughness={0.2} />
          </mesh>
        ))}

        {/* 3. Gulab Jamun (Deep brown fried milk dumplings in cardamom syrup) */}
        {[...Array(sweetsRemaining.gulabJamun)].map((_, i) => (
          <mesh
            key={`jamun-${i}`}
            position={[-0.15 + i * 0.14, 0.05, 0.15]}
            castShadow
          >
            <sphereGeometry args={[0.05, 14, 14]} />
            <meshStandardMaterial color="#4A1806" roughness={0.3} metalness={0.15} />
          </mesh>
        ))}

        {/* 4. Pista Barfi (Vibrant emerald green fudge squares with pistachio crumbs) */}
        {[...Array(sweetsRemaining.barfi)].map((_, i) => (
          <mesh
            key={`barfi-${i}`}
            position={[0.15 + (i % 2) * 0.12, 0.045, 0.2 + Math.floor(i / 2) * 0.12]}
            castShadow
          >
            <boxGeometry args={[0.075, 0.03, 0.075]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.5} />
          </mesh>
        ))}

        {/* 5. Modak (Lord Ganesha's sacred fluted sweet dumpling in center) */}
        {[...Array(sweetsRemaining.modak)].map((_, i) => (
          <mesh
            key={`modak-${i}`}
            position={[0, 0.06 + i * 0.05, 0]}
            castShadow
          >
            <coneGeometry args={[0.06, 0.09, 14]} />
            <meshStandardMaterial color="#FFF8E7" roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

export const DiningAndSweets: React.FC = () => {
  const { playerPosition, setActivePrompt, sweetsRemaining, eatSweet, lastSweetEaten } = useGameState();
  const platterRef = useRef<THREE.Group>(null);

  // Proximity check to dining table at [ 4.5, 0, -5 ]
  useFrame(() => {
    const dist = Math.hypot(playerPosition[0] - 4.5, playerPosition[2] - (-5));
    if (dist < 2.5) {
      // Find an available sweet to offer
      const sweetTypes = ['laddoo', 'kajuKatli', 'gulabJamun', 'barfi', 'modak'] as const;
      const available = sweetTypes.find(t => sweetsRemaining[t] > 0);

      if (available) {
        const labels: Record<string, string> = {
          laddoo: 'Eat Motichoor Laddoo 🟡',
          kajuKatli: 'Eat Kaju Katli 💎',
          gulabJamun: 'Eat Gulab Jamun 🟤',
          barfi: 'Eat Pista Barfi 🟩',
          modak: 'Eat Mawa Modak 🥟',
        };

        setActivePrompt({
          id: `eat-${available}`,
          label: labels[available],
          subtext: 'Press [E] or Tap to Savor Sweet',
          action: () => {
            audioManager.playEatSweet();
            eatSweet(available);
          },
        });
      }
    }
  });

  return (
    <group position={[4.5, 0, -5]}>
      {/* Sheesham Dining Table */}
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.1, 1.8]} />
        <meshStandardMaterial color="#30180B" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Table Legs */}
      {[-1.4, 1.4].map((x, i) =>
        [-0.7, 0.7].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.42, z]} castShadow>
            <cylinderGeometry args={[0.06, 0.04, 0.84, 12]} />
            <meshStandardMaterial color="#241208" roughness={0.4} />
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
        {sweetsRemaining.laddoo > 0 && (
          <group position={[-0.25, 0.05, -0.2]}>
            {[...Array(sweetsRemaining.laddoo)].map((_, idx) => (
              <mesh key={idx} position={[(idx % 2) * 0.1, idx * 0.04, (idx > 1 ? 0.08 : 0)]} castShadow>
                <sphereGeometry args={[0.055, 12, 12]} />
                <meshStandardMaterial color="#FFA500" roughness={0.8} />
              </mesh>
            ))}
          </group>
        )}

        {/* 2. Kaju Katli (Silver Foil Coated Rhombus Diamonds) */}
        {sweetsRemaining.kajuKatli > 0 && (
          <group position={[0.25, 0.04, -0.2]}>
            {[...Array(sweetsRemaining.kajuKatli)].map((_, idx) => (
              <mesh key={idx} position={[idx * 0.04, idx * 0.02, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
                <boxGeometry args={[0.08, 0.025, 0.08]} />
                <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
          </group>
        )}

        {/* 3. Gulab Jamun (Dark Brown Sweet Dumplings in Glistening Syrup) */}
        {sweetsRemaining.gulabJamun > 0 && (
          <group position={[0, 0.05, 0.25]}>
            {[...Array(sweetsRemaining.gulabJamun)].map((_, idx) => (
              <mesh key={idx} position={[(idx - 1) * 0.09, 0, 0]} castShadow>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color="#4A1C08" roughness={0.3} metalness={0.1} />
              </mesh>
            ))}
          </group>
        )}

        {/* 4. Pista Barfi (Light Green Layered Fudge) */}
        {sweetsRemaining.barfi > 0 && (
          <group position={[-0.28, 0.04, 0.15]}>
            {[...Array(sweetsRemaining.barfi)].map((_, idx) => (
              <mesh key={idx} position={[0, idx * 0.025, (idx % 2) * 0.06]} castShadow>
                <boxGeometry args={[0.08, 0.025, 0.08]} />
                <meshStandardMaterial color="#88B04B" roughness={0.6} />
              </mesh>
            ))}
          </group>
        )}

        {/* 5. Modak (Steamed Sacred Dumplings with Fluted Apex) */}
        {sweetsRemaining.modak > 0 && (
          <group position={[0.28, 0.05, 0.15]}>
            {[...Array(sweetsRemaining.modak)].map((_, idx) => (
              <mesh key={idx} position={[idx * 0.06, 0, 0]} castShadow>
                <coneGeometry args={[0.045, 0.09, 12]} />
                <meshStandardMaterial color="#FFF8DC" roughness={0.5} />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* Warm Spot illumination over Dining Table & Sweets */}
      <spotLight
        position={[0, 2.8, 0]}
        target-position={[0, 0.9, 0]}
        color="#FFA500"
        intensity={2.2}
        distance={6}
        angle={Math.PI / 3}
        penumbra={0.6}
        castShadow
      />

      {/* Dining Chairs */}
      {[-1.0, 0, 1.0].map((x, i) => (
        <group key={i} position={[x, 0, 1.1]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.45, 0.06, 0.45]} />
            <meshStandardMaterial color="#30180B" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.85, 0.2]} castShadow>
            <boxGeometry args={[0.45, 0.75, 0.05]} />
            <meshStandardMaterial color="#30180B" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

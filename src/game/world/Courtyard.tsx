import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';
import { CourtyardRangoli } from './CourtyardRangoli';

export const Courtyard: React.FC = () => {
  const {
    playerPosition,
    setActivePrompt,
    litDiyas,
    lightTargetDiya,
  } = useGameState();

  // Proximity checks for Tulsi and Pillar Diyas
  useFrame(() => {
    // 1. Proximity to Tulsi Kyari at [ -5, 0, 6 ]
    const distToTulsi = Math.hypot(playerPosition[0] - (-5), playerPosition[2] - 6);
    if (distToTulsi < 2.2 && !litDiyas['tulsi-diya']) {
      setActivePrompt({
        id: 'light-tulsi-diya',
        label: 'Light Tulsi Shrine Diya 🪔',
        subtext: 'Press [E] or Tap to ignite flame with brass stick',
        action: () => {
          audioManager.playDiyaLight();
          lightTargetDiya('tulsi-diya');
        },
      });
      return;
    }

    // 2. Proximity to Courtyard Pillar Diya at [ 5, 0, 6 ]
    const distToCourtyardDiya = Math.hypot(playerPosition[0] - 5, playerPosition[2] - 6);
    if (distToCourtyardDiya < 2.2 && !litDiyas['courtyard-pillar-diya']) {
      setActivePrompt({
        id: 'light-courtyard-diya',
        label: 'Light Lantern Pillar Diya 🪔',
        subtext: 'Press [E] or Tap to ignite flame',
        action: () => {
          audioManager.playDiyaLight();
          lightTargetDiya('courtyard-pillar-diya');
        },
      });
      return;
    }
  });

  const isTulsiLit = litDiyas['tulsi-diya'] ?? false;
  const isPillarLit = litDiyas['courtyard-pillar-diya'] ?? false;

  return (
    <group position={[0, 0, 0]}>
      {/* Courtyard Sandstone Tiled Ground */}
      <mesh position={[0, 0, 7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 14]} />
        <meshStandardMaterial color="#C29B78" roughness={0.7} />
      </mesh>

      {/* Decorative Traditional Red Sandstone Border Pathways */}
      <mesh position={[0, 0.01, 7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 14]} />
        <meshStandardMaterial color="#8F5435" roughness={0.65} />
      </mesh>

      {/* ==============================================================
          PHYSICAL 3D RANGOLI & POWDER BOWLS
          ============================================================== */}
      <CourtyardRangoli />

      {/* Traditional Tulsi Kyari (Sacred Basil Planter Shrine) on Left Courtyard */}
      <group position={[-5, 0, 6]}>
        {/* Ornate Terracotta Base Pillar */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 1.0, 1.0]} />
          <meshStandardMaterial color="#8B3A2B" roughness={0.6} />
        </mesh>
        {/* Trim and Niche */}
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[1.15, 0.1, 1.15]} />
          <meshStandardMaterial color="#B2533E" roughness={0.5} />
        </mesh>
        {/* Basil (Tulsi) Plant on Top */}
        <mesh position={[0, 1.35, 0]} castShadow>
          <sphereGeometry args={[0.38, 12, 12]} />
          <meshStandardMaterial color="#2D5A27" roughness={0.6} />
        </mesh>

        {/* Niche Diya */}
        <group position={[0, 0.65, 0.45]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.05, 0.04, 12]} />
            <meshStandardMaterial color="#C89D42" metalness={0.8} />
          </mesh>
          {isTulsiLit && (
            <group position={[0, 0.04, 0]}>
              <mesh>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshBasicMaterial color="#FF5722" />
              </mesh>
              <mesh position={[0, 0.02, 0]}>
                <coneGeometry args={[0.02, 0.045, 8]} />
                <meshBasicMaterial color="#FFD700" />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* Traditional Indian Charpai (Woven Jute Cot / Bench) on Right Courtyard */}
      <group position={[5.5, 0, 4]} rotation={[0, -0.2, 0]}>
        {/* Wooden Frame */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.08, 1.2]} />
          <meshStandardMaterial color="#5C2C16" roughness={0.5} />
        </mesh>
        {/* Woven Jute Surface */}
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[1.95, 0.04, 0.95]} />
          <meshStandardMaterial color="#DDB892" roughness={0.9} />
        </mesh>
        {/* 4 Turned Wooden Legs */}
        {[
          [-0.95, -0.45],
          [0.95, -0.45],
          [-0.95, 0.45],
          [0.95, 0.45],
        ].map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 0.2, lz]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.4, 8]} />
            <meshStandardMaterial color="#5C2C16" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Carved Stone Pillar with Brass Lantern at [ 5, 0, 6 ] */}
      <group position={[5, 0, 6]}>
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.25, 2.4, 12]} />
          <meshStandardMaterial color="#7F4F24" roughness={0.65} />
        </mesh>
        {/* Brass Lantern on Pillar */}
        <mesh position={[0, 2.6, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.18, 0.45, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Flame inside lantern */}
        {isPillarLit && (
          <group position={[0, 2.6, 0]}>
            <mesh>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color="#FFA500" />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};

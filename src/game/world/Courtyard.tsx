import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

export const Courtyard: React.FC = () => {
  const {
    playerPosition,
    setActivePrompt,
    setRangoliOverlayOpen,
    rangoliCompleted,
    rangoliColors,
    litDiyas,
    lightDiya,
  } = useGameState();

  // Proximity checks for Rangoli and Courtyard Diyas
  useFrame(() => {
    // 1. Proximity to Center Rangoli at [ 0, 0, 5 ]
    const distToRangoli = Math.hypot(playerPosition[0] - 0, playerPosition[2] - 5);
    if (distToRangoli < 2.5) {
      setActivePrompt({
        id: 'create-rangoli',
        label: rangoliCompleted ? 'Edit Courtyard Rangoli 🎨' : 'Design Festive Rangoli 🎨',
        subtext: 'Press [E] or Tap to Open Studio',
        action: () => {
          audioManager.playDiyaLight();
          setRangoliOverlayOpen(true);
        },
      });
      return;
    }

    // 2. Proximity to Tulsi Kyari at [ -5, 0, 6 ]
    const distToTulsi = Math.hypot(playerPosition[0] - (-5), playerPosition[2] - 6);
    if (distToTulsi < 2.2 && !litDiyas['tulsi-diya']) {
      setActivePrompt({
        id: 'light-tulsi-diya',
        label: 'Light Tulsi Kyari Diya 🪔',
        subtext: 'Press [E] or Tap',
        action: () => {
          audioManager.playDiyaLight();
          lightDiya('tulsi-diya');
        },
      });
      return;
    }

    // 3. Proximity to Courtyard Lantern Diya at [ 5, 0, 6 ]
    const distToCourtyardDiya = Math.hypot(playerPosition[0] - 5, playerPosition[2] - 6);
    if (distToCourtyardDiya < 2.2 && !litDiyas['courtyard-pillar-diya']) {
      setActivePrompt({
        id: 'light-courtyard-diya',
        label: 'Light Courtyard Lantern Diya 🪔',
        subtext: 'Press [E] or Tap',
        action: () => {
          audioManager.playDiyaLight();
          lightDiya('courtyard-pillar-diya');
        },
      });
      return;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Courtyard Sandstone Tiled Ground */}
      <mesh position={[0, 0, 7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 14]} />
        <meshStandardMaterial color="#B08968" roughness={0.8} />
      </mesh>

      {/* Decorative Traditional Red Stone Border Pathways */}
      <mesh position={[0, 0.01, 7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3, 14]} />
        <meshStandardMaterial color="#7F4F24" roughness={0.7} />
      </mesh>

      {/* Centerpiece Festive Rangoli Composition at [0, 0.02, 5] */}
      <group position={[0, 0.02, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Outer Ring */}
        <mesh receiveShadow>
          <ringGeometry args={[1.5, 1.8, 32]} />
          <meshStandardMaterial color="#FFD700" roughness={0.5} />
        </mesh>
        {/* Inner Base Disc */}
        <mesh receiveShadow>
          <circleGeometry args={[1.5, 32]} />
          <meshStandardMaterial color="#800020" roughness={0.6} />
        </mesh>

        {/* 8 Dynamic Petals rendered according to rangoliColors state */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const petalColor = rangoliColors[i] || (i % 2 === 0 ? '#FF6B35' : '#FFC107');
          return (
            <group key={i} rotation={[0, 0, angle]}>
              <mesh position={[0, 0.8, 0.01]}>
                <circleGeometry args={[0.3, 16]} />
                <meshStandardMaterial color={petalColor} roughness={0.4} />
              </mesh>
              <mesh position={[0, 1.25, 0.01]}>
                <circleGeometry args={[0.12, 12]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
              </mesh>
            </group>
          );
        })}

        {/* Center Diya on Rangoli */}
        <mesh position={[0, 0, 0.03]}>
          <circleGeometry args={[0.32, 24]} />
          <meshStandardMaterial color="#FF9900" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <circleGeometry args={[0.15, 16]} />
          <meshBasicMaterial color="#FFF8E7" />
        </mesh>
      </group>

      {/* Center Diya 3D Flame Light */}
      <pointLight position={[0, 0.4, 5]} color="#FFA500" intensity={1.5} distance={5} decay={2} />

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
        {/* Diya in Front of Tulsi Kyari */}
        <group position={[0, 0.1, 0.7]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.08, 0.08, 12]} />
            <meshStandardMaterial color="#8B4513" roughness={0.7} />
          </mesh>
          {(litDiyas['tulsi-diya'] ?? false) && (
            <group position={[0, 0.08, 0]}>
              <mesh>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial color="#FF4500" />
              </mesh>
              <pointLight color="#FFA500" intensity={1.5} distance={3} />
            </group>
          )}
        </group>
      </group>

      {/* Traditional Indian Wooden Bench (Charpai / Jhula Lounge) on Right Courtyard */}
      <group position={[5, 0, 6]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Wooden Frame */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.12, 1.0]} />
          <meshStandardMaterial color="#4A2511" roughness={0.5} />
        </mesh>
        {/* Woven Jute Rope Bedding */}
        <mesh position={[0, 0.37, 0]} receiveShadow>
          <boxGeometry args={[2.0, 0.02, 0.85]} />
          <meshStandardMaterial color="#C2B280" roughness={0.9} />
        </mesh>
        {/* 4 Turned Legs */}
        {[-0.95, 0.95].map((x, i) =>
          [-0.4, 0.4].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.18, z]} castShadow>
              <cylinderGeometry args={[0.05, 0.04, 0.36, 8]} />
              <meshStandardMaterial color="#30180B" roughness={0.4} />
            </mesh>
          ))
        )}
        {/* Pillow */}
        <mesh position={[0.7, 0.48, 0]} castShadow>
          <boxGeometry args={[0.4, 0.15, 0.6]} />
          <meshStandardMaterial color="#FF6B35" roughness={0.6} />
        </mesh>
      </group>

      {/* Courtyard Boundary Wall & Wrought Iron Gate to Neighbourhood Pathway */}
      <group position={[0, 0, 14]}>
        {/* Left Courtyard Wall */}
        <mesh position={[-14, 1.4, 0]} receiveShadow castShadow>
          <boxGeometry args={[22, 2.8, 0.4]} />
          <meshStandardMaterial color="#E8D5B5" roughness={0.7} />
        </mesh>
        {/* Right Courtyard Wall */}
        <mesh position={[14, 1.4, 0]} receiveShadow castShadow>
          <boxGeometry args={[22, 2.8, 0.4]} />
          <meshStandardMaterial color="#E8D5B5" roughness={0.7} />
        </mesh>

        {/* Gate Pillars */}
        {[-3.2, 3.2].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <mesh position={[0, 1.7, 0]} castShadow>
              <boxGeometry args={[0.8, 3.4, 0.8]} />
              <meshStandardMaterial color="#8B4513" roughness={0.5} />
            </mesh>
            {/* Brass Lantern on top of Pillar */}
            <mesh position={[0, 3.6, 0]}>
              <cylinderGeometry args={[0.2, 0.15, 0.45, 8]} />
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </mesh>
            <pointLight position={[0, 3.6, 0]} color="#FFA500" intensity={1.4} distance={6} decay={2} />
          </group>
        ))}
      </group>
    </group>
  );
};

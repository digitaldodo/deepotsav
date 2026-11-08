import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

export const HouseInterior: React.FC = () => {
  const {
    playerPosition,
    setActivePrompt,
    giftBoxOpened,
    openGiftBox,
    inspectedPhoto,
    setInspectedPhoto,
  } = useGameState();

  // Check proximity for gift box and photo frames
  useFrame(() => {
    // Proximity to coffee table gift box at [ -5.5, 0.8, -3 ]
    const distToGift = Math.hypot(playerPosition[0] - (-5.5), playerPosition[2] - (-3));
    if (distToGift < 2.0 && !giftBoxOpened) {
      setActivePrompt({
        id: 'open-gift',
        label: 'Open Diwali Gift Box 🎁',
        subtext: 'Press [E] or Tap',
        action: () => {
          audioManager.playEatSweet();
          openGiftBox();
        },
      });
    }

    // Proximity to photo frame on sideboard at [ 0, 1.2, -6.8 ]
    const distToPhoto = Math.hypot(playerPosition[0] - 0, playerPosition[2] - (-6.2));
    if (distToPhoto < 2.0) {
      setActivePrompt({
        id: 'inspect-photo',
        label: inspectedPhoto ? 'Put Down Photo' : 'Inspect Family Diwali Photo 🖼️',
        subtext: 'Press [E] or Tap',
        action: () => {
          audioManager.playDiyaLight();
          setInspectedPhoto(inspectedPhoto ? null : 'Diwali Family Gathering 2026');
        },
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Living Room Floor */}
      <mesh position={[0, 0.01, -7]} receiveShadow>
        <planeGeometry args={[30, 14]} />
        <meshStandardMaterial color="#8C5027" roughness={0.3} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 5.8, -7]}>
        <planeGeometry args={[30, 14]} />
        <meshStandardMaterial color="#FFF8E7" roughness={0.8} />
      </mesh>

      {/* Back Interior Wall */}
      <mesh position={[0, 3, -14]} receiveShadow>
        <boxGeometry args={[30, 6, 0.4]} />
        <meshStandardMaterial color="#FAF0CA" roughness={0.7} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-15, 3, -7]} receiveShadow>
        <boxGeometry args={[0.4, 6, 14]} />
        <meshStandardMaterial color="#FAF0CA" roughness={0.7} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[15, 3, -7]} receiveShadow>
        <boxGeometry args={[0.4, 6, 14]} />
        <meshStandardMaterial color="#FAF0CA" roughness={0.7} />
      </mesh>

      {/* Kashmiri Embroidered Carpet (Living Room Center) */}
      <mesh position={[-5.5, 0.02, -4]} receiveShadow>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial color="#800020" roughness={0.8} />
      </mesh>
      {/* Carpet Border Gold Fringe */}
      <mesh position={[-5.5, 0.025, -4]}>
        <planeGeometry args={[4.6, 3.6]} />
        <meshStandardMaterial color="#B8860B" roughness={0.7} />
      </mesh>
      <mesh position={[-5.5, 0.03, -4]}>
        <planeGeometry args={[4.2, 3.2]} />
        <meshStandardMaterial color="#4A0E17" roughness={0.8} />
      </mesh>

      {/* Traditional Indian Wooden Sofa / Diwan */}
      <group position={[-5.5, 0.45, -5.2]}>
        {/* Base Bench */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.5, 1.2]} />
          <meshStandardMaterial color="#4A2511" roughness={0.5} />
        </mesh>
        {/* Mattress Cushion */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[3.2, 0.28, 1.1]} />
          <meshStandardMaterial color="#B22222" roughness={0.6} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.8, -0.45]} castShadow>
          <boxGeometry args={[3.4, 0.8, 0.25]} />
          <meshStandardMaterial color="#4A2511" roughness={0.5} />
        </mesh>
        {/* Silk Bolster Pillows on sides */}
        <mesh position={[-1.3, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.9, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.2} roughness={0.4} />
        </mesh>
        <mesh position={[1.3, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.9, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.2} roughness={0.4} />
        </mesh>
      </group>

      {/* Coffee Table in front of Sofa */}
      <group position={[-5.5, 0, -3]}>
        {/* Tabletop */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.08, 1.2]} />
          <meshStandardMaterial color="#3E1C08" roughness={0.4} />
        </mesh>
        {/* 4 Legs */}
        {[-0.85, 0.85].map((x, i) =>
          [-0.45, 0.45].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.22, z]} castShadow>
              <cylinderGeometry args={[0.04, 0.03, 0.44, 8]} />
              <meshStandardMaterial color="#3E1C08" roughness={0.4} />
            </mesh>
          ))
        )}

        {/* Decorative Gift Box on Table */}
        <group position={[0, 0.55, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.45, giftBoxOpened ? 0.12 : 0.35, 0.45]} />
            <meshStandardMaterial color="#C70039" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Gold Ribbon */}
          <mesh position={[0, giftBoxOpened ? 0.07 : 0.18, 0]}>
            <boxGeometry args={[0.47, 0.02, 0.08]} />
            <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} />
          </mesh>
          <mesh position={[0, giftBoxOpened ? 0.07 : 0.18, 0]}>
            <boxGeometry args={[0.08, 0.02, 0.47]} />
            <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} />
          </mesh>
          {giftBoxOpened && (
            <group position={[0, 0.25, 0]}>
              <mesh>
                <sphereGeometry args={[0.08, 12, 12]} />
                <meshBasicMaterial color="#FFD700" />
              </mesh>
              <pointLight color="#FFD700" intensity={1.5} distance={2.5} />
            </group>
          )}
        </group>
      </group>

      {/* Sideboard with Family Photo Frame */}
      <group position={[0, 0, -6.8]}>
        {/* Wooden console table */}
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 1.4, 0.6]} />
          <meshStandardMaterial color="#2B1408" roughness={0.5} />
        </mesh>
        {/* Brass Photo Frame standing on top */}
        <group position={[0, 1.6, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.45, 0.04]} />
            <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Picture insert */}
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[0.5, 0.36]} />
            <meshStandardMaterial color="#FFE4B5" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Warm Living Room Chandelier Light */}
      <pointLight position={[-5.5, 4.2, -4]} color="#FFA500" intensity={1.8} distance={12} decay={2} castShadow />
      <pointLight position={[5, 4.2, -5]} color="#FFA500" intensity={1.8} distance={12} decay={2} castShadow />

      {/* Festive Hanging Brass Bells & Shubh-Labh on interior wall */}
      <mesh position={[0, 4.2, -13.7]}>
        <circleGeometry args={[0.45, 24]} />
        <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

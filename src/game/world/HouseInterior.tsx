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
  } = useGameState();

  // Check proximity for gift box
  useFrame(() => {
    // Proximity to coffee table gift box at [ -5.5, 0.8, -3 ]
    const distToGift = Math.hypot(playerPosition[0] - (-5.5), playerPosition[2] - (-3));
    if (distToGift < 2.0 && !giftBoxOpened) {
      setActivePrompt({
        id: 'open-gift',
        label: 'Open Festive Gift Box 🎁',
        subtext: 'Press [E] or Tap to reveal blessing inside',
        action: () => {
          audioManager.playGiftOpen();
          openGiftBox();
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
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
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

        {/* ==============================================================
            PHYSICAL 3D GIFT BOX WITH ANIMATING LID & REVEAL
            ============================================================== */}
        <group position={[0, 0.55, 0]}>
          {/* Box Bottom */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.45, 0.22, 0.45]} />
            <meshStandardMaterial color="#990026" roughness={0.3} metalness={0.2} />
          </mesh>

          {/* Box Lid (Lifts and tilts off when opened) */}
          <group
            position={[0, giftBoxOpened ? 0.38 : 0.12, giftBoxOpened ? 0.18 : 0]}
            rotation={[giftBoxOpened ? -0.4 : 0, 0, giftBoxOpened ? 0.2 : 0]}
          >
            <mesh castShadow>
              <boxGeometry args={[0.48, 0.06, 0.48]} />
              <meshStandardMaterial color="#C70039" roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Gold Ribbon Cross on Lid */}
            <mesh position={[0, 0.035, 0]}>
              <boxGeometry args={[0.49, 0.01, 0.09]} />
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.035, 0]}>
              <boxGeometry args={[0.09, 0.01, 0.49]} />
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>

          {/* Revealed Auspicious 24K Gold Coin inside box */}
          {giftBoxOpened && (
            <group position={[0, 0.12, 0]}>
              <mesh rotation={[Math.PI / 4, 0, 0]} castShadow>
                <cylinderGeometry args={[0.09, 0.09, 0.015, 24]} />
                <meshStandardMaterial
                  color="#FFD700"
                  metalness={0.95}
                  roughness={0.15}
                  emissive="#FFD700"
                  emissiveIntensity={0.6}
                />
              </mesh>
              {/* Handwritten Blessing Parchment */}
              <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0.1]}>
                <planeGeometry args={[0.28, 0.22]} />
                <meshStandardMaterial color="#FFF8DC" roughness={0.7} />
              </mesh>
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
          {/* Picture insert with warm painting */}
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[0.5, 0.36]} />
            <meshStandardMaterial color="#FFE4B5" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Single consolidated warm living room ambient point light */}
      <pointLight position={[0, 4.2, -4.5]} color="#FFA500" intensity={1.6} distance={14} decay={2} />

      {/* Festive Hanging Brass Shubh-Labh on interior wall */}
      <mesh position={[0, 4.2, -13.7]}>
        <circleGeometry args={[0.45, 24]} />
        <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';
import { registerInteractive, unregisterInteractive } from '../controls/FirstPersonController';
import { getCarvedWoodTexture, getMarbleFloorTexture } from '../utils/textureGenerator';

export const HouseInterior: React.FC = () => {
  const { giftBoxOpened, openGiftBox } = useGameState();
  const coinRef = useRef<THREE.Group>(null);
  const giftLidRef = useRef<THREE.Group>(null);

  const woodTex = useMemo(() => getCarvedWoodTexture(), []);
  const marbleTex = useMemo(() => getMarbleFloorTexture(), []);

  // Floating gold coin spin
  useFrame((_, delta) => {
    if (coinRef.current && giftBoxOpened) {
      coinRef.current.rotation.y += delta * 1.5;
    }
  });

  // Register Gift Box interaction
  useEffect(() => {
    registerInteractive({
      id: 'open-gift-box',
      label: giftBoxOpened ? 'Festive Gift Blessing 🪙' : 'Open Festive Gift Box 🎁',
      subtext: giftBoxOpened ? 'Auspicious Lakshmi Gold Coin Blessing' : 'Press [E] or Tap to reveal blessing inside',
      position: new THREE.Vector3(-3.2, 0.65, -3.5),
      maxDistance: 2.6,
      action: () => {
        if (!giftBoxOpened) {
          audioManager.playGiftOpen();
          openGiftBox();
        }
      },
    });

    return () => {
      unregisterInteractive('open-gift-box');
    };
  }, [giftBoxOpened, openGiftBox]);

  return (
    <group position={[0, 0, 0]}>
      {/* ==============================================================
          1. INTERIOR SHELL: MAKRANA MARBLE FLOOR, IVORY WALLS, TEAK BEAMS
          ============================================================== */}
      {/* Makrana Marble Floor (X: -5.2 to 5.2, Z: -8.0 to 0.0) */}
      <mesh position={[0, 0.01, -4.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10.4, 8.0]} />
        <meshStandardMaterial map={marbleTex} roughness={0.25} metalness={0.08} />
      </mesh>

      {/* Ceiling with Warm Ivory Foundation */}
      <mesh position={[0, 4.6, -4.0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10.4, 8.0]} />
        <meshStandardMaterial color="#FFF8EB" roughness={0.8} />
      </mesh>

      {/* Exposed Teak Ceiling Beams (Kadi-Chhat) */}
      {[-4.0, -2.0, 0.0, 2.0, 4.0].map((bx, bi) => (
        <mesh key={`ibeam-${bi}`} position={[bx, 4.45, -4.0]} castShadow>
          <boxGeometry args={[0.24, 0.3, 8.0]} />
          <meshStandardMaterial map={woodTex} roughness={0.45} />
        </mesh>
      ))}

      {/* Interior Back Wall (Z: -8.0) */}
      <mesh position={[0, 2.3, -8.0]} receiveShadow>
        <boxGeometry args={[10.4, 4.6, 0.4]} />
        <meshStandardMaterial color="#FAF3DE" roughness={0.7} />
      </mesh>
      {/* Dark Teak Baseboard Dado along Back Wall */}
      <mesh position={[0, 0.35, -7.78]} receiveShadow>
        <boxGeometry args={[10.4, 0.7, 0.06]} />
        <meshStandardMaterial map={woodTex} roughness={0.5} />
      </mesh>

      {/* Interior Left Wall (X: -5.2) */}
      <mesh position={[-5.2, 2.3, -4.0]} receiveShadow>
        <boxGeometry args={[0.4, 4.6, 8.0]} />
        <meshStandardMaterial color="#FAF3DE" roughness={0.7} />
      </mesh>
      <mesh position={[-4.98, 0.35, -4.0]} receiveShadow>
        <boxGeometry args={[0.06, 0.7, 8.0]} />
        <meshStandardMaterial map={woodTex} roughness={0.5} />
      </mesh>

      {/* Interior Right Wall (X: 5.2) */}
      <mesh position={[5.2, 2.3, -4.0]} receiveShadow>
        <boxGeometry args={[0.4, 4.6, 8.0]} />
        <meshStandardMaterial color="#FAF3DE" roughness={0.7} />
      </mesh>
      <mesh position={[4.98, 0.35, -4.0]} receiveShadow>
        <boxGeometry args={[0.06, 0.7, 8.0]} />
        <meshStandardMaterial map={woodTex} roughness={0.5} />
      </mesh>

      {/* ==============================================================
          2. BAITHAK LIVING ROOM: SHEESHAM DIWAN & SILK BROCADE CUSHIONS
          ============================================================== */}
      <group position={[-3.2, 0, -3.5]}>
        {/* Sheesham Wood Diwan Frame */}
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.44, 1.2]} />
          <meshStandardMaterial map={woodTex} roughness={0.4} />
        </mesh>
        {/* Carved Diwan Backrest */}
        <mesh position={[0, 0.65, -0.55]} castShadow>
          <boxGeometry args={[2.4, 0.45, 0.12]} />
          <meshStandardMaterial map={woodTex} roughness={0.4} />
        </mesh>

        {/* Thick Crimson Silk Gaddi (Mattress Cushion) */}
        <mesh position={[0, 0.48, 0]} receiveShadow>
          <boxGeometry args={[2.3, 0.14, 1.1]} />
          <meshStandardMaterial color="#8B0000" roughness={0.65} />
        </mesh>

        {/* 2 Cylindrical Bolster Pillows (Masand) at Sides */}
        {[-0.95, 0.95].map((bx, bi) => (
          <mesh key={`masand-${bi}`} position={[bx, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.9, 16]} />
            <meshStandardMaterial color="#FFD700" roughness={0.4} metalness={0.3} />
          </mesh>
        ))}

        {/* 3 Silk Throw Pillows with Gold Zari Border */}
        {[-0.5, 0, 0.5].map((px, pi) => (
          <mesh key={`cushion-${pi}`} position={[px, 0.62, -0.32]} rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.34, 0.34, 0.12]} />
            <meshStandardMaterial color={pi === 1 ? '#D4AF37' : '#990000'} roughness={0.5} />
          </mesh>
        ))}

        {/* ==============================================================
            3. CARVED BRASS COFFEE TABLE & FESTIVE GIFT BOX
            ============================================================== */}
        <group position={[0, 0, 1.1]}>
          {/* Hexagonal Brass Table */}
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.42, 0.45, 0.48, 6]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.25} />
          </mesh>

          {/* Festive Diwali Gift Box */}
          <group position={[0, 0.52, 0]}>
            {/* Box Body */}
            <mesh castShadow>
              <boxGeometry args={[0.24, 0.14, 0.24]} />
              <meshStandardMaterial color="#8B0000" roughness={0.4} />
            </mesh>
            {/* Gold Ribbon Wrap */}
            <mesh position={[0, 0.005, 0]}>
              <boxGeometry args={[0.245, 0.145, 0.04]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.005, 0]}>
              <boxGeometry args={[0.04, 0.145, 0.245]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Box Lid */}
            <group
              ref={giftLidRef}
              position={[0, giftBoxOpened ? 0.22 : 0.075, giftBoxOpened ? 0.18 : 0]}
              rotation={[giftBoxOpened ? 0.6 : 0, 0, 0]}
            >
              <mesh castShadow>
                <boxGeometry args={[0.255, 0.035, 0.255]} />
                <meshStandardMaterial color="#8B0000" roughness={0.4} />
              </mesh>
              {/* Gold Ribbon Bow */}
              <mesh position={[0, 0.035, 0]} castShadow>
                <sphereGeometry args={[0.045, 10, 10]} />
                <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>

            {/* Revealed Spinning 24K Gold Coin Blessing */}
            {giftBoxOpened && (
              <group ref={coinRef} position={[0, 0.18, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.065, 0.065, 0.012, 24]} />
                  <meshStandardMaterial color="#FFD700" metalness={0.98} roughness={0.12} />
                </mesh>
                <pointLight color="#FFE57F" intensity={2.0} distance={2.5} decay={2} />
              </group>
            )}
          </group>
        </group>
      </group>

      {/* Warm Ambient Baithak Chandelier / Lantern Light */}
      <pointLight position={[-1.5, 3.8, -4.0]} color="#FFA500" intensity={2.2} distance={9.0} decay={2} />
      <pointLight position={[2.5, 3.8, -4.0]} color="#FFA500" intensity={2.2} distance={9.0} decay={2} />
    </group>
  );
};

import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGameState, SweetType } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';
import { registerInteractive, unregisterInteractive } from '../controls/FirstPersonController';
import {
  getCarvedWoodTexture,
  getMotichoorTexture,
  getSilverVarkTexture,
} from '../utils/textureGenerator';

export const DiningAndSweets: React.FC = () => {
  const {
    sweetsRemaining,
    pickUpSweet,
    consumeHeldSweet,
    handItem,
    heldSweetType,
  } = useGameState();

  const woodTex = useMemo(() => getCarvedWoodTexture(), []);
  const motichoorTex = useMemo(() => getMotichoorTexture(), []);
  const silverVarkTex = useMemo(() => getSilverVarkTexture(), []);

  // Table position in living/dining area
  const tablePos = useMemo(() => new THREE.Vector3(3.4, 0.88, -4.0), []);

  // Register Sweets table interactions
  useEffect(() => {
    const sweetNames: Record<SweetType, string> = {
      laddoo: 'Motichoor Laddoo 🟡',
      kajuKatli: 'Kaju Katli 💎',
      gulabJamun: 'Gulab Jamun 🟤',
      barfi: 'Pista Barfi 🟩',
      modak: 'Mawa Modak 🥟',
    };

    // If holding sweet, register eat action
    if (handItem === 'sweet' && heldSweetType) {
      registerInteractive({
        id: `eat-sweet-${heldSweetType}`,
        label: `Savor ${sweetNames[heldSweetType]} 😋`,
        subtext: 'Press [E] or Tap to bring to mouth & eat',
        position: tablePos,
        maxDistance: 3.0,
        action: () => {
          consumeHeldSweet();
          audioManager.playEatSweet();
        },
      });
      return () => {
        unregisterInteractive(`eat-sweet-${heldSweetType}`);
      };
    }

    // Otherwise register pickup for available sweet
    const types: SweetType[] = ['laddoo', 'kajuKatli', 'gulabJamun', 'barfi', 'modak'];
    const available = types.find(t => sweetsRemaining[t] > 0);

    if (available) {
      registerInteractive({
        id: `pickup-sweet-${available}`,
        label: `Pick up ${sweetNames[available]}`,
        subtext: 'Press [E] or Tap to take onto hand',
        position: tablePos,
        maxDistance: 2.6,
        action: () => {
          pickUpSweet(available);
          audioManager.playPowderPickup();
        },
      });
      return () => {
        unregisterInteractive(`pickup-sweet-${available}`);
      };
    }
  }, [handItem, heldSweetType, sweetsRemaining, pickUpSweet, consumeHeldSweet, tablePos]);

  return (
    <group position={[3.4, 0, -4.0]}>
      {/* ==============================================================
          1. HAND-CARVED SHEESHAM DINING TABLE
          ============================================================== */}
      {/* Table Top */}
      <mesh position={[0, 0.84, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.08, 1.6]} />
        <meshStandardMaterial map={woodTex} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Table Legs */}
      {[-1.15, 1.15].map((x, i) =>
        [-0.65, 0.65].map((z, j) => (
          <mesh key={`leg-${i}-${j}`} position={[x, 0.42, z]} castShadow>
            <cylinderGeometry args={[0.05, 0.04, 0.84, 12]} />
            <meshStandardMaterial color="#2B1408" roughness={0.5} />
          </mesh>
        ))
      )}

      {/* Decorative Silk Table Runner (Crimson with Gold Zari Border) */}
      <mesh position={[0, 0.885, 0]} receiveShadow>
        <boxGeometry args={[2.5, 0.008, 0.7]} />
        <meshStandardMaterial color="#8B0000" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.89, 0]}>
        <boxGeometry args={[2.45, 0.006, 0.08]} />
        <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* ==============================================================
          2. TRADITIONAL BRASS SWEETS THALI (PLATTER)
          ============================================================== */}
      <group position={[0, 0.895, 0]}>
        {/* Large Polished Brass Thali Base */}
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[0.42, 0.38, 0.024, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={0.92} roughness={0.22} />
        </mesh>
        {/* Thali Raised Lip */}
        <mesh position={[0, 0.016, 0]}>
          <torusGeometry args={[0.41, 0.014, 12, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={0.92} roughness={0.2} />
        </mesh>

        {/* Small Center Silver Bowl with Fresh Rose Petals */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.03, 16]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.038, 0]}>
          <sphereGeometry args={[0.065, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#E91E63" roughness={0.8} />
        </mesh>

        {/* Sweets Arranged Concentrically */}
        {/* A. Motichoor Laddoos */}
        {sweetsRemaining.laddoo > 0 &&
          [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].slice(0, sweetsRemaining.laddoo).map((a, i) => (
            <mesh
              key={`lad-${i}`}
              position={[Math.cos(a) * 0.24, 0.035, Math.sin(a) * 0.24]}
              castShadow
            >
              <sphereGeometry args={[0.034, 16, 16]} />
              <meshStandardMaterial map={motichoorTex} roughness={0.65} />
            </mesh>
          ))}

        {/* B. Kaju Katli (Silver Foil Diamond) */}
        {sweetsRemaining.kajuKatli > 0 &&
          [(Math.PI * 1) / 3, Math.PI, (Math.PI * 5) / 3].slice(0, sweetsRemaining.kajuKatli).map((a, i) => (
            <mesh
              key={`kaju-${i}`}
              position={[Math.cos(a) * 0.24, 0.025, Math.sin(a) * 0.24]}
              rotation={[0, a + Math.PI / 4, 0]}
              castShadow
            >
              <boxGeometry args={[0.048, 0.016, 0.048]} />
              <meshStandardMaterial
                map={silverVarkTex}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          ))}

        {/* C. Gulab Jamun */}
        {sweetsRemaining.gulabJamun > 0 &&
          [0.15, -0.15].slice(0, sweetsRemaining.gulabJamun).map((x, i) => (
            <mesh key={`gj-${i}`} position={[x, 0.032, 0.12]} castShadow>
              <sphereGeometry args={[0.032, 16, 16]} />
              <meshStandardMaterial color="#4A1C0A" roughness={0.25} metalness={0.1} />
            </mesh>
          ))}

        {/* D. Pista Barfi */}
        {sweetsRemaining.barfi > 0 &&
          [-0.14, 0.14].slice(0, sweetsRemaining.barfi).map((x, i) => (
            <mesh key={`barfi-${i}`} position={[x, 0.024, -0.12]} castShadow>
              <boxGeometry args={[0.045, 0.02, 0.045]} />
              <meshStandardMaterial color="#66BB6A" roughness={0.5} />
            </mesh>
          ))}

        {/* E. Mawa Modak */}
        {sweetsRemaining.modak > 0 &&
          [0, Math.PI].slice(0, sweetsRemaining.modak).map((a, i) => (
            <mesh
              key={`modak-${i}`}
              position={[Math.cos(a) * 0.32, 0.038, Math.sin(a) * 0.32]}
              rotation={[-Math.PI / 2, 0, 0]}
              castShadow
            >
              <coneGeometry args={[0.028, 0.05, 14]} />
              <meshStandardMaterial color="#FFF9E6" roughness={0.6} />
            </mesh>
          ))}

        {/* Warm Candle/Diya Light Glow Illuminating Sweets */}
        <pointLight position={[0, 0.35, 0]} color="#FFA500" intensity={1.8} distance={2.5} decay={2} />
      </group>
    </group>
  );
};

import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';
import { registerInteractive, unregisterInteractive } from '../controls/FirstPersonController';
import { getCarvedWoodTexture, getSandstoneTexture } from '../utils/textureGenerator';

export const HomeExterior: React.FC = () => {
  const { houseDoorOpen, toggleHouseDoor, litDiyas } = useGameState();
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);

  const woodTex = useMemo(() => getCarvedWoodTexture(), []);
  const sandstoneTex = useMemo(() => getSandstoneTexture('#C68B59'), []);

  // Smooth double door swing animation
  useFrame((_, delta) => {
    const leftTarget = houseDoorOpen ? -Math.PI * 0.55 : 0;
    const rightTarget = houseDoorOpen ? Math.PI * 0.55 : 0;

    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        leftDoorRef.current.rotation.y,
        leftTarget,
        delta * 4.2
      );
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        rightDoorRef.current.rotation.y,
        rightTarget,
        delta * 4.2
      );
    }
  });

  // Register Doorway interaction
  useEffect(() => {
    registerInteractive({
      id: 'door-toggle',
      label: houseDoorOpen ? 'Close Haveli Doors 🚪' : 'Open Haveli Doors 🚪',
      subtext: houseDoorOpen ? 'Press [E] or Tap to close doors' : 'Press [E] or Tap to enter Baithak Living Room',
      position: new THREE.Vector3(0, 1.4, 0.2),
      maxDistance: 2.8,
      action: () => {
        audioManager.playDoorToggle();
        toggleHouseDoor();
      },
    });

    return () => {
      unregisterInteractive('door-toggle');
    };
  }, [houseDoorOpen, toggleHouseDoor]);

  const isPorchDiyaLit = litDiyas['exterior-porch-1'] ?? true;
  const isVerandahLeftLit = litDiyas['verandah-left'] ?? true;
  const isVerandahRightLit = litDiyas['verandah-right'] ?? true;

  return (
    <group position={[0, 0, 0]}>
      {/* ==============================================================
          1. ELEVATED JAISALMER SANDSTONE VERANDAH (OTLA) & STEPS
          ============================================================== */}
      {/* Lower Entrance Step */}
      <mesh position={[0, 0.1, 2.2]} receiveShadow>
        <boxGeometry args={[4.2, 0.2, 0.8]} />
        <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
      </mesh>
      {/* Upper Porch Step */}
      <mesh position={[0, 0.22, 1.5]} receiveShadow>
        <boxGeometry args={[3.8, 0.24, 0.7]} />
        <meshStandardMaterial map={sandstoneTex} roughness={0.68} />
      </mesh>

      {/* Main Elevated Verandah Floor Platform (X: -5.4 to 5.4, Z: 0 to 1.4) */}
      <mesh position={[0, 0.32, 0.7]} receiveShadow>
        <boxGeometry args={[10.8, 0.24, 1.5]} />
        <meshStandardMaterial map={sandstoneTex} roughness={0.65} />
      </mesh>

      {/* ==============================================================
          2. HAVELI FRONT FAÇADE WALL & ARCHITECTURAL ARCHES
          ============================================================== */}
      {/* Left Front Wall */}
      <mesh position={[-3.3, 2.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 4.6, 0.4]} />
        <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
      </mesh>
      {/* Right Front Wall */}
      <mesh position={[3.3, 2.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 4.6, 0.4]} />
        <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
      </mesh>
      {/* Lintel Beam above Doorway */}
      <mesh position={[0, 3.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 1.8, 0.45]} />
        <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
      </mesh>

      {/* Ornate Rajput Cusped Entrance Arch above Door */}
      <mesh position={[0, 3.0, 0.24]} castShadow>
        <boxGeometry args={[2.5, 0.22, 0.15]} />
        <meshStandardMaterial color="#8F4B23" roughness={0.55} />
      </mesh>

      {/* 4 Carved Wooden Verandah Pillars with Lotus Capitals */}
      {[-4.6, -2.4, 2.4, 4.6].map((px, pi) => (
        <group key={`v-pillar-${pi}`} position={[px, 0.44, 1.35]}>
          {/* Square Lotus Base */}
          <mesh position={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[0.3, 0.24, 0.3]} />
            <meshStandardMaterial color="#4A2306" roughness={0.5} />
          </mesh>
          {/* Fluted Column Shaft */}
          <mesh position={[0, 1.85, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.11, 3.2, 14]} />
            <meshStandardMaterial map={woodTex} roughness={0.4} />
          </mesh>
          {/* Carved Capital Bracket */}
          <mesh position={[0, 3.5, 0]} castShadow>
            <boxGeometry args={[0.38, 0.22, 0.38]} />
            <meshStandardMaterial color="#3D1D09" roughness={0.45} />
          </mesh>
        </group>
      ))}

      {/* Verandah Overhang Roof Eaves (Chhajja) */}
      <mesh position={[0, 4.05, 1.0]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[11.2, 0.12, 1.4]} />
        <meshStandardMaterial color="#7A3D1C" roughness={0.65} />
      </mesh>

      {/* ==============================================================
          3. TRADITIONAL MARIGOLD TORAN GARLAND (DOORWAY BLESSING)
          ============================================================== */}
      <group position={[0, 2.92, 0.26]}>
        {/* Horizontal Marigold Garland */}
        {[-1.05, -0.75, -0.45, -0.15, 0.15, 0.45, 0.75, 1.05].map((gx, gi) => (
          <group key={`toran-fl-${gi}`} position={[gx, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.055, 8, 8]} />
              <meshStandardMaterial color={gi % 2 === 0 ? '#FF8C00' : '#FFD700'} roughness={0.7} />
            </mesh>
            {/* Hanging Mango Leaf (Auspicious Green Pan) */}
            <mesh position={[0, -0.09, 0]}>
              <coneGeometry args={[0.025, 0.1, 4]} />
              <meshStandardMaterial color="#2E7D32" roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ==============================================================
          4. CARVED WOODEN DOUBLE DOORS WITH BRASS STUDS & KNOCKER RINGS
          ============================================================== */}
      {/* Left Door Leaf (Hinged at X: -1.1) */}
      <group position={[-1.1, 0.44, 0]}>
        <group ref={leftDoorRef}>
          <mesh position={[0.55, 1.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.08, 2.5, 0.07]} />
            <meshStandardMaterial map={woodTex} roughness={0.4} />
          </mesh>
          {/* Raised Wooden Door Panels */}
          {[0.6, 1.3, 1.9].map((py, pi) => (
            <mesh key={`lpnl-${pi}`} position={[0.55, py, 0.04]} castShadow>
              <boxGeometry args={[0.82, 0.5, 0.02]} />
              <meshStandardMaterial color="#2B1408" roughness={0.45} />
            </mesh>
          ))}
          {/* Brass Studs & Knocker */}
          <mesh position={[0.92, 1.3, 0.06]} castShadow>
            <torusGeometry args={[0.04, 0.01, 8, 16]} />
            <meshStandardMaterial color="#FFD700" metalness={0.92} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Right Door Leaf (Hinged at X: 1.1) */}
      <group position={[1.1, 0.44, 0]}>
        <group ref={rightDoorRef}>
          <mesh position={[-0.55, 1.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.08, 2.5, 0.07]} />
            <meshStandardMaterial map={woodTex} roughness={0.4} />
          </mesh>
          {/* Raised Wooden Door Panels */}
          {[0.6, 1.3, 1.9].map((py, pi) => (
            <mesh key={`rpnl-${pi}`} position={[-0.55, py, 0.04]} castShadow>
              <boxGeometry args={[0.82, 0.5, 0.02]} />
              <meshStandardMaterial color="#2B1408" roughness={0.45} />
            </mesh>
          ))}
          {/* Brass Studs & Knocker */}
          <mesh position={[-0.92, 1.3, 0.06]} castShadow>
            <torusGeometry args={[0.04, 0.01, 8, 16]} />
            <meshStandardMaterial color="#FFD700" metalness={0.92} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ==============================================================
          5. WALL NICHES WITH LIT TERRACOTTA DIYAS
          ============================================================== */}
      {/* Porch Step Central Diya */}
      {isPorchDiyaLit && (
        <group position={[0, 0.22, 2.3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.045, 0.04, 10]} />
            <meshStandardMaterial color="#A35334" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.03, 0]}>
            <coneGeometry args={[0.018, 0.05, 8]} />
            <meshBasicMaterial color="#FF9900" />
          </mesh>
          <pointLight color="#FF9900" intensity={2.2} distance={3.2} decay={2} />
        </group>
      )}

      {/* Left Wall Niche Diya */}
      {isVerandahLeftLit && (
        <group position={[-2.4, 1.6, 0.22]}>
          {/* Carved Niche Recess */}
          <mesh position={[0, 0, -0.06]}>
            <boxGeometry args={[0.35, 0.55, 0.15]} />
            <meshStandardMaterial color="#4A2306" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.2, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.04, 0.038, 10]} />
            <meshStandardMaterial color="#A35334" roughness={0.75} />
          </mesh>
          <mesh position={[0, -0.17, 0]}>
            <coneGeometry args={[0.016, 0.045, 8]} />
            <meshBasicMaterial color="#FF9900" />
          </mesh>
          <pointLight color="#FF9900" intensity={1.8} distance={2.8} decay={2} />
        </group>
      )}

      {/* Right Wall Niche Diya */}
      {isVerandahRightLit && (
        <group position={[2.4, 1.6, 0.22]}>
          <mesh position={[0, 0, -0.06]}>
            <boxGeometry args={[0.35, 0.55, 0.15]} />
            <meshStandardMaterial color="#4A2306" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.2, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.04, 0.038, 10]} />
            <meshStandardMaterial color="#A35334" roughness={0.75} />
          </mesh>
          <mesh position={[0, -0.17, 0]}>
            <coneGeometry args={[0.016, 0.045, 8]} />
            <meshBasicMaterial color="#FF9900" />
          </mesh>
          <pointLight color="#FF9900" intensity={1.8} distance={2.8} decay={2} />
        </group>
      )}
    </group>
  );
};

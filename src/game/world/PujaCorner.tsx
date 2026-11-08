import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';
import { registerInteractive, unregisterInteractive } from '../controls/FirstPersonController';
import { getCarvedWoodTexture, getMarbleFloorTexture } from '../utils/textureGenerator';

export const PujaCorner: React.FC = () => {
  const {
    ringBellWithHand,
    offerFlowers,
    litDiyas,
    lightTargetDiya,
  } = useGameState();

  const bellRef = useRef<THREE.Group>(null);
  const bellSwingTimeRef = useRef<number>(0);

  const woodTex = useMemo(() => getCarvedWoodTexture(), []);
  const marbleTex = useMemo(() => getMarbleFloorTexture(), []);

  const mandirPos = useMemo(() => new THREE.Vector3(-3.6, 1.2, -6.8), []);

  // Animate swinging bell with decay
  useFrame((_, delta) => {
    if (bellRef.current) {
      if (bellSwingTimeRef.current > 0) {
        bellSwingTimeRef.current -= delta;
        const decay = Math.max(0, bellSwingTimeRef.current / 2.0);
        bellRef.current.rotation.z = Math.sin(bellSwingTimeRef.current * 16) * 0.4 * decay;
      } else {
        bellRef.current.rotation.z = 0;
      }
    }
  });

  // Register Puja Corner interactions
  useEffect(() => {
    // 1. Temple Bell
    registerInteractive({
      id: 'puja-bell',
      label: 'Ring Sacred Temple Bell 🔔',
      subtext: 'Press [E] or Tap for harmonic blessing',
      position: new THREE.Vector3(-3.6, 2.2, -6.6),
      maxDistance: 2.8,
      action: () => {
        audioManager.playPujaBell();
        ringBellWithHand();
        bellSwingTimeRef.current = 2.0;
      },
    });

    // 2. Brass Samai Diya
    registerInteractive({
      id: 'puja-samai',
      label: litDiyas['puja-samai-right'] ? 'Mandir Diya (Lit) 🪔' : 'Light Mandir Brass Samai 🪔',
      subtext: litDiyas['puja-samai-right'] ? 'Auspicious flame burning brightly' : 'Press [E] or Tap to ignite flame',
      position: new THREE.Vector3(-2.8, 1.0, -6.6),
      maxDistance: 2.6,
      action: () => {
        if (!litDiyas['puja-samai-right']) {
          audioManager.playDiyaLight();
          lightTargetDiya('puja-samai-right');
        }
      },
    });

    // 3. Flower Offering
    registerInteractive({
      id: 'puja-flowers',
      label: 'Offer Marigold Petals 🌺',
      subtext: 'Press [E] or Tap to place flower offering',
      position: new THREE.Vector3(-3.6, 0.8, -6.5),
      maxDistance: 2.6,
      action: () => {
        audioManager.playManjiraChime();
        offerFlowers();
      },
    });

    return () => {
      unregisterInteractive('puja-bell');
      unregisterInteractive('puja-samai');
      unregisterInteractive('puja-flowers');
    };
  }, [litDiyas, lightTargetDiya, ringBellWithHand, offerFlowers]);

  const isSamaiLit = litDiyas['puja-samai-right'] ?? true;

  return (
    <group position={[-3.6, 0, -6.8]}>
      {/* ==============================================================
          1. MAKRANA MARBLE SANCTUM PLINTH
          ============================================================== */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[2.8, 0.4, 2.0]} />
        <meshStandardMaterial map={marbleTex} roughness={0.2} metalness={0.05} />
      </mesh>
      {/* 24K Gold Plinth Trim */}
      <mesh position={[0, 0.405, 0]}>
        <boxGeometry args={[2.82, 0.02, 2.02]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* ==============================================================
          2. CARVED TEAKWOOD TEMPLE MANDIR
          ============================================================== */}
      <group position={[0, 0.4, -0.3]}>
        {/* Mandir Base Cabinet */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.7, 1.0]} />
          <meshStandardMaterial map={woodTex} roughness={0.4} />
        </mesh>
        {/* Mandir Altar Cloth (Crimson Velvet with Gold Embroidered Border) */}
        <mesh position={[0, 0.71, 0]}>
          <boxGeometry args={[1.9, 0.02, 0.9]} />
          <meshStandardMaterial color="#990000" roughness={0.75} />
        </mesh>

        {/* 4 Carved Pillars with Lotus Capitals */}
        {[-0.85, 0.85].map((x, i) =>
          [-0.35, 0.35].map((z, j) => (
            <mesh key={`mpillar-${i}-${j}`} position={[x, 1.45, z]} castShadow>
              <cylinderGeometry args={[0.045, 0.055, 1.45, 14]} />
              <meshStandardMaterial color="#3D1D09" roughness={0.4} />
            </mesh>
          ))
        )}

        {/* Cusped Mandir Canopy Arch */}
        <mesh position={[0, 2.2, 0.35]} castShadow>
          <boxGeometry args={[1.8, 0.12, 0.1]} />
          <meshStandardMaterial color="#3D1D09" roughness={0.4} />
        </mesh>

        {/* Shikhara (Stepped Temple Spire) */}
        <mesh position={[0, 2.65, 0]} castShadow>
          <coneGeometry args={[0.9, 0.8, 4]} />
          <meshStandardMaterial color="#3D1D09" roughness={0.4} />
        </mesh>
        {/* Golden Kalash on Mandir Apex */}
        <mesh position={[0, 3.15, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.08, 0.25, 10]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Fresh Marigold Garlands Hanging from Canopy */}
        {[-0.6, -0.2, 0.2, 0.6].map((gx, gi) => (
          <group key={`garland-${gi}`} position={[gx, 2.05, 0.36]}>
            {[0, 1, 2, 3].map(mi => (
              <mesh key={`mfl-${mi}`} position={[0, -mi * 0.08, 0]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial color={mi % 2 === 0 ? '#FFA000' : '#FF6D00'} roughness={0.7} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Sacred Murti (Idol) Platform inside Sanctum */}
        <mesh position={[0, 0.82, -0.1]} castShadow>
          <cylinderGeometry args={[0.25, 0.28, 0.18, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.92} roughness={0.25} />
        </mesh>
        {/* Auspicious Deity Brass Idol Silhouette */}
        <mesh position={[0, 1.08, -0.1]} castShadow>
          <coneGeometry args={[0.16, 0.35, 12]} />
          <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.3, -0.1]} castShadow>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.2} />
        </mesh>
      </group>

      {/* ==============================================================
          3. SWINGING SOLID BRASS TEMPLE BELL
          ============================================================== */}
      <group position={[0, 2.3, 0.3]}>
        {/* Hanging Brass Chain */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.35, 8]} />
          <meshStandardMaterial color="#DAA520" metalness={0.88} roughness={0.25} />
        </mesh>

        {/* Articulated Bell Body */}
        <group ref={bellRef}>
          <mesh castShadow position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.06, 0.14, 0.22, 16]} />
            <meshStandardMaterial color="#FFD700" metalness={0.92} roughness={0.2} />
          </mesh>
          {/* Bell Rim */}
          <mesh position={[0, -0.23, 0]}>
            <torusGeometry args={[0.14, 0.018, 10, 24]} />
            <meshStandardMaterial color="#FFD700" metalness={0.92} roughness={0.2} />
          </mesh>
          {/* Clapper */}
          <mesh position={[0, -0.26, 0]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ==============================================================
          4. TRADITIONAL BRASS SAMAI (FLOOR OIL LAMP)
          ============================================================== */}
      <group position={[0.9, 0.4, 0.2]}>
        {/* Tiered Base */}
        <mesh position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.2, 0.08, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Fluted Column */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.7, 12]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Oil Basin with 5 Wick Notches */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.08, 0.06, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* 5 Flaming Wicks */}
        {isSamaiLit && (
          <group position={[0, 0.85, 0]}>
            {[0, 1, 2, 3, 4].map(wi => {
              const angle = (wi / 5) * Math.PI * 2;
              return (
                <mesh
                  key={`wick-${wi}`}
                  position={[Math.cos(angle) * 0.14, 0.02, Math.sin(angle) * 0.14]}
                >
                  <coneGeometry args={[0.015, 0.04, 8]} />
                  <meshBasicMaterial color="#FF9900" />
                </mesh>
              );
            })}
            <pointLight color="#FF9900" intensity={2.4} distance={3.5} decay={2} />
          </group>
        )}
      </group>

      {/* ==============================================================
          5. BRASS BASKET WITH FRESH MARIGOLD PETAL OFFERINGS
          ============================================================== */}
      <group position={[-0.9, 0.4, 0.2]}>
        {/* Brass Basket */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.12, 0.1, 16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.25} />
        </mesh>
        {/* Mounded Flower Petals */}
        <mesh position={[0, 0.11, 0]}>
          <sphereGeometry args={[0.15, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color="#FF6D00" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

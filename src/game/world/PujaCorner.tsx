import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

export const PujaCorner: React.FC = () => {
  const {
    playerPosition,
    setActivePrompt,
    ringBellWithHand,
    pujaBellRangCount,
    flowersOfferedCount,
    offerFlowers,
    litDiyas,
    lightTargetDiya,
  } = useGameState();

  const bellRef = useRef<THREE.Group>(null);
  const bellSwingTimeRef = useRef<number>(0);

  // Animate swinging bell with decaying oscillation
  useFrame((_, delta) => {
    if (bellRef.current) {
      if (bellSwingTimeRef.current > 0) {
        bellSwingTimeRef.current -= delta;
        const decay = Math.max(0, bellSwingTimeRef.current / 2.0);
        bellRef.current.rotation.z = Math.sin(bellSwingTimeRef.current * 16) * 0.35 * decay;
      } else {
        bellRef.current.rotation.z = 0;
      }
    }

    // Proximity check to Mandir at [ -5.5, 0, -12 ]
    const dist = Math.hypot(playerPosition[0] - (-5.5), playerPosition[2] - (-12));
    if (dist < 3.2) {
      if (!litDiyas['puja-samai-right']) {
        setActivePrompt({
          id: 'puja-diya',
          label: 'Light Mandir Brass Samai 🪔',
          subtext: 'Press [E] or Tap with lighting stick',
          action: () => {
            audioManager.playDiyaLight();
            lightTargetDiya('puja-samai-right');
          },
        });
      } else {
        setActivePrompt({
          id: 'puja-bell',
          label: 'Ring Sacred Temple Bell 🔔',
          subtext: 'Press [E] or Tap for harmonic blessing',
          action: () => {
            audioManager.playPujaBell();
            ringBellWithHand();
            offerFlowers();
            bellSwingTimeRef.current = 2.0;
          },
        });
      }
    }
  });

  return (
    <group position={[-5.5, 0, -12]}>
      {/* Sanctum Platform (White Makrana Marble Plinth) */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[3.6, 0.4, 2.4]} />
        <meshStandardMaterial color="#FFFDF7" roughness={0.2} metalness={0.05} />
      </mesh>
      {/* Gold Trim around plinth */}
      <mesh position={[0, 0.41, 0]}>
        <boxGeometry args={[3.62, 0.03, 2.42]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Carved Teakwood Temple Mandir Structure */}
      <group position={[0, 0.4, -0.4]}>
        {/* Mandir Base */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.9, 1.2]} />
          <meshStandardMaterial color="#5C2C16" roughness={0.4} />
        </mesh>
        {/* Mandir Inner Altar Platform with Red Velvet Cloth */}
        <mesh position={[0, 0.92, 0]}>
          <boxGeometry args={[2.2, 0.04, 1.0]} />
          <meshStandardMaterial color="#990000" roughness={0.7} />
        </mesh>

        {/* 4 Carved Pillars */}
        {[-1.0, 1.0].map((x, i) =>
          [-0.45, 0.45].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 1.8, z]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 1.7, 16]} />
              <meshStandardMaterial color="#8B4513" roughness={0.3} metalness={0.1} />
            </mesh>
          ))
        )}

        {/* Mandir Shikhara (Traditional Tiered Temple Dome) */}
        <mesh position={[0, 2.8, 0]} castShadow>
          <boxGeometry args={[2.6, 0.3, 1.4]} />
          <meshStandardMaterial color="#5C2C16" roughness={0.4} />
        </mesh>
        <mesh position={[0, 3.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[0.9, 1.2, 4]} />
          <meshStandardMaterial color="#8B4513" roughness={0.3} />
        </mesh>
        {/* Kalash on Shikhar apex */}
        <mesh position={[0, 4.05, 0]}>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Sacred Brass Deities / Idols in Center Sanctum */}
        <group position={[0, 1.2, 0]}>
          {/* Lakshmi Idol (Goddess of Wealth & Light) */}
          <mesh position={[-0.35, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.16, 0.5, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Ganesha Idol (Lord of Auspicious Beginnings) */}
          <mesh position={[0.35, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.18, 0.5, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Hanging Brass Temple Bell (Ghanti) */}
      <group position={[0, 2.8, 0.2]} ref={bellRef}>
        {/* Brass Chain */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Bell Body */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]} castShadow>
          <coneGeometry args={[0.16, 0.26, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Bell clapper */}
        <mesh position={[0, -0.12, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#B8860B" metalness={0.9} />
        </mesh>
      </group>

      {/* Tall Brass Diyas (Samai / Kuthu Vilakku) on Left & Right */}
      {[-1.3, 1.3].map((x, i) => {
        const diyaKey = i === 0 ? 'puja-samai-left' : 'puja-samai-right';
        const isLit = litDiyas[diyaKey] ?? true;
        return (
          <group key={i} position={[x, 0.4, 0.3]}>
            {/* Tall slender brass stem */}
            <mesh position={[0, 0.45, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.08, 0.9, 12]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Oil bowl with 5 wicks */}
            <mesh position={[0, 0.9, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.1, 0.06, 16]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Flame */}
            {isLit && (
              <group position={[0, 0.98, 0]}>
                <mesh>
                  <sphereGeometry args={[0.05, 8, 8]} />
                  <meshBasicMaterial color="#FF5722" />
                </mesh>
                <mesh position={[0, 0.04, 0]}>
                  <coneGeometry args={[0.03, 0.08, 8]} />
                  <meshBasicMaterial color="#FFEB3B" />
                </mesh>
              </group>
            )}
          </group>
        );
      })}

      {/* Brass Urli filled with Water and Floating Flower Petals */}
      <group position={[0, 0.42, 0.55]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.28, 0.12, 24]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Water surface */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.33, 24]} />
          <meshStandardMaterial color="#1E90FF" roughness={0.1} metalness={0.1} />
        </mesh>
        {/* Floating Marigold Petals */}
        {[...Array(8 + flowersOfferedCount)].map((_, idx) => (
          <mesh
            key={idx}
            position={[
              Math.cos(idx * 0.9) * 0.18,
              0.06,
              Math.sin(idx * 0.9) * 0.18,
            ]}
          >
            <sphereGeometry args={[0.035, 6, 6]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#FFA500' : '#FFD700'} />
          </mesh>
        ))}
      </group>

      {/* Warm Sanctum Light */}
      <pointLight position={[0, 2.2, 0]} color="#FFD700" intensity={2.0} distance={8} decay={2} />
    </group>
  );
};

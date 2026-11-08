import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

export const PujaCorner: React.FC = () => {
  const {
    playerPosition,
    setActivePrompt,
    ringPujaBell,
    offerFlowers,
    pujaBellRangCount,
    flowersOfferedCount,
    litDiyas,
    lightDiya,
  } = useGameState();

  const bellRef = useRef<THREE.Group>(null);

  // Animate bell swing when recently rung
  useFrame((_, delta) => {
    if (bellRef.current) {
      if (pujaBellRangCount > 0) {
        bellRef.current.rotation.z = Math.sin(Date.now() * 0.015) * 0.3 * Math.exp(-0.8 * (Date.now() % 3000) / 1000);
      }
    }

    // Proximity check: Puja corner is at [ -5.5, 0, -12 ]
    const distToPuja = Math.hypot(playerPosition[0] - (-5.5), playerPosition[2] - (-12));
    if (distToPuja < 2.5) {
      // Prioritize bell ring, then flower offering, then diya lighting
      if (!litDiyas['puja-samai-left'] || !litDiyas['puja-samai-right']) {
        setActivePrompt({
          id: 'puja-diya',
          label: 'Light Sacred Puja Diya 🪔',
          subtext: 'Press [E] or Tap',
          action: () => {
            audioManager.playDiyaLight();
            if (!litDiyas['puja-samai-left']) lightDiya('puja-samai-left');
            else lightDiya('puja-samai-right');
          },
        });
      } else {
        setActivePrompt({
          id: 'puja-bell',
          label: 'Ring Sacred Temple Bell 🔔',
          subtext: 'Press [E] or Tap for Blessing',
          action: () => {
            audioManager.playPujaBell();
            ringPujaBell();
            offerFlowers();
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

        {/* Mandir Shikhara (Traditional Tiered Temple Dome / Shikhar) */}
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
        const isLit = litDiyas[diyaKey] ?? true; // left diya starts lit for festive beauty
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
                <pointLight color="#FFA500" intensity={1.6} distance={4} decay={2} />
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
            <meshStandardMaterial color={idx % 2 === 0 ? '#FFA500' : '#E91E63'} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Holy Divine Aura Point Light inside Mandir */}
      <pointLight position={[0, 1.8, -0.3]} color="#FFD700" intensity={2.8} distance={7} decay={2} />
    </group>
  );
};

import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
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
      {/* ==============================================================
          1. COURTYARD PAVING: AGED JAISALMER SANDSTONE & RED TERRACOTTA
          ============================================================== */}
      {/* Main Courtyard Floor (Z: 0 to 14) */}
      <mesh position={[0, 0, 7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 14]} />
        <meshStandardMaterial color="#C59B76" roughness={0.68} />
      </mesh>

      {/* Decorative Red Sandstone Central Aisle Leading to Haveli Porch */}
      <mesh position={[0, 0.01, 7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.2, 14]} />
        <meshStandardMaterial color="#8F5435" roughness={0.65} />
      </mesh>

      {/* Ornamental Floral Border Inlay along Aisle */}
      {[-2.05, 2.05].map((bx, bi) => (
        <mesh key={`aisleborder-${bi}`} position={[bx, 0.012, 7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.18, 14]} />
          <meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* ==============================================================
          2. CARVED COURTYARD BOUNDARY WALLS WITH JAALI SCREENS & NICHES
          ============================================================== */}
      {/* Left Courtyard Wall with Jaali Screen & Diya Niches */}
      <group position={[-14, 0, 7]}>
        {/* Main Sandstone Wall */}
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 3.2, 14]} />
          <meshStandardMaterial color="#C68B59" roughness={0.7} />
        </mesh>
        {/* Ornamental Jaali Screen Parapet on Wall Top */}
        <mesh position={[0, 3.4, 0]} castShadow>
          <boxGeometry args={[0.2, 0.6, 14]} />
          <meshStandardMaterial color="#8F4B23" roughness={0.6} />
        </mesh>
        {/* Wall Niches with Lit Terracotta Diyas */}
        {[-4.5, 0, 4.5].map((wz, wi) => (
          <group key={`lwall-niche-${wi}`} position={[0.22, 1.8, wz]}>
            <mesh castShadow>
              <boxGeometry args={[0.15, 0.8, 0.6]} />
              <meshStandardMaterial color="#8B4513" roughness={0.6} />
            </mesh>
            <mesh position={[0.08, -0.28, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.045, 0.05, 10]} />
              <meshStandardMaterial color="#8B4513" roughness={0.7} />
            </mesh>
            <mesh position={[0.08, -0.22, 0]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#FF5722" emissive="#FFA500" emissiveIntensity={3.2} />
            </mesh>
            <pointLight position={[0.2, -0.15, 0]} color="#FFA500" intensity={0.6} distance={3} decay={2} />
          </group>
        ))}
      </group>

      {/* Right Courtyard Wall with Jaali Screen & Diya Niches */}
      <group position={[14, 0, 7]}>
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 3.2, 14]} />
          <meshStandardMaterial color="#C68B59" roughness={0.7} />
        </mesh>
        <mesh position={[0, 3.4, 0]} castShadow>
          <boxGeometry args={[0.2, 0.6, 14]} />
          <meshStandardMaterial color="#8F4B23" roughness={0.6} />
        </mesh>
        {[-4.5, 0, 4.5].map((wz, wi) => (
          <group key={`rwall-niche-${wi}`} position={[-0.22, 1.8, wz]}>
            <mesh castShadow>
              <boxGeometry args={[0.15, 0.8, 0.6]} />
              <meshStandardMaterial color="#8B4513" roughness={0.6} />
            </mesh>
            <mesh position={[-0.08, -0.28, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.045, 0.05, 10]} />
              <meshStandardMaterial color="#8B4513" roughness={0.7} />
            </mesh>
            <mesh position={[-0.08, -0.22, 0]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#FF5722" emissive="#FFA500" emissiveIntensity={3.2} />
            </mesh>
            <pointLight position={[-0.2, -0.15, 0]} color="#FFA500" intensity={0.6} distance={3} decay={2} />
          </group>
        ))}
      </group>

      {/* Courtyard-to-Street Gateway Portal at Z = 14 */}
      <group position={[0, 0, 14]}>
        {[-3.8, 3.8].map((px, pi) => (
          <group key={`cgate-${pi}`} position={[px, 0, 0]}>
            <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.65, 3.6, 0.65]} />
              <meshStandardMaterial color="#8F4B23" roughness={0.65} />
            </mesh>
            <mesh position={[0, 3.8, 0]} castShadow>
              <sphereGeometry args={[0.18, 12, 12]} />
              <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.25} />
            </mesh>
          </group>
        ))}
        {/* Overhead Toran String */}
        <group position={[0, 3.4, 0]}>
          {[...Array(15)].map((_, i) => (
            <mesh key={`cgtoran-${i}`} position={[(i - 7) * 0.45, Math.sin((i / 14) * Math.PI) * -0.2, 0]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#FF9E00' : '#E85D04'}
                emissive={i % 2 === 0 ? '#FFA200' : '#DC2F02'}
                emissiveIntensity={0.6}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==============================================================
          3. PHYSICAL 3D RANGOLI & POWDER STATIONS (CourtyardRangoli)
          ============================================================== */}
      <CourtyardRangoli />

      {/* ==============================================================
          4. SACRED TULSI VRINDAVAN (TULSI KYARI SHRINE) AT [-5, 0, 6]
          ============================================================== */}
      <group position={[-5, 0, 6]}>
        {/* Stepped Terracotta Base Plinth */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.3, 1.5]} />
          <meshStandardMaterial color="#8B3A2B" roughness={0.65} />
        </mesh>
        {/* Ornate Octagonal Vrindavan Body */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.55, 0.65, 0.9, 8]} />
          <meshStandardMaterial color="#A64B2A" roughness={0.6} />
        </mesh>
        {/* Carved Ledge & Crown Rim */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[1.25, 0.12, 1.25]} />
          <meshStandardMaterial color="#8B3A2B" roughness={0.6} />
        </mesh>
        {/* Kalash Spire Motifs on 4 Corners */}
        {[-0.5, 0.5].map((cx, ci) =>
          [-0.5, 0.5].map((cz, cj) => (
            <mesh key={`tkalash-${ci}-${cj}`} position={[cx, 1.35, cz]} castShadow>
              <coneGeometry args={[0.06, 0.14, 8]} />
              <meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.3} />
            </mesh>
          ))
        )}

        {/* Sacred Holy Basil (Tulsi) Plant on Top with Delicate Branches */}
        <group position={[0, 1.45, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.3, 8]} />
            <meshStandardMaterial color="#3D1D09" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.28, 0]} castShadow>
            <sphereGeometry args={[0.42, 12, 12]} />
            <meshStandardMaterial color="#1B4D28" roughness={0.65} />
          </mesh>
          <mesh position={[0.1, 0.42, 0.08]} castShadow>
            <sphereGeometry args={[0.26, 10, 10]} />
            <meshStandardMaterial color="#245F33" roughness={0.65} />
          </mesh>
        </group>

        {/* Shrine Arched Niche with Sacred Diya */}
        <group position={[0, 0.75, 0.52]}>
          {/* Niche Frame */}
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.45, 0.12]} />
            <meshStandardMaterial color="#5C1D13" roughness={0.7} />
          </mesh>
          {/* Brass Diya Vessel */}
          <mesh position={[0, -0.12, 0.04]} castShadow>
            <cylinderGeometry args={[0.09, 0.06, 0.05, 12]} />
            <meshStandardMaterial color="#DAA520" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Diya Flame when Lit */}
          {isTulsiLit && (
            <group position={[0, -0.06, 0.04]}>
              <mesh>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial
                  color="#FF5722"
                  emissive="#FFA500"
                  emissiveIntensity={3.8}
                />
              </mesh>
              <pointLight color="#FFA500" intensity={1.5} distance={5} decay={2} />
            </group>
          )}
        </group>
      </group>

      {/* ==============================================================
          5. TRADITIONAL INDIAN WOVEN CHARPAI COT & CARVED PILLAR
          ============================================================== */}
      {/* Handcrafted Indian Charpai Cot at [ 5.8, 0, 4 ] */}
      <group position={[5.8, 0, 4]} rotation={[0, -0.22, 0]}>
        {/* Carved Sheesham Frame */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.09, 1.3]} />
          <meshStandardMaterial color="#361705" roughness={0.45} />
        </mesh>
        {/* Woven Jute Rope Surface with Traditional Cross-Twill Weave */}
        <mesh position={[0, 0.47, 0]} receiveShadow>
          <boxGeometry args={[2.15, 0.04, 1.05]} />
          <meshStandardMaterial color="#DDB892" roughness={0.9} />
        </mesh>
        {/* 4 Turned Wooden Legs */}
        {[
          [-1.05, -0.5],
          [1.05, -0.5],
          [-1.05, 0.5],
          [1.05, 0.5],
        ].map(([lx, lz], i) => (
          <mesh key={`charpaileg-${i}`} position={[lx, 0.22, lz]} castShadow>
            <cylinderGeometry args={[0.05, 0.04, 0.44, 10]} />
            <meshStandardMaterial color="#DAA520" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
        {/* Embroidered Rajasthani Bolster Cushion on Charpai */}
        <mesh position={[0, 0.62, -0.32]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 1.2, 16]} />
          <meshStandardMaterial color="#E76F51" roughness={0.5} />
        </mesh>
      </group>

      {/* Carved Stone Pillar with Brass Lantern at [ 5, 0, 6 ] */}
      <group position={[5, 0, 6]}>
        {/* Stepped Pedestal Base */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color="#8F4B23" roughness={0.65} />
        </mesh>
        {/* Fluted Stone Shaft */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.28, 2.0, 16]} />
          <meshStandardMaterial color="#C68B59" roughness={0.6} />
        </mesh>
        {/* Ornate Rajput Capital */}
        <mesh position={[0, 2.7, 0]} castShadow>
          <boxGeometry args={[0.65, 0.25, 0.65]} />
          <meshStandardMaterial color="#8F4B23" roughness={0.6} />
        </mesh>
        {/* Brass Hexagonal Lantern Housing */}
        <group position={[0, 3.1, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.26, 0.2, 0.55, 6]} />
            <meshStandardMaterial color="#DAA520" metalness={0.88} roughness={0.25} />
          </mesh>
          {/* Flame inside Lantern */}
          {isPillarLit && (
            <group position={[0, 0, 0]}>
              <mesh>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshStandardMaterial
                  color="#FF5722"
                  emissive="#FFA500"
                  emissiveIntensity={3.6}
                />
              </mesh>
              <pointLight color="#FFA500" intensity={1.8} distance={6} decay={2} />
            </group>
          )}
        </group>
      </group>
    </group>
  );
};

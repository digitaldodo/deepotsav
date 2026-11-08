import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

export const HouseInterior: React.FC = () => {
  const {
    playerPosition,
    setActivePrompt,
    giftBoxOpened,
    openGiftBox,
  } = useGameState();

  const coinRef = useRef<THREE.Group>(null);

  // Proximity check for gift box on coffee table at [-5.5, 0.8, -3.2]
  useFrame((state, delta) => {
    // Gentle floating shimmer for the gold coin once revealed
    if (coinRef.current && giftBoxOpened) {
      coinRef.current.rotation.y += delta * 1.2;
    }

    const distToGift = Math.hypot(playerPosition[0] - (-5.5), playerPosition[2] - (-3.2));
    if (distToGift < 2.2 && !giftBoxOpened) {
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
      {/* ==============================================================
          1. INTERIOR SHELL: WARM TERRACOTTA FLOOR, IVORY WALLS, WOOD BEAMS
          ============================================================== */}
      {/* Polished Teak & Terracotta Parquet Floor */}
      <mesh position={[0, 0.01, -7]} receiveShadow>
        <planeGeometry args={[30, 14]} />
        <meshStandardMaterial color="#6B3714" roughness={0.35} />
      </mesh>

      {/* Ceiling with Ivory Plaster Foundation */}
      <mesh position={[0, 5.8, -7]}>
        <planeGeometry args={[30, 14]} />
        <meshStandardMaterial color="#FFF9EB" roughness={0.8} />
      </mesh>

      {/* Exposed Teak Rafters / Ceiling Beams (Kadi-Chhat) */}
      {[-12, -9, -6, -3, 0, 3, 6, 9, 12].map((bx, bi) => (
        <group key={`beam-${bi}`} position={[bx, 5.65, -7]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.3, 0.35, 14]} />
            <meshStandardMaterial color="#3D1D09" roughness={0.5} />
          </mesh>
          {/* Carved stone corbel support brackets at wall junctions */}
          <mesh position={[0, -0.22, -6.8]} castShadow>
            <boxGeometry args={[0.32, 0.25, 0.4]} />
            <meshStandardMaterial color="#8B4513" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.22, 6.8]} castShadow>
            <boxGeometry args={[0.32, 0.25, 0.4]} />
            <meshStandardMaterial color="#8B4513" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Interior Back Wall with Carved Base Dado */}
      <mesh position={[0, 3, -14]} receiveShadow>
        <boxGeometry args={[30, 6, 0.45]} />
        <meshStandardMaterial color="#FAF3DD" roughness={0.65} />
      </mesh>
      {/* Decorative Wood Baseboard Dado along Back Wall */}
      <mesh position={[0, 0.45, -13.75]} receiveShadow>
        <boxGeometry args={[30, 0.9, 0.1]} />
        <meshStandardMaterial color="#4A2306" roughness={0.5} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-15, 3, -7]} receiveShadow>
        <boxGeometry args={[0.45, 6, 14]} />
        <meshStandardMaterial color="#FAF3DD" roughness={0.65} />
      </mesh>
      <mesh position={[-14.75, 0.45, -7]} receiveShadow>
        <boxGeometry args={[0.1, 0.9, 14]} />
        <meshStandardMaterial color="#4A2306" roughness={0.5} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[15, 3, -7]} receiveShadow>
        <boxGeometry args={[0.45, 6, 14]} />
        <meshStandardMaterial color="#FAF3DD" roughness={0.65} />
      </mesh>
      <mesh position={[14.75, 0.45, -7]} receiveShadow>
        <boxGeometry args={[0.1, 0.9, 14]} />
        <meshStandardMaterial color="#4A2306" roughness={0.5} />
      </mesh>

      {/* ==============================================================
          2. CUSPED ARCHED WALL NICHES (AALA / TAAK) WITH DIYAS
          ============================================================== */}
      {[-8.5, -3.5, 3.5, 8.5].map((nx, ni) => (
        <group key={`niche-${ni}`} position={[nx, 2.8, -13.75]}>
          {/* Recessed Niche Box */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 1.6, 0.2]} />
            <meshStandardMaterial color="#E8CF9A" roughness={0.6} />
          </mesh>
          {/* Cusped Arch Top Frame */}
          <mesh position={[0, 0.8, 0.05]} castShadow rotation={[0, 0, Math.PI]}>
            <cylinderGeometry args={[0.6, 0.6, 0.15, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#8B4513" roughness={0.55} />
          </mesh>
          {/* Carved Terracotta Oil Diya resting inside niche */}
          <group position={[0, -0.65, 0.04]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.09, 0.06, 0.05, 12]} />
              <meshStandardMaterial color="#8B4513" roughness={0.7} />
            </mesh>
            {/* Glowing Flame */}
            <mesh position={[0, 0.055, 0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial
                color="#FF5722"
                emissive="#FFA500"
                emissiveIntensity={3.6}
              />
            </mesh>
            <pointLight color="#FFA500" intensity={0.5} distance={2.5} decay={2} />
          </group>
        </group>
      ))}

      {/* ==============================================================
          3. INTRICATE KASHMIRI MEDALLION RUG
          ============================================================== */}
      <group position={[-5.5, 0.02, -4.2]}>
        {/* Outer Madder Red Base with Gold Zari Fringe */}
        <mesh receiveShadow>
          <planeGeometry args={[5.8, 4.4]} />
          <meshStandardMaterial color="#780016" roughness={0.8} />
        </mesh>
        {/* Gold Brocade Concentric Border 1 */}
        <mesh position={[0, 0.003, 0]}>
          <planeGeometry args={[5.4, 4.0]} />
          <meshStandardMaterial color="#C68B59" roughness={0.7} />
        </mesh>
        {/* Deep Indigo Inner Field */}
        <mesh position={[0, 0.006, 0]}>
          <planeGeometry args={[4.8, 3.4]} />
          <meshStandardMaterial color="#1D3557" roughness={0.75} />
        </mesh>
        {/* Central Saffron Floral Medallion */}
        <mesh position={[0, 0.009, 0]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshStandardMaterial color="#E76F51" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.012, 0]}>
          <circleGeometry args={[0.55, 16]} />
          <meshStandardMaterial color="#F4A261" roughness={0.65} />
        </mesh>
        {/* Silk Tassels along North & South Ends */}
        {[-2.2, 2.2].map((ty, ti) => (
          <group key={`rugfringe-${ti}`} position={[0, 0.005, ty]}>
            {[...Array(24)].map((_, fi) => (
              <mesh key={`rf-${fi}`} position={[(fi - 11.5) * 0.22, 0, 0]}>
                <boxGeometry args={[0.04, 0.01, 0.12]} />
                <meshStandardMaterial color="#DAA520" roughness={0.4} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* ==============================================================
          4. TRADITIONAL SHEESHAM DIWAN / BAITHAK SOFA
          ============================================================== */}
      <group position={[-5.5, 0, -5.6]}>
        {/* Carved Sheesham Wood Base Frame with Turned Legs */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 0.3, 1.4]} />
          <meshStandardMaterial color="#361705" roughness={0.45} />
        </mesh>
        {/* 4 Lathe-Turned Brass-Accented Legs */}
        {[
          [-1.75, -0.55],
          [1.75, -0.55],
          [-1.75, 0.55],
          [1.75, 0.55],
        ].map(([lx, lz], li) => (
          <mesh key={`dleg-${li}`} position={[lx, 0.12, lz]} castShadow>
            <cylinderGeometry args={[0.06, 0.04, 0.24, 12]} />
            <meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
        {/* Royal Crimson Velvet Mattress with Zari Piping */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[3.6, 0.24, 1.3]} />
          <meshStandardMaterial color="#800020" roughness={0.65} />
        </mesh>
        {/* Ornate Pierced Sheesham Backrest */}
        <group position={[0, 1.05, -0.6]}>
          <mesh castShadow>
            <boxGeometry args={[3.8, 0.7, 0.14]} />
            <meshStandardMaterial color="#361705" roughness={0.45} />
          </mesh>
          {/* Carved Crest along top of backrest */}
          <mesh position={[0, 0.42, 0]} castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 3.8, 12]} />
            <meshStandardMaterial color="#4A2306" roughness={0.4} />
          </mesh>
        </group>

        {/* Cylindrical Silk Bolsters (Gau-Takkiya) on Left & Right */}
        {[-1.5, 1.5].map((bx, bi) => (
          <group key={`bolster-${bi}`} position={[bx, 0.85, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.2, 0.2, 1.0, 20]} />
              <meshStandardMaterial color="#E9C46A" metalness={0.2} roughness={0.4} />
            </mesh>
            {/* Gold Tassel End Caps */}
            {[-0.5, 0.5].map((ey, ei) => (
              <mesh key={`tassel-${ei}`} position={[0, ey, 0]} castShadow>
                <cylinderGeometry args={[0.21, 0.21, 0.04, 16]} />
                <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.25} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Rich Throw Pillows (Masnad) */}
        {[-0.7, 0, 0.7].map((px, pi) => (
          <mesh
            key={`pillow-${pi}`}
            position={[px, 0.82, -0.32]}
            rotation={[0.3, (pi - 1) * 0.15, 0]}
            castShadow
          >
            <boxGeometry args={[0.48, 0.44, 0.18]} />
            <meshStandardMaterial
              color={pi === 0 ? '#E76F51' : pi === 1 ? '#2A9D8F' : '#9B5DE5'}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* ==============================================================
          5. CARVED COFFEE TABLE & INTERACTIVE 3D GIFT BOX
          ============================================================== */}
      <group position={[-5.5, 0, -3.2]}>
        {/* Tabletop Slab in Rich Dark Sheesham */}
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.08, 1.3]} />
          <meshStandardMaterial color="#361705" roughness={0.35} />
        </mesh>
        {/* Inlaid Brass Floral Edge Filigree */}
        <mesh position={[0, 0.47, 0]} receiveShadow>
          <boxGeometry args={[2.08, 0.02, 1.18]} />
          <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* 4 Carved Cabriole Legs */}
        {[-0.95, 0.95].map((x, i) =>
          [-0.5, 0.5].map((z, j) => (
            <mesh key={`tleg-${i}-${j}`} position={[x, 0.22, z]} castShadow>
              <cylinderGeometry args={[0.045, 0.035, 0.44, 10]} />
              <meshStandardMaterial color="#361705" roughness={0.4} />
            </mesh>
          ))
        )}

        {/* Small Brass Sweet Offerings Katori on Table */}
        <group position={[-0.6, 0.49, 0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.12, 0.06, 16]} />
            <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Silver Vark Kaju Katli Pieces */}
          <mesh position={[0, 0.04, 0]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.12, 0.04, 0.12]} />
            <meshStandardMaterial color="#E0E0E0" metalness={0.9} roughness={0.15} />
          </mesh>
        </group>

        {/* ==============================================================
            PHYSICAL 3D FESTIVE GIFT BOX WITH ANIMATING LID & REVEAL
            ============================================================== */}
        <group position={[0.25, 0.52, 0]}>
          {/* Box Bottom Basin */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.5, 0.24, 0.5]} />
            <meshStandardMaterial color="#800020" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Gold Brocade Ribbon on Box Sides */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.505, 0.245, 0.1]} />
            <meshStandardMaterial color="#DAA520" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.245, 0.505]} />
            <meshStandardMaterial color="#DAA520" metalness={0.85} roughness={0.2} />
          </mesh>

          {/* Animating Box Lid (Flies open when opened) */}
          <group
            position={[0, giftBoxOpened ? 0.45 : 0.13, giftBoxOpened ? 0.25 : 0]}
            rotation={[giftBoxOpened ? -0.45 : 0, 0, giftBoxOpened ? 0.25 : 0]}
          >
            <mesh castShadow>
              <boxGeometry args={[0.54, 0.06, 0.54]} />
              <meshStandardMaterial color="#A0002A" roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Gold Ribbon Cross on Top of Lid */}
            <mesh position={[0, 0.035, 0]}>
              <boxGeometry args={[0.55, 0.015, 0.1]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.035, 0]}>
              <boxGeometry args={[0.1, 0.015, 0.55]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Satin Rosette Bow */}
            <mesh position={[0, 0.07, 0]} castShadow>
              <sphereGeometry args={[0.07, 10, 10]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>

          {/* Auspicious 24K Gold Coin & Parchment Inside */}
          {giftBoxOpened && (
            <group position={[0, 0.16, 0]} ref={coinRef}>
              <mesh castShadow rotation={[Math.PI / 4, 0, 0]}>
                <cylinderGeometry args={[0.11, 0.11, 0.02, 24]} />
                <meshStandardMaterial
                  color="#FFD700"
                  metalness={0.98}
                  roughness={0.12}
                  emissive="#FFD700"
                  emissiveIntensity={0.65}
                />
              </mesh>
              {/* Handwritten Diwali Parchment Scroll */}
              <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0.1]}>
                <planeGeometry args={[0.34, 0.26]} />
                <meshStandardMaterial color="#FFF8DC" roughness={0.8} />
              </mesh>
              <pointLight color="#FFD700" intensity={0.9} distance={2.5} decay={2} />
            </group>
          )}
        </group>
      </group>

      {/* ==============================================================
          6. HERITAGE CONSOLE, FAMILY FRAME, BRASS SURAHI & OIL SAMAI
          ============================================================== */}
      <group position={[0, 0, -13.2]}>
        {/* Carved Console Table in Sheesham */}
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 1.3, 0.7]} />
          <meshStandardMaterial color="#2B1408" roughness={0.45} />
        </mesh>
        {/* Brass Knob Pulls */}
        {[-0.9, -0.3, 0.3, 0.9].map((kx, ki) => (
          <mesh key={`knob-${ki}`} position={[kx, 0.85, 0.36]} castShadow>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Vintage Family Diwali Portrait in Repoussé Brass Frame */}
        <group position={[0, 1.7, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.7, 0.05]} />
            <meshStandardMaterial color="#DAA520" metalness={0.88} roughness={0.25} />
          </mesh>
          {/* Painting / Photo insert */}
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.76, 0.56]} />
            <meshStandardMaterial color="#FFE4B5" roughness={0.4} />
          </mesh>
        </group>

        {/* Royal Brass Surahi (Long-Neck Water Urn) on Console Left */}
        <group position={[-1.0, 1.5, 0.05]}>
          <mesh castShadow>
            <sphereGeometry args={[0.16, 14, 14]} />
            <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.07, 0.3, 14]} />
            <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <coneGeometry args={[0.05, 0.1, 12]} />
            <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Brass Paan-Daan (Betel Box) on Console Right */}
        <mesh position={[1.0, 1.38, 0.05]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.12, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.3} />
        </mesh>

        {/* Flanking Tall Brass Samai Floor Oil Lamps */}
        {[-2.2, 2.2].map((sx, si) => (
          <group key={`floorsamai-${si}`} position={[sx, 0, 0.2]}>
            {/* Stepped Brass Base */}
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.24, 0.3, 0.2, 16]} />
              <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Fluted Column */}
            <mesh position={[0, 0.9, 0]} castShadow>
              <cylinderGeometry args={[0.045, 0.065, 1.4, 12]} />
              <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Tiered Oil Diya Plates */}
            <mesh position={[0, 1.6, 0]} castShadow>
              <cylinderGeometry args={[0.26, 0.18, 0.08, 16]} />
              <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Crowning Brass Peacock (Mayur) Finial */}
            <mesh position={[0, 1.82, 0]} castShadow>
              <coneGeometry args={[0.07, 0.24, 10]} />
              <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Samai Flame */}
            <mesh position={[0, 1.68, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial
                color="#FF5722"
                emissive="#FFA500"
                emissiveIntensity={3.4}
              />
            </mesh>
            <pointLight color="#FFA500" intensity={0.9} distance={4} decay={2} />
          </group>
        ))}
      </group>

      {/* ==============================================================
          7. ORNATE HANGING BRASS JHUMKA CHANDELIER & WARM ROOM LIGHT
          ============================================================== */}
      <group position={[-5.5, 4.4, -4.5]}>
        {/* Chain */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
          <meshStandardMaterial color="#DAA520" metalness={0.9} />
        </mesh>
        {/* Pierced Brass Chandelier Bell */}
        <mesh castShadow>
          <sphereGeometry args={[0.42, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
          <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Hanging Miniature Brass Ghungroos */}
        {[...Array(8)].map((_, gi) => {
          const ga = (gi / 8) * Math.PI * 2;
          return (
            <mesh key={`ghungroo-${gi}`} position={[Math.cos(ga) * 0.38, -0.22, Math.sin(ga) * 0.38]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} />
            </mesh>
          );
        })}
        {/* Internal Glow Bulb */}
        <mesh position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshStandardMaterial
            color="#FF9E00"
            emissive="#FFA500"
            emissiveIntensity={2.5}
          />
        </mesh>
        <pointLight position={[0, -0.1, 0]} color="#FFA500" intensity={2.6} distance={14} decay={2} />
      </group>

      {/* Auspicious Brass Shubh-Labh & Kalash Plaque on Far Wall */}
      <group position={[0, 4.4, -13.7]}>
        <mesh castShadow>
          <circleGeometry args={[0.55, 32]} />
          <meshStandardMaterial color="#DAA520" metalness={0.92} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <ringGeometry args={[0.42, 0.48, 32]} />
          <meshStandardMaterial color="#800020" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};

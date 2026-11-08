import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';
import { CourtyardRangoli } from './CourtyardRangoli';
import { registerInteractive, unregisterInteractive } from '../controls/FirstPersonController';
import { getSandstoneTexture, getTerracottaTileTexture } from '../utils/textureGenerator';
import { BrassPotModel, LanternModel, PlanterPotModel, PottedPlantModel } from './ModelLoader';

export const Courtyard: React.FC = () => {
  const { litDiyas, lightTargetDiya, pickUpDiyaStick } = useGameState();

  const sandstoneTex = useMemo(() => getSandstoneTexture('#C68B59'), []);
  const tileTex = useMemo(() => getTerracottaTileTexture(), []);

  // Register Tulsi Diya & Courtyard Lantern interactions
  useEffect(() => {
    registerInteractive({
      id: 'tulsi-diya',
      label: litDiyas['tulsi-diya']
        ? 'Take Brass Flame Wand from Tulsi 🪔'
        : 'Light Tulsi Shrine Diya 🪔',
      subtext: litDiyas['tulsi-diya']
        ? 'Hold brass lighting stick with blessed flame'
        : 'Click or [E] to ignite flame with brass wand',
      position: new THREE.Vector3(-4.0, 0.9, 6.0),
      maxDistance: 2.6,
      action: () => {
        if (!litDiyas['tulsi-diya']) {
          audioManager.playDiyaLight();
          lightTargetDiya('tulsi-diya');
        } else {
          audioManager.playDiyaLight();
          pickUpDiyaStick();
        }
      },
    });

    return () => {
      unregisterInteractive('tulsi-diya');
    };
  }, [litDiyas, lightTargetDiya, pickUpDiyaStick]);

  const isTulsiLit = litDiyas['tulsi-diya'] ?? true;

  return (
    <group position={[0, 0, 0]}>
      {/* ==============================================================
          1. COURTYARD PAVING: TERRACOTTA TILES & RED SANDSTONE AISLE
          ============================================================== */}
      {/* Main Courtyard Floor (X: -6.0 to 6.0, Z: 0.0 to 12.0) */}
      <mesh position={[0, 0, 6.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12.0, 12.0]} />
        <meshStandardMaterial map={tileTex} roughness={0.7} />
      </mesh>

      {/* Central Sandstone Aisle leading from Haveli Porch to Garden Gateway */}
      <mesh position={[0, 0.008, 6.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 12.0]} />
        <meshStandardMaterial map={sandstoneTex} roughness={0.65} />
      </mesh>
      {/* Gold Trim Inlays along Aisle */}
      {[-1.6, 1.6].map((bx, bi) => (
        <mesh key={`cborder-${bi}`} position={[bx, 0.012, 6.0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 12.0]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}

      {/* ==============================================================
          2. CARVED COURTYARD BOUNDARY WALLS WITH JAALI SCREENS & NICHES
          ============================================================== */}
      {/* Left Courtyard Wall (X: -6.0) */}
      <group position={[-6.0, 0, 6.0]}>
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 3.6, 12.0]} />
          <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
        </mesh>
        {/* Decorative Cornice */}
        <mesh position={[0, 3.65, 0]} castShadow>
          <boxGeometry args={[0.5, 0.15, 12.0]} />
          <meshStandardMaterial color="#8F4B23" roughness={0.6} />
        </mesh>
        {/* Lit Terracotta Diyas in Wall Niches */}
        {[-3.5, 0, 3.5].map((wz, wi) => (
          <group key={`lwniche-${wi}`} position={[0.22, 1.8, wz]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.12, 0.5, 0.35]} />
              <meshStandardMaterial color="#4A2306" roughness={0.6} />
            </mesh>
            <mesh position={[0.05, -0.18, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.04, 0.038, 10]} />
              <meshStandardMaterial color="#A35334" roughness={0.75} />
            </mesh>
            <mesh position={[0.05, -0.15, 0]}>
              <coneGeometry args={[0.016, 0.045, 8]} />
              <meshBasicMaterial color="#FF9900" />
            </mesh>
            <pointLight color="#FF9900" intensity={1.4} distance={2.4} decay={2} />
          </group>
        ))}
      </group>

      {/* Right Courtyard Wall (X: 6.0) */}
      <group position={[6.0, 0, 6.0]}>
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 3.6, 12.0]} />
          <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
        </mesh>
        <mesh position={[0, 3.65, 0]} castShadow>
          <boxGeometry args={[0.5, 0.15, 12.0]} />
          <meshStandardMaterial color="#8F4B23" roughness={0.6} />
        </mesh>
        {[-3.5, 0, 3.5].map((wz, wi) => (
          <group key={`rwniche-${wi}`} position={[-0.22, 1.8, wz]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.12, 0.5, 0.35]} />
              <meshStandardMaterial color="#4A2306" roughness={0.6} />
            </mesh>
            <mesh position={[-0.05, -0.18, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.04, 0.038, 10]} />
              <meshStandardMaterial color="#A35334" roughness={0.75} />
            </mesh>
            <mesh position={[-0.05, -0.15, 0]}>
              <coneGeometry args={[0.016, 0.045, 8]} />
              <meshBasicMaterial color="#FF9900" />
            </mesh>
            <pointLight color="#FF9900" intensity={1.4} distance={2.4} decay={2} />
          </group>
        ))}
      </group>

      {/* Gateway Wall dividing Courtyard and Garden at Z: 12.0 */}
      <group position={[0, 0, 12.0]}>
        {/* Left Gate Wall */}
        <mesh position={[-4.1, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 3.2, 0.4]} />
          <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
        </mesh>
        {/* Right Gate Wall */}
        <mesh position={[4.1, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 3.2, 0.4]} />
          <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
        </mesh>
        {/* Gate Pillars flanking central arch (Opening is X: -2.2 to 2.2) */}
        {[-2.2, 2.2].map((gx, gi) => (
          <group key={`gpillar-${gi}`} position={[gx, 0, 0]}>
            <mesh position={[0, 1.8, 0]} castShadow>
              <boxGeometry args={[0.55, 3.6, 0.55]} />
              <meshStandardMaterial color="#8F4B23" roughness={0.6} />
            </mesh>
            {/* Kalash Top Finial */}
            <mesh position={[0, 3.8, 0]} castShadow>
              <sphereGeometry args={[0.16, 12, 12]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ==============================================================
          3. TULSI VRINDAVAN SHRINE (COURTYARD CORNER AT [-4.0, 0, 6.0])
          ============================================================== */}
      <group position={[-4.0, 0, 6.0]}>
        {/* Stepped Makrana Base */}
        <mesh position={[0, 0.12, 0]} receiveShadow>
          <boxGeometry args={[1.4, 0.24, 1.4]} />
          <meshStandardMaterial color="#FFF8EB" roughness={0.3} />
        </mesh>
        {/* Carved Terracotta Tulsi Kyari Pillar */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.7, 0.8]} />
          <meshStandardMaterial color="#A35334" roughness={0.75} />
        </mesh>
        {/* Holy Basil Plant (Tulsi) */}
        <PottedPlantModel position={[0, 0.9, 0]} scale={0.28} />

        {/* Traditional Brass Pot / Lota (Poly Haven CC0 Model) */}
        <BrassPotModel position={[0.55, 0.24, 0.4]} scale={0.35} />

        {/* Dedicated Tulsi Terracotta Diya */}
        <group position={[0, 0.92, 0.44]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.045, 0.04, 10]} />
            <meshStandardMaterial color="#A35334" roughness={0.75} />
          </mesh>
          {isTulsiLit && (
            <>
              <mesh position={[0, 0.03, 0]}>
                <coneGeometry args={[0.018, 0.05, 8]} />
                <meshBasicMaterial color="#FF9900" />
              </mesh>
              <pointLight color="#FF9900" intensity={2.2} distance={3.0} decay={2} />
            </>
          )}
        </group>
      </group>

      {/* Traditional Clay Planters & Lanterns along Wall */}
      <PlanterPotModel position={[4.2, 0, 2.8]} scale={0.65} />
      <PlanterPotModel position={[4.2, 0, 9.2]} scale={0.65} />
      <LanternModel position={[-2.2, 2.6, 12.2]} scale={0.4} />
      <LanternModel position={[2.2, 2.6, 12.2]} scale={0.4} />

      {/* ==============================================================
          4. CENTRAL RANGOLI PEDESTAL
          ============================================================== */}
      <CourtyardRangoli />
    </group>
  );
};

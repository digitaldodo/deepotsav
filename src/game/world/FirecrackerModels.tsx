import React, { useMemo } from 'react';
import * as THREE from 'three';
import { FireworkType } from '../state/useGameState';
import {
  getChakriLabelTexture,
  getAnarWrapperTexture,
  getRocketLabelTexture,
  getLadiHeaderTexture,
  getSitaGeetaTexture,
  getGangaJamunaTexture,
} from '../utils/fireworkTextures';

export interface FirecrackerModelProps {
  type: FireworkType;
  isGhost?: boolean;
  isValidPlacement?: boolean;
  isFuseBurning?: boolean;
}

// Fuse world offset relative to firework root position [x, y, z]
export const FIREWORK_FUSE_OFFSETS: Record<FireworkType, [number, number, number]> = {
  phuljhari: [0, 0.36, 0],
  chakri: [0.14, 0.03, 0],
  anar: [0, 0.38, 0],
  rocket: [0, 0.24, 0],
  ladi: [0.26, 0.03, 0],
  pencil: [0, 0.32, 0],
  sita_geeta: [0, 0.28, 0],
  ganga_jamuna: [0, 0.26, 0],
};

export const FirecrackerModel: React.FC<FirecrackerModelProps> = ({
  type,
  isGhost = false,
  isValidPlacement = true,
  isFuseBurning = false,
}) => {
  const chakriTex = useMemo(() => getChakriLabelTexture(), []);
  const anarTex = useMemo(() => getAnarWrapperTexture('gold'), []);
  const rocketTex = useMemo(() => getRocketLabelTexture(), []);
  const ladiHeaderTex = useMemo(() => getLadiHeaderTexture(), []);
  const sitaGeetaTex = useMemo(() => getSitaGeetaTexture(), []);
  const gangaJamunaTex = useMemo(() => getGangaJamunaTexture(), []);

  // Ghost materials for pointer placement preview
  const ghostColor = isValidPlacement ? '#00E676' : '#FF1744';
  const ghostMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: ghostColor,
        emissive: ghostColor,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.65,
        wireframe: false,
      }),
    [ghostColor]
  );

  if (isGhost) {
    return (
      <group>
        {/* Ground Target Ring Indicator */}
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.42, 32]} />
          <meshBasicMaterial color={ghostColor} transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.35, 32]} />
          <meshBasicMaterial color={ghostColor} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>

        {/* Ghost Representation of Selected Firework */}
        {type === 'chakri' && (
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={ghostMat}>
            <cylinderGeometry args={[0.15, 0.15, 0.035, 24]} />
          </mesh>
        )}

        {type === 'anar' && (
          <mesh position={[0, 0.18, 0]} material={ghostMat}>
            <cylinderGeometry args={[0.04, 0.15, 0.36, 20]} />
          </mesh>
        )}

        {type === 'rocket' && (
          <group position={[0, 0.25, 0]}>
            <mesh position={[0, 0.1, 0]} material={ghostMat}>
              <cylinderGeometry args={[0.035, 0.035, 0.24, 16]} />
            </mesh>
            <mesh position={[0, 0.28, 0]} material={ghostMat}>
              <coneGeometry args={[0.038, 0.12, 16]} />
            </mesh>
            <mesh position={[0, -0.1, 0]} material={ghostMat}>
              <cylinderGeometry args={[0.004, 0.004, 0.4, 8]} />
            </mesh>
          </group>
        )}

        {type === 'ladi' && (
          <mesh position={[0, 0.02, 0]} material={ghostMat}>
            <boxGeometry args={[0.55, 0.04, 0.16]} />
          </mesh>
        )}

        {type === 'sita_geeta' && (
          <group position={[0, 0.14, 0]}>
            <mesh position={[-0.07, 0, 0]} material={ghostMat}>
              <cylinderGeometry args={[0.04, 0.05, 0.28, 16]} />
            </mesh>
            <mesh position={[0.07, 0, 0]} material={ghostMat}>
              <cylinderGeometry args={[0.04, 0.05, 0.28, 16]} />
            </mesh>
          </group>
        )}

        {type === 'ganga_jamuna' && (
          <group position={[0, 0.13, 0]}>
            <mesh position={[-0.08, 0, 0]} material={ghostMat}>
              <coneGeometry args={[0.08, 0.26, 16]} />
            </mesh>
            <mesh position={[0.08, 0, 0]} material={ghostMat}>
              <coneGeometry args={[0.08, 0.26, 16]} />
            </mesh>
          </group>
        )}

        {type === 'phuljhari' && (
          <mesh position={[0, 0.18, 0]} material={ghostMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.36, 10]} />
          </mesh>
        )}
      </group>
    );
  }

  // Authentic 3D Models
  return (
    <group>
      {/* 1. ZAMEEN CHAKRI (Ground Spinner) */}
      {type === 'chakri' && (
        <group position={[0, 0.016, 0]}>
          {/* Cardboard Outer Cylinder */}
          <mesh castShadow receiveShadow rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.032, 32]} />
            <meshStandardMaterial color="#8D4925" roughness={0.7} />
          </mesh>

          {/* Top Label Decal */}
          <mesh position={[0, 0.017, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.145, 32]} />
            <meshStandardMaterial map={chakriTex} roughness={0.4} />
          </mesh>

          {/* Central Brass Pivot Spindle */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.012, 16]} />
            <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Tangential Protruding Ignition Fuse */}
          <group position={[0.12, 0.012, 0]} rotation={[0, 0, -0.3]}>
            <mesh position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.003, 0.003, 0.045, 8]} />
              <meshStandardMaterial
                color={isFuseBurning ? '#FFF176' : '#E0E0E0'}
                emissive={isFuseBurning ? '#FF9800' : '#000000'}
                emissiveIntensity={isFuseBurning ? 2.5 : 0}
                roughness={0.9}
              />
            </mesh>
          </group>
        </group>
      )}

      {/* 2. ANAR FLOWER POT (Vertical Fountain) */}
      {type === 'anar' && (
        <group position={[0, 0, 0]}>
          {/* Heavy Earthen / Clay Base Plinth */}
          <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.16, 0.17, 0.04, 24]} />
            <meshStandardMaterial color="#A0522D" roughness={0.8} />
          </mesh>

          {/* Decorative Conical Body */}
          <mesh position={[0, 0.19, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.15, 0.32, 24]} />
            <meshStandardMaterial map={anarTex} roughness={0.45} />
          </mesh>

          {/* Top Clay/Paper Sealing Cap */}
          <mesh position={[0, 0.355, 0]}>
            <cylinderGeometry args={[0.038, 0.042, 0.018, 16]} />
            <meshStandardMaterial color="#FFE082" roughness={0.6} />
          </mesh>

          {/* Vertical Braided Fuse */}
          <mesh position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.045, 8]} />
            <meshStandardMaterial
              color={isFuseBurning ? '#FFF176' : '#81C784'}
              emissive={isFuseBurning ? '#FF9800' : '#000000'}
              emissiveIntensity={isFuseBurning ? 2.8 : 0}
            />
          </mesh>
        </group>
      )}

      {/* 3. AWAAZ ROCKET (Aerial Burst) */}
      {type === 'rocket' && (
        <group position={[0, 0, 0]}>
          {/* Ground Glass Launch Bottle / Stand */}
          <mesh position={[0, 0.11, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.025, 0.042, 0.22, 16]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.2} transparent opacity={0.85} />
          </mesh>

          {/* Long Bamboo Stabilizer Stick Resting in Bottle */}
          <mesh position={[0, 0.36, 0]} castShadow>
            <cylinderGeometry args={[0.0035, 0.0035, 0.72, 8]} />
            <meshStandardMaterial color="#D7CCC8" roughness={0.6} />
          </mesh>

          {/* Propellant Rocket Body Cylinder */}
          <mesh position={[0, 0.44, 0]} castShadow>
            <cylinderGeometry args={[0.032, 0.032, 0.22, 20]} />
            <meshStandardMaterial map={rocketTex} roughness={0.4} />
          </mesh>

          {/* Aerodynamic Glossy Nose Cone */}
          <mesh position={[0, 0.60, 0]} castShadow>
            <coneGeometry args={[0.035, 0.11, 20]} />
            <meshStandardMaterial color="#00BCD4" metalness={0.6} roughness={0.25} />
          </mesh>

          {/* Lower Rocket Nozzle & Fuse */}
          <mesh position={[0, 0.31, 0]}>
            <cylinderGeometry args={[0.015, 0.025, 0.03, 12]} />
            <meshStandardMaterial color="#424242" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.05, 8]} />
            <meshStandardMaterial
              color={isFuseBurning ? '#FFF176' : '#ECEFF1'}
              emissive={isFuseBurning ? '#FF9800' : '#000000'}
              emissiveIntensity={isFuseBurning ? 3 : 0}
            />
          </mesh>
        </group>
      )}

      {/* 4. 1000-WALA LADI (Garland Chain Crackers) */}
      {type === 'ladi' && (
        <group position={[0, 0.018, 0]}>
          {/* Header Tag Card at Head of Garland */}
          <mesh position={[0.26, 0.03, 0]} rotation={[-0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.14, 0.08, 0.005]} />
            <meshStandardMaterial map={ladiHeaderTex} roughness={0.4} />
          </mesh>

          {/* Main Braided Fuse running along chain */}
          <mesh position={[0, 0.015, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.004, 0.004, 0.54, 8]} />
            <meshStandardMaterial
              color={isFuseBurning ? '#FFF176' : '#2E7D32'}
              emissive={isFuseBurning ? '#FF9800' : '#000000'}
              emissiveIntensity={isFuseBurning ? 2.5 : 0}
            />
          </mesh>

          {/* Connected Individual Red Paper Crackers */}
          {Array.from({ length: 24 }).map((_, i) => {
            const cx = -0.25 + (i / 24) * 0.5;
            const cz = (i % 2 === 0 ? 0.04 : -0.04);
            return (
              <group key={`ladi-unit-${i}`} position={[cx, 0.01, cz]} rotation={[0, 0, Math.PI / 2]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.009, 0.009, 0.065, 8]} />
                  <meshStandardMaterial color="#D32F2F" roughness={0.5} />
                </mesh>
                {/* Gold Paper Band */}
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.0095, 0.0095, 0.018, 8]} />
                  <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* 5. SITA-GEETA (Special Two-Stage Twin) */}
      {type === 'sita_geeta' && (
        <group position={[0, 0.015, 0]}>
          {/* Shared Base Plinth */}
          <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.24, 0.02, 0.12]} />
            <meshStandardMaterial color="#4A148C" roughness={0.6} />
          </mesh>

          {/* Twin Cylinders "Sita" & "Geeta" */}
          {[-0.065, 0.065].map((cx, idx) => (
            <group key={`sg-cyl-${idx}`} position={[cx, 0.14, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.04, 0.042, 0.24, 20]} />
                <meshStandardMaterial map={sitaGeetaTex} roughness={0.45} />
              </mesh>
              {/* Brass Top Ring */}
              <mesh position={[0, 0.125, 0]}>
                <cylinderGeometry args={[0.041, 0.041, 0.014, 16]} />
                <meshStandardMaterial color="#DAA520" metalness={0.85} roughness={0.3} />
              </mesh>
            </group>
          ))}

          {/* Interconnecting Fuse Bridge */}
          <mesh position={[0, 0.27, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.0035, 0.0035, 0.14, 8]} />
            <meshStandardMaterial
              color={isFuseBurning ? '#FFF176' : '#E0E0E0'}
              emissive={isFuseBurning ? '#FF9800' : '#000000'}
              emissiveIntensity={isFuseBurning ? 2.5 : 0}
            />
          </mesh>
          <mesh position={[0, 0.29, 0]}>
            <cylinderGeometry args={[0.0035, 0.0035, 0.035, 8]} />
            <meshStandardMaterial
              color={isFuseBurning ? '#FFF176' : '#ECEFF1'}
              emissive={isFuseBurning ? '#FF9800' : '#000000'}
              emissiveIntensity={isFuseBurning ? 3 : 0}
            />
          </mesh>
        </group>
      )}

      {/* 6. GANGA-JAMUNA (Dual Stream Fountain) */}
      {type === 'ganga_jamuna' && (
        <group position={[0, 0.015, 0]}>
          {/* Shared Base Plate with Gold Trim */}
          <mesh position={[0, 0.012, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.26, 0.024, 0.14]} />
            <meshStandardMaterial color="#B71C1C" roughness={0.6} />
          </mesh>

          {/* Left Pot (Ganga - Gold) */}
          <group position={[-0.07, 0.13, 0]}>
            <mesh castShadow>
              <coneGeometry args={[0.055, 0.22, 20]} />
              <meshStandardMaterial map={gangaJamunaTex} metalness={0.6} roughness={0.3} color="#FFD700" />
            </mesh>
          </group>

          {/* Right Pot (Jamuna - Silver) */}
          <group position={[0.07, 0.13, 0]}>
            <mesh castShadow>
              <coneGeometry args={[0.055, 0.22, 20]} />
              <meshStandardMaterial map={gangaJamunaTex} metalness={0.8} roughness={0.25} color="#ECEFF1" />
            </mesh>
          </group>

          {/* Shared Bridge Fuse */}
          <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.0035, 0.0035, 0.15, 8]} />
            <meshStandardMaterial
              color={isFuseBurning ? '#FFF176' : '#81C784'}
              emissive={isFuseBurning ? '#FF9800' : '#000000'}
              emissiveIntensity={isFuseBurning ? 2.5 : 0}
            />
          </mesh>
        </group>
      )}

      {/* 7. PHULJHARI (Handheld Sparkler Stand) */}
      {type === 'phuljhari' && (
        <group position={[0, 0.18, 0]}>
          {/* Wire Body */}
          <mesh position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.36, 8]} />
            <meshStandardMaterial color="#B0BEC5" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Pyrotechnic Coating */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.20, 8]} />
            <meshStandardMaterial
              color={isFuseBurning ? '#FFE082' : '#616161'}
              roughness={0.85}
              emissive={isFuseBurning ? '#FF9800' : '#000000'}
              emissiveIntensity={isFuseBurning ? 2.5 : 0}
            />
          </mesh>
        </group>
      )}

      {/* FUSE BURNING SIZZLING SPARK EMBER & LIGHT */}
      {isFuseBurning && (
        <group position={FIREWORK_FUSE_OFFSETS[type]}>
          <mesh>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshBasicMaterial color="#FFEB3B" />
          </mesh>
          <pointLight color="#FF9800" intensity={3.5} distance={2.5} decay={2} />
        </group>
      )}
    </group>
  );
};

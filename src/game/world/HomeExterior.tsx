import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

export const HomeExterior: React.FC = () => {
  const { houseDoorOpen, toggleHouseDoor, playerPosition, setActivePrompt } = useGameState();
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);

  // Animate double door opening angle
  useFrame((_, delta) => {
    const leftTarget = houseDoorOpen ? -Math.PI * 0.5 : 0;
    const rightTarget = houseDoorOpen ? Math.PI * 0.5 : 0;

    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        leftDoorRef.current.rotation.y,
        leftTarget,
        delta * 3.8
      );
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        rightDoorRef.current.rotation.y,
        rightTarget,
        delta * 3.8
      );
    }

    // Interaction prompt distance check: Doorway is at [0, 0, 0]
    const distToDoor = Math.hypot(playerPosition[0] - 0, playerPosition[2] - 0.3);
    if (distToDoor < 2.8) {
      setActivePrompt({
        id: 'door-toggle',
        label: houseDoorOpen ? 'Close Haveli Doors 🚪' : 'Open Haveli Doors 🚪',
        subtext: 'Press [E] or Tap to swing open',
        action: () => {
          audioManager.playDoorToggle();
          toggleHouseDoor();
        },
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ==============================================================
          1. ELEVATED SANDSTONE PLINTH & ENTRANCE VERANDAH (OTLA)
          ============================================================== */}
      {/* Lower Grand Plinth Step */}
      <mesh position={[0, 0.12, 1.2]} receiveShadow>
        <boxGeometry args={[14, 0.24, 2.4]} />
        <meshStandardMaterial color="#B87333" roughness={0.7} />
      </mesh>
      {/* Upper Porch Platform */}
      <mesh position={[0, 0.3, 0.6]} receiveShadow>
        <boxGeometry args={[12, 0.2, 1.6]} />
        <meshStandardMaterial color="#C68B59" roughness={0.65} />
      </mesh>
      {/* Central Entrance Steps */}
      <mesh position={[0, 0.1, 2.6]} receiveShadow>
        <boxGeometry args={[4.4, 0.2, 0.8]} />
        <meshStandardMaterial color="#B87333" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.22, 2.0]} receiveShadow>
        <boxGeometry args={[4.0, 0.2, 0.6]} />
        <meshStandardMaterial color="#C68B59" roughness={0.65} />
      </mesh>

      {/* Carved Porch Stone Balustrade (Left & Right) */}
      {[-5.0, 5.0].map((bx, idx) => (
        <group key={`balustrade-${idx}`} position={[bx, 0.4, 1.4]}>
          {/* Railing Base */}
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.6, 0.12, 0.2]} />
            <meshStandardMaterial color="#9C5D33" roughness={0.7} />
          </mesh>
          {/* Miniature Baluster Pillars */}
          {[-1.4, -0.7, 0, 0.7, 1.4].map((px, pidx) => (
            <mesh key={`p-${pidx}`} position={[px, 0.32, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.05, 0.38, 8]} />
              <meshStandardMaterial color="#C68B59" roughness={0.65} />
            </mesh>
          ))}
          {/* Top Handrail */}
          <mesh position={[0, 0.54, 0]} castShadow>
            <boxGeometry args={[3.8, 0.08, 0.25]} />
            <meshStandardMaterial color="#8F4B23" roughness={0.6} />
          </mesh>
          {/* End Post with Kalash Finial */}
          <group position={[bx > 0 ? -1.85 : 1.85, 0.35, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.26, 0.7, 0.26]} />
              <meshStandardMaterial color="#8F4B23" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.45, 0]} castShadow>
              <sphereGeometry args={[0.1, 10, 10]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ==============================================================
          2. TRADITIONAL BRASS URLIS WITH FLOATING PETALS & DIYAS
          ============================================================== */}
      {[-2.5, 2.5].map((ux, uidx) => (
        <group key={`urli-${uidx}`} position={[ux, 0.22, 2.0]}>
          {/* Carved Hexagonal Stone Pedestal */}
          <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.42, 0.48, 0.3, 6]} />
            <meshStandardMaterial color="#8B4513" roughness={0.7} />
          </mesh>
          {/* Large Hand-hammered Brass Urli Basin */}
          <group position={[0, 0.38, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.45, 0.25, 0.16, 24]} />
              <meshStandardMaterial color="#DAA520" metalness={0.88} roughness={0.22} />
            </mesh>
            {/* Water Surface inside Urli */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.42, 24]} />
              <meshStandardMaterial color="#1A3344" roughness={0.1} metalness={0.5} />
            </mesh>
            {/* Floating Rose & Marigold Petals */}
            {[...Array(12)].map((_, pi) => {
              const angle = (pi / 12) * Math.PI * 2;
              const rad = 0.15 + (pi % 3) * 0.08;
              const isMarigold = pi % 2 === 0;
              return (
                <mesh
                  key={`petal-${pi}`}
                  position={[Math.cos(angle) * rad, 0.065, Math.sin(angle) * rad]}
                  rotation={[0, angle, 0]}
                >
                  <circleGeometry args={[0.045, 8]} />
                  <meshStandardMaterial
                    color={isMarigold ? '#FFA500' : '#D90429'}
                    roughness={0.4}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              );
            })}
            {/* Center Floating Brass Clay Diya */}
            <group position={[0, 0.08, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.09, 0.05, 0.04, 16]} />
                <meshStandardMaterial color="#8B4513" roughness={0.8} />
              </mesh>
              {/* Flame */}
              <mesh position={[0, 0.045, 0]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial
                  color="#FF5722"
                  emissive="#FFA500"
                  emissiveIntensity={2.8}
                />
              </mesh>
              <pointLight color="#FFA500" intensity={0.6} distance={2.5} decay={2} />
            </group>
          </group>
        </group>
      ))}

      {/* ==============================================================
          3. MAIN FAÇADE WALLS (WARM JAISALMER SANDSTONE & PLASTER)
          ============================================================== */}
      {/* Ground Floor Central Wall */}
      <mesh position={[-7.5, 3.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[11, 6.4, 0.45]} />
        <meshStandardMaterial color="#E6C280" roughness={0.65} />
      </mesh>
      <mesh position={[7.5, 3.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[11, 6.4, 0.45]} />
        <meshStandardMaterial color="#E6C280" roughness={0.65} />
      </mesh>
      {/* Wall above ground floor doorway */}
      <mesh position={[0, 4.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.4, 2.6, 0.45]} />
        <meshStandardMaterial color="#D9A86C" roughness={0.6} />
      </mesh>

      {/* Upper Floor (Second Story) Haveli Wall */}
      <mesh position={[0, 8.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[26, 4.2, 0.45]} />
        <meshStandardMaterial color="#E8CF9A" roughness={0.7} />
      </mesh>

      {/* Decorative Stone Cornice Band dividing 1st & 2nd floors */}
      <mesh position={[0, 6.4, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[26.4, 0.28, 0.55]} />
        <meshStandardMaterial color="#9C5D33" roughness={0.6} />
      </mesh>

      {/* ==============================================================
          4. GRAND CUSPED MULTI-FOIL TORANA ENTRANCE ARCHWAY
          ============================================================== */}
      <group position={[0, 0, 0]}>
        {/* Left Fluted Pillar (Stambha) with Carved Base & Capital */}
        <group position={[-1.75, 0, 0.15]}>
          {/* Base Pedestal */}
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.8, 0.55]} />
            <meshStandardMaterial color="#8F4B23" roughness={0.65} />
          </mesh>
          {/* Fluted Shaft */}
          <mesh position={[0, 1.9, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, 2.3, 16]} />
            <meshStandardMaterial color="#C68B59" roughness={0.55} />
          </mesh>
          {/* Ghata-Pallava (Pot-and-Foliage) Capital */}
          <mesh position={[0, 3.15, 0]} castShadow>
            <sphereGeometry args={[0.26, 12, 10]} />
            <meshStandardMaterial color="#DAA520" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Bracket Corbel (Toda) projecting forward */}
          <mesh position={[0.1, 3.42, 0.12]} castShadow>
            <boxGeometry args={[0.48, 0.32, 0.48]} />
            <meshStandardMaterial color="#8F4B23" roughness={0.6} />
          </mesh>
        </group>

        {/* Right Fluted Pillar */}
        <group position={[1.75, 0, 0.15]}>
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.8, 0.55]} />
            <meshStandardMaterial color="#8F4B23" roughness={0.65} />
          </mesh>
          <mesh position={[0, 1.9, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, 2.3, 16]} />
            <meshStandardMaterial color="#C68B59" roughness={0.55} />
          </mesh>
          <mesh position={[0, 3.15, 0]} castShadow>
            <sphereGeometry args={[0.26, 12, 10]} />
            <meshStandardMaterial color="#DAA520" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[-0.1, 3.42, 0.12]} castShadow>
            <boxGeometry args={[0.48, 0.32, 0.48]} />
            <meshStandardMaterial color="#8F4B23" roughness={0.6} />
          </mesh>
        </group>

        {/* Deeply Carved Torana Lintel */}
        <mesh position={[0, 3.55, 0.2]} castShadow>
          <boxGeometry args={[4.2, 0.38, 0.55]} />
          <meshStandardMaterial color="#7A3918" roughness={0.6} />
        </mesh>

        {/* Auspicious Brass Ganesha / Kalash Medallion over Arch */}
        <group position={[0, 3.55, 0.49]}>
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.04, 24]} />
            <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Auspicious Center Jewel */}
          <mesh position={[0, 0, 0.03]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial
              color="#D90429"
              emissive="#FF2200"
              emissiveIntensity={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* Multi-tier Marigold & Mango Leaf Bandhanwar (Toran) */}
        <group position={[0, 3.25, 0.38]}>
          {/* Main Swag of Golden Marigolds */}
          {[...Array(19)].map((_, i) => {
            const x = (i - 9) * 0.18;
            const curve = Math.sin((i / 18) * Math.PI) * -0.25;
            const isGold = i % 2 === 0;
            return (
              <group key={`m-${i}`} position={[x, curve, 0]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.07, 8, 8]} />
                  <meshStandardMaterial
                    color={isGold ? '#FF9E00' : '#E85D04'}
                    emissive={isGold ? '#FFA200' : '#DC2F02'}
                    emissiveIntensity={0.5}
                    roughness={0.4}
                  />
                </mesh>
                {/* Mango leaf hanging between marigolds */}
                {i % 2 === 1 && (
                  <mesh position={[0, -0.09, 0]} rotation={[0, 0, 0.1]}>
                    <coneGeometry args={[0.035, 0.14, 5]} />
                    <meshStandardMaterial color="#2D6A4F" roughness={0.5} />
                  </mesh>
                )}
              </group>
            );
          })}
        </group>
      </group>

      {/* ==============================================================
          5. DOUBLE-LEAF SHEESHAM ENTRANCE DOORS WITH BRASS ELEPHANT SPIKES
          ============================================================== */}
      {/* Left Door Leaf (Pivots from x = -1.45) */}
      <group position={[-1.45, 0, 0.04]} ref={leftDoorRef}>
        <group position={[0.72, 1.6, 0]}>
          {/* Heavy Sheesham Wood Panel */}
          <mesh castShadow>
            <boxGeometry args={[1.44, 3.1, 0.1]} />
            <meshStandardMaterial color="#361705" roughness={0.45} />
          </mesh>
          {/* Recessed Carved Inner Molding */}
          <mesh position={[0, 0, 0.052]}>
            <boxGeometry args={[1.2, 2.8, 0.02]} />
            <meshStandardMaterial color="#4A2306" roughness={0.4} />
          </mesh>
          {/* Brass Conical Spikes (Gaj-Kante) */}
          {[-0.35, 0.35].map((sx, sxi) =>
            [-0.9, -0.3, 0.3, 0.9].map((sy, syi) => (
              <mesh key={`spike-l-${sxi}-${syi}`} position={[sx, sy, 0.065]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.032, 0.06, 12]} />
                <meshStandardMaterial color="#FFD700" metalness={0.88} roughness={0.25} />
              </mesh>
            ))
          )}
          {/* Forged Brass Ring Knocker */}
          <group position={[0.5, 0, 0.07]}>
            <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.06, 0.01]} castShadow>
              <torusGeometry args={[0.06, 0.018, 8, 20]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Right Door Leaf (Pivots from x = 1.45) */}
      <group position={[1.45, 0, 0.04]} ref={rightDoorRef}>
        <group position={[-0.72, 1.6, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.44, 3.1, 0.1]} />
            <meshStandardMaterial color="#361705" roughness={0.45} />
          </mesh>
          <mesh position={[0, 0, 0.052]}>
            <boxGeometry args={[1.2, 2.8, 0.02]} />
            <meshStandardMaterial color="#4A2306" roughness={0.4} />
          </mesh>
          {/* Brass Conical Spikes */}
          {[-0.35, 0.35].map((sx, sxi) =>
            [-0.9, -0.3, 0.3, 0.9].map((sy, syi) => (
              <mesh key={`spike-r-${sxi}-${syi}`} position={[sx, sy, 0.065]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.032, 0.06, 12]} />
                <meshStandardMaterial color="#FFD700" metalness={0.88} roughness={0.25} />
              </mesh>
            ))
          )}
          {/* Forged Brass Ring Knocker */}
          <group position={[-0.5, 0, 0.07]}>
            <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.06, 0.01]} castShadow>
              <torusGeometry args={[0.06, 0.018, 8, 20]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ==============================================================
          6. CANTILEVERED UPPER JHAROKHA BALCONY (ABOVE ENTRANCE)
          ============================================================== */}
      <group position={[0, 6.2, 0.3]}>
        {/* Carved Stone Cantilever Brackets (Todas) underneath */}
        {[-1.2, -0.4, 0.4, 1.2].map((bx, bidx) => (
          <group key={`jbracket-${bidx}`} position={[bx, -0.45, 0.2]}>
            <mesh castShadow>
              <boxGeometry args={[0.18, 0.65, 0.7]} />
              <meshStandardMaterial color="#8F4B23" roughness={0.65} />
            </mesh>
            <mesh position={[0, -0.22, 0.15]} rotation={[-0.5, 0, 0]} castShadow>
              <boxGeometry args={[0.16, 0.4, 0.35]} />
              <meshStandardMaterial color="#7A3918" roughness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Projecting Balcony Floor Slab */}
        <mesh position={[0, 0, 0.45]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.22, 1.2]} />
          <meshStandardMaterial color="#B87333" roughness={0.65} />
        </mesh>

        {/* Jharokha Pierced Stone Jaali Balustrade */}
        {/* Front Jaali Screen */}
        <group position={[0, 0.65, 1.0]}>
          <mesh castShadow>
            <boxGeometry args={[3.0, 1.1, 0.08]} />
            <meshStandardMaterial color="#C68B59" roughness={0.6} />
          </mesh>
          {/* Pierced lattice diamond patterns (decorative recesses with warm glow) */}
          {[-1.1, -0.55, 0, 0.55, 1.1].map((jx, ji) => (
            <mesh key={`jhole-f-${ji}`} position={[jx, 0, 0.03]} rotation={[0, 0, Math.PI / 4]}>
              <planeGeometry args={[0.22, 0.22]} />
              <meshStandardMaterial
                color="#FFB703"
                emissive="#FF8C00"
                emissiveIntensity={1.2}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>

        {/* Left & Right Side Jaali Screens */}
        {[-1.55, 1.55].map((sx, sidx) => (
          <group key={`jrail-s-${sidx}`} position={[sx, 0.65, 0.5]}>
            <mesh castShadow>
              <boxGeometry args={[0.08, 1.1, 1.0]} />
              <meshStandardMaterial color="#C68B59" roughness={0.6} />
            </mesh>
            {[-0.25, 0.25].map((jz, jzi) => (
              <mesh
                key={`jhole-s-${sidx}-${jzi}`}
                position={[sidx === 0 ? -0.03 : 0.03, 0, jz]}
                rotation={[0, Math.PI / 2, Math.PI / 4]}
              >
                <planeGeometry args={[0.22, 0.22]} />
                <meshStandardMaterial
                  color="#FFB703"
                  emissive="#FF8C00"
                  emissiveIntensity={1.2}
                  roughness={0.3}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* 4 Miniature Corner Rajput Pillars */}
        {[
          [-1.5, 0.5],
          [1.5, 0.5],
          [-1.5, 1.0],
          [1.5, 1.0],
        ].map(([cx, cz], cidx) => (
          <mesh key={`jpillar-${cidx}`} position={[cx, 1.4, cz]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 1.6, 12]} />
            <meshStandardMaterial color="#8F4B23" roughness={0.6} />
          </mesh>
        ))}

        {/* Rajput Bangaldar / Chhatri Vaulted Canopy Roof */}
        <group position={[0, 2.3, 0.55]}>
          {/* Sloping Stone Chhajja Eaves */}
          <mesh castShadow rotation={[0, Math.PI / 4, 0]}>
            <cylinderGeometry args={[1.8, 2.1, 0.35, 4]} />
            <meshStandardMaterial color="#7A3918" roughness={0.6} />
          </mesh>
          {/* Crowned Dome */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <sphereGeometry args={[1.2, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#D9A86C" roughness={0.55} />
          </mesh>
          {/* Brass Kalash Finial with Spire */}
          <group position={[0, 1.7, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.16, 12, 12]} />
              <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.25, 0]} castShadow>
              <coneGeometry args={[0.07, 0.35, 12]} />
              <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* Authentic Hanging Octagonal Akash Kandils swinging beneath Jharokha */}
        {[-1.1, 1.1].map((kx, kidx) => (
          <group key={`kandil-jh-${kidx}`} position={[kx, -0.2, 0.7]}>
            {/* Cord */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.3, 6]} />
              <meshBasicMaterial color="#FFD700" />
            </mesh>
            {/* Prismatic Kandil Lantern Body */}
            <mesh castShadow>
              <octahedronGeometry args={[0.24, 0]} />
              <meshStandardMaterial
                color={kidx === 0 ? '#E63946' : '#FFB703'}
                emissive={kidx === 0 ? '#D90429' : '#FB8500'}
                emissiveIntensity={2.2}
                roughness={0.3}
              />
            </mesh>
            {/* Hanging Golden Foil Tassels */}
            <mesh position={[0, -0.24, 0]}>
              <cylinderGeometry args={[0.05, 0.12, 0.28, 8]} />
              <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.3} />
            </mesh>
            <pointLight
              color={kidx === 0 ? '#FF6B6B' : '#FFAA00'}
              intensity={0.8}
              distance={3.5}
              decay={2}
            />
          </group>
        ))}
      </group>

      {/* ==============================================================
          7. TRADITIONAL RAJPUT ARROW-ARCH JAALI WINDOWS (WINGS)
          ============================================================== */}
      {/* Left Wing Ground Floor Window */}
      <group position={[-6.5, 2.5, 0.1]}>
        {/* Carved Stone Window Frame */}
        <mesh castShadow>
          <boxGeometry args={[2.2, 2.4, 0.3]} />
          <meshStandardMaterial color="#8F4B23" roughness={0.6} />
        </mesh>
        {/* Sloping Stone Sunshade (Chhajja) */}
        <mesh position={[0, 1.35, 0.2]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[2.5, 0.12, 0.55]} />
          <meshStandardMaterial color="#7A3918" roughness={0.65} />
        </mesh>
        {/* Intricate Jaali Lattice Window Glass with Golden Inner Glow */}
        <mesh position={[0, 0, 0.14]}>
          <planeGeometry args={[1.8, 1.9]} />
          <meshStandardMaterial
            color="#FFB703"
            emissive="#FF8C00"
            emissiveIntensity={2.2}
            roughness={0.25}
          />
        </mesh>
        {/* Window Sill with Diyas */}
        <mesh position={[0, -1.2, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.14, 0.35]} />
          <meshStandardMaterial color="#8F4B23" roughness={0.6} />
        </mesh>
        {[-0.6, 0, 0.6].map((dx, di) => (
          <group key={`win-diya-l-${di}`} position={[dx, -1.05, 0.22]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.07, 0.045, 0.05, 10]} />
              <meshStandardMaterial color="#8B4513" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.045, 0]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial
                color="#FF5722"
                emissive="#FFA500"
                emissiveIntensity={3.2}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Right Wing Ground Floor Window */}
      <group position={[6.5, 2.5, 0.1]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 2.4, 0.3]} />
          <meshStandardMaterial color="#8F4B23" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.35, 0.2]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[2.5, 0.12, 0.55]} />
          <meshStandardMaterial color="#7A3918" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0, 0.14]}>
          <planeGeometry args={[1.8, 1.9]} />
          <meshStandardMaterial
            color="#FFB703"
            emissive="#FF8C00"
            emissiveIntensity={2.2}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[0, -1.2, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.14, 0.35]} />
          <meshStandardMaterial color="#8F4B23" roughness={0.6} />
        </mesh>
        {[-0.6, 0, 0.6].map((dx, di) => (
          <group key={`win-diya-r-${di}`} position={[dx, -1.05, 0.22]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.07, 0.045, 0.05, 10]} />
              <meshStandardMaterial color="#8B4513" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.045, 0]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial
                color="#FF5722"
                emissive="#FFA500"
                emissiveIntensity={3.2}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Upper Floor Arched Rajput Windows (Left & Right) */}
      {[-7.0, 7.0].map((ux, uidx) => (
        <group key={`upwin-${uidx}`} position={[ux, 8.2, 0.15]}>
          <mesh castShadow>
            <boxGeometry args={[2.0, 2.2, 0.25]} />
            <meshStandardMaterial color="#7A3918" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.12]}>
            <planeGeometry args={[1.6, 1.8]} />
            <meshStandardMaterial
              color="#FFB703"
              emissive="#FF8C00"
              emissiveIntensity={2.0}
              roughness={0.3}
            />
          </mesh>
          {/* Rajput Arch Crest */}
          <mesh position={[0, 1.15, 0.15]} castShadow rotation={[0, 0, Math.PI]}>
            <cylinderGeometry args={[1.0, 1.0, 0.2, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#8F4B23" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* ==============================================================
          8. ROOF PARAPET WITH SCALLOPED BATTLEMENTS (KANGURA) & KALASH POTS
          ============================================================== */}
      {/* Heavy Main Roof Overhang Eaves (Khaprail / Chhajja) */}
      <mesh position={[0, 10.6, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[27.2, 0.35, 1.6]} />
        <meshStandardMaterial color="#6E2C00" roughness={0.65} />
      </mesh>
      {/* Traditional Crenellated Rajput Parapet (Kangura) */}
      <group position={[0, 11.0, 0.2]}>
        {[...Array(27)].map((_, ki) => (
          <group key={`kangura-${ki}`} position={[(ki - 13) * 1.0, 0, 0]}>
            {/* Scalloped Wall Segment */}
            <mesh castShadow>
              <boxGeometry args={[0.75, 0.65, 0.25]} />
              <meshStandardMaterial color="#D9A86C" roughness={0.65} />
            </mesh>
            {/* Decorative Kangura Pointed Arch Crest */}
            <mesh position={[0, 0.4, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[0.36, 0.35, 4]} />
              <meshStandardMaterial color="#B87333" roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Terracotta Kalash Pots lining the roofline */}
      {[-12.5, -6.5, 0, 6.5, 12.5].map((kx, ki) => (
        <group key={`roofkalash-${ki}`} position={[kx, 11.6, 0.2]}>
          <mesh castShadow>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshStandardMaterial color="#B87333" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.16, 0.2, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Dense Draped Scalloped Fairy Lights (Jhalar) along Roofline */}
      <group position={[0, 10.4, 1.15]}>
        {[...Array(48)].map((_, fi) => {
          const fx = (fi - 23.5) * 0.55;
          const fy = Math.sin((fi / 3) * Math.PI) * -0.15;
          const colors = ['#FFD700', '#FF3E00', '#00E5FF', '#39FF14', '#FF007F'];
          const col = colors[fi % colors.length];
          return (
            <mesh key={`rfairy-${fi}`} position={[fx, fy, 0]}>
              <sphereGeometry args={[0.045, 6, 6]} />
              <meshStandardMaterial
                color={col}
                emissive={col}
                emissiveIntensity={2.4}
              />
            </mesh>
          );
        })}
      </group>

      {/* ==============================================================
          9. ENTRANCE DIYA ILLUMINATIONS & WARM PORCH LIGHT
          ============================================================== */}
      {/* Row of Lit Terracotta Diyas along Verandah Edge */}
      {[-4.2, -3.2, -2.2, -1.2, 1.2, 2.2, 3.2, 4.2].map((dx, di) => (
        <group key={`porch-diya-${di}`} position={[dx, 0.42, 1.3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.05, 0.05, 12]} />
            <meshStandardMaterial color="#8B4513" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.055, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color="#FF5722"
              emissive="#FFA500"
              emissiveIntensity={3.5}
            />
          </mesh>
        </group>
      ))}

      {/* Warm Golden Glow Point Lights Illuminating the Haveli Façade */}
      <pointLight position={[0, 3.4, 1.4]} color="#FFA500" intensity={2.8} distance={9} decay={2} />
      <pointLight position={[-6.5, 2.5, 1.0]} color="#FF9000" intensity={1.8} distance={7} decay={2} />
      <pointLight position={[6.5, 2.5, 1.0]} color="#FF9000" intensity={1.8} distance={7} decay={2} />
      <pointLight position={[0, 7.2, 1.8]} color="#FFB020" intensity={2.2} distance={8} decay={2} />
    </group>
  );
};

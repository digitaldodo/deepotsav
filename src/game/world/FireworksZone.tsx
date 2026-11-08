import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState, FireworkType, PlacedFirework } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';
import { registerInteractive, unregisterInteractive } from '../controls/FirstPersonController';
import { BenchModel, LanternModel, PlanterPotModel } from './ModelLoader';
import { getSandstoneTexture } from '../utils/textureGenerator';

export const FIREWORK_ITEMS: Array<{
  type: FireworkType;
  title: string;
  tag: string;
  shelfPos: [number, number, number];
  color: string;
}> = [
  { type: 'phuljhari', title: 'Phuljhadi (Sparklers) ✨', tag: 'Handheld', shelfPos: [-2.6, 0.95, 18.8], color: '#FFD700' },
  { type: 'chakri', title: 'Zameen Chakri 🌀', tag: 'Ground Spinner', shelfPos: [-1.8, 0.95, 18.8], color: '#FF6D00' },
  { type: 'anar', title: 'Anar Flower Pot 🌋', tag: 'Vertical Fountain', shelfPos: [-1.0, 0.95, 18.8], color: '#FFD54F' },
  { type: 'rocket', title: 'Awaaz Rocket 🚀', tag: 'Aerial Burst', shelfPos: [-0.2, 0.95, 18.8], color: '#00BCD4' },
  { type: 'ladi', title: '1000-Wala Ladi 🧨', tag: 'Chain Crackers', shelfPos: [0.6, 0.95, 18.8], color: '#D32F2F' },
  { type: 'sita_geeta', title: 'Sita-Geeta Twin 👯', tag: 'Dual Flare', shelfPos: [1.4, 0.95, 18.8], color: '#9C27B0' },
  { type: 'ganga_jamuna', title: 'Ganga-Jamuna Stream 🌊', tag: 'Dual Stream', shelfPos: [2.2, 0.95, 18.8], color: '#FF4081' },
];

export const FireworksZone: React.FC = () => {
  const {
    pickupFirework,
    pickupSparkler,
    igniteSparkler,
    dropSparkler,
    sparklerHolding,
    sparklerIgnited,
    placeFireworkOnGround,
    igniteFirework,
    placedFireworks,
    updatePlacedFireworks,
    triggerGrandFinale,
    grandFinaleActive,
    heldFireworkType,
    handItem,
  } = useGameState();

  const sandstoneTex = useMemo(() => getSandstoneTexture('#C68B59'), []);

  // Active particle systems
  const chakriSparksRef = useRef<THREE.Points>(null);
  const anarSparksRef = useRef<THREE.Points>(null);
  const ladiSparksRef = useRef<THREE.Points>(null);

  // Chakri particles
  const chakriCount = 75;
  const { chakriPositions, chakriVelocities } = useMemo(() => {
    const pos = new Float32Array(chakriCount * 3);
    const vel = new Float32Array(chakriCount * 3);
    for (let i = 0; i < chakriCount; i++) {
      const angle = (i / chakriCount) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * 0.1;
      pos[i * 3 + 1] = 0.05;
      pos[i * 3 + 2] = Math.sin(angle) * 0.1;
      vel[i * 3] = Math.cos(angle) * (1.5 + Math.random() * 1.5);
      vel[i * 3 + 1] = 0.08 + Math.random() * 0.15;
      vel[i * 3 + 2] = Math.sin(angle) * (1.5 + Math.random() * 1.5);
    }
    return { chakriPositions: pos, chakriVelocities: vel };
  }, []);

  // Anar fountain particles
  const anarCount = 110;
  const { anarPositions, anarVelocities } = useMemo(() => {
    const pos = new Float32Array(anarCount * 3);
    const vel = new Float32Array(anarCount * 3);
    for (let i = 0; i < anarCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.08;
      pos[i * 3 + 1] = 0.15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
      vel[i * 3] = (Math.random() - 0.5) * 0.7;
      vel[i * 3 + 1] = 3.2 + Math.random() * 2.8;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
    }
    return { anarPositions: pos, anarVelocities: vel };
  }, []);

  // Register Fireworks Stall, Launch Pad, and Garden Bench interactions
  useEffect(() => {
    // 1. Phuljhadi Sparkler
    registerInteractive({
      id: 'fw-sparkler',
      label: sparklerHolding
        ? sparklerIgnited
          ? 'Put Down Sparkler 🪄'
          : 'Ignite Held Sparkler! 💥'
        : 'Pick up Phuljhadi (Sparkler) ✨',
      subtext: sparklerHolding
        ? sparklerIgnited
          ? 'Press [E] or Tap to finish drawing in air'
          : 'Press [E] or Tap to light sparkler flame'
        : 'Press [E] or Tap to hold sparkler in hand',
      position: new THREE.Vector3(-2.6, 0.95, 18.8),
      maxDistance: 2.6,
      action: () => {
        if (!sparklerHolding) {
          audioManager.playDiyaLight();
          pickupSparkler();
        } else if (!sparklerIgnited) {
          audioManager.startSparklerLoop();
          igniteSparkler();
        } else {
          audioManager.stopSparklerLoop();
          dropSparkler();
        }
      },
    });

    // 2. Fireworks on Stall
    FIREWORK_ITEMS.slice(1).forEach(item => {
      registerInteractive({
        id: `fw-item-${item.type}`,
        label: `Take ${item.title}`,
        subtext: `Press [E] or Tap to carry ${item.tag}`,
        position: new THREE.Vector3(...item.shelfPos),
        maxDistance: 2.5,
        action: () => {
          pickupFirework(item.type);
          audioManager.playPowderPickup();
        },
      });
    });

    // 3. Central Launch Pad at [0, 0.05, 15.8]
    registerInteractive({
      id: 'fw-launch-pad',
      label: handItem === 'firework' && heldFireworkType
        ? `Place ${heldFireworkType.toUpperCase()} on Launch Pad 🎯`
        : placedFireworks.some(f => f.state === 'placed')
        ? 'Ignite Placed Firework! 💥'
        : 'Diwali Fireworks Launch Pad 🌟',
      subtext: handItem === 'firework'
        ? 'Press [E] or Tap to set on safety circle'
        : placedFireworks.some(f => f.state === 'placed')
        ? 'Press [E] or Tap to light fuse'
        : 'Pick up a firework from stall to launch here',
      position: new THREE.Vector3(0, 0.08, 15.8),
      maxDistance: 3.2,
      action: () => {
        if (handItem === 'firework' && heldFireworkType) {
          placeFireworkOnGround([0, 0.05, 15.8]);
          audioManager.playPowderPickup();
        } else {
          const placed = placedFireworks.find(f => f.state === 'placed');
          if (placed) {
            igniteFirework(placed.id);
            if (placed.type === 'chakri') audioManager.playChakriSound();
            else if (placed.type === 'anar') audioManager.playAnarSound();
            else if (placed.type === 'rocket') audioManager.playRocketSound();
            else if (placed.type === 'ladi') audioManager.playLadiSound();
            else audioManager.playDiyaLight();
          }
        }
      },
    });

    // 4. Grand Finale Button
    registerInteractive({
      id: 'fw-grand-finale',
      label: grandFinaleActive ? 'Grand Finale Lighting the Sky! 🎆' : 'Launch Grand Fireworks Finale 🎆',
      subtext: 'Press [E] or Tap to trigger multi-rocket synchronized display',
      position: new THREE.Vector3(2.8, 0.95, 18.8),
      maxDistance: 2.6,
      action: () => {
        audioManager.playGrandFinale();
        triggerGrandFinale();
      },
    });

    // 5. Garden Bench
    registerInteractive({
      id: 'garden-bench',
      label: 'Garden Resting Bench 🪑',
      subtext: 'Press [E] or Tap to relax and enjoy the night sky',
      position: new THREE.Vector3(-4.0, 0.6, 15.5),
      maxDistance: 2.6,
      action: () => {
        audioManager.playManjiraChime();
      },
    });

    return () => {
      unregisterInteractive('fw-sparkler');
      FIREWORK_ITEMS.slice(1).forEach(item => unregisterInteractive(`fw-item-${item.type}`));
      unregisterInteractive('fw-launch-pad');
      unregisterInteractive('fw-grand-finale');
      unregisterInteractive('garden-bench');
    };
  }, [
    handItem,
    heldFireworkType,
    sparklerHolding,
    sparklerIgnited,
    placedFireworks,
    grandFinaleActive,
    pickupSparkler,
    igniteSparkler,
    dropSparkler,
    pickupFirework,
    placeFireworkOnGround,
    igniteFirework,
    triggerGrandFinale,
  ]);

  // Frame update for active fireworks simulations
  useFrame((state, delta) => {
    updatePlacedFireworks(delta);

    // Animate Chakri spinning sparks
    if (chakriSparksRef.current) {
      chakriSparksRef.current.rotation.y = state.clock.getElapsedTime() * 24;
    }

    // Animate Anar fountain sparks
    if (anarSparksRef.current) {
      const positions = anarSparksRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < anarCount; i++) {
        positions[i * 3 + 1] += anarVelocities[i * 3 + 1] * delta;
        positions[i * 3] += anarVelocities[i * 3] * delta;
        positions[i * 3 + 2] += anarVelocities[i * 3 + 2] * delta;

        // Reset particles that peaked
        if (positions[i * 3 + 1] > 3.8) {
          positions[i * 3] = (Math.random() - 0.5) * 0.08;
          positions[i * 3 + 1] = 0.15;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
        }
      }
      anarSparksRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const activeChakri = placedFireworks.find(f => f.type === 'chakri' && (f.state === 'ignited' || f.state === 'active'));
  const activeAnar = placedFireworks.find(f => f.type === 'anar' && (f.state === 'ignited' || f.state === 'active'));

  return (
    <group position={[0, 0, 0]}>
      {/* ==============================================================
          1. GARDEN PAVING & FLOWERBEDS (Z: 12.0 to 20.0, X: -6.0 to 6.0)
          ============================================================== */}
      {/* Garden Green Ground */}
      <mesh position={[0, 0, 16.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12.0, 8.0]} />
        <meshStandardMaterial color="#2E4A28" roughness={0.85} />
      </mesh>

      {/* Flagstone Pathway from Gateway to Fireworks Stall */}
      <mesh position={[0, 0.01, 16.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.8, 8.0]} />
        <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
      </mesh>

      {/* Far Garden Wall with Balustrade at Z: 20.0 */}
      <group position={[0, 0, 20.0]}>
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[12.0, 2.4, 0.4]} />
          <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
        </mesh>
        {/* Overhead Hanging Lanterns */}
        {[-3.0, 3.0].map((lx, li) => (
          <LanternModel key={`glantern-${li}`} position={[lx, 2.6, -0.2]} scale={0.4} />
        ))}
      </group>

      {/* Garden Side Boundary Walls */}
      <mesh position={[-6.0, 1.2, 16.0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 2.4, 8.0]} />
        <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
      </mesh>
      <mesh position={[6.0, 1.2, 16.0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 2.4, 8.0]} />
        <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
      </mesh>

      {/* ==============================================================
          2. GARDEN RESTING BENCH & FLOWER POTS
          ============================================================== */}
      <BenchModel position={[-4.0, 0, 15.5]} rotation={[0, Math.PI / 2, 0]} scale={0.85} />
      <PlanterPotModel position={[-4.0, 0, 13.5]} scale={0.65} />
      <PlanterPotModel position={[-4.0, 0, 17.5]} scale={0.65} />

      {/* ==============================================================
          3. CIRCULAR SAFETY FIREWORKS LAUNCH PAD AT [0, 0, 15.8]
          ============================================================== */}
      <group position={[0, 0, 15.8]}>
        {/* Stone Circular Pad */}
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.8, 32]} />
          <meshStandardMaterial color="#8F5435" roughness={0.7} />
        </mesh>
        {/* Gold Border Ring */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.72, 1.8, 32]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* Placed Fireworks Models on Launch Pad */}
        {placedFireworks.map(fw => (
          <group key={fw.id} position={[0, 0.03, 0]}>
            {fw.type === 'chakri' && (
              <mesh castShadow rotation={[-Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.14, 0.14, 0.03, 16]} />
                <meshStandardMaterial color="#FF6D00" roughness={0.4} />
              </mesh>
            )}
            {fw.type === 'anar' && (
              <mesh castShadow>
                <coneGeometry args={[0.12, 0.32, 12]} />
                <meshStandardMaterial color="#FFD54F" roughness={0.5} />
              </mesh>
            )}
            {fw.type === 'rocket' && (
              <group>
                <mesh position={[0, 0.3, 0]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.6, 6]} />
                  <meshStandardMaterial color="#8D6E63" />
                </mesh>
                <mesh position={[0, 0.5, 0]} castShadow>
                  <coneGeometry args={[0.04, 0.16, 8]} />
                  <meshStandardMaterial color="#00BCD4" />
                </mesh>
              </group>
            )}
            {fw.type === 'ladi' && (
              <mesh castShadow>
                <boxGeometry args={[0.45, 0.04, 0.12]} />
                <meshStandardMaterial color="#D32F2F" />
              </mesh>
            )}
          </group>
        ))}

        {/* Active Chakri Particles */}
        {activeChakri && (
          <group position={[0, 0.04, 0]}>
            <points ref={chakriSparksRef}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[chakriPositions, 3]}
                />
              </bufferGeometry>
              <pointsMaterial size={0.045} color="#FF9900" transparent opacity={0.95} />
            </points>
            <pointLight color="#FF9900" intensity={3.5} distance={4.5} decay={2} />
          </group>
        )}

        {/* Active Anar Fountain Particles */}
        {activeAnar && (
          <group position={[0, 0.05, 0]}>
            <points ref={anarSparksRef}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[anarPositions, 3]}
                />
              </bufferGeometry>
              <pointsMaterial size={0.065} color="#FFD700" transparent opacity={0.95} />
            </points>
            <pointLight position={[0, 1.8, 0]} color="#FFA500" intensity={4.5} distance={8.0} decay={2} />
          </group>
        )}
      </group>

      {/* ==============================================================
          4. AUTHENTIC INDIAN FIREWORKS STALL COUNTER (Z: 18.8)
          ============================================================== */}
      <group position={[0, 0, 18.8]}>
        {/* Stall Counter Table */}
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.2, 0.96, 0.8]} />
          <meshStandardMaterial color="#5C2E1A" roughness={0.5} />
        </mesh>
        {/* Countertop Trim */}
        <mesh position={[0, 0.98, 0]} receiveShadow>
          <boxGeometry args={[6.4, 0.05, 0.9]} />
          <meshStandardMaterial color="#8F4B23" roughness={0.4} />
        </mesh>

        {/* Festive Red Cloth Runner */}
        <mesh position={[0, 1.01, 0]}>
          <boxGeometry args={[6.0, 0.01, 0.7]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.65} />
        </mesh>

        {/* Display Fireworks Boxes on Countertop */}
        {FIREWORK_ITEMS.map((item, i) => (
          <group key={`stall-fw-${i}`} position={[item.shelfPos[0], 1.06, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.34, 0.12, 0.22]} />
              <meshStandardMaterial color={item.color} roughness={0.4} />
            </mesh>
            {/* Box Label Tag */}
            <mesh position={[0, 0.065, 0]}>
              <planeGeometry args={[0.28, 0.16]} />
              <meshBasicMaterial color="#FFF" />
            </mesh>
          </group>
        ))}

        {/* Stall Overhead Roof Canopy (Festive Striped Saffron-Red) */}
        <mesh position={[0, 2.6, 0]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[6.6, 0.1, 1.4]} />
          <meshStandardMaterial color="#FF6D00" roughness={0.6} />
        </mesh>
        {/* Support Posts */}
        {[-3.0, 3.0].map((px, pi) => (
          <mesh key={`spost-${pi}`} position={[px, 1.8, 0.45]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 1.6, 8]} />
            <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}

        {/* Stall Warm Illumination Lantern */}
        <pointLight position={[0, 2.4, 0]} color="#FFA500" intensity={2.6} distance={6.0} decay={2} />
      </group>
    </group>
  );
};

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState, FireworkType, PlacedFirework } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';
import { registerInteractive, unregisterInteractive } from '../controls/FirstPersonController';
import { activeSparkSource } from '../controls/FirstPersonHands';
import { BenchModel, LanternModel, PlanterPotModel } from './ModelLoader';
import { getSandstoneTexture } from '../utils/textureGenerator';
import {
  FirecrackerModel,
  FIREWORK_FUSE_OFFSETS,
} from './FirecrackerModels';
import {
  getChakriLabelTexture,
  getAnarWrapperTexture,
  getRocketLabelTexture,
  getLadiHeaderTexture,
  getSitaGeetaTexture,
  getGangaJamunaTexture,
  getSparklerBoxTexture,
  getStallBannerTexture,
} from '../utils/fireworkTextures';

export interface StallFireworkItem {
  type: FireworkType;
  title: string;
  tag: string;
  price: string;
  shelfPos: [number, number, number];
  boxColor: string;
}

export const STALL_FIREWORKS: StallFireworkItem[] = [
  {
    type: 'phuljhari',
    title: 'Phuljhadi Sparklers',
    tag: 'Handheld',
    price: '₹40',
    shelfPos: [-2.5, 1.05, 18.7],
    boxColor: '#C62828',
  },
  {
    type: 'chakri',
    title: 'Zameen Chakri',
    tag: 'Ground Spinner',
    price: '₹60',
    shelfPos: [-1.7, 1.05, 18.7],
    boxColor: '#E65100',
  },
  {
    type: 'anar',
    title: 'Anar Flower Pot',
    tag: 'Vertical Fountain',
    price: '₹80',
    shelfPos: [-0.9, 1.05, 18.7],
    boxColor: '#AD1457',
  },
  {
    type: 'rocket',
    title: 'Awaaz Rocket',
    tag: 'Aerial Burst',
    price: '₹100',
    shelfPos: [-0.1, 1.05, 18.7],
    boxColor: '#00838F',
  },
  {
    type: 'ladi',
    title: '1000-Wala Ladi',
    tag: 'Chain Crackers',
    price: '₹150',
    shelfPos: [0.7, 1.05, 18.7],
    boxColor: '#B71C1C',
  },
  {
    type: 'sita_geeta',
    title: 'Sita-Geeta Twin',
    tag: 'Two-Stage Flare',
    price: '₹120',
    shelfPos: [1.5, 1.05, 18.7],
    boxColor: '#4A148C',
  },
  {
    type: 'ganga_jamuna',
    title: 'Ganga-Jamuna Stream',
    tag: 'Dual Stream',
    price: '₹140',
    shelfPos: [2.3, 1.05, 18.7],
    boxColor: '#C2185B',
  },
];

export const FireworksZone: React.FC = () => {
  const {
    pickupFirework,
    pickupSparkler,
    igniteSparkler,
    dropSparkler,
    sparklerHolding,
    sparklerIgnited,
    placedFireworks,
    updatePlacedFireworks,
    startFuseBurn,
    triggerGrandFinale,
    grandFinaleActive,
    heldFireworkType,
    handItem,
    placementMode,
    placementPos,
    placementValid,
  } = useGameState();

  const sandstoneTex = useMemo(() => getSandstoneTexture('#C68B59'), []);
  const stallBannerTex = useMemo(() => getStallBannerTexture(), []);
  const sparklerBoxTex = useMemo(() => getSparklerBoxTexture(), []);
  const chakriTex = useMemo(() => getChakriLabelTexture(), []);
  const anarTex = useMemo(() => getAnarWrapperTexture('gold'), []);
  const rocketTex = useMemo(() => getRocketLabelTexture(), []);
  const ladiHeaderTex = useMemo(() => getLadiHeaderTexture(), []);
  const sitaGeetaTex = useMemo(() => getSitaGeetaTexture(), []);
  const gangaJamunaTex = useMemo(() => getGangaJamunaTexture(), []);

  // Track state transitions to trigger sound exactly once per firework activation
  const ignitedSoundsTriggered = useRef<Set<string>>(new Set());

  // Particle systems
  const chakriSparksRef = useRef<THREE.Points>(null);
  const anarSparksRef = useRef<THREE.Points>(null);
  const rocketSparksRef = useRef<THREE.Points>(null);
  const ladiSparksRef = useRef<THREE.Points>(null);
  const dualStreamSparksRef = useRef<THREE.Points>(null);

  // 1. Chakri Particles (radial spiral disc)
  const chakriCount = 90;
  const { chakriPositions, chakriVelocities } = useMemo(() => {
    const pos = new Float32Array(chakriCount * 3);
    const vel = new Float32Array(chakriCount * 3);
    for (let i = 0; i < chakriCount; i++) {
      const angle = (i / chakriCount) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * 0.12;
      pos[i * 3 + 1] = 0.04;
      pos[i * 3 + 2] = Math.sin(angle) * 0.12;
      vel[i * 3] = Math.cos(angle) * (1.8 + Math.random() * 1.6);
      vel[i * 3 + 1] = 0.05 + Math.random() * 0.22;
      vel[i * 3 + 2] = Math.sin(angle) * (1.8 + Math.random() * 1.6);
    }
    return { chakriPositions: pos, chakriVelocities: vel };
  }, []);

  // 2. Anar Particles (towering fountain)
  const anarCount = 140;
  const { anarPositions, anarVelocities } = useMemo(() => {
    const pos = new Float32Array(anarCount * 3);
    const vel = new Float32Array(anarCount * 3);
    for (let i = 0; i < anarCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.08;
      pos[i * 3 + 1] = 0.25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
      vel[i * 3] = (Math.random() - 0.5) * 0.9;
      vel[i * 3 + 1] = 3.6 + Math.random() * 3.4;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.9;
    }
    return { anarPositions: pos, anarVelocities: vel };
  }, []);

  // 3. Rocket Aerial Burst Particles
  const rocketBurstCount = 120;
  const { rocketPositions, rocketVelocities } = useMemo(() => {
    const pos = new Float32Array(rocketBurstCount * 3);
    const vel = new Float32Array(rocketBurstCount * 3);
    for (let i = 0; i < rocketBurstCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 26.0;
      pos[i * 3 + 2] = 0;

      // Spherical shell distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 4.5 + Math.random() * 5.0;
      vel[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
      vel[i * 3 + 1] = speed * Math.cos(phi);
      vel[i * 3 + 2] = speed * Math.sin(phi) * Math.sin(theta);
    }
    return { rocketPositions: pos, rocketVelocities: vel };
  }, []);

  // 4. Ladi Chain Pop Sparks
  const ladiSparksCount = 60;
  const { ladiPositions, ladiVelocities } = useMemo(() => {
    const pos = new Float32Array(ladiSparksCount * 3);
    const vel = new Float32Array(ladiSparksCount * 3);
    for (let i = 0; i < ladiSparksCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0.04;
      pos[i * 3 + 2] = 0;
      vel[i * 3] = (Math.random() - 0.5) * 2.2;
      vel[i * 3 + 1] = 0.4 + Math.random() * 1.6;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
    }
    return { ladiPositions: pos, ladiVelocities: vel };
  }, []);

  // Register stall interactions & placed firework inspections
  useEffect(() => {
    // 1. Phuljhadi Sparkler Station
    registerInteractive({
      id: 'fw-sparkler',
      label: sparklerHolding
        ? sparklerIgnited
          ? 'Put Away Lit Phuljhadi 🪄'
          : 'Light Held Phuljhadi at Stall Diya! 🔥'
        : 'Pick up Phuljhadi (Sparkler) ✨',
      subtext: sparklerHolding
        ? sparklerIgnited
          ? 'Click or [E] to stow sparkler'
          : 'Click or [E] to light sparkler from sacred flame'
        : 'Click or [E] to hold festive sparkler',
      position: new THREE.Vector3(-2.5, 1.05, 18.7),
      maxDistance: 2.6,
      action: () => {
        if (!sparklerHolding) {
          audioManager.playPowderPickup();
          pickupSparkler();
        } else if (!sparklerIgnited) {
          audioManager.playDiyaLight();
          audioManager.startSparklerLoop();
          igniteSparkler();
        } else {
          audioManager.stopSparklerLoop();
          dropSparkler();
        }
      },
    });

    // 2. Stall Diya Flame Source (Permanent Auspicious Flame at Stall)
    registerInteractive({
      id: 'stall-diya-flame',
      label:
        sparklerHolding && !sparklerIgnited
          ? 'Light Phuljhadi at Brass Diya 🔥'
          : 'Stall Auspicious Diya 🪔',
      subtext:
        sparklerHolding && !sparklerIgnited
          ? 'Click or [E] to touch sparkler to flame'
          : 'Continuous auspicious flame for lighting crackers',
      position: new THREE.Vector3(-3.1, 1.06, 18.7),
      maxDistance: 2.4,
      action: () => {
        if (sparklerHolding && !sparklerIgnited) {
          audioManager.playDiyaLight();
          audioManager.startSparklerLoop();
          igniteSparkler();
        } else {
          audioManager.playDiyaLight();
        }
      },
    });

    // 3. Indian Firecrackers on Stall Shelves
    STALL_FIREWORKS.slice(1).forEach(item => {
      registerInteractive({
        id: `fw-item-${item.type}`,
        label: `Pick up ${item.title} (${item.price}) 📦`,
        subtext: `Click or [E] to take into hand & place anywhere with pointer`,
        position: new THREE.Vector3(...item.shelfPos),
        maxDistance: 2.5,
        action: () => {
          pickupFirework(item.type);
          audioManager.playPowderPickup();
        },
      });
    });

    // 4. Grand Finale Skyrocket Showcase
    registerInteractive({
      id: 'fw-grand-finale',
      label: grandFinaleActive
        ? 'Grand Finale Synchronized Display Active! 🎆'
        : 'Launch Grand Fireworks Finale 🎆',
      subtext: 'Click or [E] to trigger awe-inspiring synchronized sky showcase',
      position: new THREE.Vector3(2.9, 1.05, 18.7),
      maxDistance: 2.6,
      action: () => {
        audioManager.playGrandFinale();
        triggerGrandFinale();
      },
    });

    // 5. Garden Resting Bench
    registerInteractive({
      id: 'garden-bench',
      label: 'Garden Resting Bench 🪑',
      subtext: 'Click or [E] to sit back and watch Diwali fireworks',
      position: new THREE.Vector3(-4.0, 0.6, 15.5),
      maxDistance: 2.6,
      action: () => {
        audioManager.playManjiraChime();
      },
    });

    // 6. Placed Unlit Fireworks Interactivity
    placedFireworks
      .filter(fw => fw.state === 'placed')
      .forEach(fw => {
        registerInteractive({
          id: `placed-fw-${fw.id}`,
          label: sparklerHolding && sparklerIgnited
            ? `Touch Lit Phuljhadi to ${fw.type.toUpperCase()} Fuse! 💥`
            : sparklerHolding && !sparklerIgnited
            ? `Ignite Phuljhadi first to light ${fw.type.toUpperCase()}! 🪄`
            : `Placed ${fw.type.toUpperCase()} (Bring lit Phuljhadi to fuse) 🪔`,
          subtext: sparklerHolding && sparklerIgnited
            ? 'Physical touch or Click/[E] to light fuse'
            : 'Fuses ignite upon contact with active sparks or flame',
          position: new THREE.Vector3(fw.pos[0], fw.pos[1] + 0.2, fw.pos[2]),
          maxDistance: 2.4,
          action: () => {
            if (sparklerHolding && sparklerIgnited) {
              startFuseBurn(fw.id);
              audioManager.playFuseBurn(fw.pos);
            } else if (sparklerHolding && !sparklerIgnited) {
              audioManager.playDiyaLight();
              audioManager.startSparklerLoop();
              igniteSparkler();
            } else {
              audioManager.playManjiraChime();
            }
          },
        });
      });

    return () => {
      unregisterInteractive('fw-sparkler');
      unregisterInteractive('stall-diya-flame');
      STALL_FIREWORKS.slice(1).forEach(item => unregisterInteractive(`fw-item-${item.type}`));
      unregisterInteractive('fw-grand-finale');
      unregisterInteractive('garden-bench');
      placedFireworks.forEach(fw => unregisterInteractive(`placed-fw-${fw.id}`));
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
    startFuseBurn,
    triggerGrandFinale,
  ]);

  // Main simulation frame update
  useFrame((state, delta) => {
    updatePlacedFireworks(delta);

    // ==============================================================
    // A. PHYSICAL CONTACT IGNITION SYSTEM:
    // Dedicated fuse collider vs active spark-source collider overlap
    // ==============================================================
    if (activeSparkSource.active) {
      const sparkPos = activeSparkSource.position;
      const CONTACT_THRESHOLD = 0.44; // meters

      placedFireworks.forEach(fw => {
        if (fw.state === 'placed') {
          const offset = FIREWORK_FUSE_OFFSETS[fw.type];
          const fuseWorldPos = new THREE.Vector3(
            fw.pos[0] + offset[0],
            fw.pos[1] + offset[1],
            fw.pos[2] + offset[2]
          );

          const dist = sparkPos.distanceTo(fuseWorldPos);
          if (dist <= CONTACT_THRESHOLD) {
            // PHYSICAL CONTACT DETECTED!
            startFuseBurn(fw.id);
            audioManager.playFuseBurn(fw.pos);
          }
        }
      });
    }

    // ==============================================================
    // B. SOUND TRIGGER & ACTIVE PARTICLES UPDATES
    // ==============================================================
    placedFireworks.forEach(fw => {
      // Trigger individual cracker sound when transitioning to 'active'
      if (fw.state === 'active' && !ignitedSoundsTriggered.current.has(fw.id)) {
        ignitedSoundsTriggered.current.add(fw.id);
        if (fw.type === 'chakri') audioManager.playChakriSpin(fw.pos, fw.id);
        else if (fw.type === 'anar') audioManager.playAnarFountain(fw.pos, fw.id);
        else if (fw.type === 'rocket') audioManager.playRocketLaunch(fw.pos, fw.id);
        else if (fw.type === 'ladi') audioManager.playLadiChain(fw.pos, fw.id);
        else if (fw.type === 'sita_geeta') audioManager.playSitaGeeta(fw.pos, fw.id);
        else if (fw.type === 'ganga_jamuna') audioManager.playGangaJamuna(fw.pos, fw.id);
        else if (fw.type === 'phuljhari') audioManager.playPhuljhadiSpark();
      }

      // Stop sounds immediately when burnt
      if (fw.state === 'burnt' && ignitedSoundsTriggered.current.has(fw.id)) {
        audioManager.stopFireworkSound(fw.id);
      }
    });

    // Animate Chakri spinning sparks
    if (chakriSparksRef.current) {
      chakriSparksRef.current.rotation.y = state.clock.getElapsedTime() * 42;
    }

    // Animate Anar fountain particles
    if (anarSparksRef.current) {
      const positions = anarSparksRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < anarCount; i++) {
        positions[i * 3 + 1] += anarVelocities[i * 3 + 1] * delta;
        positions[i * 3] += anarVelocities[i * 3] * delta;
        positions[i * 3 + 2] += anarVelocities[i * 3 + 2] * delta;

        // Reset particles that peaked
        if (positions[i * 3 + 1] > 4.2) {
          positions[i * 3] = (Math.random() - 0.5) * 0.08;
          positions[i * 3 + 1] = 0.25;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
        }
      }
      anarSparksRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate Rocket Aerial Burst particles
    if (rocketSparksRef.current) {
      const positions = rocketSparksRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < rocketBurstCount; i++) {
        positions[i * 3] += rocketVelocities[i * 3] * delta;
        positions[i * 3 + 1] += rocketVelocities[i * 3 + 1] * delta - 1.8 * delta; // gravity
        positions[i * 3 + 2] += rocketVelocities[i * 3 + 2] * delta;
      }
      rocketSparksRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate Ladi Chain Pop sparks
    if (ladiSparksRef.current) {
      const positions = ladiSparksRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < ladiSparksCount; i++) {
        positions[i * 3] += ladiVelocities[i * 3] * delta;
        positions[i * 3 + 1] += ladiVelocities[i * 3 + 1] * delta - 2.5 * delta;
        positions[i * 3 + 2] += ladiVelocities[i * 3 + 2] * delta;
        if (positions[i * 3 + 1] < 0.02) {
          positions[i * 3] = (Math.random() - 0.5) * 0.2;
          positions[i * 3 + 1] = 0.04;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
        }
      }
      ladiSparksRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const activeChakri = placedFireworks.find(
    f => f.type === 'chakri' && f.state === 'active'
  );
  const activeAnar = placedFireworks.find(
    f => (f.type === 'anar' || f.type === 'pencil') && f.state === 'active'
  );
  const activeRocket = placedFireworks.find(
    f => f.type === 'rocket' && f.state === 'active'
  );
  const activeLadi = placedFireworks.find(
    f => f.type === 'ladi' && f.state === 'active'
  );
  const activeSitaGeeta = placedFireworks.find(
    f => f.type === 'sita_geeta' && f.state === 'active'
  );
  const activeGangaJamuna = placedFireworks.find(
    f => f.type === 'ganga_jamuna' && f.state === 'active'
  );

  return (
    <group position={[0, 0, 0]}>
      {/* ==============================================================
          1. GARDEN PAVING & SURROUNDING GROUND (Z: 12.0 to 20.0, X: -6.0 to 6.0)
          ============================================================== */}
      {/* Garden Celebration Ground */}
      <mesh position={[0, 0, 16.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12.0, 8.0]} />
        <meshStandardMaterial color="#223B1E" roughness={0.88} />
      </mesh>

      {/* Sandstone Central Pathway leading to Stall */}
      <mesh position={[0, 0.01, 16.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 8.0]} />
        <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
      </mesh>

      {/* Far Garden Boundary Wall at Z: 20.0 */}
      <group position={[0, 0, 20.0]}>
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[12.0, 2.4, 0.4]} />
          <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
        </mesh>
        {[-3.5, 3.5].map((lx, li) => (
          <LanternModel key={`glantern-${li}`} position={[lx, 2.6, -0.2]} scale={0.4} />
        ))}
      </group>

      {/* Side Boundary Walls */}
      <mesh position={[-6.0, 1.2, 16.0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 2.4, 8.0]} />
        <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
      </mesh>
      <mesh position={[6.0, 1.2, 16.0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 2.4, 8.0]} />
        <meshStandardMaterial map={sandstoneTex} roughness={0.7} />
      </mesh>

      {/* Garden Resting Bench & Flower Pots */}
      <BenchModel position={[-4.0, 0, 15.5]} rotation={[0, Math.PI / 2, 0]} scale={0.85} />
      <PlanterPotModel position={[-4.0, 0, 13.5]} scale={0.65} />
      <PlanterPotModel position={[-4.0, 0, 17.5]} scale={0.65} />

      {/* ==============================================================
          2. AUTHENTIC 3D FIREWORKS STALL: "DEEPOTSAV PATAKA BHANDAR"
          Stepped shelves, product boxes, authentic labels, price plaques
          ============================================================== */}
      <group position={[0, 0, 18.8]}>
        {/* Stall Wooden Counter Base */}
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.4, 0.96, 0.85]} />
          <meshStandardMaterial color="#4A2306" roughness={0.6} />
        </mesh>

        {/* Countertop Trim */}
        <mesh position={[0, 0.98, 0]} receiveShadow>
          <boxGeometry args={[6.6, 0.05, 0.95]} />
          <meshStandardMaterial color="#6E340E" roughness={0.4} />
        </mesh>

        {/* Festive Saffron-Crimson Table Runner */}
        <mesh position={[0, 1.01, 0]}>
          <boxGeometry args={[6.2, 0.01, 0.75]} />
          <meshStandardMaterial color="#C62828" roughness={0.7} />
        </mesh>

        {/* Stepped Upper Display Shelf for Packaging Boxes */}
        <mesh position={[0, 1.14, 0.18]} castShadow receiveShadow>
          <boxGeometry args={[5.8, 0.24, 0.35]} />
          <meshStandardMaterial color="#3E1C04" roughness={0.6} />
        </mesh>

        {/* Overhead Hanging Banner "दीपोत्सव पटाखा भण्डार" */}
        <group position={[0, 2.55, 0]}>
          <mesh castShadow>
            <boxGeometry args={[5.6, 0.75, 0.05]} />
            <meshStandardMaterial map={stallBannerTex} roughness={0.35} />
          </mesh>
          {/* Decorative Gold Frame */}
          <mesh position={[0, 0, -0.01]}>
            <boxGeometry args={[5.7, 0.82, 0.04]} />
            <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>

        {/* Overhead Canopy with Festive Scalloped Saffron Cloth */}
        <mesh position={[0, 2.95, -0.1]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[6.6, 0.08, 1.3]} />
          <meshStandardMaterial color="#E65100" roughness={0.5} />
        </mesh>

        {/* Canopy Brass Support Pillars */}
        {[-3.0, 3.0].map((px, pi) => (
          <mesh key={`cpost-${pi}`} position={[px, 1.8, 0.38]} castShadow>
            <cylinderGeometry args={[0.04, 0.045, 1.7, 10]} />
            <meshStandardMaterial color="#DAA520" metalness={0.85} roughness={0.25} />
          </mesh>
        ))}

        {/* Hanging Festive Marigold Toran Garland along Counter Front */}
        <group position={[0, 0.95, 0.44]}>
          {Array.from({ length: 20 }).map((_, gi) => (
            <mesh key={`gtoran-${gi}`} position={[-2.8 + gi * 0.29, Math.sin(gi * 0.7) * 0.04, 0]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color={gi % 2 === 0 ? '#FF8F00' : '#FFD54F'} roughness={0.9} />
            </mesh>
          ))}
        </group>

        {/* Stall Auspicious Brass Samai Diya (Source of Perpetual Flame) */}
        <group position={[-3.1, 1.02, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.09, 0.06, 16]} />
            <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <coneGeometry args={[0.02, 0.05, 10]} />
            <meshBasicMaterial color="#FF9800" />
          </mesh>
          <pointLight position={[0, 0.08, 0]} color="#FF9800" intensity={2.2} distance={3.0} decay={2} />
        </group>

        {/* ==============================================================
            STALL FIREWORKS PRODUCTS & PACKAGING ON SHELVES
            ============================================================== */}

        {/* 1. Phuljhadi Multipack Box & Sample Sparklers */}
        <group position={[-2.5, 1.15, 0.18]}>
          <mesh castShadow>
            <boxGeometry args={[0.26, 0.42, 0.08]} />
            <meshStandardMaterial map={sparklerBoxTex} roughness={0.4} />
          </mesh>
          {/* Loose sample sparklers lying on brass tray */}
          <group position={[0, -0.1, -0.22]} rotation={[0, 0.3, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.015, 16]} />
              <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
            </mesh>
            <group position={[0, 0.02, 0]} rotation={[0, 0, Math.PI / 2]} scale={0.45}>
              <FirecrackerModel type="phuljhari" />
            </group>
          </group>
        </group>

        {/* 2. Zameen Chakri Box & Sample Chakri */}
        <group position={[-1.7, 1.15, 0.18]}>
          <mesh castShadow>
            <boxGeometry args={[0.32, 0.28, 0.12]} />
            <meshStandardMaterial map={chakriTex} roughness={0.4} />
          </mesh>
          {/* Sample Chakri on display */}
          <group position={[0, -0.1, -0.22]}>
            <FirecrackerModel type="chakri" />
          </group>
        </group>

        {/* 3. Anar Box & Sample Flower Pot */}
        <group position={[-0.9, 1.15, 0.18]}>
          <mesh castShadow>
            <boxGeometry args={[0.32, 0.32, 0.14]} />
            <meshStandardMaterial map={anarTex} roughness={0.45} />
          </mesh>
          {/* Sample Anar Cone on display */}
          <group position={[0, -0.1, -0.22]}>
            <FirecrackerModel type="anar" />
          </group>
        </group>

        {/* 4. Awaaz Rocket Box & Sample Standing Rocket */}
        <group position={[-0.1, 1.15, 0.18]}>
          <mesh castShadow>
            <boxGeometry args={[0.24, 0.45, 0.1]} />
            <meshStandardMaterial map={rocketTex} roughness={0.4} />
          </mesh>
          {/* Standing sample rocket in launch tube */}
          <group position={[0, -0.1, -0.22]}>
            <FirecrackerModel type="rocket" />
          </group>
        </group>

        {/* 5. 1000-Wala Ladi Box & Draped Sample */}
        <group position={[0.7, 1.15, 0.18]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.28, 0.12]} />
            <meshStandardMaterial map={ladiHeaderTex} roughness={0.4} />
          </mesh>
          {/* Draped sample garland on display */}
          <group position={[0, -0.1, -0.22]} scale={0.8}>
            <FirecrackerModel type="ladi" />
          </group>
        </group>

        {/* 6. Sita-Geeta Special Box & Sample */}
        <group position={[1.5, 1.15, 0.18]}>
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.32, 0.12]} />
            <meshStandardMaterial map={sitaGeetaTex} roughness={0.45} />
          </mesh>
          {/* Sample twin cylinder on display */}
          <group position={[0, -0.1, -0.22]} scale={0.85}>
            <FirecrackerModel type="sita_geeta" />
          </group>
        </group>

        {/* 7. Ganga-Jamuna Dual Box & Sample */}
        <group position={[2.3, 1.15, 0.18]}>
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.32, 0.12]} />
            <meshStandardMaterial map={gangaJamunaTex} roughness={0.45} />
          </mesh>
          {/* Sample dual cones on display */}
          <group position={[0, -0.1, -0.22]} scale={0.85}>
            <FirecrackerModel type="ganga_jamuna" />
          </group>
        </group>

        {/* Price Tags / Brass Plaques in Front of Each Product */}
        {STALL_FIREWORKS.map((item, idx) => (
          <group key={`plaque-${idx}`} position={[item.shelfPos[0], 1.02, 0.28]} rotation={[-0.45, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.28, 0.08, 0.01]} />
              <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.25} />
            </mesh>
          </group>
        ))}

        {/* Stall Warm Illumination Lanterns */}
        <pointLight position={[0, 2.3, 0.2]} color="#FFA500" intensity={3.2} distance={8.0} decay={2} />
      </group>

      {/* ==============================================================
          3. REAL-TIME 3D POINTER PLACEMENT PREVIEW (GHOST MESH)
          Renders at exact mouse/touch raycast hit position on ground
          ============================================================== */}
      {placementMode && heldFireworkType && (
        <group position={placementPos}>
          <FirecrackerModel
            type={heldFireworkType}
            isGhost={true}
            isValidPlacement={placementValid}
          />
        </group>
      )}

      {/* ==============================================================
          4. PLACED 3D FIREWORKS MODELS ON THE CELEBRATION GROUND
          Each sits at its exact user-placed world position
          ============================================================== */}
      {placedFireworks.map(fw => (
        <group key={fw.id} position={fw.pos}>
          {/* Authentic 3D Cracker Model */}
          <FirecrackerModel
            type={fw.type}
            isFuseBurning={fw.state === 'fuse_burning'}
          />

          {/* Interactive Selection / Inspection Halo */}
          {fw.state === 'placed' && (
            <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.22, 0.26, 24]} />
              <meshBasicMaterial color="#FFD700" transparent opacity={0.45} />
            </mesh>
          )}

          {/* Burnt Remnant Ash & Charring */}
          {fw.state === 'burnt' && (
            <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.25, 16]} />
              <meshStandardMaterial color="#1A1A1A" roughness={0.95} transparent opacity={0.7} />
            </mesh>
          )}

          {/* Sizzling Fuse Light when burning */}
          {fw.state === 'fuse_burning' && (
            <pointLight
              position={FIREWORK_FUSE_OFFSETS[fw.type]}
              color="#FFA000"
              intensity={4.0}
              distance={3.0}
              decay={2}
            />
          )}

          {/* Active Illumination during display */}
          {fw.state === 'active' && (
            <pointLight
              position={[0, fw.type === 'anar' ? 1.8 : 0.4, 0]}
              color={fw.color || '#FFD700'}
              intensity={fw.type === 'anar' ? 5.5 : 3.8}
              distance={fw.type === 'anar' ? 9.0 : 5.5}
              decay={2}
            />
          )}
        </group>
      ))}

      {/* ==============================================================
          5. DEDICATED VISUAL EFFECTS PARTICLE SYSTEMS
          ============================================================== */}

      {/* A. Active Chakri Spinning Particles */}
      {activeChakri && (
        <group position={[activeChakri.pos[0], 0.035, activeChakri.pos[2]]}>
          <points ref={chakriSparksRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[chakriPositions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.052} color="#FF9100" transparent opacity={0.95} />
          </points>
        </group>
      )}

      {/* B. Active Anar Vertical Fountain Particles */}
      {activeAnar && (
        <group position={[activeAnar.pos[0], 0.05, activeAnar.pos[2]]}>
          <points ref={anarSparksRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[anarPositions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.068} color="#FFD700" transparent opacity={0.95} />
          </points>
        </group>
      )}

      {/* C. Active Rocket Aerial Chrysanthemum Burst Particles */}
      {activeRocket && (
        <group position={[activeRocket.pos[0], 0, activeRocket.pos[2]]}>
          <points ref={rocketSparksRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[rocketPositions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.085} color="#00E5FF" transparent opacity={0.95} />
          </points>
          <pointLight position={[0, 26, 0]} color="#00E5FF" intensity={8.0} distance={45.0} decay={2} />
        </group>
      )}

      {/* D. Active Ladi Sequential Pop Particles */}
      {activeLadi && (
        <group position={[activeLadi.pos[0], 0.02, activeLadi.pos[2]]}>
          <points ref={ladiSparksRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[ladiPositions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.055} color="#FF3D00" transparent opacity={0.95} />
          </points>
          {/* Flashing strobe pop light */}
          <pointLight position={[0, 0.25, 0]} color="#FF5252" intensity={5.0} distance={4.5} decay={2} />
        </group>
      )}

      {/* E. Active Sita-Geeta Twin Flare Particles */}
      {activeSitaGeeta && (
        <group position={[activeSitaGeeta.pos[0], 0.05, activeSitaGeeta.pos[2]]}>
          <points ref={anarSparksRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[anarPositions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.065} color="#E040FB" transparent opacity={0.95} />
          </points>
        </group>
      )}

      {/* F. Active Ganga-Jamuna Dual Stream Particles */}
      {activeGangaJamuna && (
        <group position={[activeGangaJamuna.pos[0], 0.05, activeGangaJamuna.pos[2]]}>
          <points ref={anarSparksRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[anarPositions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.065} color="#FFEA00" transparent opacity={0.95} />
          </points>
        </group>
      )}
    </group>
  );
};

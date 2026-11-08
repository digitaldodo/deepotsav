import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState, FireworkType, PlacedFirework } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

// 8 Distinct Indian Firecracker Varieties displayed on stall shelves
export const FIREWORK_ITEMS: Array<{
  type: FireworkType;
  title: string;
  icon: string;
  tag: string;
  desc: string;
  shelfPos: [number, number, number];
  boxColor: string;
}> = [
  { type: 'phuljhari', title: 'Phuljhari (Sparklers)', icon: '✨', tag: 'Handheld', desc: 'Continuous golden wire sparkler', shelfPos: [-3.0, 0.95, 30.5], boxColor: '#E53935' },
  { type: 'chakri', title: 'Zameen Chakri', icon: '🌀', tag: 'Ground Spinner', desc: 'Spins with circular rings of fire', shelfPos: [-2.2, 0.95, 30.5], boxColor: '#FF6D00' },
  { type: 'anar', title: 'Anar Flower Pot', icon: '🌋', tag: 'Vertical Fountain', desc: 'Towering 3.5m fountain of golden sparks', shelfPos: [-1.4, 0.95, 30.5], boxColor: '#FFD54F' },
  { type: 'rocket', title: 'Awaaz Rocket', icon: '🚀', tag: 'Aerial Burst', desc: 'Whistling ascent & high altitude explosion', shelfPos: [-0.6, 0.95, 30.5], boxColor: '#00BCD4' },
  { type: 'ladi', title: '1000-Wala Ladi', icon: '🧨', tag: 'Chain Crackers', desc: 'Rapid sequential ground explosions', shelfPos: [0.2, 0.95, 30.5], boxColor: '#D32F2F' },
  { type: 'pencil', title: 'Colour Pencil Pot', icon: '✏️', tag: 'Sparkler Pot', desc: 'Slender shimmering multi-hue fountain', shelfPos: [1.0, 0.95, 30.5], boxColor: '#4CAF50' },
  { type: 'sita_geeta', title: 'Sita-Geeta Special', icon: '👯', tag: 'Two-Stage', desc: 'Golden fountain followed by twin bursting flares', shelfPos: [1.8, 0.95, 30.5], boxColor: '#9C27B0' },
  { type: 'ganga_jamuna', title: 'Ganga-Jamuna Twin', icon: '🌊', tag: 'Dual Stream', desc: 'Intertwined gold and silver spark streams', shelfPos: [2.6, 0.95, 30.5], boxColor: '#FF4081' },
];

export const FireworksStall: React.FC = () => {
  const { camera } = useThree();
  const {
    playerPosition,
    setActivePrompt,
    activePrompt,
    pickupFirework,
    placeFireworkOnGround,
    igniteFirework,
    placedFireworks,
    updatePlacedFireworks,
    grandFinaleActive,
    triggerGrandFinale,
    heldFireworkType,
    handItem,
  } = useGameState();

  // Particle systems for active fireworks
  const chakriSparksRef = useRef<THREE.Points>(null);
  const anarSparksRef = useRef<THREE.Points>(null);
  const finaleSparksRef = useRef<THREE.Points>(null);

  // Initialize particle positions and velocities
  const chakriParticleCount = 80;
  const { chakriPositions, chakriVelocities } = useMemo(() => {
    const pos = new Float32Array(chakriParticleCount * 3);
    const vel = new Float32Array(chakriParticleCount * 3);
    for (let i = 0; i < chakriParticleCount; i++) {
      const angle = (i / chakriParticleCount) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * 0.1;
      pos[i * 3 + 1] = 0.04;
      pos[i * 3 + 2] = Math.sin(angle) * 0.1;

      vel[i * 3] = Math.cos(angle) * (1.2 + Math.random() * 1.5);
      vel[i * 3 + 1] = 0.05 + Math.random() * 0.2;
      vel[i * 3 + 2] = Math.sin(angle) * (1.2 + Math.random() * 1.5);
    }
    return { chakriPositions: pos, chakriVelocities: vel };
  }, []);

  const anarParticleCount = 120;
  const { anarPositions, anarVelocities } = useMemo(() => {
    const pos = new Float32Array(anarParticleCount * 3);
    const vel = new Float32Array(anarParticleCount * 3);
    for (let i = 0; i < anarParticleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 1] = 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      vel[i * 3] = (Math.random() - 0.5) * 0.8;
      vel[i * 3 + 1] = 3.2 + Math.random() * 2.8;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    return { anarPositions: pos, anarVelocities: vel };
  }, []);

  // Frame update loop
  useFrame((state, delta) => {
    updatePlacedFireworks(delta);
    const playerPos = camera.position;

    // Animate active Chakri particles
    if (chakriSparksRef.current) {
      const time = state.clock.getElapsedTime();
      chakriSparksRef.current.rotation.y = time * 24; // fast rotation
    }

    // 1. Check proximity to Fireworks Stall Counter at [ 0, 0, 30.5 ]
    for (const item of FIREWORK_ITEMS) {
      const itemVec = new THREE.Vector3(...item.shelfPos);
      if (playerPos.distanceTo(itemVec) < 1.8) {
        if (activePrompt?.id !== `take-firework-${item.type}`) {
          setActivePrompt({
            id: `take-firework-${item.type}`,
            label: `${item.icon} Take ${item.title}`,
            subtext: `${item.tag} — ${item.desc}`,
            action: () => {
              pickupFirework(item.type);
              audioManager.playPowderPickup();
            },
          });
        }
        return;
      }
    }

    // 2. Check proximity to Park Celebration Launch Pad at [ 0, 0, 35 ]
    const launchPadPos = new THREE.Vector3(0, 0, 35);
    const distToPad = playerPos.distanceTo(launchPadPos);

    if (distToPad < 3.2) {
      // If holding a firework in hand, offer to place it on the ground!
      if (handItem === 'firework' && heldFireworkType) {
        if (activePrompt?.id !== 'place-firework-pad') {
          setActivePrompt({
            id: 'place-firework-pad',
            label: `Place ${heldFireworkType.toUpperCase()} on Launch Pad 🎯`,
            subtext: 'Press [E] or Tap to set on ground',
            action: () => {
              const forward = new THREE.Vector3();
              camera.getWorldDirection(forward);
              placeFireworkOnGround([
                playerPos.x + forward.x * 1.4,
                0.02,
                playerPos.z + forward.z * 1.4,
              ]);
              audioManager.playPowderPickup();
            },
          });
        }
        return;
      }

      // Check proximity to any placed unignited firework
      const placedToIgnite = placedFireworks.find(
        f => f.state === 'placed' && playerPos.distanceTo(new THREE.Vector3(...f.pos)) < 2.0
      );

      if (placedToIgnite) {
        if (activePrompt?.id !== `ignite-${placedToIgnite.id}`) {
          setActivePrompt({
            id: `ignite-${placedToIgnite.id}`,
            label: `Ignite ${placedToIgnite.type.toUpperCase()}! 🔥`,
            subtext: 'Press [E] or Tap to light fuse with brass stick',
            action: () => {
              igniteFirework(placedToIgnite.id);
              // Trigger corresponding synthesized audio
              switch (placedToIgnite.type) {
                case 'chakri':
                  audioManager.playChakriSpin();
                  break;
                case 'anar':
                  audioManager.playAnarFountain();
                  break;
                case 'rocket':
                  audioManager.playRocketLaunch();
                  break;
                case 'ladi':
                  audioManager.playLadiChain();
                  break;
                case 'pencil':
                  audioManager.playPencilFountain();
                  break;
                case 'sita_geeta':
                  audioManager.playSitaGeeta();
                  break;
                case 'ganga_jamuna':
                  audioManager.playGangaJamuna();
                  break;
                default:
                  audioManager.playDiyaLight();
                  break;
              }
            },
          });
        }
        return;
      }

      // Grand Finale launch trigger at [ 0, 0, 37 ]
      const finalePos = new THREE.Vector3(0, 0, 37);
      if (playerPos.distanceTo(finalePos) < 2.2 && !grandFinaleActive) {
        if (activePrompt?.id !== 'grand-finale-trigger') {
          setActivePrompt({
            id: 'grand-finale-trigger',
            label: '🎆 Start Grand Diwali Fireworks Finale',
            subtext: 'Press [E] or Tap for spectacular community display',
            action: () => {
              triggerGrandFinale();
              audioManager.playFinaleSequence();
            },
          });
        }
        return;
      }
    }

    // Clear prompt if moved away
    if (
      activePrompt &&
      (activePrompt.id.startsWith('take-firework') ||
        activePrompt.id === 'place-firework-pad' ||
        activePrompt.id.startsWith('ignite-') ||
        activePrompt.id === 'grand-finale-trigger')
    ) {
      setActivePrompt(null);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ==============================================================
          PHYSICAL 3D INDIAN FIREWORKS STALL (Patakha Dukan) in Park [0, 0, 30]
          ============================================================== */}
      <group position={[0, 0, 30.5]}>
        {/* Stall Wooden Counter Base */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.2, 0.9, 1.4]} />
          <meshStandardMaterial color="#4E2A12" roughness={0.7} />
        </mesh>
        {/* Polished Teak Counter Top */}
        <mesh position={[0, 0.92, 0]} receiveShadow>
          <boxGeometry args={[7.4, 0.08, 1.6]} />
          <meshStandardMaterial color="#30180B" roughness={0.4} />
        </mesh>

        {/* Traditional Festive Awning Canopy (Striped Crimson & Gold) */}
        <group position={[0, 2.6, 0]}>
          <mesh rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[7.6, 0.06, 2.4]} />
            <meshStandardMaterial color="#C70039" roughness={0.6} />
          </mesh>
          {/* Gold scalloped valance trim */}
          <mesh position={[0, -0.2, 1.2]}>
            <boxGeometry args={[7.6, 0.35, 0.04]} />
            <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Canopy Pillars */}
          {[-3.6, 3.6].map((px, idx) => (
            <mesh key={idx} position={[px, -1.2, 0.8]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
              <meshStandardMaterial color="#1A1A1A" metalness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Vintage Signboard: "DEEPOTSAV PATAKHA BHANDAR (FIREWORKS)" */}
        <mesh position={[0, 2.85, 1.1]}>
          <boxGeometry args={[5.8, 0.45, 0.06]} />
          <meshStandardMaterial color="#FFB300" roughness={0.4} />
        </mesh>

        {/* Shelves displaying 3D Indian Fireworks Boxes */}
        {FIREWORK_ITEMS.map((item) => (
          <group key={item.type} position={[item.shelfPos[0], 0.98, 0]}>
            {/* Branded Firecracker Carton Box */}
            <mesh position={[0, 0.08, 0]} castShadow>
              <boxGeometry args={[0.55, 0.16, 0.42]} />
              <meshStandardMaterial color={item.boxColor} roughness={0.5} />
            </mesh>
            {/* Decorative Printed Label On Box Top */}
            <mesh position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.48, 0.36]} />
              <meshStandardMaterial color="#FFD700" metalness={0.5} roughness={0.3} />
            </mesh>

            {/* Distinct 3D Physical Item resting on its box */}
            {item.type === 'chakri' && (
              <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.14, 0.14, 0.04, 16]} />
                <meshStandardMaterial color="#FF5722" roughness={0.6} />
              </mesh>
            )}
            {item.type === 'anar' && (
              <mesh position={[0, 0.28, 0]} castShadow>
                <coneGeometry args={[0.1, 0.22, 14]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
              </mesh>
            )}
            {item.type === 'rocket' && (
              <group position={[0, 0.3, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
                  <meshStandardMaterial color="#ECECEC" roughness={0.4} />
                </mesh>
                <mesh position={[0, 0.18, 0]}>
                  <coneGeometry args={[0.045, 0.14, 8]} />
                  <meshStandardMaterial color="#E53935" roughness={0.4} />
                </mesh>
              </group>
            )}
            {item.type === 'ladi' && (
              <mesh position={[0, 0.18, 0]} castShadow>
                <boxGeometry args={[0.42, 0.04, 0.14]} />
                <meshStandardMaterial color="#D32F2F" roughness={0.6} />
              </mesh>
            )}
            {item.type === 'pencil' && (
              <mesh position={[0, 0.26, 0]} castShadow>
                <cylinderGeometry args={[0.035, 0.035, 0.32, 12]} />
                <meshStandardMaterial color="#4CAF50" roughness={0.4} />
              </mesh>
            )}
            {item.type === 'sita_geeta' && (
              <group position={[0, 0.26, 0]}>
                <mesh position={[-0.06, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.04, 0.04, 0.26, 12]} />
                  <meshStandardMaterial color="#9C27B0" roughness={0.4} />
                </mesh>
                <mesh position={[0.06, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.04, 0.04, 0.26, 12]} />
                  <meshStandardMaterial color="#E91E63" roughness={0.4} />
                </mesh>
              </group>
            )}
            {item.type === 'ganga_jamuna' && (
              <mesh position={[0, 0.26, 0]} castShadow>
                <coneGeometry args={[0.12, 0.24, 12]} />
                <meshStandardMaterial color="#00BCD4" metalness={0.7} roughness={0.3} />
              </mesh>
            )}
            {item.type === 'phuljhari' && (
              <mesh position={[0, 0.24, 0]} rotation={[0, 0, 0.3]} castShadow>
                <cylinderGeometry args={[0.006, 0.006, 0.38, 8]} />
                <meshStandardMaterial color="#B0B0B0" metalness={0.9} />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* ==============================================================
          DESIGNATED CELEBRATION LAUNCH ZONE IN PARK [0, 0, 35]
          ============================================================== */}
      <group position={[0, 0.015, 35]}>
        {/* Marked Safe Firecracker Circle on Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[4.2, 36]} />
          <meshStandardMaterial color="#37474F" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.9, 4.15, 36]} />
          <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Grand Finale Gazebo Pillar at [0, 0, 2] */}
        <group position={[0, 0, 2]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.45, 0.8, 12]} />
            <meshStandardMaterial color="#FFB300" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.82, 0]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshBasicMaterial color="#FF5722" />
          </mesh>
          <pointLight position={[0, 1.2, 0]} color="#FFA500" intensity={1.5} distance={6} />
        </group>
      </group>

      {/* ==============================================================
          PLACED PHYSICAL FIREWORKS SIMULATION (CHAKRI, ANAR, ROCKET, LADI, ETC.)
          ============================================================== */}
      {placedFireworks.map(f => {
        const isActive = f.state === 'active';
        return (
          <group key={f.id} position={f.pos}>
            {/* 3D Physical Shell */}
            {f.type === 'chakri' && (
              <group>
                <mesh rotation={[-Math.PI / 2, 0, isActive ? f.timer * 30 : 0]} castShadow>
                  <cylinderGeometry args={[0.16, 0.16, 0.045, 16]} />
                  <meshStandardMaterial color="#FF5722" roughness={0.6} />
                </mesh>
                {/* Spinning circular sparks */}
                {isActive && (
                  <group>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                      <ringGeometry args={[0.4, 1.8, 24]} />
                      <meshBasicMaterial color="#FFEB3B" transparent opacity={0.85} side={THREE.DoubleSide} />
                    </mesh>
                    <pointLight color="#FFA500" intensity={3.0} distance={5} />
                  </group>
                )}
              </group>
            )}

            {f.type === 'anar' && (
              <group>
                <mesh position={[0, 0.14, 0]} castShadow>
                  <coneGeometry args={[0.12, 0.28, 14]} />
                  <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Vertical towering golden fountain */}
                {isActive && (
                  <group position={[0, 0.28, 0]}>
                    <mesh position={[0, 1.8, 0]}>
                      <cylinderGeometry args={[0.45, 0.08, 3.6, 12]} />
                      <meshBasicMaterial color="#FFF59D" transparent opacity={0.9} />
                    </mesh>
                    <pointLight position={[0, 1.5, 0]} color="#FFE082" intensity={4.0} distance={9} />
                  </group>
                )}
              </group>
            )}

            {f.type === 'rocket' && (
              <group position={[0, isActive ? Math.min(f.timer * 18, 30) : 0, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
                  <meshStandardMaterial color="#ECECEC" />
                </mesh>
                <mesh position={[0, 0.24, 0]}>
                  <coneGeometry args={[0.05, 0.16, 8]} />
                  <meshStandardMaterial color="#E53935" />
                </mesh>
                {isActive && (
                  <group position={[0, -0.3, 0]}>
                    <mesh>
                      <sphereGeometry args={[0.08, 8, 8]} />
                      <meshBasicMaterial color="#FFEB3B" />
                    </mesh>
                    <pointLight color="#FF9800" intensity={2.5} distance={4} />
                  </group>
                )}
              </group>
            )}

            {f.type === 'ladi' && (
              <group>
                <mesh position={[0, 0.02, 0]}>
                  <boxGeometry args={[1.2, 0.03, 0.18]} />
                  <meshStandardMaterial color="#D32F2F" />
                </mesh>
                {/* Flashing explosion pops */}
                {isActive && (
                  <group position={[(Math.random() - 0.5) * 1.0, 0.08, 0]}>
                    <mesh>
                      <sphereGeometry args={[0.18, 8, 8]} />
                      <meshBasicMaterial color="#FFFFFF" />
                    </mesh>
                    <pointLight color="#FF5722" intensity={3.5} distance={4} />
                  </group>
                )}
              </group>
            )}

            {f.type === 'pencil' && (
              <group>
                <mesh position={[0, 0.18, 0]}>
                  <cylinderGeometry args={[0.04, 0.04, 0.36, 12]} />
                  <meshStandardMaterial color="#4CAF50" />
                </mesh>
                {isActive && (
                  <group position={[0, 0.36, 0]}>
                    <mesh position={[0, 1.1, 0]}>
                      <cylinderGeometry args={[0.22, 0.04, 2.2, 10]} />
                      <meshBasicMaterial color="#00E5FF" transparent opacity={0.8} />
                    </mesh>
                    <pointLight position={[0, 1.0, 0]} color="#00E5FF" intensity={3.0} distance={6} />
                  </group>
                )}
              </group>
            )}

            {f.type === 'sita_geeta' && (
              <group>
                <mesh position={[-0.08, 0.16, 0]}>
                  <cylinderGeometry args={[0.045, 0.045, 0.32, 10]} />
                  <meshStandardMaterial color="#9C27B0" />
                </mesh>
                <mesh position={[0.08, 0.16, 0]}>
                  <cylinderGeometry args={[0.045, 0.045, 0.32, 10]} />
                  <meshStandardMaterial color="#E91E63" />
                </mesh>
                {isActive && (
                  <group position={[0, 0.34, 0]}>
                    <mesh position={[0, 1.6, 0]}>
                      <cylinderGeometry args={[0.35, 0.06, 3.2, 12]} />
                      <meshBasicMaterial color="#FF4081" transparent opacity={0.85} />
                    </mesh>
                    <pointLight position={[0, 1.4, 0]} color="#FF4081" intensity={3.5} distance={8} />
                  </group>
                )}
              </group>
            )}

            {f.type === 'ganga_jamuna' && (
              <group>
                <mesh position={[0, 0.18, 0]}>
                  <coneGeometry args={[0.14, 0.36, 12]} />
                  <meshStandardMaterial color="#00BCD4" metalness={0.7} />
                </mesh>
                {isActive && (
                  <group position={[0, 0.36, 0]}>
                    <mesh position={[0, 1.7, 0]}>
                      <cylinderGeometry args={[0.4, 0.07, 3.4, 12]} />
                      <meshBasicMaterial color="#E0F7FA" transparent opacity={0.9} />
                    </mesh>
                    <pointLight position={[0, 1.5, 0]} color="#00E5FF" intensity={3.5} distance={8} />
                  </group>
                )}
              </group>
            )}
          </group>
        );
      })}

      {/* ==============================================================
          GRAND FINALE SKY BURSTS SIMULATION
          ============================================================== */}
      {grandFinaleActive && (
        <group position={[0, 22, 35]}>
          {[
            [-12, 4, -4, '#FFD700'],
            [12, 6, 2, '#FF1744'],
            [0, 10, 0, '#00E5FF'],
            [-6, 8, 6, '#76FF03'],
            [6, 9, -6, '#E040FB'],
          ].map(([fx, fy, fz, fcol], idx) => (
            <group key={idx} position={[fx as number, fy as number, fz as number]}>
              <mesh>
                <sphereGeometry args={[2.5, 12, 12]} />
                <meshBasicMaterial color={fcol as string} transparent opacity={0.85} />
              </mesh>
              <pointLight color={fcol as string} intensity={4.5} distance={40} />
            </group>
          ))}
        </group>
      )}
    </group>
  );
};

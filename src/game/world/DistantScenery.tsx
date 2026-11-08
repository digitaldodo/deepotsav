import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getCarvedWoodTexture, getSandstoneTexture } from '../utils/textureGenerator';

interface DistantBurst {
  pos: THREE.Vector3;
  color: THREE.Color;
  startTime: number;
  duration: number;
  particles: Float32Array;
  velocities: Float32Array;
  active: boolean;
}

export const DistantScenery: React.FC = () => {
  const starsRef = useRef<THREE.Points>(null);
  const fireworksGroupRef = useRef<THREE.Group>(null);
  const burstPointsRef = useRef<THREE.Points[]>([]);
  const flashLightRef = useRef<THREE.PointLight>(null);

  // 1. Twinkling Starfield in Deep Indigo Night Sky
  const starCount = 650;
  const { starPositions, starColors } = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);
    const gold = new THREE.Color('#FFE4B5');
    const blue = new THREE.Color('#B0E0E6');
    const white = new THREE.Color('#FFFFFF');

    for (let i = 0; i < starCount; i++) {
      // Upper hemisphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(0.08 + Math.random() * 0.92); // keep above horizon
      const r = 85 + Math.random() * 15;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const c = Math.random() > 0.4 ? gold : Math.random() > 0.5 ? white : blue;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { starPositions: pos, starColors: col };
  }, []);

  // 2. Distant Haveli Skyline Ring (Rooftops, Chhatris, Jharokhas)
  const distantBuildings = useMemo(() => {
    const buildings: Array<{
      x: number;
      z: number;
      w: number;
      h: number;
      d: number;
      rotation: number;
      color: string;
      windows: Array<{ x: number; y: number; z: number }>;
      hasChhatri: boolean;
      chhatriHeight: number;
    }> = [];

    // Ring 1: Near neighbourhood background (radius ~30m to ~45m)
    const angles = 24;
    for (let i = 0; i < angles; i++) {
      // Skip the direct entrance path direction if needed, but fill 360 for vista
      const angle = (i / angles) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
      const radius = 34 + Math.random() * 12;

      // Don't spawn right inside playable courtyard/house/park
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius + 6; // offset center towards mid of level

      const w = 7 + Math.random() * 6;
      const h = 7 + Math.random() * 8;
      const d = 6 + Math.random() * 5;

      const colors = ['#8C5338', '#99583D', '#7B4228', '#6E3A24', '#8A624A', '#5C2E1A'];
      const color = colors[i % colors.length];

      // Windows
      const windows: Array<{ x: number; y: number; z: number }> = [];
      const floors = Math.floor(h / 2.5);
      for (let f = 1; f < floors; f++) {
        for (let wx = -w * 0.35; wx <= w * 0.35; wx += 2.2) {
          windows.push({ x: wx, y: f * 2.4 - h / 2, z: d / 2 + 0.05 });
        }
      }

      buildings.push({
        x,
        z,
        w,
        h,
        d,
        rotation: angle + Math.PI / 2,
        color,
        windows,
        hasChhatri: i % 3 === 0,
        chhatriHeight: h / 2 + 1.2,
      });
    }

    // Ring 2: Far skyline & temple spires (radius ~55m to ~75m)
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const radius = 60 + Math.random() * 16;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius + 6;
      const w = 10 + Math.random() * 8;
      const h = 14 + Math.random() * 12;
      const d = 10 + Math.random() * 8;

      buildings.push({
        x,
        z,
        w,
        h,
        d,
        rotation: angle,
        color: '#4A2A1A',
        windows: [],
        hasChhatri: true,
        chhatriHeight: h / 2 + 2.0,
      });
    }

    return buildings;
  }, []);

  // 3. Distant Periodic Fireworks Launching on Horizon
  const burstColors = useMemo(
    () => [
      new THREE.Color('#FFD700'), // Gold
      new THREE.Color('#FF3366'), // Ruby
      new THREE.Color('#00E5FF'), // Cyan
      new THREE.Color('#39FF14'), // Emerald
      new THREE.Color('#FF9900'), // Amber Saffron
      new THREE.Color('#E066FF'), // Orchid Purple
    ],
    []
  );

  const burstsRef = useRef<DistantBurst[]>([]);
  const lastLaunchTime = useRef<number>(0);

  // Initialize burst pool
  useMemo(() => {
    burstsRef.current = Array.from({ length: 4 }).map(() => {
      const count = 90;
      const particles = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      return {
        pos: new THREE.Vector3(),
        color: new THREE.Color('#FFD700'),
        startTime: 0,
        duration: 2.2,
        particles,
        velocities,
        active: false,
      };
    });
  }, []);

  useFrame(state => {
    const time = state.clock.getElapsedTime();

    // Twinkle stars
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.0006;
    }

    // Trigger distant firework burst periodically
    if (time - lastLaunchTime.current > 2.8 + Math.random() * 1.5) {
      lastLaunchTime.current = time;
      const idleBurst = burstsRef.current.find(b => !b.active);
      if (idleBurst) {
        idleBurst.active = true;
        idleBurst.startTime = time;
        const angle = Math.random() * Math.PI * 2;
        const dist = 45 + Math.random() * 25;
        idleBurst.pos.set(
          Math.cos(angle) * dist,
          22 + Math.random() * 14,
          Math.sin(angle) * dist + 6
        );
        idleBurst.color = burstColors[Math.floor(Math.random() * burstColors.length)];

        // Random spherical explosion velocities
        for (let i = 0; i < 90; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const speed = 4.5 + Math.random() * 6.5;

          idleBurst.velocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
          idleBurst.velocities[i * 3 + 1] = speed * Math.cos(phi) * 0.9;
          idleBurst.velocities[i * 3 + 2] = speed * Math.sin(phi) * Math.sin(theta);

          idleBurst.particles[i * 3] = idleBurst.pos.x;
          idleBurst.particles[i * 3 + 1] = idleBurst.pos.y;
          idleBurst.particles[i * 3 + 2] = idleBurst.pos.z;
        }

        // Flash atmospheric light
        if (flashLightRef.current) {
          flashLightRef.current.position.copy(idleBurst.pos);
          flashLightRef.current.color = idleBurst.color;
          flashLightRef.current.intensity = 2.4;
        }
      }
    }

    // Update active distant bursts
    burstsRef.current.forEach((burst, idx) => {
      if (!burst.active) return;
      const age = time - burst.startTime;
      if (age > burst.duration) {
        burst.active = false;
        return;
      }

      const pointsMesh = burstPointsRef.current[idx];
      if (pointsMesh) {
        const positions = pointsMesh.geometry.attributes.position.array as Float32Array;
        const decay = 1 - age / burst.duration;

        for (let i = 0; i < 90; i++) {
          burst.velocities[i * 3 + 1] -= 9.8 * 0.016 * 0.2; // slight gravity
          positions[i * 3] += burst.velocities[i * 3] * 0.016;
          positions[i * 3 + 1] += burst.velocities[i * 3 + 1] * 0.016;
          positions[i * 3 + 2] += burst.velocities[i * 3 + 2] * 0.016;
        }
        pointsMesh.geometry.attributes.position.needsUpdate = true;
        (pointsMesh.material as THREE.PointsMaterial).opacity = Math.max(0, decay);
      }
    });

    // Fade flash light
    if (flashLightRef.current && flashLightRef.current.intensity > 0) {
      flashLightRef.current.intensity *= 0.92;
    }
  });

  return (
    <group>
      {/* ==============================================================
          1. FESTIVE DIWALI EVENING SKY DOME & TWILIGHT GRADIENT
          ============================================================== */}
      {/* Sky Sphere */}
      <mesh position={[0, 10, 6]}>
        <sphereGeometry args={[95, 32, 24]} />
        <meshBasicMaterial color="#0A0F26" side={THREE.BackSide} />
      </mesh>

      {/* Atmospheric Twilight Horizon Haze Cylinder (Warm Amber-Indigo Glow) */}
      <mesh position={[0, 4, 6]}>
        <cylinderGeometry args={[90, 92, 24, 32, 1, true]} />
        <meshBasicMaterial
          color="#2E1828"
          side={THREE.BackSide}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Auspicious Golden Crescent Moon */}
      <group position={[28, 44, -22]} rotation={[0, -0.6, 0.4]}>
        {/* Glowing Moon Sphere */}
        <mesh>
          <sphereGeometry args={[3.2, 24, 24]} />
          <meshBasicMaterial color="#FFF5DE" />
        </mesh>
        {/* Shadow Mask for Crescent */}
        <mesh position={[-1.1, 0.25, 0.7]}>
          <sphereGeometry args={[3.1, 24, 24]} />
          <meshBasicMaterial color="#0A0F26" />
        </mesh>
        {/* Soft Golden Moon Halo Glow */}
        <mesh>
          <sphereGeometry args={[4.2, 16, 16]} />
          <meshBasicMaterial color="#FFE8B5" transparent opacity={0.18} />
        </mesh>
        <pointLight color="#FFE5B4" intensity={1.2} distance={85} decay={2} />
      </group>

      {/* Twinkling Starfield */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[starColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          vertexColors
          transparent
          opacity={0.88}
          sizeAttenuation
        />
      </points>

      {/* Atmospheric Flash Light for Distant Bursts */}
      <pointLight
        ref={flashLightRef}
        position={[0, 30, 0]}
        color="#FFD700"
        intensity={0}
        distance={95}
        decay={2}
      />

      {/* ==============================================================
          2. DISTANT HAVELI SKYLINE & LIT ROOFTOPS
          ============================================================== */}
      {distantBuildings.map((b, i) => (
        <group
          key={`distant-bldg-${i}`}
          position={[b.x, b.h / 2, b.z]}
          rotation={[0, b.rotation, 0]}
        >
          {/* Main Building Block */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              color={b.color}
              roughness={0.8}
              metalness={0.05}
            />
          </mesh>

          {/* Glowing Windows */}
          {b.windows.map((w, wi) => (
            <mesh key={`w-${wi}`} position={[w.x, w.y, w.z]}>
              <planeGeometry args={[1.0, 1.4]} />
              <meshBasicMaterial color="#FFB84D" />
            </mesh>
          ))}

          {/* Rooftop Parapet Line of Fairy Lights / Diyas */}
          <group position={[0, b.h / 2 + 0.1, b.d / 2]}>
            {[-b.w * 0.4, 0, b.w * 0.4].map((lx, li) => (
              <mesh key={`diya-${li}`} position={[lx, 0.05, 0]}>
                <sphereGeometry args={[0.1, 6, 6]} />
                <meshBasicMaterial color="#FF9900" />
              </mesh>
            ))}
          </group>

          {/* Rajput Chhatri (Octagonal Pavilion Dome) on Selected Rooftops */}
          {b.hasChhatri && (
            <group position={[0, b.h / 2, 0]}>
              {/* 4 Chhatri Pillars */}
              {[-1.2, 1.2].map((cx, ci) =>
                [-1.2, 1.2].map((cz, cj) => (
                  <mesh key={`cp-${ci}-${cj}`} position={[cx, 1.0, cz]}>
                    <cylinderGeometry args={[0.08, 0.1, 2.0, 8]} />
                    <meshStandardMaterial color="#A26242" roughness={0.7} />
                  </mesh>
                ))
              )}
              {/* Chhatri Cornice */}
              <mesh position={[0, 2.05, 0]}>
                <boxGeometry args={[3.0, 0.15, 3.0]} />
                <meshStandardMaterial color="#8F4B23" roughness={0.7} />
              </mesh>
              {/* Chhatri Fluted Dome */}
              <mesh position={[0, 2.8, 0]}>
                <sphereGeometry args={[1.4, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                <meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.3} />
              </mesh>
              {/* Kalash Golden Finial & Spire */}
              <mesh position={[0, 3.7, 0]}>
                <cylinderGeometry args={[0.02, 0.12, 0.8, 8]} />
                <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* Temple Shikhara Spire in the Far Distance */}
      <group position={[-52, 0, -42]}>
        {/* Temple Base */}
        <mesh position={[0, 6, 0]}>
          <boxGeometry args={[12, 12, 12]} />
          <meshStandardMaterial color="#7B3F21" roughness={0.75} />
        </mesh>
        {/* Tiered Nagara Shikhara */}
        <mesh position={[0, 18, 0]}>
          <coneGeometry args={[5.5, 14, 12]} />
          <meshStandardMaterial color="#B87333" roughness={0.65} metalness={0.2} />
        </mesh>
        {/* Amalaka Disc */}
        <mesh position={[0, 25.5, 0]}>
          <cylinderGeometry args={[1.8, 1.8, 0.8, 16]} />
          <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Golden Kalash & Temple Dhwaja (Saffron Flag) */}
        <mesh position={[0, 27, 0]}>
          <cylinderGeometry args={[0.05, 0.35, 1.8, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
        </mesh>
        <pointLight position={[0, 20, 0]} color="#FF9900" intensity={2.8} distance={60} decay={2} />
      </group>

      {/* Hanging Akash Kandil / Akashdeep Lanterns in Mid-Sky */}
      {[-16, 16].map((kx, ki) => (
        <group key={`kandil-${ki}`} position={[kx, 7.5, 8]}>
          {/* Hexagonal Star Lantern Body */}
          <mesh>
            <octahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial
              color={ki === 0 ? '#E91E63' : '#FF9800'}
              emissive={ki === 0 ? '#E91E63' : '#FF9800'}
              emissiveIntensity={2.2}
              roughness={0.2}
            />
          </mesh>
          {/* Trailing Paper Tails (Tassels) */}
          {[-0.15, 0, 0.15].map((tx, ti) => (
            <mesh key={`tail-${ti}`} position={[tx, -0.45, 0]}>
              <cylinderGeometry args={[0.015, 0.02, 0.55, 6]} />
              <meshBasicMaterial color="#FFD700" />
            </mesh>
          ))}
          <pointLight color="#FF9800" intensity={1.4} distance={9} decay={2} />
        </group>
      ))}

      {/* ==============================================================
          3. DISTANT AERIAL FIREWORKS BURSTS
          ============================================================== */}
      <group ref={fireworksGroupRef}>
        {burstsRef.current.map((burst, i) => (
          <points
            key={`burst-${i}`}
            ref={el => {
              if (el) burstPointsRef.current[i] = el;
            }}
          >
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[burst.particles, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.45}
              color={burst.color}
              transparent
              opacity={0}
              sizeAttenuation
            />
          </points>
        ))}
      </group>

      {/* Global Warm Festive Ambient Illumination (Ensures No Pitch Black Areas) */}
      <ambientLight intensity={1.25} color="#FFE6CA" />
      <directionalLight
        position={[25, 42, -18]}
        intensity={1.0}
        color="#FFF0DB"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={['#FFE4C4', '#381D0E', 0.85]} />
    </group>
  );
};

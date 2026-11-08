import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';
import { registerInteractive, unregisterInteractive } from '../controls/FirstPersonController';
import { touchInput } from '../controls/MobileVirtualControls';
import { ScreenRaycaster } from '../utils/ScreenRaycaster';
import {
  rangoliEngine,
} from '../utils/RangoliCanvasEngine';
import {
  ALL_18_RANGOLI_COLORS,
  currentRangoliConfig,
} from '../../components/hud/RangoliToolbar';

export interface PowderBowlSlot {
  id: string;
  name: string;
  color: string;
  tier: 1 | 2;
  angle: number; // in radians
  worldPos: [number, number, number];
}

export const CourtyardRangoli: React.FC = () => {
  const { camera, gl } = useThree();
  const heldPowderColor = useGameState(s => s.heldPowderColor);
  const heldPowderName = useGameState(s => s.heldPowderName);
  const handItem = useGameState(s => s.handItem);
  const pickUpPowder = useGameState(s => s.pickUpPowder);
  const litDiyas = useGameState(s => s.litDiyas);

  const canvasTexture = useMemo(() => rangoliEngine.getTexture(), []);
  const canvasMeshRef = useRef<THREE.Mesh>(null);
  const cursorRingRef = useRef<THREE.Mesh>(null);

  // Courtyard center for Rangoli
  const RANGOLI_CENTER_Z = 5.0;
  const RANGOLI_RADIUS = 2.0;
  const RANGOLI_SURFACE_Y = 0.046;

  // Active drawing tracking
  const isDrawing = useRef(false);
  const lastUV = useRef<THREE.Vector2 | null>(null);
  const pointerPos = useRef(new THREE.Vector3(0, RANGOLI_SURFACE_Y + 0.002, RANGOLI_CENTER_Z));
  const pointerInside = useRef(false);
  const lastSoundTime = useRef(0);

  // Falling powder particle stream
  const particleCount = 45;
  const powderGeoRef = useRef<THREE.BufferGeometry>(null);
  const particlePositions = useMemo(() => new Float32Array(particleCount * 3), []);
  const particleVelocities = useMemo(() => new Float32Array(particleCount * 3), []);
  const particleLifetimes = useMemo(() => new Float32Array(particleCount), []);

  // 18 Powder Bowls distributed evenly across 2 tiers of a semicircular carved teak rack
  const powderSlots: PowderBowlSlot[] = useMemo(() => {
    const tier1Angles = [-1.15, -0.86, -0.57, -0.28, 0.0, 0.28, 0.57, 0.86, 1.15];
    const tier2Angles = [-1.15, -0.86, -0.57, -0.28, 0.0, 0.28, 0.57, 0.86, 1.15];

    return ALL_18_RANGOLI_COLORS.map((col, idx) => {
      const isTier1 = idx < 9;
      const angle = isTier1 ? tier1Angles[idx] : tier2Angles[idx - 9];
      const radius = isTier1 ? 2.38 : 2.70;
      const y = isTier1 ? 0.12 : 0.26;

      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      return {
        id: col.id,
        name: col.name,
        color: col.hex,
        tier: isTier1 ? 1 : 2,
        angle,
        worldPos: [x, y, z + RANGOLI_CENTER_Z],
      };
    });
  }, []);

  // Register interactive triggers for the 18 physical bowls
  useEffect(() => {
    powderSlots.forEach(slot => {
      registerInteractive({
        id: `pwd-bowl-${slot.id}`,
        label: `Take ${slot.name} Powder 🎨`,
        subtext:
          heldPowderColor === slot.color
            ? 'Currently held in your hands'
            : 'Click or [E] to take (auto-returns previous bowl)',
        position: new THREE.Vector3(...slot.worldPos),
        maxDistance: 2.6,
        action: () => {
          pickUpPowder(slot.color, slot.name);
          audioManager.playPowderPickup();
        },
      });
    });

    // Central canvas inspection trigger
    registerInteractive({
      id: 'rangoli-canvas-inspect',
      label:
        handItem === 'powder'
          ? `Draw with ${heldPowderName || 'Powder'} (Pointer / Touch) ✨`
          : 'Courtyard Rangoli Studio 🪷',
      subtext:
        handItem === 'powder'
          ? 'Click & drag on ground to sprinkle intricate patterns'
          : 'Pick up any of the 18 powder bowls to create custom Rangoli art',
      position: new THREE.Vector3(0, 0.1, RANGOLI_CENTER_Z),
      maxDistance: 2.8,
      action: () => {
        if (handItem !== 'powder') {
          pickUpPowder('#FF9933', 'Kesari Saffron');
          audioManager.playPowderPickup();
        }
      },
    });

    return () => {
      powderSlots.forEach(slot => unregisterInteractive(`pwd-bowl-${slot.id}`));
      unregisterInteractive('rangoli-canvas-inspect');
    };
  }, [powderSlots, handItem, heldPowderColor, heldPowderName, pickUpPowder]);

  // Spawn fine falling powder particle stream directly above pointer hit position
  const spawnFallingPowder = (hitPoint: THREE.Vector3) => {
    for (let i = 0; i < 4; i++) {
      const idx = Math.floor(Math.random() * particleCount);
      particlePositions[idx * 3] = hitPoint.x + (Math.random() - 0.5) * 0.04;
      particlePositions[idx * 3 + 1] = hitPoint.y + 0.16 + Math.random() * 0.08;
      particlePositions[idx * 3 + 2] = hitPoint.z + (Math.random() - 0.5) * 0.04;

      particleVelocities[idx * 3] = (Math.random() - 0.5) * 0.05;
      particleVelocities[idx * 3 + 1] = -0.5 - Math.random() * 0.4;
      particleVelocities[idx * 3 + 2] = (Math.random() - 0.5) * 0.05;

      particleLifetimes[idx] = 1.0;
    }
    if (powderGeoRef.current) {
      powderGeoRef.current.attributes.position.needsUpdate = true;
    }
  };

  // Precision ScreenRaycaster pointer listeners
  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerAction = (clientX: number, clientY: number, isDownAction: boolean) => {
      const hit = ScreenRaycaster.raycastRangoli(
        clientX,
        clientY,
        canvas,
        camera,
        canvasMeshRef.current,
        0,
        RANGOLI_CENTER_Z,
        RANGOLI_SURFACE_Y,
        RANGOLI_RADIUS
      );

      if (hit && hit.inside) {
        pointerPos.current.set(hit.hitPoint.x, RANGOLI_SURFACE_Y + 0.002, hit.hitPoint.z);
        pointerInside.current = true;

        if (cursorRingRef.current) {
          cursorRingRef.current.position.set(hit.hitPoint.x, RANGOLI_SURFACE_Y + 0.003, hit.hitPoint.z);
          cursorRingRef.current.visible = true;
        }

        if (isDownAction || isDrawing.current) {
          if (!isDrawing.current) {
            // Start stroke
            isDrawing.current = true;
            touchInput.suspended = true;
            lastUV.current = hit.uv.clone();

            if (currentRangoliConfig.toolMode === 'petal_stamp' && currentRangoliConfig.petalType) {
              rangoliEngine.stampPetals(hit.uv.x, hit.uv.y, currentRangoliConfig.petalType, currentRangoliConfig.symmetry);
              audioManager.playPowderSprinkle();
            } else {
              rangoliEngine.beginStroke(hit.uv.x, hit.uv.y, currentRangoliConfig);
              rangoliEngine.applyPointOrStroke(hit.uv.x, hit.uv.y, currentRangoliConfig);
              audioManager.playPowderSprinkle();
            }
            spawnFallingPowder(hit.hitPoint);
          } else {
            // Continuous interpolated stroke
            if (lastUV.current) {
              const points = ScreenRaycaster.interpolateUV(lastUV.current, hit.uv, 0.006);
              for (const pt of points) {
                rangoliEngine.applyPointOrStroke(pt.x, pt.y, currentRangoliConfig);
              }
              lastUV.current.copy(hit.uv);
            } else {
              rangoliEngine.applyPointOrStroke(hit.uv.x, hit.uv.y, currentRangoliConfig);
              lastUV.current = hit.uv.clone();
            }

            spawnFallingPowder(hit.hitPoint);

            // Throttled sound
            const now = performance.now();
            if (now - lastSoundTime.current > 160) {
              audioManager.playPowderSprinkle();
              lastSoundTime.current = now;
            }
          }
        }
      } else {
        pointerInside.current = false;
        if (cursorRingRef.current) {
          cursorRingRef.current.visible = false;
        }
        if (isDrawing.current) {
          isDrawing.current = false;
          touchInput.suspended = false;
          rangoliEngine.endStroke();
          lastUV.current = null;
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return; // only left click
      if (handItem === 'powder') {
        handlePointerAction(e.clientX, e.clientY, true);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (handItem === 'powder') {
        handlePointerAction(e.clientX, e.clientY, false);
      }
    };

    const onPointerUp = () => {
      if (isDrawing.current) {
        isDrawing.current = false;
        touchInput.suspended = false;
        rangoliEngine.endStroke();
        lastUV.current = null;
      }
    };

    // Mobile touch listeners with exact coordinates
    const onTouchStart = (e: TouchEvent) => {
      if (handItem === 'powder' && e.touches.length > 0) {
        const touch = e.touches[0];
        handlePointerAction(touch.clientX, touch.clientY, true);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (handItem === 'powder' && e.touches.length > 0) {
        const touch = e.touches[0];
        handlePointerAction(touch.clientX, touch.clientY, false);
      }
    };

    const onTouchEnd = () => {
      if (isDrawing.current) {
        isDrawing.current = false;
        touchInput.suspended = false;
        rangoliEngine.endStroke();
        lastUV.current = null;
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handItem, camera, gl]);

  // Frame update for falling powder particles
  useFrame((_, delta) => {
    if (!powderGeoRef.current) return;
    const positions = powderGeoRef.current.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      if (particleLifetimes[i] > 0) {
        particleLifetimes[i] -= delta * 3.5;
        positions[i * 3] += particleVelocities[i * 3] * delta;
        positions[i * 3 + 1] += particleVelocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += particleVelocities[i * 3 + 2] * delta;

        // Ground contact clamp
        if (positions[i * 3 + 1] <= RANGOLI_SURFACE_Y) {
          positions[i * 3 + 1] = RANGOLI_SURFACE_Y;
          particleLifetimes[i] = 0;
        }
      }
    }
    powderGeoRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ==============================================================
          1. RAISED CIRCULAR CARVED SANDSTONE PLINTH IN COURTYARD CENTER
          ============================================================== */}
      <mesh position={[0, 0.02, RANGOLI_CENTER_Z]} receiveShadow>
        <cylinderGeometry args={[2.08, 2.15, 0.04, 48]} />
        <meshStandardMaterial color="#A6583A" roughness={0.75} />
      </mesh>
      {/* Sacred Brass Inlay Trim Ring */}
      <mesh position={[0, 0.042, RANGOLI_CENTER_Z]}>
        <torusGeometry args={[2.05, 0.016, 10, 48]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.2} />
      </mesh>

      {/* ==============================================================
          2. DYNAMIC HIGH-RESOLUTION RANGOLI CANVASTEXTURE SURFACE
          Draw freely anywhere with pointer or touch!
          ============================================================== */}
      <mesh
        ref={canvasMeshRef}
        position={[0, RANGOLI_SURFACE_Y, RANGOLI_CENTER_Z]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[RANGOLI_RADIUS, 64]} />
        <meshStandardMaterial
          map={canvasTexture}
          roughness={0.92}
          metalness={0.05}
        />
      </mesh>

      {/* Real-time 3D Golden Pointer Cursor Reticle on the Rangoli Surface */}
      <mesh
        ref={cursorRingRef}
        position={[0, RANGOLI_SURFACE_Y + 0.003, RANGOLI_CENTER_Z]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <ringGeometry args={[0.02, 0.035, 24]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.8} />
      </mesh>

      {/* Falling 3D Powder Particles */}
      <points>
        <bufferGeometry ref={powderGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.018}
          color={heldPowderColor || '#FF9933'}
          transparent
          opacity={0.88}
        />
      </points>

      {/* ==============================================================
          3. PHYSICAL CARVED TEAK POWDER STORAGE RACK (18 BOWL SLOTS)
          ============================================================== */}
      <group position={[0, 0, RANGOLI_CENTER_Z]}>
        {/* Tier 1 Curved Teak Beam */}
        <mesh position={[0, 0.05, 1.85]} receiveShadow>
          <cylinderGeometry args={[2.48, 2.52, 0.09, 32, 1, false, Math.PI * 0.12, Math.PI * 0.76]} />
          <meshStandardMaterial color="#4A2810" roughness={0.7} />
        </mesh>
        {/* Tier 2 Elevated Teak Beam */}
        <mesh position={[0, 0.18, 2.05]} receiveShadow>
          <cylinderGeometry args={[2.80, 2.84, 0.17, 32, 1, false, Math.PI * 0.12, Math.PI * 0.76]} />
          <meshStandardMaterial color="#3D1F0A" roughness={0.7} />
        </mesh>

        {/* 18 Individual Physical Brass Powder Bowls */}
        {powderSlots.map(slot => {
          const isHeld = (heldPowderColor || '').toLowerCase() === slot.color.toLowerCase();
          const [bx, by, bz] = slot.worldPos;
          const localZ = bz - RANGOLI_CENTER_Z;

          return (
            <group key={slot.id} position={[bx, by, localZ]}>
              {/* Carved Teak Bowl Pedestal */}
              <mesh position={[0, -0.04, 0]}>
                <cylinderGeometry args={[0.075, 0.085, 0.06, 14]} />
                <meshStandardMaterial color="#301808" roughness={0.8} />
              </mesh>

              {/* Brass Placement Ring */}
              <mesh position={[0, -0.008, 0]}>
                <torusGeometry args={[0.068, 0.006, 8, 16]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.25} />
              </mesh>

              {/* Brass Identification Plaque */}
              <mesh position={[0, -0.035, 0.08]} rotation={[-0.35, 0, 0]}>
                <boxGeometry args={[0.09, 0.024, 0.004]} />
                <meshStandardMaterial color="#DAA520" metalness={0.92} roughness={0.2} />
              </mesh>

              {/* Physical Bowl & Powder (Auto-returns when another color is selected) */}
              {!isHeld ? (
                <group>
                  {/* Hammered Heavy Brass Bowl */}
                  <mesh castShadow position={[0, 0.02, 0]}>
                    <cylinderGeometry args={[0.068, 0.045, 0.048, 16]} />
                    <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.22} />
                  </mesh>
                  {/* Flared Engraved Rim */}
                  <mesh position={[0, 0.044, 0]}>
                    <torusGeometry args={[0.07, 0.006, 8, 18]} />
                    <meshStandardMaterial color="#FFD700" metalness={0.96} roughness={0.16} />
                  </mesh>
                  {/* Vibrant Powder Mound */}
                  <mesh position={[0, 0.038, 0]}>
                    <sphereGeometry args={[0.062, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                    <meshStandardMaterial color={slot.color} roughness={0.94} />
                  </mesh>
                </group>
              ) : (
                /* Glowing Ring indicating bowl is currently lifted in hand */
                <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.04, 0.07, 16]} />
                  <meshBasicMaterial color="#FFD700" transparent opacity={0.65} />
                </mesh>
              )}
            </group>
          );
        })}
      </group>

      {/* ==============================================================
          4. WORKSTATION ARTISAN ACCESSORIES & TOOLS
          ============================================================== */}
      {/* A. Stencil Rack Stand */}
      <group position={[-2.2, 0.15, RANGOLI_CENTER_Z + 0.4]} rotation={[0, 0.6, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.25, 0.08]} />
          <meshStandardMaterial color="#4A2810" roughness={0.7} />
        </mesh>
        {/* Brass Stencil Plates */}
        {[-0.08, 0, 0.08].map((ox, i) => (
          <mesh key={`st-plate-${i}`} position={[ox, 0.05, 0.03]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.06, 0.16, 0.004]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* B. Flower Petal Woven Baskets */}
      <group position={[2.2, 0.08, RANGOLI_CENTER_Z + 0.4]} rotation={[0, -0.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.11, 0.1, 16]} />
          <meshStandardMaterial color="#8D6E63" roughness={0.9} />
        </mesh>
        {/* Orange Marigold Petals */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.15, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#FF6F00" roughness={0.8} />
        </mesh>
      </group>

      {/* C. Perimeter Auspicious Terracotta Diyas (8 lamps) */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dx = Math.cos(angle) * 1.96;
        const dz = Math.sin(angle) * 1.96;
        const diyaId = `rangoli-perimeter-diya-${i}`;
        const isLit = litDiyas[diyaId] ?? true;

        return (
          <group key={diyaId} position={[dx, RANGOLI_SURFACE_Y, RANGOLI_CENTER_Z + dz]}>
            {/* Clay Diya Bowl */}
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.02, 0.03, 12]} />
              <meshStandardMaterial color="#C86432" roughness={0.85} />
            </mesh>
            {/* Cotton Wick */}
            <mesh position={[0.02, 0.02, 0]}>
              <cylinderGeometry args={[0.003, 0.003, 0.015, 6]} />
              <meshStandardMaterial color="#FFF8DC" />
            </mesh>
            {/* Auspicious Warm Flame */}
            {isLit && (
              <group position={[0.02, 0.035, 0]}>
                <mesh>
                  <sphereGeometry args={[0.012, 8, 8]} />
                  <meshBasicMaterial color="#FFD700" />
                </mesh>
                <pointLight color="#FFA500" intensity={0.45} distance={1.8} decay={2} />
              </group>
            )}
          </group>
        );
      })}

      {/* Warm Illumination overhead for Rangoli Workspace */}
      <pointLight position={[0, 2.6, RANGOLI_CENTER_Z]} color="#FFE082" intensity={2.8} distance={7.0} decay={2} />
    </group>
  );
};

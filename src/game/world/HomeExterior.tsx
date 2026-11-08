import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

export const HomeExterior: React.FC = () => {
  const { houseDoorOpen, toggleHouseDoor, playerPosition, setActivePrompt } = useGameState();
  const doorPivotRef = useRef<THREE.Group>(null);

  // Animate door opening angle
  useFrame((_, delta) => {
    if (!doorPivotRef.current) return;
    const targetRotation = houseDoorOpen ? -Math.PI * 0.55 : 0;
    doorPivotRef.current.rotation.y = THREE.MathUtils.lerp(
      doorPivotRef.current.rotation.y,
      targetRotation,
      delta * 4
    );

    // Interaction prompt distance check: Door is at [0, 0]
    const distToDoor = Math.hypot(playerPosition[0] - 0, playerPosition[2] - 0.2);
    if (distToDoor < 2.5) {
      setActivePrompt({
        id: 'door-toggle',
        label: houseDoorOpen ? 'Close Front Door' : 'Open Front Door',
        subtext: 'Press [E] or Tap',
        action: () => {
          audioManager.playDoorToggle();
          toggleHouseDoor();
        },
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* House Front Façade Wall (Ivory/Terracotta textured Indian house) */}
      <mesh position={[-8.5, 3, 0]} receiveShadow castShadow>
        <boxGeometry args={[13, 6, 0.4]} />
        <meshStandardMaterial color="#E8D5B5" roughness={0.7} />
      </mesh>
      <mesh position={[8.5, 3, 0]} receiveShadow castShadow>
        <boxGeometry args={[13, 6, 0.4]} />
        <meshStandardMaterial color="#E8D5B5" roughness={0.7} />
      </mesh>
      {/* Wall segment above doorway */}
      <mesh position={[0, 4.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[4, 2.8, 0.4]} />
        <meshStandardMaterial color="#D4A373" roughness={0.6} />
      </mesh>

      {/* Decorative Traditional Indian Entrance Portal / Archway */}
      <group position={[0, 0, 0]}>
        {/* Left carved pillar */}
        <mesh position={[-1.6, 1.8, 0.1]} castShadow>
          <boxGeometry args={[0.4, 3.6, 0.4]} />
          <meshStandardMaterial color="#8B4513" roughness={0.5} />
        </mesh>
        {/* Right carved pillar */}
        <mesh position={[1.6, 1.8, 0.1]} castShadow>
          <boxGeometry args={[0.4, 3.6, 0.4]} />
          <meshStandardMaterial color="#8B4513" roughness={0.5} />
        </mesh>
        {/* Lintel Beam */}
        <mesh position={[0, 3.4, 0.1]} castShadow>
          <boxGeometry args={[3.8, 0.35, 0.5]} />
          <meshStandardMaterial color="#6A2E05" roughness={0.5} />
        </mesh>

        {/* Festive Marigold Garland (Toran) over doorway */}
        <group position={[0, 3.15, 0.25]}>
          {[...Array(15)].map((_, i) => (
            <mesh key={i} position={[(i - 7) * 0.22, Math.sin((i / 14) * Math.PI) * -0.15, 0]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#FF8C00' : '#FFD700'}
                roughness={0.4}
                emissive={i % 2 === 0 ? '#FF4500' : '#FFA500'}
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Carved Teak Wooden Front Door (Pivotable) */}
      <group position={[-1.2, 0, 0]} ref={doorPivotRef}>
        <mesh position={[1.2, 1.6, 0]} castShadow>
          <boxGeometry args={[2.4, 3.2, 0.1]} />
          <meshStandardMaterial color="#4A2306" roughness={0.4} />
        </mesh>
        {/* Brass Knocker / Handle */}
        <mesh position={[2.0, 1.5, 0.08]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.16, 12]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Decorative auspicious brass sun emblem */}
        <mesh position={[1.2, 2.3, 0.06]}>
          <circleGeometry args={[0.22, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Front Steps (Entrance Porch) */}
      <mesh position={[0, 0.12, 0.8]} receiveShadow>
        <boxGeometry args={[4.2, 0.24, 1.4]} />
        <meshStandardMaterial color="#BC8F8F" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.24, 0.4]} receiveShadow>
        <boxGeometry args={[3.8, 0.24, 0.8]} />
        <meshStandardMaterial color="#A0522D" roughness={0.6} />
      </mesh>

      {/* Windows with Warm Lighting on Left & Right Wings */}
      <group position={[-5, 2.2, 0]}>
        {/* Window frame */}
        <mesh castShadow>
          <boxGeometry args={[2, 2, 0.2]} />
          <meshStandardMaterial color="#4A2306" roughness={0.5} />
        </mesh>
        {/* Glowing glass */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.7, 1.7]} />
          <meshBasicMaterial color="#FFB703" />
        </mesh>
        {/* Warm Point Light escaping window */}
        <pointLight position={[0, 0, 0.5]} color="#FFA500" intensity={1.4} distance={6} decay={2} />
      </group>

      <group position={[5, 2.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2, 2, 0.2]} />
          <meshStandardMaterial color="#4A2306" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.7, 1.7]} />
          <meshBasicMaterial color="#FFB703" />
        </mesh>
        <pointLight position={[0, 0, 0.5]} color="#FFA500" intensity={1.4} distance={6} decay={2} />
      </group>

      {/* Traditional Clay Diyas lining the entrance steps */}
      <group position={[0, 0, 0]}>
        {[-1.6, -1.1, 1.1, 1.6].map((x, idx) => (
          <group key={idx} position={[x, 0.26, 0.7]}>
            {/* Diya Clay Pot */}
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.06, 0.06, 12]} />
              <meshStandardMaterial color="#8B4513" roughness={0.7} />
            </mesh>
            {/* Glowing Flame */}
            <mesh position={[0, 0.06, 0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color="#FF4500" />
            </mesh>
            <pointLight position={[0, 0.1, 0]} color="#FFA500" intensity={0.9} distance={2.5} decay={2} />
          </group>
        ))}
      </group>

      {/* House Roof Eaves with Hanging Fairy Lights */}
      <mesh position={[0, 6.2, 0.4]} castShadow>
        <boxGeometry args={[31, 0.5, 2.2]} />
        <meshStandardMaterial color="#8B2500" roughness={0.5} />
      </mesh>
      {/* String Lights on roof edge */}
      <group position={[0, 5.9, 1.4]}>
        {[...Array(28)].map((_, i) => (
          <mesh key={i} position={[(i - 13.5) * 1.05, (i % 2) * -0.1, 0]}>
            <sphereGeometry args={[0.045, 6, 6]} />
            <meshBasicMaterial color={i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FF4500' : '#00E5FF'} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

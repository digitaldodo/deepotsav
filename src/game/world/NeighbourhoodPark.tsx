import React from 'react';
import * as THREE from 'three';

export const NeighbourhoodPark: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Paved Street / Festive Pathway (Z: 14 to 24) */}
      <mesh position={[0, 0.01, 19]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 10]} />
        <meshStandardMaterial color="#4A4E69" roughness={0.8} />
      </mesh>

      {/* Street Edge Curbs */}
      {[-3.1, 3.1].map((x, i) => (
        <mesh key={i} position={[x, 0.08, 19]} receiveShadow>
          <boxGeometry args={[0.2, 0.16, 10]} />
          <meshStandardMaterial color="#9A8C98" roughness={0.7} />
        </mesh>
      ))}

      {/* Street Lamps on Pathway with Hanging Torans */}
      {[-3.8, 3.8].map((x, i) => (
        <group key={i} position={[x, 0, 19]}>
          {/* Cast Iron Pole */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.1, 4.4, 8]} />
            <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.7} />
          </mesh>
          {/* Classical Victorian-Indian Lamp Lantern */}
          <mesh position={[0, 4.4, 0]}>
            <octahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFA500"
              emissiveIntensity={2.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* Single consolidated street lamp light */}
      <pointLight position={[0, 4.6, 19]} color="#FFA500" intensity={2.0} distance={14} decay={2} />

      {/* Neighbouring Decorated Houses in Distance on Left & Right */}
      <group position={[-16, 0, 22]}>
        <mesh position={[0, 3.5, 0]} castShadow>
          <boxGeometry args={[10, 7, 10]} />
          <meshStandardMaterial color="#3D3A45" roughness={0.8} />
        </mesh>
        {/* Glowing windows */}
        <mesh position={[4.6, 2.5, 0]}>
          <planeGeometry args={[1.5, 1.8]} />
          <meshStandardMaterial
            color="#FFB703"
            emissive="#FF8C00"
            emissiveIntensity={1.8}
          />
        </mesh>
      </group>

      <group position={[16, 0, 22]}>
        <mesh position={[0, 3.5, 0]} castShadow>
          <boxGeometry args={[10, 7, 10]} />
          <meshStandardMaterial color="#423E37" roughness={0.8} />
        </mesh>
        <mesh position={[-4.6, 2.5, 0]}>
          <planeGeometry args={[1.5, 1.8]} />
          <meshStandardMaterial
            color="#FFB703"
            emissive="#FF8C00"
            emissiveIntensity={1.8}
          />
        </mesh>
      </group>

      {/* Community Park Grounds (Z: 24 to 42) */}
      <mesh position={[0, 0, 33]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[46, 18]} />
        <meshStandardMaterial color="#1E523A" roughness={0.85} />
      </mesh>

      {/* Curving Park Stone Walkways */}
      <mesh position={[0, 0.015, 33]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.2, 18]} />
        <meshStandardMaterial color="#797D62" roughness={0.8} />
      </mesh>

      {/* Park Benches */}
      {[-5, 5].map((x, i) => (
        <group key={i} position={[x, 0, 30]} rotation={[0, x > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
          {/* Bench seat */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[2.0, 0.08, 0.5]} />
            <meshStandardMaterial color="#5C3D2E" roughness={0.5} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.85, -0.22]} castShadow>
            <boxGeometry args={[2.0, 0.45, 0.06]} />
            <meshStandardMaterial color="#5C3D2E" roughness={0.5} />
          </mesh>
          {/* Metal Legs */}
          {[-0.8, 0.8].map((lx, j) => (
            <mesh key={j} position={[lx, 0.25, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
              <meshStandardMaterial color="#1B1B1B" metalness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Gulmohar & Banyan Trees in Park */}
      {[
        [-10, 0, 28],
        [10, 0, 28],
        [-14, 0, 37],
        [14, 0, 37],
        [0, 0, 39],
      ].map(([tx, ty, tz], i) => (
        <group key={i} position={[tx, ty, tz]}>
          {/* Trunk */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.5, 5, 10]} />
            <meshStandardMaterial color="#4A2810" roughness={0.9} />
          </mesh>
          {/* Lush Foliage Canopy */}
          <mesh position={[0, 5.2, 0]} castShadow>
            <sphereGeometry args={[2.2, 12, 12]} />
            <meshStandardMaterial color="#1B4D28" roughness={0.8} />
          </mesh>
          <mesh position={[0.6, 6.2, 0.4]} castShadow>
            <sphereGeometry args={[1.6, 10, 10]} />
            <meshStandardMaterial color="#245F33" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Traditional Festive Hanging Lanterns (Akash Kandil) hanging from Park Trees */}
      {[
        [-8.5, 3.8, 28],
        [8.5, 3.8, 28],
        [0, 4.2, 36],
      ].map(([lx, ly, lz], i) => (
        <group key={i} position={[lx, ly, lz]}>
          {/* Faceted Lantern Body */}
          <mesh castShadow>
            <octahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#E63946' : i % 3 === 1 ? '#FFB703' : '#9D4EDD'}
              emissive={i % 3 === 0 ? '#E63946' : i % 3 === 1 ? '#FFB703' : '#9D4EDD'}
              emissiveIntensity={2.5}
            />
          </mesh>
          {/* Hanging silk ribbons */}
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.08, 0.18, 0.5, 8]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

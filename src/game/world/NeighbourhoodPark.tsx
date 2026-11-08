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
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
          </mesh>
          <pointLight position={[0, 4.4, 0]} color="#FFA500" intensity={2.2} distance={10} decay={2} />
        </group>
      ))}

      {/* Neighbouring Decorated Houses in Distance on Left & Right */}
      <group position={[-16, 0, 22]}>
        <mesh position={[0, 3.5, 0]} castShadow>
          <boxGeometry args={[10, 7, 10]} />
          <meshStandardMaterial color="#3D3A45" roughness={0.8} />
        </mesh>
        {/* Glowing windows */}
        <mesh position={[4.6, 2.5, 0]}>
          <planeGeometry args={[1.5, 1.8]} />
          <meshBasicMaterial color="#FFB703" />
        </mesh>
        <pointLight position={[4.6, 2.5, 0]} color="#FFA500" intensity={1.2} distance={6} />
      </group>

      <group position={[16, 0, 22]}>
        <mesh position={[0, 3.5, 0]} castShadow>
          <boxGeometry args={[10, 7, 10]} />
          <meshStandardMaterial color="#423E37" roughness={0.8} />
        </mesh>
        <mesh position={[-4.6, 2.5, 0]}>
          <planeGeometry args={[1.5, 1.8]} />
          <meshBasicMaterial color="#FFB703" />
        </mesh>
        <pointLight position={[-4.6, 2.5, 0]} color="#FFA500" intensity={1.2} distance={6} />
      </group>

      {/* Community Park Grounds (Z: 24 to 42) */}
      <mesh position={[0, 0, 33]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[46, 18]} />
        <meshStandardMaterial color="#1B4332" roughness={0.9} />
      </mesh>

      {/* Curving Park Stone Walkways */}
      <mesh position={[0, 0.02, 33]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[5, 7.5, 32]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>

      {/* Park Benches */}
      {[-6, 6].map((x, i) => (
        <group key={i} position={[x, 0, 30]} rotation={[0, i === 0 ? Math.PI / 3 : -Math.PI / 3, 0]}>
          {/* Wood Slats */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[1.8, 0.08, 0.5]} />
            <meshStandardMaterial color="#4A2511" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.85, 0.22]} castShadow>
            <boxGeometry args={[1.8, 0.6, 0.06]} />
            <meshStandardMaterial color="#4A2511" roughness={0.5} />
          </mesh>
          {/* Cast Iron Legs */}
          {[-0.8, 0.8].map((lx, j) => (
            <mesh key={j} position={[lx, 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.44, 8]} />
              <meshStandardMaterial color="#1A1A1A" metalness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Park Trees with Festive Fairy Lanterns */}
      {[
        { x: -9, z: 27, scale: 1.2 },
        { x: 9, z: 27, scale: 1.1 },
        { x: -11, z: 36, scale: 1.4 },
        { x: 11, z: 36, scale: 1.3 },
        { x: 0, z: 39, scale: 1.5 },
      ].map((tree, idx) => (
        <group key={idx} position={[tree.x, 0, tree.z]} scale={tree.scale}>
          {/* Tree Trunk */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.4, 3.6, 8]} />
            <meshStandardMaterial color="#3E2723" roughness={0.9} />
          </mesh>
          {/* Foliage Canopy */}
          <mesh position={[0, 4.2, 0]} castShadow>
            <sphereGeometry args={[1.6, 12, 12]} />
            <meshStandardMaterial color="#081C15" roughness={0.8} />
          </mesh>
          <mesh position={[0, 5.2, 0]} castShadow>
            <sphereGeometry args={[1.2, 10, 10]} />
            <meshStandardMaterial color="#1B4332" roughness={0.8} />
          </mesh>

          {/* Hanging Glowing Paper Lanterns (Kandil / Akash Kandil) */}
          <group position={[0.8, 3.2, 0]}>
            <mesh>
              <octahedronGeometry args={[0.2, 0]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? '#E91E63' : '#FFD700'}
                emissive={idx % 2 === 0 ? '#C2185B' : '#FFA000'}
                emissiveIntensity={0.6}
              />
            </mesh>
            <pointLight
              color={idx % 2 === 0 ? '#FF4081' : '#FFD54F'}
              intensity={0.9}
              distance={4}
              decay={2}
            />
          </group>
        </group>
      ))}
    </group>
  );
};

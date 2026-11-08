import React from 'react';
import * as THREE from 'three';

export const NeighbourhoodPark: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* ==============================================================
          1. FESTIVE PAVED STREET / MOHALLA (Z: 14 to 24)
          ============================================================== */}
      {/* Main Cobblestone / Sandstone Street Pavement */}
      <mesh position={[0, 0.015, 19]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 10]} />
        <meshStandardMaterial color="#5A4E45" roughness={0.75} />
      </mesh>

      {/* Street Edge Stone Curbs with Terracotta Trim */}
      {[-4.1, 4.1].map((x, i) => (
        <mesh key={`curb-${i}`} position={[x, 0.08, 19]} receiveShadow>
          <boxGeometry args={[0.25, 0.16, 10]} />
          <meshStandardMaterial color="#8F5435" roughness={0.7} />
        </mesh>
      ))}

      {/* Street Threshold Rangolis in front of Neighbouring Havelis */}
      {[-4.8, 4.8].map((rx, ri) => (
        <group key={`str-rangoli-${ri}`} position={[rx, 0.02, 19]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.9, 24]} />
            <meshStandardMaterial color="#800020" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.6, 0.85, 24]} />
            <meshStandardMaterial color="#FFB703" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.35, 16]} />
            <meshStandardMaterial color="#0077B6" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Ornate Indian Cast-Iron Street Lamps with Amber Glass Lanterns */}
      {[-4.5, 4.5].map((x, i) => (
        <group key={`lamp-${i}`} position={[x, 0, 19]}>
          {/* Fluted Cast-Iron Base */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.28, 0.8, 12]} />
            <meshStandardMaterial color="#1E232A" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Main Pole */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 4.2, 12]} />
            <meshStandardMaterial color="#1E232A" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Ornate Rajput Bracket Arm */}
          <mesh position={[x > 0 ? -0.35 : 0.35, 4.4, 0]} castShadow>
            <boxGeometry args={[0.7, 0.1, 0.1]} />
            <meshStandardMaterial color="#1E232A" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Amber Glass Lantern Body */}
          <group position={[x > 0 ? -0.7 : 0.7, 4.1, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.22, 0.16, 0.45, 8]} />
              <meshStandardMaterial
                color="#FFB703"
                emissive="#FFA500"
                emissiveIntensity={2.8}
                roughness={0.2}
              />
            </mesh>
            {/* Brass Cap and Finial */}
            <mesh position={[0, 0.28, 0]} castShadow>
              <coneGeometry args={[0.26, 0.18, 8]} />
              <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Warm Street Illumination Lights */}
      <pointLight position={[0, 4.8, 19]} color="#FFA500" intensity={2.6} distance={16} decay={2} />

      {/* ==============================================================
          2. OVERHEAD STREET-CROSSING FESTIVE LIGHT CANOPY (JHALAR)
          ============================================================== */}
      {/* 3 Zig-zagging Strands of Overhead Fairy Lights strung across the Street */}
      {[16, 19, 22].map((sz, si) => (
        <group key={`overstrand-${si}`} position={[0, 5.0, sz]}>
          {[...Array(16)].map((_, li) => {
            const lx = (li - 7.5) * 0.55;
            const ly = Math.sin((li / 15) * Math.PI) * -0.65;
            const colors = ['#FFD700', '#FF3E00', '#00E5FF', '#39FF14', '#FF007F'];
            const c = colors[(li + si * 2) % colors.length];
            return (
              <mesh key={`ostrand-${li}`} position={[lx, ly, 0]}>
                <sphereGeometry args={[0.05, 6, 6]} />
                <meshStandardMaterial
                  color={c}
                  emissive={c}
                  emissiveIntensity={2.6}
                />
              </mesh>
            );
          })}
          {/* Traditional Akash Kandil hanging from center of overhead strand */}
          <group position={[0, -0.75, 0]}>
            <mesh castShadow>
              <octahedronGeometry args={[0.28, 0]} />
              <meshStandardMaterial
                color={si === 0 ? '#E63946' : si === 1 ? '#FFB703' : '#9D4EDD'}
                emissive={si === 0 ? '#D90429' : si === 1 ? '#FB8500' : '#7209B7'}
                emissiveIntensity={2.4}
              />
            </mesh>
            <mesh position={[0, -0.28, 0]}>
              <cylinderGeometry args={[0.06, 0.14, 0.32, 8]} />
              <meshStandardMaterial color="#DAA520" metalness={0.8} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ==============================================================
          3. MULTI-STORY DECORATED NEIGHBOURING HAVELIS (LEFT & RIGHT)
          ============================================================== */}
      {/* Left Mohalla Haveli (Pastel Pistachio & Sandstone 2-Story Haveli) */}
      <group position={[-16, 0, 19]}>
        {/* Ground Floor Main Wall */}
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[11, 7, 10]} />
          <meshStandardMaterial color="#B7B7A4" roughness={0.7} />
        </mesh>
        {/* Second Floor Wall */}
        <mesh position={[0, 9.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[10.5, 5, 9.5]} />
          <meshStandardMaterial color="#DDBEA9" roughness={0.7} />
        </mesh>
        {/* Cantilevered Street-Facing Jharokha Balcony */}
        <group position={[4.8, 5.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 1.4, 2.8]} />
            <meshStandardMaterial color="#6B3714" roughness={0.6} />
          </mesh>
          {/* Glowing Jaali Window */}
          <mesh position={[0.62, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[2.4, 1.1]} />
            <meshStandardMaterial
              color="#FFB703"
              emissive="#FF8C00"
              emissiveIntensity={2.0}
            />
          </mesh>
        </group>
        {/* Ground Floor Windows with Golden Glow */}
        {[-2.5, 2.5].map((wz, wi) => (
          <group key={`lhav-win-${wi}`} position={[4.8, 2.5, wz]}>
            <mesh position={[0.62, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[1.6, 2.0]} />
              <meshStandardMaterial
                color="#FFB703"
                emissive="#FF8C00"
                emissiveIntensity={2.2}
              />
            </mesh>
          </group>
        ))}
        {/* Haveli Roof Parapet & Draped Fairy Lights */}
        <group position={[4.8, 12.1, 0]}>
          {[...Array(12)].map((_, fi) => (
            <mesh key={`lh-fl-${fi}`} position={[0, (fi % 2) * -0.15, (fi - 5.5) * 0.8]}>
              <sphereGeometry args={[0.05, 6, 6]} />
              <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2.5} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Right Mohalla Haveli (Warm Terracotta & Ochre 2-Story Haveli) */}
      <group position={[16, 0, 19]}>
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[11, 7, 10]} />
          <meshStandardMaterial color="#CB997E" roughness={0.7} />
        </mesh>
        <mesh position={[0, 9.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[10.5, 5, 9.5]} />
          <meshStandardMaterial color="#DDA15E" roughness={0.7} />
        </mesh>
        {/* Cantilevered Street-Facing Jharokha Balcony */}
        <group position={[-4.8, 5.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 1.4, 2.8]} />
            <meshStandardMaterial color="#6B3714" roughness={0.6} />
          </mesh>
          <mesh position={[-0.62, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[2.4, 1.1]} />
            <meshStandardMaterial
              color="#FFB703"
              emissive="#FF8C00"
              emissiveIntensity={2.0}
            />
          </mesh>
        </group>
        {/* Windows */}
        {[-2.5, 2.5].map((wz, wi) => (
          <group key={`rhav-win-${wi}`} position={[-4.8, 2.5, wz]}>
            <mesh position={[-0.62, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry args={[1.6, 2.0]} />
              <meshStandardMaterial
                color="#FFB703"
                emissive="#FF8C00"
                emissiveIntensity={2.2}
              />
            </mesh>
          </group>
        ))}
        {/* Roofline Fairy Lights */}
        <group position={[-4.8, 12.1, 0]}>
          {[...Array(12)].map((_, fi) => (
            <mesh key={`rh-fl-${fi}`} position={[0, (fi % 2) * -0.15, (fi - 5.5) * 0.8]}>
              <sphereGeometry args={[0.05, 6, 6]} />
              <meshStandardMaterial color="#FF4500" emissive="#FF4500" emissiveIntensity={2.5} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==============================================================
          4. GRAND PARK ENTRANCE GATEWAY (DIWALI MELA TORANA ARCH)
          ============================================================== */}
      <group position={[0, 0, 24]}>
        {/* Stone Gate Pillars (Left & Right) */}
        {[-3.2, 3.2].map((px, pi) => (
          <group key={`gatepost-${pi}`} position={[px, 0, 0]}>
            <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.7, 4.4, 0.7]} />
              <meshStandardMaterial color="#8F4B23" roughness={0.65} />
            </mesh>
            {/* Stepped Capital & Brass Kalash Finial */}
            <mesh position={[0, 4.6, 0]} castShadow>
              <boxGeometry args={[0.9, 0.3, 0.9]} />
              <meshStandardMaterial color="#C68B59" roughness={0.6} />
            </mesh>
            <mesh position={[0, 5.0, 0]} castShadow>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshStandardMaterial color="#DAA520" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>
        ))}

        {/* Wrought-Iron Cusped Archway Span */}
        <mesh position={[0, 4.7, 0]} castShadow>
          <boxGeometry args={[6.8, 0.25, 0.3]} />
          <meshStandardMaterial color="#1E232A" metalness={0.8} />
        </mesh>
        <mesh position={[0, 5.2, 0]} castShadow rotation={[0, 0, Math.PI]}>
          <cylinderGeometry args={[2.8, 2.8, 0.15, 24, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Dense Marigold Toran Garland on Arch */}
        <group position={[0, 4.5, 0.18]}>
          {[...Array(17)].map((_, i) => (
            <mesh key={`gtoran-${i}`} position={[(i - 8) * 0.38, Math.sin((i / 16) * Math.PI) * -0.3, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#FF9E00' : '#E85D04'}
                emissive={i % 2 === 0 ? '#FFA200' : '#DC2F02'}
                emissiveIntensity={0.6}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==============================================================
          5. COMMUNITY PARK & MELA GROUNDS (Z: 24 to 45)
          ============================================================== */}
      {/* Park Lush Green Grass Floor */}
      <mesh position={[0, 0, 34]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[46, 20]} />
        <meshStandardMaterial color="#1B4332" roughness={0.85} />
      </mesh>

      {/* Meandering Red Sandstone Park Paths */}
      <mesh position={[0, 0.015, 34]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.4, 20]} />
        <meshStandardMaterial color="#8F5435" roughness={0.75} />
      </mesh>
      {/* Cross Path to Fireworks Area */}
      <mesh position={[0, 0.018, 33]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[32, 3.8]} />
        <meshStandardMaterial color="#8F5435" roughness={0.75} />
      </mesh>

      {/* Classical Park Benches */}
      {[-7, 7].map((x, i) => (
        <group key={`bench-${i}`} position={[x, 0, 31]} rotation={[0, x > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
          <mesh position={[0, 0.48, 0]} castShadow>
            <boxGeometry args={[2.2, 0.08, 0.55]} />
            <meshStandardMaterial color="#4A2306" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.85, -0.25]} castShadow>
            <boxGeometry args={[2.2, 0.48, 0.08]} />
            <meshStandardMaterial color="#4A2306" roughness={0.5} />
          </mesh>
          {[-0.9, 0.9].map((lx, j) => (
            <mesh key={`bl-${j}`} position={[lx, 0.24, 0]} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.48, 8]} />
              <meshStandardMaterial color="#1A1A1A" metalness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ==============================================================
          6. SACRED BANYAN TREE SHRINE (CHHABUTRA) IN PARK CENTER
          ============================================================== */}
      <group position={[0, 0, 41]}>
        {/* Circular Stepped Stone Platform (Chhabutra) */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[3.2, 3.5, 0.5, 24]} />
          <meshStandardMaterial color="#8F5435" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.4, 2.6, 0.3, 24]} />
          <meshStandardMaterial color="#B87333" roughness={0.65} />
        </mesh>

        {/* Ring of 16 Lit Terracotta Diyas around Chhabutra Edge */}
        {[...Array(16)].map((_, di) => {
          const angle = (di / 16) * Math.PI * 2;
          const rad = 2.8;
          return (
            <group key={`chhab-diya-${di}`} position={[Math.cos(angle) * rad, 0.55, Math.sin(angle) * rad]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.07, 0.045, 0.05, 10]} />
                <meshStandardMaterial color="#8B4513" roughness={0.7} />
              </mesh>
              <mesh position={[0, 0.05, 0]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial
                  color="#FF5722"
                  emissive="#FFA500"
                  emissiveIntensity={3.4}
                />
              </mesh>
            </group>
          );
        })}

        {/* Massive Sacred Banyan Tree Trunk & Canopy */}
        <mesh position={[0, 3.2, 0]} castShadow>
          <cylinderGeometry args={[0.9, 1.4, 5.5, 14]} />
          <meshStandardMaterial color="#3D1D09" roughness={0.9} />
        </mesh>
        {/* Expansive Foliage Canopies */}
        <mesh position={[0, 6.8, 0]} castShadow>
          <sphereGeometry args={[3.8, 14, 14]} />
          <meshStandardMaterial color="#1B4D28" roughness={0.8} />
        </mesh>
        <mesh position={[1.4, 7.8, 0.8]} castShadow>
          <sphereGeometry args={[2.6, 12, 12]} />
          <meshStandardMaterial color="#245F33" roughness={0.75} />
        </mesh>
        <mesh position={[-1.4, 7.6, -0.8]} castShadow>
          <sphereGeometry args={[2.4, 12, 12]} />
          <meshStandardMaterial color="#2D6A4F" roughness={0.75} />
        </mesh>

        {/* Fairy Light Strings draped in Banyan Tree */}
        {[...Array(24)].map((_, fi) => {
          const a = (fi / 24) * Math.PI * 2;
          const r = 2.4 + (fi % 3) * 0.4;
          const y = 5.2 + Math.sin(fi) * 1.2;
          return (
            <mesh key={`bany-fl-${fi}`} position={[Math.cos(a) * r, y, Math.sin(a) * r]}>
              <sphereGeometry args={[0.06, 6, 6]} />
              <meshStandardMaterial
                color="#FFD700"
                emissive="#FFA500"
                emissiveIntensity={2.8}
              />
            </mesh>
          );
        })}

        {/* Hanging Akash Kandils on Banyan Branches */}
        {[-2.2, 0, 2.2].map((kx, ki) => (
          <group key={`bany-kandil-${ki}`} position={[kx, 4.8, ki === 1 ? -2.2 : 1.2]}>
            <mesh castShadow>
              <octahedronGeometry args={[0.35, 0]} />
              <meshStandardMaterial
                color={ki === 0 ? '#E63946' : ki === 1 ? '#FFB703' : '#00B4D8'}
                emissive={ki === 0 ? '#D90429' : ki === 1 ? '#FB8500' : '#0077B6'}
                emissiveIntensity={2.6}
              />
            </mesh>
            <mesh position={[0, -0.35, 0]}>
              <cylinderGeometry args={[0.07, 0.16, 0.38, 8]} />
              <meshStandardMaterial color="#DAA520" metalness={0.8} />
            </mesh>
          </group>
        ))}

        <pointLight position={[0, 4.5, 0]} color="#FFA500" intensity={2.8} distance={15} decay={2} />
      </group>

      {/* Flanking Park Gulmohar Trees */}
      {[
        [-13, 0, 28],
        [13, 0, 28],
        [-15, 0, 39],
        [15, 0, 39],
      ].map(([tx, ty, tz], i) => (
        <group key={`gulm-${i}`} position={[tx, ty, tz]}>
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.48, 5, 10]} />
            <meshStandardMaterial color="#4A2810" roughness={0.9} />
          </mesh>
          <mesh position={[0, 5.2, 0]} castShadow>
            <sphereGeometry args={[2.4, 12, 12]} />
            <meshStandardMaterial color="#1B4D28" roughness={0.8} />
          </mesh>
          <mesh position={[0.5, 6.2, 0.4]} castShadow>
            <sphereGeometry args={[1.8, 10, 10]} />
            <meshStandardMaterial color="#2D6A4F" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ==============================================================
          7. DISTANT ILLUMINATED CITY SKYLINE & TEMPLE SHIKHARAS
          ============================================================== */}
      {/* Background Indian City Skyline Silhouettes with Lit Windows & Spires */}
      <group position={[0, 0, 58]}>
        {[-32, -22, -11, 0, 11, 22, 32].map((bx, bi) => {
          const height = 12 + (bi % 3) * 6;
          const isTemple = bi % 2 === 1;
          return (
            <group key={`skyline-${bi}`} position={[bx, 0, 0]}>
              {/* Haveli / Building Block */}
              <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[9, height, 8]} />
                <meshStandardMaterial color="#161824" roughness={0.9} />
              </mesh>
              {/* If Temple, add Shikhara Spire on Top */}
              {isTemple && (
                <mesh position={[0, height + 3, 0]}>
                  <coneGeometry args={[2.5, 6, 8]} />
                  <meshStandardMaterial color="#251E28" roughness={0.8} />
                </mesh>
              )}
              {/* Illuminated Windows on Distant Buildings */}
              {[-2.5, 2.5].map((wx, wi) => (
                <mesh key={`skywin-${wi}`} position={[wx, height * 0.6, -4.1]}>
                  <planeGeometry args={[1.2, 1.5]} />
                  <meshStandardMaterial
                    color="#FFB703"
                    emissive="#FF8C00"
                    emissiveIntensity={1.8}
                  />
                </mesh>
              ))}
            </group>
          );
        })}
      </group>
    </group>
  );
};

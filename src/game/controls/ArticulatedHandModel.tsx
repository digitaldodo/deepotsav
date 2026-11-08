import React, { useRef } from 'react';
import * as THREE from 'three';

export interface FingerJointAngles {
  mcp: number; // Metacarpophalangeal (knuckle) flex
  pip: number; // Proximal interphalangeal (middle joint) flex
  dip: number; // Distal interphalangeal (tip joint) flex
  spread?: number; // Abduction / adduction (sideways spread)
}

export interface HandPoseAngles {
  thumb: { mcp: number; pip: number; dip: number; spread: number };
  index: FingerJointAngles;
  middle: FingerJointAngles;
  ring: FingerJointAngles;
  pinky: FingerJointAngles;
  wristTilt?: [number, number, number];
}

interface AnatomicalPhalanxProps {
  length: number;
  radiusBase: number;
  radiusTip: number;
  flexAngle: number;
  spreadAngle?: number;
  hasNail?: boolean;
  skinMaterial: THREE.Material;
  nailMaterial: THREE.Material;
  children?: React.ReactNode;
}

// Single anatomical phalanx segment with organic tapering and joint capsule
const AnatomicalPhalanx: React.FC<AnatomicalPhalanxProps> = ({
  length,
  radiusBase,
  radiusTip,
  flexAngle,
  spreadAngle = 0,
  hasNail = false,
  skinMaterial,
  nailMaterial,
  children,
}) => {
  return (
    <group rotation={[flexAngle, spreadAngle, 0]}>
      {/* Knuckle joint sphere */}
      <mesh material={skinMaterial} castShadow>
        <sphereGeometry args={[radiusBase * 1.05, 12, 10]} />
      </mesh>

      {/* Segment body: contoured anatomical cylinder */}
      <mesh position={[0, 0, -length * 0.5]} rotation={[Math.PI / 2, 0, 0]} material={skinMaterial} castShadow>
        <cylinderGeometry args={[radiusTip, radiusBase, length, 12]} />
      </mesh>

      {/* Fingernail plate on dorsal side of distal phalanx */}
      {hasNail && (
        <group position={[0, radiusTip * 0.72, -length * 0.72]} rotation={[-0.15, 0, 0]}>
          <mesh material={nailMaterial}>
            <boxGeometry args={[radiusTip * 1.35, 0.0018, length * 0.55]} />
          </mesh>
        </group>
      )}

      {/* Child joint connection at distal end */}
      <group position={[0, 0, -length]}>{children}</group>
    </group>
  );
};

interface ArticulatedHandMeshProps {
  isLeft?: boolean;
  pose: HandPoseAngles;
  skinColor?: string;
}

/**
 * ArticulatedHumanHand:
 * High-fidelity human hand with complete 5-finger anatomical rigging (3 joints per finger),
 * sculpted muscular palm contours (thenar & hypothenar eminences), fingernail beds,
 * gold zari silk sleeve, and traditional 24K kada.
 */
export const ArticulatedHandMesh: React.FC<ArticulatedHandMeshProps> = ({
  isLeft = false,
  pose,
  skinColor = '#C58459',
}) => {
  const rootRef = useRef<THREE.Group>(null);

  // Materials
  const skinMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: skinColor,
        roughness: 0.68,
        metalness: 0.05,
      }),
    [skinColor]
  );

  const nailMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E8BCA0',
        roughness: 0.35,
        metalness: 0.1,
      }),
    []
  );

  const kurtaMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#800020', // Royal Ruby Silk
        roughness: 0.55,
      }),
    []
  );

  const zariGoldMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D4AF37', // Gold Zari
        metalness: 0.92,
        roughness: 0.2,
      }),
    []
  );

  const kadaGoldMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#FFD700', // 24K Gold Kada
        metalness: 0.96,
        roughness: 0.15,
      }),
    []
  );

  const sign = isLeft ? -1 : 1;

  return (
    <group ref={rootRef} scale={[sign, 1, 1]}>
      {/* ==============================================================
          1. FESTIVE ATTIRE & CONTROURED FOREARM
          ============================================================== */}
      {/* Deep Ruby Silk Kurta Sleeve */}
      <mesh position={[0.02, -0.06, 0.22]} rotation={[0.38, 0, 0]} material={kurtaMat} castShadow>
        <cylinderGeometry args={[0.048, 0.058, 0.22, 18]} />
      </mesh>
      {/* Gold Embroidered Zari Brocade Trim */}
      <mesh position={[0.02, -0.015, 0.125]} rotation={[0.38, 0, 0]} material={zariGoldMat}>
        <torusGeometry args={[0.049, 0.007, 10, 24]} />
      </mesh>

      {/* Contoured Muscular Forearm (Brachioradialis curve) */}
      <mesh position={[0.018, -0.005, 0.08]} rotation={[0.38, 0, 0]} material={skinMat} castShadow>
        <cylinderGeometry args={[0.036, 0.044, 0.14, 16]} />
      </mesh>

      {/* Traditional Auspicious 24K Gold Kada (Bangle) on Wrist */}
      <mesh position={[0.015, 0.008, 0.038]} rotation={[0.38, 0, 0]} material={kadaGoldMat}>
        <torusGeometry args={[0.042, 0.0075, 12, 28]} />
      </mesh>

      {/* ==============================================================
          2. SCULPTED ANATOMICAL PALM
          ============================================================== */}
      {/* Central Palm Body: tapered, rounded carpal-metacarpal bridge */}
      <mesh position={[0.01, 0.012, -0.025]} rotation={[0.08, 0, 0]} material={skinMat} castShadow>
        <boxGeometry args={[0.068, 0.026, 0.068]} />
      </mesh>

      {/* Thenar Eminence (Fleshy Thumb Mount Pad) */}
      <mesh position={[-0.022, 0.008, -0.018]} rotation={[0.2, -0.35, 0.15]} material={skinMat} castShadow>
        <sphereGeometry args={[0.022, 12, 10]} />
      </mesh>

      {/* Hypothenar Eminence (Pinky Side Muscular Pad) */}
      <mesh position={[0.034, 0.006, -0.022]} rotation={[0.1, 0.1, -0.1]} material={skinMat} castShadow>
        <sphereGeometry args={[0.019, 12, 10]} />
      </mesh>

      {/* Knuckle Metacarpal Ridge (Dorsal Knuckle Pad Arc) */}
      <mesh position={[0.01, 0.016, -0.056]} rotation={[0.05, 0, 0]} material={skinMat} castShadow>
        <cylinderGeometry args={[0.012, 0.014, 0.064, 12]} rotation={[0, 0, Math.PI / 2]} />
      </mesh>

      {/* ==============================================================
          3. FIVE ARTICULATED HUMAN FINGERS
          ============================================================== */}
      {/* A. THUMB (Opposable, 2 robust phalanges + metacarpal base) */}
      <group position={[-0.028, 0.005, -0.022]} rotation={[0.35, -0.55, 0.3]}>
        <AnatomicalPhalanx
          length={0.034}
          radiusBase={0.012}
          radiusTip={0.0105}
          flexAngle={pose.thumb.mcp}
          spreadAngle={pose.thumb.spread}
          skinMaterial={skinMat}
          nailMaterial={nailMat}
        >
          <AnatomicalPhalanx
            length={0.026}
            radiusBase={0.0105}
            radiusTip={0.009}
            flexAngle={pose.thumb.dip}
            hasNail={true}
            skinMaterial={skinMat}
            nailMaterial={nailMat}
          />
        </AnatomicalPhalanx>
      </group>

      {/* B. INDEX FINGER (3 articulated phalanges: proximal, intermediate, distal) */}
      <group position={[-0.022, 0.014, -0.058]}>
        <AnatomicalPhalanx
          length={0.038}
          radiusBase={0.0095}
          radiusTip={0.0085}
          flexAngle={pose.index.mcp}
          spreadAngle={pose.index.spread || -0.05}
          skinMaterial={skinMat}
          nailMaterial={nailMat}
        >
          <AnatomicalPhalanx
            length={0.026}
            radiusBase={0.0085}
            radiusTip={0.0076}
            flexAngle={pose.index.pip}
            skinMaterial={skinMat}
            nailMaterial={nailMat}
          >
            <AnatomicalPhalanx
              length={0.02}
              radiusBase={0.0076}
              radiusTip={0.0068}
              flexAngle={pose.index.dip}
              hasNail={true}
              skinMaterial={skinMat}
              nailMaterial={nailMat}
            />
          </AnatomicalPhalanx>
        </AnatomicalPhalanx>
      </group>

      {/* C. MIDDLE FINGER (Longest finger, 3 articulated phalanges) */}
      <group position={[-0.002, 0.016, -0.062]}>
        <AnatomicalPhalanx
          length={0.043}
          radiusBase={0.01}
          radiusTip={0.0088}
          flexAngle={pose.middle.mcp}
          spreadAngle={pose.middle.spread || 0.0}
          skinMaterial={skinMat}
          nailMaterial={nailMat}
        >
          <AnatomicalPhalanx
            length={0.029}
            radiusBase={0.0088}
            radiusTip={0.0079}
            flexAngle={pose.middle.pip}
            skinMaterial={skinMat}
            nailMaterial={nailMat}
          >
            <AnatomicalPhalanx
              length={0.022}
              radiusBase={0.0079}
              radiusTip={0.007}
              flexAngle={pose.middle.dip}
              hasNail={true}
              skinMaterial={skinMat}
              nailMaterial={nailMat}
            />
          </AnatomicalPhalanx>
        </AnatomicalPhalanx>
      </group>

      {/* D. RING FINGER (3 articulated phalanges) */}
      <group position={[0.018, 0.014, -0.059]}>
        <AnatomicalPhalanx
          length={0.039}
          radiusBase={0.0092}
          radiusTip={0.0082}
          flexAngle={pose.ring.mcp}
          spreadAngle={pose.ring.spread || 0.04}
          skinMaterial={skinMat}
          nailMaterial={nailMat}
        >
          <AnatomicalPhalanx
            length={0.027}
            radiusBase={0.0082}
            radiusTip={0.0074}
            flexAngle={pose.ring.pip}
            skinMaterial={skinMat}
            nailMaterial={nailMat}
          >
            <AnatomicalPhalanx
              length={0.02}
              radiusBase={0.0074}
              radiusTip={0.0066}
              flexAngle={pose.ring.dip}
              hasNail={true}
              skinMaterial={skinMat}
              nailMaterial={nailMat}
            />
          </AnatomicalPhalanx>
        </AnatomicalPhalanx>
      </group>

      {/* E. PINKY FINGER (Shortest, angled slightly inward) */}
      <group position={[0.036, 0.01, -0.052]}>
        <AnatomicalPhalanx
          length={0.03}
          radiusBase={0.0082}
          radiusTip={0.0072}
          flexAngle={pose.pinky.mcp}
          spreadAngle={pose.pinky.spread || 0.09}
          skinMaterial={skinMat}
          nailMaterial={nailMat}
        >
          <AnatomicalPhalanx
            length={0.02}
            radiusBase={0.0072}
            radiusTip={0.0064}
            flexAngle={pose.pinky.pip}
            skinMaterial={skinMat}
            nailMaterial={nailMat}
          >
            <AnatomicalPhalanx
              length={0.016}
              radiusBase={0.0064}
              radiusTip={0.0058}
              flexAngle={pose.pinky.dip}
              hasNail={true}
              skinMaterial={skinMat}
              nailMaterial={nailMat}
            />
          </AnatomicalPhalanx>
        </AnatomicalPhalanx>
      </group>
    </group>
  );
};

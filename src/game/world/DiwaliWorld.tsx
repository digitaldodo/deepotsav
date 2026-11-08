import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { FirstPersonController } from '../controls/FirstPersonController';
import { FirstPersonHands } from '../controls/FirstPersonHands';
import { HomeExterior } from './HomeExterior';
import { HouseInterior } from './HouseInterior';
import { DiningAndSweets } from './DiningAndSweets';
import { PujaCorner } from './PujaCorner';
import { Courtyard } from './Courtyard';
import { NeighbourhoodPark } from './NeighbourhoodPark';
import { SparklerStation } from './SparklerStation';
import { FireworksDisplay } from './FireworksDisplay';
import { Decorations } from './Decorations';

export const DiwaliWorld: React.FC = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full bg-[#0A0A1A] overflow-hidden select-none"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <Canvas
        camera={{ fov: 70, near: 0.1, far: 140, position: [0, 1.6, 9] }}
        dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn('WebGL context lost, awaiting restoration...');
          });
          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.info('WebGL context restored successfully!');
          });
        }}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        <Suspense fallback={null}>
          <FirstPersonController />
          <FirstPersonHands />
          <HomeExterior />
          <HouseInterior />
          <DiningAndSweets />
          <PujaCorner />
          <Courtyard />
          <NeighbourhoodPark />
          <SparklerStation />
          <FireworksDisplay />
          <Decorations />
        </Suspense>
      </Canvas>
    </div>
  );
};

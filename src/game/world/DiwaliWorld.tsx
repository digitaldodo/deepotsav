import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { FirstPersonController } from '../controls/FirstPersonController';
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
    <div className="absolute inset-0 w-full h-full bg-[#0A0A1A]">
      <Canvas
        camera={{ fov: 72, near: 0.1, far: 120, position: [0, 1.6, 9] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        shadows
      >
        <Suspense fallback={null}>
          <FirstPersonController />
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

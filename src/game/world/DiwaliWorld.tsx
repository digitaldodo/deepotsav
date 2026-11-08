import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameState } from '../state/useGameState';
import { CinematicCameraRig } from '../controls/CinematicCameraRig';
import { FirstPersonController } from '../controls/FirstPersonController';
import { FirstPersonHands } from '../controls/FirstPersonHands';
import { DistantScenery } from './DistantScenery';
import { HomeExterior } from './HomeExterior';
import { HouseInterior } from './HouseInterior';
import { DiningAndSweets } from './DiningAndSweets';
import { PujaCorner } from './PujaCorner';
import { Courtyard } from './Courtyard';
import { FireworksZone } from './FireworksZone';

export const DiwaliWorld: React.FC = () => {
  const { cinematicActive } = useGameState();

  return (
    <div
      className="absolute inset-0 w-full h-full bg-[#0A0F26] overflow-hidden select-none touch-none"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <Canvas
        camera={{ fov: 75, near: 0.1, far: 180, position: [0, 1.65, 8.5] }}
        dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.75) : 1]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
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
          {/* Camera Controller: Cinematic Mode vs Gameplay First Person */}
          {cinematicActive ? <CinematicCameraRig /> : <FirstPersonController />}

          {/* First Person Hands (Active only in Gameplay) */}
          <FirstPersonHands />

          {/* Expansive Distant Scenery (Sky, Moon, Stars, Distant Havelis, Temple, Distant Fireworks) */}
          <DistantScenery />

          {/* Playable Compact World Modules */}
          <HomeExterior />
          <HouseInterior />
          <DiningAndSweets />
          <PujaCorner />
          <Courtyard />
          <FireworksZone />
        </Suspense>
      </Canvas>
    </div>
  );
};

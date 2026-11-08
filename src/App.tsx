import React, { useState, useEffect } from 'react';
import { useGameState } from './game/state/useGameState';
import { DiwaliWorld } from './game/world/DiwaliWorld';
import { GameHUD } from './components/hud/GameHUD';
import { MobileVirtualControls } from './game/controls/MobileVirtualControls';
import { CinematicOverlay } from './components/menus/CinematicOverlay';
import { PauseMenu } from './components/menus/PauseMenu';

export const App: React.FC = () => {
  const { cinematicActive } = useGameState();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const hasTouch =
      'ontouchstart' in window ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
      (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches);
    setIsTouchDevice(hasTouch);
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden bg-[#0A0F26] select-none touch-none"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      {/* 3D Diwali World Canvas */}
      <DiwaliWorld />

      {/* Cinematic Happy Diwali Intro Overlay */}
      {cinematicActive && <CinematicOverlay />}

      {/* Active First-Person Gameplay Overlays */}
      {!cinematicActive && (
        <>
          <GameHUD />
          {isTouchDevice && <MobileVirtualControls />}
          <PauseMenu />
        </>
      )}
    </div>
  );
};

export default App;

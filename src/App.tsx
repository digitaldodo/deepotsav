import React, { useState, useEffect } from 'react';
import { useGameState } from './game/state/useGameState';
import { DiwaliWorld } from './game/world/DiwaliWorld';
import { GameHUD } from './components/hud/GameHUD';
import { MobileVirtualControls } from './game/controls/MobileVirtualControls';
import { IntroScreen } from './components/menus/IntroScreen';
import { PauseMenu } from './components/menus/PauseMenu';

export const App: React.FC = () => {
  const { gameStarted } = useGameState();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0A1A] select-none">
      {/* 3D First-Person Diwali Canvas */}
      <DiwaliWorld />

      {/* Intro Screen */}
      {!gameStarted && <IntroScreen />}

      {/* Active Game State Overlays */}
      {gameStarted && (
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

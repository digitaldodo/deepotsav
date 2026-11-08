import React from 'react';
import { useGameState } from '../../game/state/useGameState';
import { audioManager } from '../../game/audio/AudioManager';

export const IntroScreen: React.FC = () => {
  const { gameStarted, setGameStarted, setSoundEnabled } = useGameState();

  if (gameStarted) return null;

  const handleEnterWorld = (enableAudio: boolean) => {
    if (enableAudio) {
      setSoundEnabled(true);
      audioManager.setMuted(false);
      audioManager.playPujaBell();
    }
    setGameStarted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#0A0A1A] via-[#161224] to-[#0A0A1A] text-white text-center select-none overflow-y-auto">
      {/* Top Auspicious Emblem */}
      <div className="mt-8 animate-[reveal-up_0.6s_ease-out]">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/5 border border-[#D4AF37]/30 text-[#FF6B35]">
          <span>✦</span>
          <span>A Living 3D Diwali World</span>
          <span>✦</span>
        </div>
      </div>

      {/* Main Title & Hero Presentation */}
      <div className="max-w-md w-full my-6 animate-[reveal-up_0.8s_ease-out]">
        <div className="text-6xl mb-3 animate-pulse">🪔</div>

        <h1
          className="text-4xl sm:text-6xl font-extrabold mb-3 leading-tight tracking-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          <span className="text-gold-gradient">Deepotsav</span>{' '}
          <span className="text-white">3D</span>
        </h1>

        <p className="text-sm text-white/80 leading-relaxed mb-6">
          Step into an Indian neighbourhood celebrating the Festival of Lights. Walk through the home, savor sweets, light diyas, create rangoli, explore the park, and play with virtual sparklers.
        </p>

        {/* Enter CTA Buttons (Touch friendly >52px) */}
        <div className="space-y-3">
          <button
            onClick={() => handleEnterWorld(true)}
            className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FF8C00] to-[#D4AF37] text-black font-extrabold text-base shadow-2xl active:scale-95 transition-transform flex items-center justify-center gap-2"
            style={{
              minHeight: '52px',
              boxShadow: '0 0 35px rgba(212, 175, 55, 0.5)',
            }}
          >
            <span>Enter Celebration with Sound 🔊</span>
          </button>

          <button
            onClick={() => handleEnterWorld(false)}
            className="w-full py-3 px-6 rounded-full bg-white/5 border border-white/15 text-white/70 hover:bg-white/10 text-xs font-semibold transition-all"
            style={{ minHeight: '44px' }}
          >
            Enter in Quiet Mode (Muted 🔇)
          </button>
        </div>
      </div>

      {/* Quick Controls Cheat Sheet */}
      <div className="mb-4 max-w-sm w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-left text-xs text-white/60">
        <div className="font-bold text-[#D4AF37] mb-1 uppercase tracking-wider text-[10px]">
          How to Navigate:
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-white font-semibold">Desktop:</span> WASD to walk, Mouse to look around, [E] to interact.
          </div>
          <div>
            <span className="text-white font-semibold">Mobile:</span> Left joystick to move, swipe right side to look around.
          </div>
        </div>
      </div>
    </div>
  );
};

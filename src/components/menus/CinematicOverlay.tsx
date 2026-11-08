import React from 'react';
import { useGameState } from '../../game/state/useGameState';
import { audioManager } from '../../game/audio/AudioManager';

export const CinematicOverlay: React.FC = () => {
  const {
    cinematicActive,
    cinematicPhase,
    skipCinematic,
    enterCelebration,
    soundEnabled,
    setSoundEnabled,
  } = useGameState();

  if (!cinematicActive) return null;

  const handleEnter = (withAudio = true) => {
    if (withAudio) {
      setSoundEnabled(true);
      audioManager.setMuted(false);
      audioManager.playPujaBell();
    } else {
      setSoundEnabled(false);
      audioManager.setMuted(true);
    }
    enterCelebration();
  };

  const handleSkip = () => {
    setSoundEnabled(true);
    audioManager.setMuted(false);
    skipCinematic();
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioManager.setMuted(!next);
    if (next) audioManager.playDiyaLight();
  };

  // Scene captions during cinematic playback
  const sceneCaptions: Record<number, string> = {
    1: '✦ SCENE 1: Festive Night in the Haveli ✦',
    2: '✦ SCENE 2: The Lighting of Sacred Diyas ✦',
    3: '✦ SCENE 3: Auspicious Courtyard Rangoli ✦',
    4: '✦ SCENE 4: Radiance of the Sky Fireworks ✦',
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-4 sm:p-8 select-none transition-opacity duration-700">
      {/* Top Header: Logo, Sound Toggle & Skip Option */}
      <header className="flex items-center justify-between w-full pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-[#D4AF37]/40 backdrop-blur-md shadow-lg">
          <span className="text-lg">🪔</span>
          <span className="text-xs font-bold tracking-widest uppercase text-[#D4AF37]">
            Deepotsav
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/80 active:scale-95 transition-all shadow-md backdrop-blur-md text-sm"
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>

          {/* Skip Intro Button */}
          <button
            onClick={handleSkip}
            className="px-4 py-2 rounded-full bg-black/60 border border-[#D4AF37]/50 text-[#FFE4B5] hover:bg-black/80 hover:text-white active:scale-95 transition-all text-xs font-semibold shadow-md backdrop-blur-md flex items-center gap-1.5"
          >
            <span>Skip Intro</span>
            <span>⏭️</span>
          </button>
        </div>
      </header>

      {/* Middle/Bottom: Scenes 1-4 Subtitle Badges */}
      {cinematicPhase >= 1 && cinematicPhase <= 4 && (
        <div className="flex flex-col items-center justify-end pb-8 animate-[fade-in_0.5s_ease-out]">
          <div className="px-5 py-2 rounded-full bg-black/65 border border-[#D4AF37]/35 text-[#FFE6B3] backdrop-blur-md text-xs font-medium tracking-wide shadow-2xl">
            {sceneCaptions[cinematicPhase] || '✦ Deepotsav Diwali Celebration ✦'}
          </div>
        </div>
      )}

      {/* Final Happy Diwali Title Card & Call to Action (Phase 5 or 6) */}
      {(cinematicPhase === 5 || cinematicPhase === 6) && (
        <div className="self-center my-auto max-w-lg w-full pointer-events-auto p-6 sm:p-8 rounded-3xl bg-black/75 border border-[#D4AF37]/50 backdrop-blur-xl text-center shadow-[0_0_60px_rgba(212,175,55,0.35)] animate-[scale-in_0.6s_ease-out]">
          {/* Sacred Diya Icon */}
          <div className="text-5xl sm:text-6xl mb-3 drop-shadow-[0_0_25px_rgba(255,180,0,0.8)]">
            🪔
          </div>

          {/* Grand Festive Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFDF73] via-[#FFF5D0] to-[#E5A823] drop-shadow-md">
            HAPPY DIWALI
          </h1>

          <p className="text-xs sm:text-sm font-light text-[#FFE8C2] leading-relaxed mb-6 px-2">
            May your home be filled with light, happiness, and prosperity.
            Welcome to the authentic Deepotsav celebration.
          </p>

          {/* Main Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleEnter(true)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#FF9900] to-[#D4AF37] text-black font-extrabold text-sm sm:text-base shadow-[0_0_30px_rgba(212,175,55,0.6)] active:scale-98 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ENTER THE CELEBRATION</span>
              <span>🪔</span>
            </button>

            <button
              onClick={() => handleEnter(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs font-medium transition-all cursor-pointer"
            >
              Enter in Quiet Mode (Muted 🔇)
            </button>
          </div>

          {/* Quick Controls Info */}
          <div className="mt-5 pt-4 border-t border-white/10 text-[11px] text-white/50 flex justify-around">
            <span>Desktop: [W,A,S,D] + Mouse + [E]</span>
            <span>•</span>
            <span>Mobile: Virtual Joystick + Touch</span>
          </div>
        </div>
      )}

      {/* Bottom Spacer */}
      <footer className="h-6" />
    </div>
  );
};

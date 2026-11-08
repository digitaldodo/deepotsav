import React from 'react';
import { useGameState, GraphicsQuality } from '../../game/state/useGameState';
import { audioManager } from '../../game/audio/AudioManager';

export const PauseMenu: React.FC = () => {
  const isPaused = useGameState(s => s.isPaused);
  const setPaused = useGameState(s => s.setPaused);
  const soundEnabled = useGameState(s => s.soundEnabled);
  const setSoundEnabled = useGameState(s => s.setSoundEnabled);
  const soundVolume = useGameState(s => s.soundVolume);
  const setSoundVolume = useGameState(s => s.setSoundVolume);
  const graphicsQuality = useGameState(s => s.graphicsQuality);
  const setGraphicsQuality = useGameState(s => s.setGraphicsQuality);
  const mouseSensitivity = useGameState(s => s.mouseSensitivity);
  const setMouseSensitivity = useGameState(s => s.setMouseSensitivity);
  const touchSensitivity = useGameState(s => s.touchSensitivity);
  const setTouchSensitivity = useGameState(s => s.setTouchSensitivity);
  const replayCinematic = useGameState(s => s.replayCinematic);
  const resetGameProgress = useGameState(s => s.resetGameProgress);

  if (!isPaused) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fade-in_0.2s_ease-out]">
      <div
        className="w-full max-w-sm p-6 rounded-3xl bg-gradient-to-b from-[#1C142B] to-[#0A0A1A] border border-[#D4AF37]/40 shadow-2xl text-white select-none max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: '0 0 45px rgba(212, 175, 55, 0.25)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪔</span>
            <div>
              <h2 className="text-base font-bold text-[#D4AF37]">Settings & Pause</h2>
              <p className="text-[11px] text-white/60">Customize Deepotsav 3D Experience</p>
            </div>
          </div>
          <button
            onClick={() => setPaused(false)}
            className="w-7 h-7 rounded-full bg-white/10 text-white/70 hover:bg-white/20 flex items-center justify-center text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 1. Audio Controls */}
        <div className="mb-4 space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white/80">Festive Audio & Ambience</span>
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                audioManager.setMuted(!next);
                if (next) audioManager.playDiyaLight();
              }}
              className="text-xs text-[#D4AF37] font-semibold underline cursor-pointer"
            >
              {soundEnabled ? 'Mute' : 'Unmute'}
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={soundVolume}
            onChange={e => {
              const v = parseFloat(e.target.value);
              setSoundVolume(v);
              audioManager.setVolume(v);
            }}
            className="w-full accent-[#D4AF37] cursor-pointer"
          />
        </div>

        {/* 2. Control Sensitivity */}
        <div className="mb-4 space-y-2 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-xs font-semibold text-white/80 mb-1">Camera Sensitivity</div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-white/60">
              <span>Mouse / Touch Look Speed</span>
              <span>{mouseSensitivity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.1"
              value={mouseSensitivity}
              onChange={e => {
                const v = parseFloat(e.target.value);
                setMouseSensitivity(v);
                setTouchSensitivity(v);
              }}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Graphics Quality */}
        <div className="mb-5 space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-xs font-semibold text-white/80 mb-1">Rendering Quality</div>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as GraphicsQuality[]).map(q => (
              <button
                key={q}
                onClick={() => setGraphicsQuality(q)}
                className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                  graphicsQuality === q
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Resume */}
          <button
            onClick={() => setPaused(false)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FF9900] to-[#D4AF37] text-black font-extrabold text-xs sm:text-sm active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            Resume Exploring ✨
          </button>

          {/* Replay Cinematic Intro */}
          <button
            onClick={() => {
              replayCinematic();
            }}
            className="w-full py-2.5 rounded-xl bg-white/10 border border-[#D4AF37]/35 text-[#FFE8C2] text-xs font-semibold hover:bg-white/15 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Replay Happy Diwali Intro</span>
            <span>🎬</span>
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              resetGameProgress();
              setPaused(false);
            }}
            className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            Reset Exploration Progress
          </button>
        </div>
      </div>
    </div>
  );
};

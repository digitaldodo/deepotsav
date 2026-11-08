import React from 'react';
import { useGameState, GraphicsQuality } from '../../game/state/useGameState';
import { audioManager } from '../../game/audio/AudioManager';

export const PauseMenu: React.FC = () => {
  const {
    isPaused,
    setPaused,
    soundEnabled,
    setSoundEnabled,
    soundVolume,
    setSoundVolume,
    graphicsQuality,
    setGraphicsQuality,
    resetGameProgress,
  } = useGameState();

  if (!isPaused) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[reveal-up_0.3s_ease-out]">
      <div className="w-full max-w-sm p-6 rounded-3xl bg-gradient-to-b from-[#1C142B] to-[#0A0A1A] border border-[#D4AF37]/40 shadow-2xl text-white">
        <div className="text-center pb-3 border-b border-white/10 mb-5">
          <span className="text-3xl">🪔</span>
          <h2 className="text-2xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Exploration Paused
          </h2>
          <p className="text-xs text-white/60">Customize settings or take a moment to rest</p>
        </div>

        {/* Audio Volume Controls */}
        <div className="mb-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white/80">Sound &amp; Ambiance</span>
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                audioManager.setMuted(!next);
              }}
              className="text-xs text-[#D4AF37] underline"
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
            className="w-full accent-[#D4AF37]"
          />
        </div>

        {/* Graphics Quality */}
        <div className="mb-6 space-y-2">
          <div className="text-xs font-semibold text-white/80">Graphics Quality</div>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as GraphicsQuality[]).map(q => (
              <button
                key={q}
                onClick={() => setGraphicsQuality(q)}
                className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                  graphicsQuality === q
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                    : 'bg-white/5 text-white/60 border-white/10'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={() => setPaused(false)}
            className="w-full py-3.5 rounded-full bg-[#D4AF37] text-black font-extrabold text-sm active:scale-95 transition-all shadow-lg"
          >
            Resume Exploring ✨
          </button>

          <button
            onClick={() => {
              resetGameProgress();
              setPaused(false);
            }}
            className="w-full py-2.5 rounded-full bg-white/5 border border-white/15 text-white/60 text-xs hover:bg-white/10 transition-all"
          >
            Restart &amp; Reset Activities
          </button>
        </div>
      </div>
    </div>
  );
};

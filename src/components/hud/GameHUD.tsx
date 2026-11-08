import React, { useState } from 'react';
import { useGameState } from '../../game/state/useGameState';
import { audioManager } from '../../game/audio/AudioManager';
import { ActivityJournal } from './ActivityJournal';

export const GameHUD: React.FC = () => {
  const {
    currentLocationName,
    activePrompt,
    isPaused,
    setPaused,
    soundEnabled,
    setSoundEnabled,
    sweetsEatenTotal,
    pujaBellRangCount,
    litDiyas,
    rangoliCompleted,
    sparklerHolding,
    fireworksLaunchCount,
    handItem,
    heldPowderName,
    heldPowderColor,
    heldSweetType,
    clearHand,
  } = useGameState();

  const [journalOpen, setJournalOpen] = useState(false);

  // Compute completed activities count
  const completedCount = [
    sweetsEatenTotal > 0,
    pujaBellRangCount > 0,
    Object.keys(litDiyas).length >= 2,
    rangoliCompleted,
    sparklerHolding,
    fireworksLaunchCount > 0,
  ].filter(Boolean).length;

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-5 select-none">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pointer-events-auto">
          {/* Logo & Current Location Badge */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-2xl bg-black/60 border border-[#D4AF37]/30 backdrop-blur-md flex items-center gap-2 shadow-lg">
              <span className="text-xl">🪔</span>
              <div>
                <div className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase leading-tight">
                  Deepotsav 3D
                </div>
                <div className="text-xs font-semibold text-white leading-tight">
                  {currentLocationName}
                </div>
              </div>
            </div>

            {/* In-Hand Active Item Pill */}
            {handItem !== 'none' && (
              <div className="hidden xs:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/70 border border-white/20 backdrop-blur-md shadow-lg animate-[fade-in_0.3s_ease-out]">
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                  style={{
                    backgroundColor:
                      handItem === 'powder'
                        ? heldPowderColor || '#FFC107'
                        : handItem === 'sweet'
                        ? '#FFB300'
                        : '#FFD700',
                  }}
                />
                <span className="text-xs font-medium text-white/90">
                  {handItem === 'powder' && (heldPowderName || 'Rangoli Powder')}
                  {handItem === 'sweet' && (heldSweetType || 'Sweet')}
                  {handItem === 'diya_stick' && 'Lighting Stick'}
                  {handItem === 'sparkler' && 'Phuljhadi Sparkler'}
                </span>
                <button
                  onClick={clearHand}
                  className="ml-1 text-[11px] text-white/50 hover:text-white px-1 hover:bg-white/10 rounded"
                  title="Put away"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-2">
            {/* Activity Journal Toggle */}
            <button
              onClick={() => setJournalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-black/60 border border-[#D4AF37]/30 text-white backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold shadow-lg active:scale-95 transition-all"
            >
              <span>📜 Journal</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#D4AF37] text-black text-[10px] font-extrabold">
                {completedCount}/6
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                audioManager.setMuted(!next);
                if (next) audioManager.playDiyaLight();
              }}
              className="w-10 h-10 rounded-2xl bg-black/60 border border-white/15 text-white flex items-center justify-center text-sm backdrop-blur-md active:scale-95 shadow-lg"
              title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>

            {/* Pause / Settings */}
            <button
              onClick={() => setPaused(!isPaused)}
              className="w-10 h-10 rounded-2xl bg-black/60 border border-white/15 text-[#D4AF37] flex items-center justify-center text-xs font-bold backdrop-blur-md active:scale-95 shadow-lg"
              title="Pause & Settings"
            >
              ⚙️
            </button>
          </div>
        </header>

        {/* Center Minimal First-Person Reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center opacity-70">
          <div className="w-2 h-2 rounded-full border border-white/80 bg-white/40 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
        </div>

        {/* Desktop Controls Overlay Guide (Hidden on Touch Screen) */}
        <div className="hidden sm:flex items-center justify-between text-xs text-white/50 bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-xl border border-white/5 max-w-lg mx-auto">
          <span>[W,A,S,D] Walk</span>
          <span>•</span>
          <span>[Mouse] Look Around</span>
          <span>•</span>
          <span>[E] Interact / Hand Action</span>
          <span>•</span>
          <span>[Shift] Sprint</span>
          <span>•</span>
          <span>[Esc] Pause</span>
        </div>

        {/* Desktop Centered Contextual Prompt */}
        {activePrompt && (
          <div className="hidden sm:flex flex-col items-center justify-center pointer-events-auto mb-8 animate-[bounce-in_0.3s_ease-out]">
            <button
              onClick={() => activePrompt.action()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#FF6B35] text-black font-extrabold text-sm shadow-2xl flex items-center gap-2 border border-white/30 hover:scale-105 active:scale-95 transition-transform"
              style={{ boxShadow: '0 0 25px rgba(212, 175, 55, 0.5)' }}
            >
              <span className="text-lg">✨</span>
              <span>{activePrompt.label}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-black/20 text-black font-bold">
                Press [E]
              </span>
            </button>
            {activePrompt.subtext && (
              <div className="text-xs text-white/80 mt-1.5 drop-shadow font-medium">
                {activePrompt.subtext}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Activity Journal Checklist */}
      <ActivityJournal isOpen={journalOpen} onClose={() => setJournalOpen(false)} />
    </>
  );
};

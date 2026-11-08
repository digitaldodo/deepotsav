import React, { useState, useEffect } from 'react';
import { useGameState } from '../../game/state/useGameState';
import { audioManager } from '../../game/audio/AudioManager';
import { ActivityJournal } from './ActivityJournal';
import { RangoliToolbar } from './RangoliToolbar';

export const GameHUD: React.FC = () => {
  const currentLocationName = useGameState(s => s.currentLocationName);
  const activePrompt = useGameState(s => s.activePrompt);
  const setPaused = useGameState(s => s.setPaused);
  const soundEnabled = useGameState(s => s.soundEnabled);
  const setSoundEnabled = useGameState(s => s.setSoundEnabled);
  const handItem = useGameState(s => s.handItem);
  const heldPowderName = useGameState(s => s.heldPowderName);
  const heldPowderColor = useGameState(s => s.heldPowderColor);
  const heldSweetType = useGameState(s => s.heldSweetType);
  const heldFireworkType = useGameState(s => s.heldFireworkType);
  const clearHand = useGameState(s => s.clearHand);
  const placementMode = useGameState(s => s.placementMode);
  const placementPos = useGameState(s => s.placementPos);
  const placementValid = useGameState(s => s.placementValid);
  const placeFireworkOnGround = useGameState(s => s.placeFireworkOnGround);
  const cancelPlacement = useGameState(s => s.cancelPlacement);

  const [journalOpen, setJournalOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Accurate touch & pointer capability detection
  useEffect(() => {
    const isTouch =
      'ontouchstart' in window ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
      (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches);
    setIsTouchDevice(isTouch);
  }, []);

  // Format label for touch devices (strip desktop keyboard instructions like [E] or "Press E")
  const formatActionPrompt = () => {
    if (!activePrompt) return null;

    let label = activePrompt.label;
    if (isTouchDevice) {
      // Clean out [E], Press [E], Press E, etc.
      label = label
        .replace(/\[E\]/gi, '')
        .replace(/Press E\s*(to)?/gi, 'Tap to')
        .replace(/Press\s*/gi, 'Tap to ')
        .trim();

      // If it doesn't already start with "Tap", add it for clarity
      if (!label.toLowerCase().startsWith('tap') && !label.toLowerCase().startsWith('savor')) {
        label = `Tap to ${label}`;
      }
    }
    return label;
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioManager.setMuted(!next);
    if (next) audioManager.playDiyaLight();
  };

  return (
    <>
      {/* HUD Root Container - pointer-events-none so touches pass through to 3D game */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none select-none z-30 flex flex-col justify-between"
        style={{
          paddingTop: 'max(12px, env(safe-area-inset-top))',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          paddingLeft: 'max(14px, env(safe-area-inset-left))',
          paddingRight: 'max(14px, env(safe-area-inset-right))',
        }}
      >
        {/* ==============================================================
            1. TOP HUD BAR: COMPACT LOCATION INDICATOR & 3 ICON CONTROLS
            ============================================================== */}
        <header className="flex items-center justify-between w-full pointer-events-auto">
          {/* Top Left: Small Translucent Location Pill */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-[#D4AF37]/35 backdrop-blur-md shadow-lg">
              <span className="text-sm drop-shadow-[0_0_8px_rgba(255,180,0,0.8)]">🪔</span>
              <span className="text-xs font-semibold text-[#FFE8C2] tracking-wide">
                {currentLocationName.replace('Front Gate & ', '')}
              </span>
            </div>

            {/* In-Hand Active Item Pill (if holding something) */}
            {handItem !== 'none' && (
              <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 border border-white/20 backdrop-blur-md shadow-md">
                <div
                  className="w-2.5 h-2.5 rounded-full border border-white/40"
                  style={{
                    backgroundColor:
                      handItem === 'powder'
                        ? heldPowderColor || '#FFC107'
                        : handItem === 'sweet'
                        ? '#FFB300'
                        : '#FFD700',
                  }}
                />
                <span className="text-[11px] font-medium text-white/90">
                  {handItem === 'powder' && (heldPowderName || 'Powder')}
                  {handItem === 'sweet' && (heldSweetType || 'Sweet')}
                  {handItem === 'diya_stick' && 'Lighting Stick'}
                  {handItem === 'sparkler' && 'Phuljhadi'}
                  {handItem === 'firework' && `${heldFireworkType?.toUpperCase()}`}
                </span>
                <button
                  onClick={clearHand}
                  className="text-[10px] text-white/60 hover:text-white px-1 ml-0.5 rounded cursor-pointer"
                  title="Put away item"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Top Right: 3 Compact Circular Icon Controls (Journal, Sound, Pause) */}
          <div className="flex items-center gap-2">
            {/* 1. Journal Button */}
            <button
              onClick={() => setJournalOpen(true)}
              className="w-9 h-9 rounded-full bg-black/60 border border-[#D4AF37]/35 text-[#FFE8C2] hover:bg-black/80 active:scale-95 transition-all shadow-md backdrop-blur-md flex items-center justify-center text-sm cursor-pointer"
              title="Diwali Activities Journal"
              aria-label="Diwali Activities Journal"
            >
              📜
            </button>

            {/* 2. Sound Toggle Button */}
            <button
              onClick={toggleSound}
              className="w-9 h-9 rounded-full bg-black/60 border border-[#D4AF37]/35 text-[#FFE8C2] hover:bg-black/80 active:scale-95 transition-all shadow-md backdrop-blur-md flex items-center justify-center text-sm cursor-pointer"
              title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
              aria-label={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>

            {/* 3. Pause / Settings Button */}
            <button
              onClick={() => setPaused(true)}
              className="w-9 h-9 rounded-full bg-black/60 border border-[#D4AF37]/35 text-[#FFE8C2] hover:bg-black/80 active:scale-95 transition-all shadow-md backdrop-blur-md flex items-center justify-center text-sm cursor-pointer"
              title="Pause & Settings"
              aria-label="Pause & Settings"
            >
              ⏸️
            </button>
          </div>
        </header>

        {/* ==============================================================
            2. CENTER SCREEN RETICLE / CROSSHAIR
            ============================================================== */}
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-10">
          {activePrompt ? (
            /* Illuminated Golden Interactive Reticle */
            <div className="w-5 h-5 rounded-sm border-1.5 border-[#FFD700] rotate-45 shadow-[0_0_12px_rgba(255,215,0,0.8)] animate-pulse" />
          ) : (
            /* Subtle Dot Reticle */
            <div className="w-1.5 h-1.5 rounded-full bg-white/50 shadow-sm" />
          )}
        </div>

        {/* ==============================================================
            3. REDESIGNED CONTEXTUAL INTERACTION INDICATOR & PLACEMENT MODE
            ============================================================== */}
        {placementMode ? (
          /* Placement Mode Overlay */
          <div
            className="self-center pointer-events-auto transition-all duration-300 z-30 flex flex-col items-center gap-2"
            style={{
              marginBottom: isTouchDevice ? '28vh' : '10vh',
            }}
          >
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/85 border border-[#D4AF37]/60 text-white backdrop-blur-md shadow-2xl">
              <span className="text-base">🎯</span>
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-bold text-[#FFE8C2]">
                  Placing {heldFireworkType?.toUpperCase()}
                </span>
                <span className="text-[11px] text-white/70">
                  {isTouchDevice
                    ? 'Drag over ground to aim preview'
                    : 'Point cursor on ground to aim preview'}
                </span>
              </div>

              {/* Validity Pill */}
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                  placementValid
                    ? 'bg-[#00E676] text-black shadow-[0_0_8px_rgba(0,230,118,0.6)]'
                    : 'bg-[#FF1744] text-white'
                }`}
              >
                {placementValid ? 'Valid Ground' : 'Invalid Area'}
              </span>
            </div>

            {/* Actions for Mobile / Desktop */}
            <div className="flex items-center gap-2 pointer-events-auto mt-1">
              {isTouchDevice ? (
                <>
                  <button
                    disabled={!placementValid}
                    onClick={() => {
                      if (placementValid) {
                        placeFireworkOnGround(placementPos);
                        audioManager.playPowderPickup();
                      }
                    }}
                    className={`px-4 py-2 rounded-full font-bold text-xs sm:text-sm backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 cursor-pointer ${
                      placementValid
                        ? 'bg-[#00E676] text-black hover:bg-[#69F0AE] active:scale-95'
                        : 'bg-gray-600/60 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>✓ Place Here</span>
                  </button>
                  <button
                    onClick={cancelPlacement}
                    className="px-3.5 py-2 rounded-full bg-red-900/80 hover:bg-red-800 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>✕ Cancel</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 text-[11px] text-white/80 bg-black/60 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">
                  <span>🖱️ <b>Left-Click</b> to place</span>
                  <span>•</span>
                  <span><b>Right-Click / [Esc]</b> to cancel</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className="self-center pointer-events-auto transition-all duration-300 z-30"
            style={{
              marginBottom: isTouchDevice ? '32vh' : '12vh',
            }}
          >
            {activePrompt && (
              <button
                onClick={() => activePrompt.action()}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/75 border border-[#D4AF37]/50 text-white backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.35)] active:scale-95 hover:border-[#D4AF37] transition-all cursor-pointer animate-[fade-in_0.2s_ease-out]"
              >
                {/* Keyboard badge on desktop only */}
                {!isTouchDevice && (
                  <span className="px-1.5 py-0.5 rounded bg-[#D4AF37] text-black font-extrabold text-[10px]">
                    E
                  </span>
                )}

                {/* Action Label */}
                <span className="text-xs sm:text-sm font-semibold text-[#FFE8C2]">
                  {formatActionPrompt()}
                </span>

                {/* Small Action Arrow */}
                <span className="text-xs text-[#D4AF37]">✦</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3D Rangoli Creative Studio Toolbar */}
      <RangoliToolbar />

      {/* Activity Journal Modal / Bottom Sheet */}
      <ActivityJournal isOpen={journalOpen} onClose={() => setJournalOpen(false)} />
    </>
  );
};

import React, { useState } from 'react';
import { useGameState } from '../../game/state/useGameState';
import { audioManager } from '../../game/audio/AudioManager';

export const RangoliOverlay: React.FC = () => {
  const {
    rangoliOverlayOpen,
    setRangoliOverlayOpen,
    rangoliColors,
    setRangoliColor,
    resetRangoli,
    setRangoliCompleted,
  } = useGameState();

  const COLORS = ['#E91E63', '#FF6B35', '#FFD700', '#22C55E', '#3B82F6', '#8B5CF6', '#FFFFFF', '#D4AF37'];
  const [activeColor, setActiveColor] = useState(COLORS[0]);

  if (!rangoliOverlayOpen) return null;

  const handleFillPetal = (petalId: number) => {
    audioManager.playDiyaLight();
    setRangoliColor(petalId, activeColor);
  };

  const handleDone = () => {
    setRangoliCompleted(true);
    setRangoliOverlayOpen(false);
    audioManager.playPujaBell();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[reveal-up_0.3s_ease-out]">
      <div className="w-full max-w-sm p-6 rounded-3xl bg-gradient-to-b from-[#1C142B] to-[#0A0A1A] border border-[#D4AF37]/40 shadow-2xl text-center text-white">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="text-left">
            <h2 className="text-xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Courtyard Rangoli Studio 🌸
            </h2>
            <p className="text-[11px] text-white/60">Choose a festive colour and tap a petal to fill</p>
          </div>
          <button
            onClick={() => setRangoliOverlayOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 text-white/70 hover:bg-white/20 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Color Palette Swatches */}
        <div className="flex justify-center gap-2 mb-4">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setActiveColor(c)}
              className={`w-8 h-8 rounded-full transition-all border-2 ${
                activeColor === c ? 'scale-125 border-white shadow-lg' : 'border-transparent opacity-75'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Interactive Rangoli SVG Canvas */}
        <div className="relative my-3 flex justify-center">
          <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-2xl">
            <circle cx="120" cy="120" r="110" fill="rgba(0,0,0,0.4)" stroke="#D4AF37" strokeWidth="1.5" />

            {/* 8 Petals */}
            {[...Array(8)].map((_, i) => {
              const angle = (i * 360) / 8;
              const color = rangoliColors[i] || 'rgba(255,255,255,0.15)';
              return (
                <g key={i} transform={`rotate(${angle} 120 120)`}>
                  <path
                    d="M 120 120 C 100 60 100 25 120 15 C 140 25 140 60 120 120"
                    fill={color}
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all hover:opacity-90 active:scale-95"
                    onClick={() => handleFillPetal(i)}
                  />
                  <circle cx="120" cy="30" r="3.5" fill="#FFFFFF" opacity="0.8" />
                </g>
              );
            })}

            {/* Center Circle */}
            <circle cx="120" cy="120" r="24" fill="#FF9900" stroke="#FFFFFF" strokeWidth="2" />
            <text x="120" y="125" fontSize="14" textAnchor="middle" fill="#FFFFFF" pointerEvents="none">
              🪔
            </text>
          </svg>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={resetRangoli}
            className="flex-1 py-2.5 rounded-full bg-white/10 text-white/70 text-xs font-semibold hover:bg-white/20 transition-all"
          >
            Clear Colors 🔄
          </button>
          <button
            onClick={handleDone}
            className="flex-1 py-2.5 rounded-full bg-[#D4AF37] text-black text-xs font-bold shadow-lg active:scale-95 transition-all"
          >
            Apply to World ✨
          </button>
        </div>
      </div>
    </div>
  );
};

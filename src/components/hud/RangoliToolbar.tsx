import React, { useState } from 'react';
import { useGameState } from '../../game/state/useGameState';
import {
  rangoliEngine,
  RangoliDrawOptions,
  RangoliToolMode,
  StencilType,
  PetalType,
} from '../../game/utils/RangoliCanvasEngine';
import { audioManager } from '../../game/audio/AudioManager';

export const ALL_18_RANGOLI_COLORS = [
  { id: 'sindoor', name: 'Vermilion Red', hex: '#E32636' },
  { id: 'crimson', name: 'Crimson', hex: '#DC143C' },
  { id: 'pink', name: 'Rani Pink', hex: '#FF69B4' },
  { id: 'magenta', name: 'Magenta', hex: '#D81B60' },
  { id: 'saffron', name: 'Kesari Saffron', hex: '#FF9933' },
  { id: 'yellow', name: 'Haldi Yellow', hex: '#FFEB3B' },
  { id: 'golden_yellow', name: 'Golden Yellow', hex: '#FFD700' },
  { id: 'orange', name: 'Marigold Orange', hex: '#FF6F00' },
  { id: 'white', name: 'Rice Flour White', hex: '#FFFFFF' },
  { id: 'ivory', name: 'Ivory Cream', hex: '#FFFFF0' },
  { id: 'green', name: 'Mehendi Green', hex: '#4CAF50' },
  { id: 'emerald', name: 'Emerald', hex: '#00897B' },
  { id: 'blue', name: 'Royal Blue', hex: '#1E88E5' },
  { id: 'turquoise', name: 'Turquoise', hex: '#00BCD4' },
  { id: 'purple', name: 'Gulal Purple', hex: '#7E57C2' },
  { id: 'violet', name: 'Deep Violet', hex: '#8E24AA' },
  { id: 'brown', name: 'Earth Brown', hex: '#795548' },
  { id: 'ochre', name: 'Geru Ochre', hex: '#CC7722' },
];

// Global drawing configuration shared with 3D canvas interaction
export const currentRangoliConfig: RangoliDrawOptions = {
  color: '#FF9933',
  brushSize: 14,
  symmetry: 6,
  mirror: false,
  toolMode: 'brush',
  stencil: 'lotus',
  petalType: 'marigold_orange',
};

export const RangoliToolbar: React.FC = () => {
  const handItem = useGameState(s => s.handItem);
  const heldPowderColor = useGameState(s => s.heldPowderColor);
  const heldPowderName = useGameState(s => s.heldPowderName);
  const pickUpPowder = useGameState(s => s.pickUpPowder);
  const clearHand = useGameState(s => s.clearHand);

  const [activeTab, setActiveTab] = useState<'draw' | 'stencils' | 'petals' | 'colors'>('draw');
  const [symmetry, setSymmetry] = useState<1 | 2 | 4 | 6 | 8 | 12>(6);
  const [brushSize, setBrushSize] = useState<number>(14);
  const [isMirror, setIsMirror] = useState<boolean>(false);
  const [selectedStencil, setSelectedStencil] = useState<StencilType>('lotus');
  const [selectedPetal, setSelectedPetal] = useState<PetalType>('marigold_orange');
  const [activeColor, setActiveColor] = useState<string>(heldPowderColor || '#FF9933');

  // Keep global config synchronized
  currentRangoliConfig.color = heldPowderColor || activeColor;
  currentRangoliConfig.symmetry = symmetry;
  currentRangoliConfig.brushSize = brushSize;
  currentRangoliConfig.mirror = isMirror;
  currentRangoliConfig.stencil = selectedStencil;
  currentRangoliConfig.petalType = selectedPetal;

  // Only show toolbar when holding powder
  if (handItem !== 'powder') return null;

  const handleColorSelect = (hex: string, name: string) => {
    setActiveColor(hex);
    currentRangoliConfig.color = hex;
    pickUpPowder(hex, name);
    audioManager.playPowderPickup();
  };

  const handleSymmetrySelect = (sym: 1 | 2 | 4 | 6 | 8 | 12) => {
    setSymmetry(sym);
    currentRangoliConfig.symmetry = sym;
    audioManager.playManjiraChime();
  };

  const handleApplyStencil = (st: StencilType) => {
    setSelectedStencil(st);
    currentRangoliConfig.stencil = st;
    rangoliEngine.applyStencil(st, heldPowderColor || activeColor);
    audioManager.playPowderSprinkle();
  };

  const handleDrawKolam = () => {
    rangoliEngine.drawKolamGrid();
    audioManager.playManjiraChime();
  };

  const handleUndo = () => {
    if (rangoliEngine.undo()) {
      audioManager.playDiyaLight();
    }
  };

  const handleRedo = () => {
    if (rangoliEngine.redo()) {
      audioManager.playDiyaLight();
    }
  };

  const handleClear = () => {
    rangoliEngine.clearAll();
    audioManager.playDiyaLight();
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-3 pointer-events-auto select-none animate-[slide-up_0.25s_ease-out]">
      <div className="p-3.5 rounded-3xl bg-black/85 backdrop-blur-xl border border-[#D4AF37]/50 shadow-2xl text-white">
        {/* Top Header: Active Color & Tabs */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 gap-2">
          {/* Active Hand Color Pill */}
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full border-2 border-white/80 shadow-md flex-shrink-0"
              style={{ backgroundColor: heldPowderColor || activeColor }}
            />
            <span className="text-xs font-semibold text-[#FFE8C2] truncate">
              {heldPowderName || 'Rangoli Powder'}
            </span>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('draw');
                currentRangoliConfig.toolMode = 'brush';
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'draw' ? 'bg-[#D4AF37] text-black font-semibold shadow' : 'text-white/70 hover:text-white'
              }`}
            >
              ✏️ Draw
            </button>
            <button
              onClick={() => {
                setActiveTab('stencils');
                currentRangoliConfig.toolMode = 'stencil';
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'stencils' ? 'bg-[#D4AF37] text-black font-semibold shadow' : 'text-white/70 hover:text-white'
              }`}
            >
              🪷 Stencils
            </button>
            <button
              onClick={() => {
                setActiveTab('petals');
                currentRangoliConfig.toolMode = 'petal_stamp';
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'petals' ? 'bg-[#D4AF37] text-black font-semibold shadow' : 'text-white/70 hover:text-white'
              }`}
            >
              🌸 Petals
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'colors' ? 'bg-[#D4AF37] text-black font-semibold shadow' : 'text-white/70 hover:text-white'
              }`}
            >
              🎨 18 Colors
            </button>
          </div>

          {/* Put away bowl */}
          <button
            onClick={clearHand}
            title="Put away bowl & resume normal exploration"
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab 1: Draw Controls (Symmetry & Brush Size) */}
        {activeTab === 'draw' && (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Radial Symmetry Selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-white/60 text-[11px] font-medium">Symmetry:</span>
              {([1, 2, 4, 6, 8, 12] as const).map(sym => (
                <button
                  key={`sym-${sym}`}
                  onClick={() => handleSymmetrySelect(sym)}
                  className={`w-7 h-7 rounded-lg font-semibold text-xs flex items-center justify-center transition-all ${
                    symmetry === sym
                      ? 'bg-[#FF9933] text-black shadow-md scale-105'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {sym === 1 ? 'Free' : `${sym}x`}
                </button>
              ))}
              {/* Mirror toggle */}
              <button
                onClick={() => {
                  const next = !isMirror;
                  setIsMirror(next);
                  currentRangoliConfig.mirror = next;
                }}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isMirror ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                title="Mirror symmetry"
              >
                🪞 Mirror
              </button>
            </div>

            {/* Brush Size Selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-white/60 text-[11px] font-medium">Width:</span>
              {[
                { size: 6, label: 'Fine' },
                { size: 14, label: 'Med' },
                { size: 24, label: 'Thick' },
              ].map(b => (
                <button
                  key={`brush-${b.size}`}
                  onClick={() => {
                    setBrushSize(b.size);
                    currentRangoliConfig.brushSize = b.size;
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    brushSize === b.size
                      ? 'bg-[#D4AF37] text-black font-bold shadow'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Utility actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleDrawKolam}
                title="Add traditional Pulli Kolam dot grid guide"
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFE8C2] text-xs font-medium transition-colors"
              >
                💠 Kolam Dots
              </button>
              <button
                onClick={handleUndo}
                title="Undo last stroke"
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm"
              >
                ↶
              </button>
              <button
                onClick={handleRedo}
                title="Redo stroke"
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm"
              >
                ↷
              </button>
              <button
                onClick={handleClear}
                title="Clear Rangoli canvas"
                className="w-7 h-7 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 flex items-center justify-center text-xs"
              >
                🗑️
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Stencil Stamp Selection */}
        {activeTab === 'stencils' && (
          <div className="flex items-center justify-between gap-2 overflow-x-auto py-1">
            <span className="text-[11px] text-white/60 whitespace-nowrap">Stamp Traditional Stencil:</span>
            {[
              { type: 'lotus' as StencilType, label: 'Lotus (Padma)', icon: '🪷' },
              { type: 'diya' as StencilType, label: 'Auspicious Diya', icon: '🪔' },
              { type: 'peacock' as StencilType, label: 'Regal Peacock', icon: '🦚' },
              { type: 'mandala' as StencilType, label: 'Sacred Mandala', icon: '🏵️' },
              { type: 'kalash' as StencilType, label: 'Purna Kalash', icon: '🏺' },
              { type: 'paisley' as StencilType, label: 'Paisley / Kalka', icon: '🥭' },
            ].map(st => (
              <button
                key={st.type}
                onClick={() => handleApplyStencil(st.type)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-amber-600/40 border border-white/15 hover:border-amber-400 text-xs font-medium transition-all whitespace-nowrap"
              >
                <span>{st.icon}</span>
                <span>{st.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tab 3: Petal Stamp Selection */}
        {activeTab === 'petals' && (
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-white/60 text-[11px] whitespace-nowrap">Click canvas to stamp flower petals:</span>
            {[
              { type: 'marigold_orange' as PetalType, label: 'Marigold Orange', hex: '#FF6F00' },
              { type: 'marigold_yellow' as PetalType, label: 'Marigold Yellow', hex: '#FFD54F' },
              { type: 'rose_red' as PetalType, label: 'Gulab Red', hex: '#C2185B' },
              { type: 'jasmine_white' as PetalType, label: 'Mogra White', hex: '#FFFFFF' },
            ].map(pt => (
              <button
                key={pt.type}
                onClick={() => {
                  setSelectedPetal(pt.type);
                  currentRangoliConfig.petalType = pt.type;
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  selectedPetal === pt.type
                    ? 'bg-amber-600/50 border-amber-400 font-semibold shadow'
                    : 'bg-white/10 border-white/15 hover:bg-white/20'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full border border-white/50" style={{ backgroundColor: pt.hex }} />
                <span>{pt.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tab 4: 18 Powder Color Swatches (Auto-Switching) */}
        <div className="mt-2.5 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-white/50 tracking-wider uppercase font-semibold">
              Authentic Powder Rack (18 Colors — Auto-Switch Bowl)
            </span>
            <span className="text-[10px] text-[#FFE8C2]/70">Tap color to switch held bowl</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {ALL_18_RANGOLI_COLORS.map(col => {
              const isSelected = (heldPowderColor || activeColor).toLowerCase() === col.hex.toLowerCase();
              return (
                <button
                  key={col.id}
                  onClick={() => handleColorSelect(col.hex, col.name)}
                  title={`${col.name} (${col.hex})`}
                  className={`group relative flex-shrink-0 w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                    isSelected
                      ? 'border-[#FFE8C2] scale-110 shadow-[0_0_12px_rgba(255,215,0,0.8)]'
                      : 'border-white/30 hover:border-white/70 hover:scale-105'
                  }`}
                  style={{ backgroundColor: col.hex }}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ExperienceConfig, ModuleId, TemplateId } from '@/types/experience';
import { festiveAudio } from '@/lib/festive-sound';

// =============================================
// TEMPLATE THEME CONFIGURATOR
// =============================================
export function getTemplateTheme(id: TemplateId) {
  const themes: Record<TemplateId, {
    id: TemplateId;
    name: string;
    bg: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    muted: string;
    cardBorder: string;
    fontDisplay: string;
    patternType: 'mandala' | 'marigold' | 'minimal' | 'stars' | 'floral' | 'confetti';
  }> = {
    'royal-gold': {
      id: 'royal-gold',
      name: 'Royal Gold',
      bg: 'linear-gradient(180deg, #0A0A1A 0%, #151528 50%, #0A0A1A 100%)',
      surface: 'rgba(26,26,46,0.92)',
      primary: '#D4AF37',
      secondary: '#B8860B',
      accent: '#FF6B35',
      text: '#FFF8E7',
      muted: 'rgba(255,248,231,0.65)',
      cardBorder: 'rgba(212,175,55,0.35)',
      fontDisplay: 'Cormorant Garamond, serif',
      patternType: 'mandala',
    },
    'traditional-rangoli': {
      id: 'traditional-rangoli',
      name: 'Traditional Rangoli',
      bg: 'linear-gradient(180deg, #240802 0%, #170401 50%, #2A0902 100%)',
      surface: 'rgba(48,12,4,0.92)',
      primary: '#FF6B35',
      secondary: '#FFC107',
      accent: '#E91E63',
      text: '#FFF5EA',
      muted: 'rgba(255,245,234,0.65)',
      cardBorder: 'rgba(255,107,53,0.35)',
      fontDisplay: 'Cormorant Garamond, serif',
      patternType: 'marigold',
    },
    'minimal-luxe': {
      id: 'minimal-luxe',
      name: 'Minimal Luxe',
      bg: 'linear-gradient(180deg, #FAFAF5 0%, #F5F0E8 50%, #ECE7DD 100%)',
      surface: 'rgba(250,250,245,0.95)',
      primary: '#B89230',
      secondary: '#7A6229',
      accent: '#C9A84C',
      text: '#221C14',
      muted: 'rgba(34,28,20,0.65)',
      cardBorder: 'rgba(184,146,48,0.25)',
      fontDisplay: 'Cormorant Garamond, serif',
      patternType: 'minimal',
    },
    'midnight-celebration': {
      id: 'midnight-celebration',
      name: 'Midnight Celebration',
      bg: 'linear-gradient(180deg, #020617 0%, #0B1120 50%, #160D2D 100%)',
      surface: 'rgba(15,23,42,0.92)',
      primary: '#A78BFA',
      secondary: '#EC4899',
      accent: '#F59E0B',
      text: '#F1F5F9',
      muted: 'rgba(241,245,249,0.65)',
      cardBorder: 'rgba(167,139,250,0.3)',
      fontDisplay: 'Cormorant Garamond, serif',
      patternType: 'stars',
    },
    'marigold-glow': {
      id: 'marigold-glow',
      name: 'Marigold Glow',
      bg: 'linear-gradient(180deg, #1A0B00 0%, #0E0500 50%, #200D00 100%)',
      surface: 'rgba(35,15,0,0.92)',
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#10B981',
      text: '#FEF3C7',
      muted: 'rgba(254,243,199,0.65)',
      cardBorder: 'rgba(245,158,11,0.35)',
      fontDisplay: 'Cormorant Garamond, serif',
      patternType: 'floral',
    },
    'festive-fun': {
      id: 'festive-fun',
      name: 'Festive Fun',
      bg: 'linear-gradient(180deg, #1C0A00 0%, #0F0800 50%, #240E00 100%)',
      surface: 'rgba(38,18,0,0.92)',
      primary: '#FF4D4D',
      secondary: '#3B82F6',
      accent: '#22C55E',
      text: '#FFF7ED',
      muted: 'rgba(255,247,237,0.7)',
      cardBorder: 'rgba(255,77,77,0.35)',
      fontDisplay: 'Cormorant Garamond, serif',
      patternType: 'confetti',
    },
  };
  return themes[id] || themes['royal-gold'];
}

// Background Motif Renderer for each template
function TemplateBackgroundDecor({ theme }: { theme: ReturnType<typeof getTemplateTheme> }) {
  if (theme.patternType === 'mandala') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full border-2 border-[#D4AF37] animate-[spin_120s_linear_infinite]" />
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full border border-dashed border-[#D4AF37]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full border-2 border-[#D4AF37] animate-[spin_90s_linear_infinite_reverse]" />
      </div>
    );
  }
  if (theme.patternType === 'marigold') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <div className="absolute top-0 inset-x-0 h-6 flex justify-around">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-5 h-5 rounded-full bg-[#FF6B35] border border-[#FFC107] -translate-y-2 shadow-sm" />
          ))}
        </div>
      </div>
    );
  }
  if (theme.patternType === 'stars') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white animate-pulse"
            style={{
              top: `${(i * 19) % 100}%`,
              left: `${(i * 31) % 100}%`,
              animationDuration: `${1.5 + (i % 4) * 0.5}s`,
            }}
          />
        ))}
      </div>
    );
  }
  if (theme.patternType === 'floral') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <div className="absolute top-2 left-2 text-2xl">🌼</div>
        <div className="absolute top-2 right-2 text-2xl">🌼</div>
        <div className="absolute bottom-4 left-4 text-2xl">🌸</div>
        <div className="absolute bottom-4 right-4 text-2xl">🌸</div>
      </div>
    );
  }
  if (theme.patternType === 'confetti') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-6 left-1/4 text-xl">🎉</div>
        <div className="absolute top-12 right-1/4 text-xl">✨</div>
        <div className="absolute bottom-16 left-1/3 text-xl">🎆</div>
      </div>
    );
  }
  return null;
}

// =============================================
// MODULE 1: WELCOME SCREEN (ENVELOPE / DOOR)
// =============================================
function ModuleWelcome({
  experience,
  theme,
  onComplete,
}: {
  experience: ExperienceConfig;
  theme: ReturnType<typeof getTemplateTheme>;
  onComplete: () => void;
}) {
  const [opened, setOpened] = useState(false);
  const p = experience.personalization;

  const handleOpen = () => {
    festiveAudio.playCelebration();
    setOpened(true);
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative text-center">
      <div className="max-w-md w-full relative z-10 animate-[reveal-up_0.6s_ease-out]">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 bg-white/5 border border-white/10 text-[#FF6B35]">
          ✦ Deepotsav ✦
        </div>

        <p className="text-sm font-medium mb-2 tracking-wide" style={{ color: theme.muted }}>
          A personalized Diwali celebration from
        </p>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8"
          style={{ fontFamily: theme.fontDisplay, color: theme.primary }}
        >
          {p.senderName || 'Your Loved One'}
        </h1>

        {/* Interactive Envelope / Box */}
        <div className="my-6 flex justify-center">
          <button
            onClick={handleOpen}
            className={`group relative cursor-pointer transition-all duration-700 ${
              opened ? 'scale-110 -translate-y-4 opacity-90' : 'hover:scale-105 active:scale-95'
            }`}
            style={{ width: '240px', height: '170px' }}
            aria-label="Open Diwali Greeting"
          >
            <svg width="240" height="170" viewBox="0 0 240 170" className="drop-shadow-2xl">
              <defs>
                <linearGradient id="envelopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={theme.primary} />
                  <stop offset="100%" stopColor={theme.secondary} />
                </linearGradient>
              </defs>

              {/* Envelope Body */}
              <rect x="10" y="45" width="220" height="115" rx="10" fill={theme.surface} stroke={theme.primary} strokeWidth="2" />
              {/* Envelope Flap */}
              <path
                d={opened ? 'M 10 45 L 120 5 L 230 45' : 'M 10 45 L 120 100 L 230 45'}
                fill={opened ? 'none' : 'url(#envelopeGrad)'}
                stroke={theme.primary}
                strokeWidth="2"
                className="transition-all duration-500"
              />
              {/* Bottom V Fold */}
              <path d="M 10 160 L 120 105 L 230 160" fill={theme.surface} opacity="0.6" stroke={theme.primary} strokeWidth="1" />
              {/* Diya Wax Seal */}
              {!opened && (
                <g className="animate-pulse">
                  <circle cx="120" cy="100" r="16" fill="#E8341A" stroke="#FFC107" strokeWidth="2" />
                  <text x="120" y="105" fontSize="13" textAnchor="middle" fill="#FFC107">🪔</text>
                </g>
              )}
            </svg>

            {!opened && (
              <div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold tracking-wider text-white/70 animate-bounce whitespace-nowrap bg-black/40 px-3 py-1 rounded-full border border-white/10"
              >
                Tap to Open Wish ↓
              </div>
            )}
          </button>
        </div>

        {/* Recipient Dedication */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Specially for</p>
          <h2
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: theme.fontDisplay, color: theme.text }}
          >
            {p.recipientName ? `${p.recipientName} ✨` : 'You & Your Family ✨'}
          </h2>
        </div>

        <button
          onClick={handleOpen}
          className="btn-festive mt-8 w-full sm:w-auto px-8 py-3.5 rounded-full text-base font-bold transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 mx-auto"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            color: '#0A0A1A',
            minHeight: '48px',
          }}
        >
          <span>Begin Celebration</span>
          <span>🪔</span>
        </button>
      </div>
    </div>
  );
}

// =============================================
// MODULE 2: LIGHT THE DIYAS
// =============================================
function ModuleDiyaLighting({
  theme,
  onComplete,
}: {
  theme: ReturnType<typeof getTemplateTheme>;
  onComplete: () => void;
}) {
  const DIYA_COUNT = 5;
  const [litState, setLitState] = useState<boolean[]>(Array(DIYA_COUNT).fill(false));
  const [completed, setCompleted] = useState(false);

  const lightDiya = (index: number) => {
    if (litState[index]) return;
    festiveAudio.playDiyaChime(1 + index * 0.15);

    setLitState(prev => {
      const next = [...prev];
      next[index] = true;
      const count = next.filter(Boolean).length;
      if (count === DIYA_COUNT) {
        setCompleted(true);
        festiveAudio.playCelebration();
        setTimeout(onComplete, 2200);
      }
      return next;
    });
  };

  const litCount = litState.filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 py-12 text-center max-w-lg mx-auto">
      <div>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 bg-[#D4AF37]/10 text-[#D4AF37]">
          Activity 1 of 6
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: theme.fontDisplay, color: theme.primary }}>
          Light the Diyas 🪔
        </h2>
        <p className="text-xs sm:text-sm text-white/70 max-w-xs mx-auto">
          {completed
            ? '✨ All diyas are glowing bright! May your year be filled with light!'
            : `Tap each diya to light it. (${litCount}/${DIYA_COUNT} lit)`}
        </p>

        {/* Progress Bar */}
        <div className="w-48 h-2 rounded-full bg-white/10 mx-auto mt-4 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(litCount / DIYA_COUNT) * 100}%`,
              background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`,
              boxShadow: `0 0 10px ${theme.primary}`,
            }}
          />
        </div>
      </div>

      {/* Diyas Row / Arch */}
      <div className="w-full my-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {litState.map((lit, i) => (
          <button
            key={i}
            onClick={() => lightDiya(i)}
            className={`relative p-2 rounded-2xl transition-all duration-300 min-w-[56px] min-h-[56px] flex items-center justify-center ${
              lit ? 'scale-110 drop-shadow-[0_0_20px_rgba(255,193,7,0.7)]' : 'hover:scale-105 active:scale-95 opacity-70'
            }`}
            style={{
              background: lit ? 'radial-gradient(circle, rgba(255,193,7,0.2) 0%, transparent 70%)' : 'transparent',
            }}
            aria-label={lit ? `Diya ${i + 1} lit` : `Light diya ${i + 1}`}
          >
            <svg width="68" height="68" viewBox="0 0 68 68">
              {/* Diya Base */}
              <ellipse cx="34" cy="52" rx="26" ry="10" fill={lit ? '#C97D18' : '#6A4310'} />
              <path d="M 8 52 Q 12 38 34 34 Q 56 38 60 52 Z" fill={lit ? '#E89825' : '#8B5A1A'} />
              <ellipse cx="34" cy="38" rx="22" ry="7" fill={lit ? '#FFC107' : '#B8860B'} />
              {/* Wick */}
              <line x1="34" y1="36" x2="34" y2="24" stroke={lit ? '#5A2A00' : '#331B05'} strokeWidth="2.5" strokeLinecap="round" />
              {/* Flame */}
              {lit && (
                <g className="animate-[flame_1.2s_ease-in-out_infinite]" style={{ transformOrigin: '34px 24px' }}>
                  <ellipse cx="34" cy="18" rx="7" ry="11" fill="#FF5722" opacity="0.9" />
                  <ellipse cx="34" cy="16" rx="4.5" ry="7.5" fill="#FFC107" />
                  <ellipse cx="34" cy="15" rx="2" ry="4" fill="#FFFFFF" />
                  <circle cx="34" cy="18" r="14" fill="#FFA000" opacity="0.2" />
                </g>
              )}
            </svg>
            {!lit && (
              <span className="absolute -bottom-2 text-[10px] text-white/50 tracking-wider">Tap</span>
            )}
          </button>
        ))}
      </div>

      <div className="w-full flex items-center justify-between">
        <button
          onClick={onComplete}
          className="text-xs text-white/40 hover:text-white/70 underline py-2 min-h-[44px]"
        >
          Skip activity →
        </button>
        {completed && (
          <button
            onClick={onComplete}
            className="px-6 py-2.5 rounded-full text-xs font-bold transition-all bg-[#D4AF37] text-[#0A0A1A] animate-bounce min-h-[44px]"
          >
            Continue ✨
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================
// MODULE 3: RANGOLI STUDIO
// =============================================
function ModuleRangoli({
  theme,
  onComplete,
}: {
  theme: ReturnType<typeof getTemplateTheme>;
  onComplete: () => void;
}) {
  const COLORS = ['#E91E63', '#FF9800', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0', '#FFFFFF', '#D4AF37'];
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [filledColors, setFilledColors] = useState<Record<number, string>>({});
  const [complete, setComplete] = useState(false);

  const totalPetals = 8;
  const totalCenter = 1;

  const fillPart = (id: number) => {
    festiveAudio.playSparkle(800 + id * 80);
    setFilledColors(prev => {
      const next = { ...prev, [id]: selectedColor };
      if (Object.keys(next).length >= totalPetals + totalCenter) {
        setComplete(true);
        festiveAudio.playCelebration();
      }
      return next;
    });
  };

  const handleReset = () => {
    setFilledColors({});
    setComplete(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 py-12 text-center max-w-lg mx-auto">
      <div>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 bg-[#FF6B35]/15 text-[#FF6B35]">
          Activity 2 of 6
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: theme.fontDisplay, color: theme.primary }}>
          Rangoli Studio 🎨
        </h2>
        <p className="text-xs sm:text-sm text-white/70">
          Pick a colour and tap any petal to decorate your rangoli.
        </p>
      </div>

      {/* Color Swatches (Touch Friendly >44px) */}
      <div className="my-3 flex flex-wrap justify-center gap-2">
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => setSelectedColor(c)}
            className={`w-9 h-9 rounded-full transition-all border-2 ${
              selectedColor === c ? 'scale-125 border-white shadow-lg' : 'border-transparent opacity-80'
            }`}
            style={{ backgroundColor: c, boxShadow: selectedColor === c ? `0 0 12px ${c}` : 'none' }}
            aria-label={`Select color ${c}`}
          />
        ))}
      </div>

      {/* Rangoli Vector Canvas */}
      <div className="relative my-4 flex justify-center">
        <svg width="280" height="280" viewBox="0 0 280 280" className="drop-shadow-2xl">
          {/* Base outer circle */}
          <circle cx="140" cy="140" r="130" fill="rgba(0,0,0,0.3)" stroke={theme.primary} strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 8 Outer Petals */}
          {[...Array(totalPetals)].map((_, i) => {
            const angle = (i * 360) / totalPetals;
            const color = filledColors[i] || 'rgba(255,255,255,0.12)';
            return (
              <g key={i} transform={`rotate(${angle} 140 140)`}>
                <path
                  d="M 140 140 C 120 70 120 30 140 20 C 160 30 160 70 140 140"
                  fill={color}
                  stroke={theme.primary}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all hover:opacity-90 active:scale-95"
                  onClick={() => fillPart(i)}
                />
                <circle cx="140" cy="40" r="4" fill="#FFFFFF" opacity="0.7" />
              </g>
            );
          })}

          {/* Center Circle */}
          <circle
            cx="140"
            cy="140"
            r="28"
            fill={filledColors[100] || 'rgba(255,255,255,0.2)'}
            stroke={theme.primary}
            strokeWidth="2"
            className="cursor-pointer transition-all hover:scale-105"
            onClick={() => fillPart(100)}
          />
          <text x="140" y="145" fontSize="16" textAnchor="middle" fill="#FFFFFF" pointerEvents="none">
            🪔
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div className="w-full flex items-center justify-between gap-4">
        <button
          onClick={handleReset}
          className="text-xs px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 min-h-[44px]"
        >
          Clear &amp; Reset 🔄
        </button>

        <button
          onClick={onComplete}
          className="btn-festive px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md min-h-[44px]"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: '#0A0A1A' }}
        >
          {complete ? 'Wonderful! Continue →' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}

// =============================================
// MODULE 4: FIREWORKS
// =============================================
function ModuleFireworks({
  theme,
  onComplete,
}: {
  theme: ReturnType<typeof getTemplateTheme>;
  onComplete: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [burstCount, setBurstCount] = useState(0);

  const addBurst = useCallback((x: number, y: number) => {
    festiveAudio.playFireworkBurst();
    setBurstCount(c => c + 1);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = [theme.primary, theme.accent, '#FFC107', '#E91E63', '#00E676', '#00E5FF'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const particleCount = 45;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number; alpha: number; color: string;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 4;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
      });
    }

    let frame = 0;
    const animate = () => {
      frame++;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravity
        p.alpha -= 0.02;

        if (p.alpha > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      if (frame < 50) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [theme]);

  // Handle Touch and Click
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addBurst(x, y);
  };

  // Auto trigger initial fireworks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.parentElement?.clientWidth || 360;
    canvas.height = canvas.parentElement?.clientHeight || 450;

    const t1 = setTimeout(() => addBurst(canvas.width * 0.3, canvas.height * 0.35), 400);
    const t2 = setTimeout(() => addBurst(canvas.width * 0.7, canvas.height * 0.3), 900);
    const t3 = setTimeout(() => addBurst(canvas.width * 0.5, canvas.height * 0.25), 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [addBurst]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 py-12 text-center max-w-lg mx-auto relative overflow-hidden select-none">
      <div>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 bg-[#A78BFA]/15 text-[#A78BFA]">
          Activity 3 of 6
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: theme.fontDisplay, color: theme.primary }}>
          Sky of Lights 🎆
        </h2>
        <p className="text-xs sm:text-sm text-white/70">
          Tap anywhere on screen to launch sparkling fireworks!
        </p>
      </div>

      {/* Canvas Area */}
      <div className="w-full flex-1 my-4 relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 min-h-[320px]">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          className="w-full h-full cursor-crosshair touch-none"
        />
        <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none text-xs text-white/40">
          ✨ {burstCount} fireworks ignited
        </div>
      </div>

      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            if (canvas) {
              for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                  addBurst(canvas.width * (0.2 + i * 0.15), canvas.height * (0.2 + (i % 2) * 0.15));
                }, i * 200);
              }
            }
          }}
          className="text-xs px-4 py-2.5 rounded-full bg-white/10 text-white/80 hover:bg-white/20 min-h-[44px]"
        >
          Launch Grand Finale 🌟
        </button>

        <button
          onClick={onComplete}
          className="btn-festive px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md min-h-[44px]"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: '#0A0A1A' }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// =============================================
// MODULE 5: SURPRISE GIFT & SCRATCH-TO-REVEAL
// =============================================
function ModuleGiftReveal({
  experience,
  theme,
  onComplete,
}: {
  experience: ExperienceConfig;
  theme: ReturnType<typeof getTemplateTheme>;
  onComplete: () => void;
}) {
  const [mode, setMode] = useState<'box' | 'scratch'>('box');
  const [opened, setOpened] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null);
  const p = experience.personalization;

  const handleOpenBox = () => {
    festiveAudio.playCelebration();
    setOpened(true);
  };

  // Scratch card canvas setup
  useEffect(() => {
    if (mode !== 'scratch' || opened) return;
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 280;
    canvas.height = 180;

    // Metallic gold foil layer
    const grad = ctx.createLinearGradient(0, 0, 280, 180);
    grad.addColorStop(0, '#D4AF37');
    grad.addColorStop(0.5, '#FFF2B2');
    grad.addColorStop(1, '#B8860B');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 280, 180);

    // Text on gold foil
    ctx.fillStyle = '#0A0A1A';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH WITH FINGER ✨', 140, 95);
  }, [mode, opened]);

  const handleScratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    setScratchPercent(prev => {
      const next = prev + 4;
      if (next >= 60 && !opened) {
        setOpened(true);
        festiveAudio.playCelebration();
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 py-12 text-center max-w-lg mx-auto">
      <div>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 bg-[#FF6B35]/15 text-[#FF6B35]">
          Activity 4 of 6
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: theme.fontDisplay, color: theme.primary }}>
          Open Your Surprise 🎁
        </h2>
        <p className="text-xs sm:text-sm text-white/70">
          A personal Diwali blessing waiting inside for you.
        </p>

        {/* Mode selector */}
        {!opened && (
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => setMode('box')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                mode === 'box' ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-white/60'
              }`}
            >
              🎁 Animated Gift Box
            </button>
            <button
              onClick={() => setMode('scratch')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                mode === 'scratch' ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-white/60'
              }`}
            >
              🪙 Scratch Card
            </button>
          </div>
        )}
      </div>

      {/* Main Interactive Stage */}
      <div className="my-6 w-full flex justify-center items-center min-h-[220px]">
        {!opened ? (
          mode === 'box' ? (
            <button
              onClick={handleOpenBox}
              className="group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="Open Gift Box"
            >
              <div className="relative text-7xl sm:text-8xl animate-bounce">
                🎁
              </div>
              <p className="mt-4 text-xs font-semibold text-[#D4AF37] tracking-wider uppercase bg-white/5 px-4 py-1.5 rounded-full border border-[#D4AF37]/30">
                Tap Gift Box to Unbox ✨
              </p>
            </button>
          ) : (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/40 w-[280px] h-[180px]">
              {/* Underlying surprise text */}
              <div className="absolute inset-0 bg-[#1A1A2E] p-4 flex flex-col justify-center items-center text-center">
                <span className="text-3xl mb-1">🪔</span>
                <p className="text-sm font-bold text-[#D4AF37]">Shubh Deepawali!</p>
                <p className="text-xs text-white/80 line-clamp-2 mt-1">{p.mainMessage}</p>
              </div>
              {/* Scratchable Canvas */}
              <canvas
                ref={scratchCanvasRef}
                onPointerMove={e => e.buttons === 1 && handleScratch(e)}
                onPointerDown={handleScratch}
                className="absolute inset-0 cursor-pointer touch-none"
              />
            </div>
          )
        ) : (
          /* Revealed Surprise Card */
          <div
            className="w-full max-w-sm p-6 rounded-3xl border shadow-2xl animate-[reveal-up_0.6s_ease-out]"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
            }}
          >
            <div className="text-4xl mb-2">🎉</div>
            <h3
              className="text-xl sm:text-2xl font-bold mb-2"
              style={{ fontFamily: theme.fontDisplay, color: theme.primary }}
            >
              {p.greeting || 'Happy Diwali!'}
            </h3>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed my-3 italic">
              &ldquo;{p.mainMessage}&rdquo;
            </p>
            <p className="text-xs font-semibold text-[#D4AF37] mt-3">
              — {p.signature || p.senderName || 'Best Wishes'}
            </p>
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-between">
        <button
          onClick={onComplete}
          className="text-xs text-white/40 hover:text-white/70 underline py-2 min-h-[44px]"
        >
          Skip activity →
        </button>
        <button
          onClick={onComplete}
          className="btn-festive px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md min-h-[44px]"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: '#0A0A1A' }}
        >
          Continue to Memories →
        </button>
      </div>
    </div>
  );
}

// =============================================
// MODULE 6: MEMORY GALLERY (TOUCH CAROUSEL)
// =============================================
function ModuleMemoryGallery({
  experience,
  theme,
  onComplete,
}: {
  experience: ExperienceConfig;
  theme: ReturnType<typeof getTemplateTheme>;
  onComplete: () => void;
}) {
  const photos = experience.media.photos;
  const [activeIdx, setActiveIdx] = useState(0);

  // If no uploaded photos, provide festive curated Diwali images
  const displayPhotos = photos.length > 0 ? photos : [
    {
      id: 'default-1',
      url: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80',
      caption: 'Lighting the path with happiness and hope 🪔',
      order: 0,
    },
    {
      id: 'default-2',
      url: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80',
      caption: 'Festive rangoli colors bringing positivity home 🌸',
      order: 1,
    },
    {
      id: 'default-3',
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      caption: 'Sparklers and warm smiles with loved ones ✨',
      order: 2,
    },
  ];

  const nextPhoto = () => setActiveIdx(i => (i + 1) % displayPhotos.length);
  const prevPhoto = () => setActiveIdx(i => (i - 1 + displayPhotos.length) % displayPhotos.length);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 py-12 text-center max-w-lg mx-auto">
      <div>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 bg-[#D4AF37]/15 text-[#D4AF37]">
          Activity 5 of 6
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: theme.fontDisplay, color: theme.primary }}>
          Diwali Memories 📸
        </h2>
        <p className="text-xs sm:text-sm text-white/70">
          Cherishing warm moments together this festive season.
        </p>
      </div>

      {/* Carousel */}
      <div className="w-full my-4 relative">
        <div
          className="relative rounded-3xl overflow-hidden border shadow-2xl bg-black/50 aspect-[4/3] flex items-center justify-center"
          style={{ borderColor: theme.cardBorder }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayPhotos[activeIdx].url}
            alt={displayPhotos[activeIdx].caption || 'Diwali Memory'}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Caption Overlay */}
          {displayPhotos[activeIdx].caption && (
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <p className="text-xs sm:text-sm text-white font-medium">
                {displayPhotos[activeIdx].caption}
              </p>
            </div>
          )}

          {/* Nav buttons (>44px touch targets) */}
          <button
            onClick={prevPhoto}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center text-xl hover:bg-black/80 transition-all border border-white/20"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            onClick={nextPhoto}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center text-xl hover:bg-black/80 transition-all border border-white/20"
            aria-label="Next photo"
          >
            ›
          </button>
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-1.5 mt-3">
          {displayPhotos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`h-2 rounded-full transition-all ${
                activeIdx === i ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/20'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="w-full flex items-center justify-between">
        <button
          onClick={onComplete}
          className="text-xs text-white/40 hover:text-white/70 underline py-2 min-h-[44px]"
        >
          Skip activity →
        </button>
        <button
          onClick={onComplete}
          className="btn-festive px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md min-h-[44px]"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: '#0A0A1A' }}
        >
          Personal Wishes →
        </button>
      </div>
    </div>
  );
}

// =============================================
// MODULE 7: PERSONAL WISHES
// =============================================
function ModulePersonalWishes({
  experience,
  theme,
  onComplete,
}: {
  experience: ExperienceConfig;
  theme: ReturnType<typeof getTemplateTheme>;
  onComplete: () => void;
}) {
  const p = experience.personalization;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 py-12 text-center max-w-lg mx-auto">
      <div>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 bg-[#FFC107]/15 text-[#FFC107]">
          Activity 6 of 6
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: theme.fontDisplay, color: theme.primary }}>
          Heartfelt Wishes 💝
        </h2>
        <p className="text-xs sm:text-sm text-white/70">
          A traditional Diwali blessing penned especially for you.
        </p>
      </div>

      {/* Greeting Parchment Card */}
      <div
        className="my-6 w-full p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden text-left"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="absolute top-3 right-3 text-3xl opacity-20">🪔</div>

        <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
          To {p.recipientName || 'Dear Friend'}
        </p>

        <h3
          className="text-2xl sm:text-3xl font-bold mb-4"
          style={{ fontFamily: theme.fontDisplay, color: theme.primary }}
        >
          {p.greeting || 'Shubh Deepotsav!'}
        </h3>

        <div className="h-0.5 w-12 bg-[#D4AF37]/40 mb-4" />

        <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-4">
          {p.mainMessage}
        </p>

        {p.additionalWishes && (
          <p className="text-xs sm:text-sm text-[#FFC107] italic leading-relaxed mb-4 border-l-2 border-[#FFC107]/40 pl-3">
            {p.additionalWishes}
          </p>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-end">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/40">Warm Regards</p>
            <p className="text-sm sm:text-base font-bold text-[#D4AF37]">
              {p.signature || p.senderName || 'Your Well-wisher'}
            </p>
          </div>
          <span className="text-2xl">✨</span>
        </div>
      </div>

      <div className="w-full flex items-center justify-end">
        <button
          onClick={onComplete}
          className="btn-festive w-full sm:w-auto px-8 py-3 rounded-full text-sm font-bold transition-all shadow-xl min-h-[48px]"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: '#0A0A1A' }}
        >
          Experience Grand Finale 🎆
        </button>
      </div>
    </div>
  );
}

// =============================================
// MODULE 8: GRAND FINALE
// =============================================
function ModuleFinale({
  experience,
  theme,
  onReplay,
}: {
  experience: ExperienceConfig;
  theme: ReturnType<typeof getTemplateTheme>;
  onReplay: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const p = experience.personalization;

  const currentUrl = typeof window !== 'undefined'
    ? (experience.slug ? `${window.location.origin}/experience/${experience.slug}` : window.location.href)
    : '';

  const handleShare = async () => {
    const text = `🪔 *${p.senderName || 'Someone'}* has sent you an interactive Diwali celebration!\n\nOpen your Deepotsav here 👇\n${currentUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Diwali from ${p.senderName || 'Deepotsav'}`,
          text,
          url: currentUrl,
        });
        return;
      } catch {
        // user cancelled or failed, fallback
      }
    }
    // WhatsApp fallback
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center max-w-lg mx-auto relative z-10">
      <div className="w-full animate-[reveal-up_0.6s_ease-out]">
        <div className="text-6xl mb-3 animate-pulse">🪔</div>

        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 bg-[#D4AF37]/20 text-[#D4AF37]">
          ✦ Happy Diwali 2026 ✦
        </div>

        <h1
          className="text-4xl sm:text-5xl font-extrabold mb-2"
          style={{ fontFamily: theme.fontDisplay, color: theme.primary }}
        >
          Subh Deepawali!
        </h1>

        <p className="text-base text-white/80 max-w-xs mx-auto mb-6">
          May the divine light of Diwali illuminate your life with peace, prosperity, health and boundless happiness.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3 w-full max-w-xs mx-auto mb-8">
          <button
            onClick={handleShare}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-[#25D366] shadow-lg shadow-[#25D366]/30 transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>📱 Share on WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30 hover:bg-white/10 transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>🔗 {copied ? '✓ Link Copied to Clipboard!' : 'Copy Experience Link'}</span>
          </button>

          <button
            onClick={onReplay}
            className="w-full py-3 px-6 rounded-2xl font-semibold text-xs text-white/70 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            <span>🔁 Replay from Beginning</span>
          </button>
        </div>

        <a
          href="/create"
          className="inline-block text-xs font-medium text-[#D4AF37] underline tracking-wider py-2"
        >
          ✨ Create Your Own Deepotsav Experience →
        </a>
      </div>
    </div>
  );
}

// =============================================
// MAIN ORCHESTRATOR
// =============================================
export default function ExperienceEngine({
  experience,
  previewMode = false,
}: {
  experience: ExperienceConfig;
  previewMode?: boolean;
}) {
  const theme = getTemplateTheme(experience.appearance.templateId);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const enabledModules = experience.modules
    .filter(m => m.enabled)
    .sort((a, b) => a.order - b.order);

  const [currentIdx, setCurrentIdx] = useState(0);

  const toggleSound = () => {
    festiveAudio.enabled = !audioEnabled;
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      festiveAudio.playDiyaChime(1.2);
    }
  };

  const handleNext = () => {
    setCurrentIdx(i => Math.min(i + 1, enabledModules.length - 1));
  };

  const handlePrev = () => {
    setCurrentIdx(i => Math.max(i - 1, 0));
  };

  const handleReplay = () => {
    setCurrentIdx(0);
  };

  const activeModule = enabledModules[currentIdx] || enabledModules[0];

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden text-white"
      style={{
        background: theme.bg,
        color: theme.text,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <TemplateBackgroundDecor theme={theme} />

      {/* Top Header Controls (Mobile-First Safe Area) */}
      <header className="sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪔</span>
          <span className="text-xs sm:text-sm font-bold tracking-wide" style={{ color: theme.primary }}>
            {theme.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle button (Sound disabled by default) */}
          <button
            onClick={toggleSound}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border min-h-[36px] ${
              audioEnabled
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                : 'bg-white/5 border-white/10 text-white/50'
            }`}
            aria-label={audioEnabled ? 'Mute sound' : 'Enable festive sound'}
          >
            <span>{audioEnabled ? '🔊 Sound On' : '🔇 Sound Off'}</span>
          </button>

          {!previewMode && (
            <div className="text-[11px] font-medium text-white/50 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              {currentIdx + 1} / {enabledModules.length}
            </div>
          )}
        </div>
      </header>

      {/* Step Progress Dots */}
      <div className="px-4 py-1.5 flex gap-1 justify-center bg-black/20">
        {enabledModules.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => setCurrentIdx(idx)}
            className={`h-1 rounded-full transition-all ${
              idx === currentIdx
                ? 'w-6 bg-[#D4AF37]'
                : idx < currentIdx
                ? 'w-2 bg-[#D4AF37]/50'
                : 'w-2 bg-white/20'
            }`}
            aria-label={`Jump to ${m.id}`}
          />
        ))}
      </div>

      {/* Active Module Renderer */}
      <main className="relative z-10 w-full">
        {activeModule.id === 'welcome' && (
          <ModuleWelcome experience={experience} theme={theme} onComplete={handleNext} />
        )}
        {activeModule.id === 'diya-lighting' && (
          <ModuleDiyaLighting theme={theme} onComplete={handleNext} />
        )}
        {activeModule.id === 'rangoli' && (
          <ModuleRangoli theme={theme} onComplete={handleNext} />
        )}
        {activeModule.id === 'fireworks' && (
          <ModuleFireworks theme={theme} onComplete={handleNext} />
        )}
        {activeModule.id === 'gift-reveal' && (
          <ModuleGiftReveal experience={experience} theme={theme} onComplete={handleNext} />
        )}
        {activeModule.id === 'memory-gallery' && (
          <ModuleMemoryGallery experience={experience} theme={theme} onComplete={handleNext} />
        )}
        {activeModule.id === 'personal-wishes' && (
          <ModulePersonalWishes experience={experience} theme={theme} onComplete={handleNext} />
        )}
        {activeModule.id === 'finale' && (
          <ModuleFinale experience={experience} theme={theme} onReplay={handleReplay} />
        )}
      </main>

      {/* Bottom Floating Navigation for Quick Access */}
      {currentIdx > 0 && currentIdx < enabledModules.length - 1 && (
        <footer className="fixed bottom-3 inset-x-0 z-30 px-4 flex justify-between pointer-events-none max-w-lg mx-auto">
          <button
            onClick={handlePrev}
            className="pointer-events-auto px-4 py-2 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-white/70 border border-white/10 hover:bg-black/80 transition-all shadow-lg min-h-[44px]"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="pointer-events-auto px-4 py-2 rounded-full text-xs font-medium bg-[#D4AF37] text-black transition-all shadow-lg min-h-[44px]"
          >
            Next Activity →
          </button>
        </footer>
      )}
    </div>
  );
}

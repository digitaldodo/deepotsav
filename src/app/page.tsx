'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TEMPLATES } from '@/types/experience';
import { festiveAudio } from '@/lib/festive-sound';

// ========================
// Ambient Particle System
// ========================
function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Array<{
      x: number; y: number; vx: number; vy: number;
      alpha: number; size: number; color: string; life: number; maxLife: number;
    }> = [];

    const colors = ['#D4AF37', '#FF6B35', '#FFC107', '#E8341A'];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function spawnParticle() {
      if (!canvas) return;
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 1.0 + 0.3),
        alpha: 0,
        size: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 180 + 90,
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.08) spawnParticle();

      particles = particles.filter(p => p.life < p.maxLife);
      for (const p of particles) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        const lifeRatio = p.life / p.maxLife;
        p.alpha = lifeRatio < 0.1
          ? lifeRatio * 10 * 0.5
          : lifeRatio > 0.7
          ? (1 - (lifeRatio - 0.7) / 0.3) * 0.5
          : 0.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

// ========================
// Diya SVG Component
// ========================
function DiyaSVG({ lit = false, size = 60 }: { lit?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className="transition-all duration-300">
      <ellipse cx="30" cy="45" rx="22" ry="8" fill={lit ? '#D97706' : '#78350F'} />
      <path d="M8 45 Q10 35 30 32 Q50 35 52 45 Z" fill={lit ? '#F59E0B' : '#8B5A1A'} />
      <ellipse cx="30" cy="38" rx="20" ry="10" fill={lit ? '#FCD34D' : '#A07820'} />
      <ellipse cx="30" cy="37" rx="12" ry="5" fill={lit ? '#FDE68A' : '#B8860B'} />
      <line x1="30" y1="37" x2="30" y2="28" stroke={lit ? '#92400E' : '#451A03'} strokeWidth="2" strokeLinecap="round" />
      {lit && (
        <g className="animate-[flame_1.2s_ease-in-out_infinite]" style={{ transformOrigin: '30px 28px' }}>
          <ellipse cx="30" cy="20" rx="5" ry="9" fill="#FF5722" opacity="0.9" />
          <ellipse cx="30" cy="18" rx="3.5" ry="6" fill="#FFC107" />
          <ellipse cx="30" cy="17" rx="1.5" ry="3" fill="#FEFCE8" />
          <circle cx="30" cy="20" r="11" fill="#FFA000" opacity="0.18" />
        </g>
      )}
    </svg>
  );
}

// ========================
// Main Landing Page
// ========================
export default function HomePage() {
  const [diyas, setDiyas] = useState([false, true, false, false, false]);
  const [scrolled, setScrolled] = useState(false);
  const [activeShowcase, setActiveShowcase] = useState<'diya' | 'rangoli' | 'gift' | 'fireworks'>('diya');

  // Interactive showcase states
  const [showcaseDiyas, setShowcaseDiyas] = useState([true, true, false]);
  const [showcaseRangoliColor, setShowcaseRangoliColor] = useState('#E91E63');
  const [showcasePetals, setShowcasePetals] = useState<Record<number, string>>({ 0: '#FF9800', 1: '#E91E63', 2: '#4CAF50' });
  const [giftOpened, setGiftOpened] = useState(false);
  const [fireworkBurstCount, setFireworkBurstCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const lightDiya = (i: number) => {
    festiveAudio.playDiyaChime(1 + i * 0.15);
    setDiyas(prev => {
      const next = [...prev];
      next[i] = true;
      if (next.every(Boolean)) {
        festiveAudio.playCelebration();
      }
      return next;
    });
  };

  const allLit = diyas.every(Boolean);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#0A0A1A', color: '#FFF8E7' }}>
      <AmbientParticles />

      {/* 1. COMPACT MOBILE-FIRST HEADER */}
      <nav
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,10,26,0.96)' : 'rgba(10,10,26,0.6)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212,175,55,0.15)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🪔</span>
          <span
            className="text-lg sm:text-xl font-bold tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#D4AF37' }}
          >
            Deepotsav
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/create"
            className="btn-festive px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 min-h-[40px]"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #FF6B35)',
              color: '#0A0A1A',
            }}
          >
            <span>Create Wish</span>
            <span>✨</span>
          </Link>
        </div>
      </nav>

      {/* 2. IMMERSIVE HERO SECTION */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-20 pb-12 z-10 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 bg-white/5 border border-[#D4AF37]/30 text-[#FF6B35]">
          <span>✦</span>
          <span>Festival of Lights 2026</span>
          <span>✦</span>
        </div>

        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          <span className="text-gold-gradient">Share the Divine</span>
          <br />
          <span className="text-white">Light of</span>{' '}
          <span className="text-saffron-gradient">Diwali</span>
        </h1>

        <p className="text-sm sm:text-base max-w-md mx-auto mb-8 text-[#FFF8E7]/75 leading-relaxed">
          Craft an immersive, mobile-first Diwali experience for friends and family — interactive diyas, rangoli, canvas fireworks, and personal memories.
        </p>

        {/* Hero Actions */}
        <div className="w-full flex flex-col sm:flex-row gap-3 justify-center mb-10 max-w-xs sm:max-w-md mx-auto">
          <Link
            href="/create"
            className="btn-festive w-full sm:w-auto px-8 py-3.5 rounded-full text-base font-bold transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #FF6B35)',
              color: '#0A0A1A',
              minHeight: '48px',
            }}
          >
            <span>Create Your Diwali Wish</span>
            <span>🪔</span>
          </Link>
          <Link
            href="/experience/demo-royal-gold"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-white/5 transition-all flex items-center justify-center min-h-[48px] gap-1.5"
          >
            <span>Live Recipient Demo</span>
            <span>✨</span>
          </Link>
        </div>

        {/* Interactive Diya Bar (Touch-friendly >44px) */}
        <div className="w-full p-4 rounded-3xl bg-black/40 border border-[#D4AF37]/20 backdrop-blur-md">
          <p className="text-xs font-medium text-[#D4AF37]/80 mb-3 tracking-wide">
            {allLit ? '✨ All diyas glowing! Happy Diwali! ✨' : 'Tap a diya to illuminate 🪔'}
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            {diyas.map((lit, i) => (
              <button
                key={i}
                onClick={() => lightDiya(i)}
                className={`min-w-[48px] min-h-[48px] rounded-2xl flex items-center justify-center transition-all ${
                  lit ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,193,7,0.8)]' : 'opacity-65 active:scale-90 hover:opacity-100'
                }`}
                aria-label={lit ? `Diya ${i + 1} lit` : `Light diya ${i + 1}`}
              >
                <DiyaSVG lit={lit} size={i === 2 ? 58 : 46} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TEMPLATE DISCOVERY SECTION (Swipeable Carousel on Mobile) */}
      <section id="templates" className="relative z-10 py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-xs font-semibold tracking-widest uppercase mb-1 text-[#FF6B35]">
            Six Distinct Designs
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#D4AF37' }}
          >
            Choose Your Diwali Design
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-md mx-auto">
            Swipe sideways on mobile to inspect each unique artistic style.
          </p>
        </div>

        {/* Horizontally scrollable container on smartphones, responsive grid on desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 px-1 -mx-4 sm:mx-0 sm:overflow-visible scrollbar-hide">
          {TEMPLATES.map(t => (
            <div
              key={t.id}
              className="min-w-[280px] sm:min-w-0 snap-center rounded-3xl overflow-hidden border border-[#D4AF37]/20 bg-[#0F0F23] shadow-xl flex flex-col justify-between shrink-0 transition-transform active:scale-98"
            >
              {/* Color Visual Block */}
              <div
                className="h-36 p-4 flex flex-col justify-between relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${t.palette.background}, ${t.palette.secondary})`,
                }}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10">
                    {t.tagline}
                  </span>
                  <span className="text-2xl">🪔</span>
                </div>
                <div className="relative z-10">
                  <h3
                    className="text-xl font-bold text-white drop-shadow"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {t.name}
                  </h3>
                </div>
              </div>

              {/* Description & Select CTA */}
              <div className="p-4 flex-1 flex flex-col justify-between bg-[#0F0F23]">
                <p className="text-xs text-white/70 leading-relaxed mb-4">
                  {t.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex gap-1">
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: t.palette.primary }} />
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: t.palette.secondary }} />
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: t.palette.accent }} />
                  </div>

                  <Link
                    href={`/create?template=${t.id}`}
                    className="text-xs font-bold px-3.5 py-2 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37]/25 transition-all flex items-center gap-1"
                  >
                    <span>Use Template</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE SHOWCASE SECTION */}
      <section className="relative z-10 py-14 px-4 bg-black/40 border-y border-white/5">
        <div className="max-w-md mx-auto text-center">
          <div className="text-xs font-semibold tracking-widest uppercase mb-1 text-[#FF6B35]">
            Interactive Playground
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#D4AF37' }}
          >
            Try the Festive Activities
          </h2>

          {/* Activity Tabs */}
          <div className="flex justify-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 mb-6">
            <button
              onClick={() => setActiveShowcase('diya')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeShowcase === 'diya' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/70'
              }`}
            >
              🪔 Diya
            </button>
            <button
              onClick={() => setActiveShowcase('rangoli')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeShowcase === 'rangoli' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/70'
              }`}
            >
              🎨 Rangoli
            </button>
            <button
              onClick={() => setActiveShowcase('gift')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeShowcase === 'gift' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/70'
              }`}
            >
              🎁 Gift
            </button>
            <button
              onClick={() => setActiveShowcase('fireworks')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeShowcase === 'fireworks' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/70'
              }`}
            >
              🎆 Sparks
            </button>
          </div>

          {/* Activity Canvas Box */}
          <div className="p-6 rounded-3xl bg-[#14142B] border border-white/10 shadow-2xl min-h-[200px] flex flex-col justify-center items-center">
            {activeShowcase === 'diya' && (
              <div className="w-full">
                <p className="text-xs text-white/70 mb-4">Tap to light all three showcase diyas:</p>
                <div className="flex justify-center gap-4">
                  {showcaseDiyas.map((lit, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        festiveAudio.playDiyaChime(1.1 + i * 0.2);
                        setShowcaseDiyas(d => {
                          const n = [...d];
                          n[i] = !n[i];
                          return n;
                        });
                      }}
                      className="p-1 min-w-[50px] min-h-[50px] flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <DiyaSVG lit={lit} size={50} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeShowcase === 'rangoli' && (
              <div className="w-full">
                <div className="flex justify-center gap-1.5 mb-3">
                  {['#E91E63', '#FF9800', '#4CAF50', '#2196F3', '#FFEB3B'].map(c => (
                    <button
                      key={c}
                      onClick={() => setShowcaseRangoliColor(c)}
                      className={`w-6 h-6 rounded-full border ${showcaseRangoliColor === c ? 'scale-125 border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3].map(id => (
                    <button
                      key={id}
                      onClick={() => {
                        festiveAudio.playSparkle(900 + id * 100);
                        setShowcasePetals(p => ({ ...p, [id]: showcaseRangoliColor }));
                      }}
                      className="w-12 h-14 rounded-full border border-white/20 transition-all flex items-center justify-center text-xs active:scale-95"
                      style={{ backgroundColor: showcasePetals[id] || 'rgba(255,255,255,0.1)' }}
                    >
                      🌸
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-white/50 mt-2">Tap petal to fill chosen colour</p>
              </div>
            )}

            {activeShowcase === 'gift' && (
              <div className="w-full">
                {!giftOpened ? (
                  <button
                    onClick={() => {
                      festiveAudio.playCelebration();
                      setGiftOpened(true);
                    }}
                    className="group active:scale-90 transition-transform"
                  >
                    <div className="text-5xl animate-bounce">🎁</div>
                    <p className="text-xs text-[#D4AF37] font-semibold mt-2">Tap to Unbox</p>
                  </button>
                ) : (
                  <div>
                    <div className="text-3xl mb-1">✨ 🪔 ✨</div>
                    <p className="text-xs font-bold text-[#D4AF37]">Surprise Revealed!</p>
                    <p className="text-[11px] text-white/80 mt-1">May your life be filled with sweet moments.</p>
                    <button
                      onClick={() => setGiftOpened(false)}
                      className="text-[10px] text-white/40 underline mt-3"
                    >
                      Close &amp; retry
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeShowcase === 'fireworks' && (
              <div className="w-full">
                <button
                  onClick={() => {
                    festiveAudio.playFireworkBurst();
                    setFireworkBurstCount(c => c + 1);
                  }}
                  className="px-6 py-3 rounded-full bg-[#A78BFA] text-black font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 mx-auto"
                >
                  <span>Launch Sparkler</span>
                  <span>🎆</span>
                </button>
                <p className="text-[11px] text-white/50 mt-3">
                  {fireworkBurstCount > 0 ? `Burst ignited: ${fireworkBurstCount} times ✨` : 'Tap button to trigger audio sparkler'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (3 SIMPLE MOBILE STEPS) */}
      <section className="relative z-10 py-16 px-4 max-w-md mx-auto text-center">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-8"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#D4AF37' }}
        >
          How Deepotsav Works
        </h2>

        <div className="space-y-4 text-left">
          {[
            { step: '1', title: 'Pick a Diwali Design', desc: 'Select from 6 premium artistic templates crafted for Indian festive warmth.' },
            { step: '2', title: 'Personalize & Add Memories', desc: 'Add sender & recipient names, heartfelt greetings, photos, and enable interactive modules.' },
            { step: '3', title: 'Share Link via WhatsApp', desc: 'Publish instantly. Recipients open your gift directly in their smartphone browser without any app install!' },
          ].map(s => (
            <div key={s.step} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black font-bold text-sm flex items-center justify-center shrink-0">
                {s.step}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-0.5">{s.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FINAL CTA & COMPACT MOBILE FOOTER */}
      <section className="relative z-10 py-12 px-4 text-center max-w-md mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1C142B] to-[#0A0A1A] border border-[#D4AF37]/30 shadow-2xl">
          <div className="text-4xl mb-3">🪔</div>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-2 text-[#D4AF37]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Light Up Someone&apos;s Diwali
          </h2>
          <p className="text-xs sm:text-sm text-white/70 mb-6">
            Takes under 2 minutes. Free, instant, and unforgettable.
          </p>
          <Link
            href="/create"
            className="btn-festive w-full py-4 rounded-full text-base font-bold transition-all shadow-xl flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #FF6B35)',
              color: '#0A0A1A',
              minHeight: '48px',
            }}
          >
            <span>Start Creating Now</span>
            <span>✨</span>
          </Link>
        </div>

        <footer className="mt-12 text-center text-xs text-white/40 pb-6">
          <p className="flex items-center justify-center gap-1.5 font-medium text-white/60 mb-1">
            <span>🪔</span>
            <span>Deepotsav</span>
            <span>—</span>
            <span>Premium Diwali Gifting</span>
          </p>
          <p className="text-[11px]">Celebrating the Festival of Lights • Mobile-first web experience</p>
        </footer>
      </section>
    </div>
  );
}

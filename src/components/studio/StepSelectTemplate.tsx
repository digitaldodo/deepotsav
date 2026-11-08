'use client';

import { TEMPLATES, TemplateId, ExperienceConfig } from '@/types/experience';
import { useState } from 'react';

interface Props {
  experience: ExperienceConfig;
  update: (partial: Partial<ExperienceConfig>) => void;
  goNext: () => void;
  goPrev: () => void;
}

const templateBgs: Record<TemplateId, string> = {
  'royal-gold': 'linear-gradient(135deg, #0A0A1A 0%, #1a1a2e 40%, #16213e 100%)',
  'traditional-rangoli': 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 50%, #FFC107 100%)',
  'minimal-luxe': 'linear-gradient(135deg, #FAFAF5 0%, #F5F0E8 50%, #EDE8DC 100%)',
  'midnight-celebration': 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)',
  'marigold-glow': 'linear-gradient(135deg, #1C0A00 0%, #2D1600 50%, #3D2000 100%)',
  'festive-fun': 'linear-gradient(135deg, #EF4444 0%, #F97316 50%, #EAB308 100%)',
};

const templateDecorations: Record<TemplateId, string> = {
  'royal-gold': '👑 Regal • Gold • Traditional',
  'traditional-rangoli': '🌸 Colourful • Festive • Warm',
  'minimal-luxe': '✦ Elegant • Minimal • Sophisticated',
  'midnight-celebration': '🎆 Dramatic • Night • Spectacular',
  'marigold-glow': '🌼 Floral • Warm • Traditional',
  'festive-fun': '🎉 Playful • Vibrant • Joyful',
};

export default function StepSelectTemplate({ experience, update, goNext }: Props) {
  const [hoveredId, setHoveredId] = useState<TemplateId | null>(null);
  const selected = experience.appearance.templateId;

  const selectTemplate = (id: TemplateId) => {
    update({ appearance: { ...experience.appearance, templateId: id } });
  };

  return (
    <div>
      <div className="text-center mb-10">
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#D4AF37', fontWeight: 700 }}>
          Choose Your Template
        </h2>
        <p style={{ color: 'rgba(255,248,231,0.6)', marginTop: '0.5rem' }}>
          Each template is a fully unique experience — not just a colour change.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {TEMPLATES.map(t => {
          const isSelected = t.id === selected;
          const isHovered = t.id === hoveredId;
          return (
            <button
              key={t.id}
              onClick={() => selectTemplate(t.id)}
              onMouseEnter={() => setHoveredId(t.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="text-left rounded-2xl overflow-hidden transition-all"
              style={{
                transform: isHovered || isSelected ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isSelected
                  ? `0 0 0 3px ${t.palette.primary}, 0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${t.palette.primary}40`
                  : isHovered
                  ? '0 12px 40px rgba(0,0,0,0.4)'
                  : '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              {/* Preview area */}
              <div
                className="relative h-36 overflow-hidden"
                style={{ background: templateBgs[t.id] }}
              >
                {/* Template-specific decorative SVG/element */}
                <TemplatePreviewDecoration id={t.id} />

                {/* Selection badge */}
                {isSelected && (
                  <div
                    className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: t.palette.primary, color: '#0A0A1A' }}
                  >
                    ✓
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-10"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
              </div>

              {/* Info */}
              <div
                className="p-4"
                style={{
                  background: '#0D1B2A',
                  borderTop: `1px solid ${t.palette.primary}30`,
                }}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    color: t.palette.primary,
                  }}>
                    {t.name}
                  </h3>
                  {isSelected && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      background: `${t.palette.primary}20`,
                      color: t.palette.primary,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}>
                      SELECTED
                    </span>
                  )}
                </div>
                <p className="text-xs mb-2" style={{ color: t.palette.primary + 'aa', letterSpacing: '0.03em' }}>
                  {templateDecorations[t.id]}
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,248,231,0.5)', lineHeight: 1.5 }}>
                  {t.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={goNext}
          className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)', color: '#0A0A1A' }}
        >
          Personalize Your Experience →
        </button>
      </div>
    </div>
  );
}

function TemplatePreviewDecoration({ id }: { id: TemplateId }) {
  if (id === 'royal-gold') {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="100" height="100" viewBox="0 0 100 100" opacity="0.4">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" strokeWidth="1" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#D4AF37" strokeWidth="1" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="#D4AF37" strokeWidth="1" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
            <line key={a} x1="50" y1="5" x2="50" y2="95"
              stroke="#D4AF37" strokeWidth="0.5" opacity="0.5"
              transform={`rotate(${a}, 50, 50)`} />
          ))}
          <circle cx="50" cy="50" r="5" fill="#D4AF37" opacity="0.6" />
        </svg>
        <div className="absolute bottom-3 text-xs font-medium tracking-widest" style={{ color: '#D4AF37', opacity: 0.7 }}>
          🪔 ROYAL GOLD 🪔
        </div>
      </div>
    );
  }
  if (id === 'traditional-rangoli') {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="100" height="100" viewBox="0 0 100 100" opacity="0.5">
          {[0, 30, 60, 90, 120, 150].map(a => (
            <ellipse key={a} cx="50" cy="50" rx="45" ry="15" fill="none" stroke="white" strokeWidth="1.5"
              transform={`rotate(${a}, 50, 50)`} />
          ))}
          <circle cx="50" cy="50" r="8" fill="white" opacity="0.6" />
          {[0, 60, 120, 180, 240, 300].map((a, i) => (
            <circle key={i} cx={50 + 30 * Math.cos(a * Math.PI / 180)} cy={50 + 30 * Math.sin(a * Math.PI / 180)}
              r="4" fill="rgba(255,193,7,0.8)" />
          ))}
        </svg>
      </div>
    );
  }
  if (id === 'minimal-luxe') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div style={{ color: '#C9A84C', fontSize: '2rem', opacity: 0.5 }}>✦</div>
        <div style={{ color: '#C9A84C', fontSize: '0.65rem', letterSpacing: '0.3em', opacity: 0.4 }}>
          MINIMAL LUXE
        </div>
        <div style={{ width: '60px', height: '1px', background: '#C9A84C', opacity: 0.3 }} />
      </div>
    );
  }
  if (id === 'midnight-celebration') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div key={i}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              top: `${10 + Math.sin(i * 1.3) * 40 + 40}%`,
              left: `${(i * 7) % 100}%`,
              opacity: 0.3 + (i % 3) * 0.2,
              animation: `star-twinkle ${1 + (i % 3) * 0.5}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
        <div className="absolute bottom-3 w-full text-center text-xs tracking-widest" style={{ color: 'rgba(167,139,250,0.6)' }}>
          🎆 MIDNIGHT CELEBRATION
        </div>
      </div>
    );
  }
  if (id === 'marigold-glow') {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="90" height="90" viewBox="0 0 90 90" opacity="0.5">
          {[...Array(8)].map((_, i) => (
            <ellipse key={i} cx="45" cy="22" rx="10" ry="20" fill="#F59E0B"
              transform={`rotate(${i * 45}, 45, 45)`} />
          ))}
          <circle cx="45" cy="45" r="12" fill="#D97706" />
          <circle cx="45" cy="45" r="6" fill="#FEF3C7" />
        </svg>
      </div>
    );
  }
  if (id === 'festive-fun') {
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-4 text-3xl" style={{ opacity: 0.4 }}>
        <span>🎊</span>
        <span>🎆</span>
        <span>🎉</span>
      </div>
    );
  }
  return null;
}

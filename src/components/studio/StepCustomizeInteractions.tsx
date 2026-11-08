'use client';

import { ExperienceConfig, ModuleConfig, ModuleId } from '@/types/experience';

interface Props {
  experience: ExperienceConfig;
  update: (partial: Partial<ExperienceConfig>) => void;
  goNext: () => void;
  goPrev: () => void;
}

const MODULE_INFO: Record<ModuleId, { label: string; desc: string; emoji: string; required?: boolean }> = {
  'welcome': { label: 'Welcome Screen', desc: 'Animated entrance with personalized names', emoji: '🎊', required: true },
  'diya-lighting': { label: 'Light the Diyas', desc: 'Interactive diya lighting with flame animations', emoji: '🪔' },
  'rangoli': { label: 'Create Rangoli', desc: 'Color-fill an interactive rangoli pattern', emoji: '🎨' },
  'fireworks': { label: 'Fireworks Show', desc: 'Canvas-based touch-responsive fireworks', emoji: '🎆' },
  'gift-reveal': { label: 'Surprise Gift', desc: 'Animated gift box or scratch-to-reveal', emoji: '🎁' },
  'memory-gallery': { label: 'Memory Gallery', desc: 'Slideshow of your uploaded photos', emoji: '📸' },
  'personal-wishes': { label: 'Personal Wishes', desc: 'Beautiful message card reveal', emoji: '💝' },
  'finale': { label: 'Grand Finale', desc: 'Spectacular fireworks and Happy Diwali message', emoji: '✨', required: true },
};

export default function StepCustomizeInteractions({ experience, update, goNext, goPrev }: Props) {
  const modules = [...experience.modules].sort((a, b) => a.order - b.order);

  const toggleModule = (id: ModuleId) => {
    if (MODULE_INFO[id]?.required) return;
    const updated = experience.modules.map(m =>
      m.id === id ? { ...m, enabled: !m.enabled } : m
    );
    update({ modules: updated });
  };

  const moveModule = (id: ModuleId, dir: -1 | 1) => {
    const sorted = [...modules];
    const idx = sorted.findIndex(m => m.id === id);
    const target = idx + dir;
    if (target < 0 || target >= sorted.length) return;
    // Swap orders
    const a = sorted[idx].order;
    const b = sorted[target].order;
    const updated = experience.modules.map(m => {
      if (m.id === sorted[idx].id) return { ...m, order: b };
      if (m.id === sorted[target].id) return { ...m, order: a };
      return m;
    });
    update({ modules: updated });
  };

  const sortedModules = [...experience.modules].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="text-center mb-10">
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#D4AF37', fontWeight: 700 }}>
          Customize Activities
        </h2>
        <p style={{ color: 'rgba(255,248,231,0.6)', marginTop: '0.5rem' }}>
          Choose which interactive activities to include and arrange their order.
        </p>
      </div>

      <div className="space-y-3 mb-10">
        {sortedModules.map((module, idx) => {
          const info = MODULE_INFO[module.id];
          return (
            <div
              key={module.id}
              className="flex items-center gap-4 p-4 rounded-xl transition-all"
              style={{
                background: module.enabled ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${module.enabled ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}`,
                opacity: !module.enabled ? 0.6 : 1,
              }}
            >
              {/* Reorder buttons */}
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => moveModule(module.id, -1)}
                  disabled={idx === 0}
                  className="w-6 h-6 rounded flex items-center justify-center text-xs transition-all disabled:opacity-20"
                  style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
                >
                  ▲
                </button>
                <button
                  onClick={() => moveModule(module.id, 1)}
                  disabled={idx === sortedModules.length - 1}
                  className="w-6 h-6 rounded flex items-center justify-center text-xs transition-all disabled:opacity-20"
                  style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
                >
                  ▼
                </button>
              </div>

              {/* Emoji */}
              <div className="text-2xl shrink-0 w-8 text-center">{info.emoji}</div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold" style={{ color: '#FFF8E7' }}>
                    {info.label}
                  </span>
                  {info.required && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{
                      background: 'rgba(212,175,55,0.15)',
                      color: '#D4AF37',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}>
                      REQUIRED
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{info.desc}</p>
              </div>

              {/* Toggle */}
              <button
                onClick={() => toggleModule(module.id)}
                disabled={info.required}
                className="relative w-11 h-6 rounded-full transition-all shrink-0 disabled:cursor-not-allowed"
                style={{
                  background: module.enabled ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: module.enabled ? '1.4rem' : '0.25rem' }}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div
        className="flex items-center gap-6 p-4 rounded-xl mb-8"
        style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}
      >
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: '#D4AF37', fontFamily: 'Cormorant Garamond, serif' }}>
            {experience.modules.filter(m => m.enabled).length}
          </div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Activities</div>
        </div>
        <div style={{ width: '1px', height: '40px', background: 'rgba(212,175,55,0.2)' }} />
        <div className="flex-1">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            Your recipient will experience these activities in order. The Welcome and Finale screens are always shown.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={goPrev} className="px-6 py-2.5 rounded-full text-sm font-medium"
          style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
          ← Back
        </button>
        <button onClick={goNext} className="px-8 py-3 rounded-full font-semibold"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)', color: '#0A0A1A' }}>
          Customize Appearance →
        </button>
      </div>
    </div>
  );
}

'use client';

import { ExperienceConfig, AnimationIntensity } from '@/types/experience';

interface Props {
  experience: ExperienceConfig;
  update: (partial: Partial<ExperienceConfig>) => void;
  goNext: () => void;
  goPrev: () => void;
}

const INTENSITY_OPTIONS: { value: AnimationIntensity; label: string; desc: string }[] = [
  { value: 'minimal', label: 'Minimal', desc: 'Subtle transitions only — best for older devices' },
  { value: 'moderate', label: 'Moderate', desc: 'Balanced animations — recommended for most' },
  { value: 'full', label: 'Full', desc: 'All effects — particles, glows and transitions' },
];

export default function StepAppearance({ experience, update, goNext, goPrev }: Props) {
  const a = experience.appearance;

  const updateAppearance = (partial: Partial<typeof a>) => {
    update({ appearance: { ...a, ...partial } });
  };

  return (
    <div>
      <div className="text-center mb-10">
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#D4AF37', fontWeight: 700 }}>
          Customize Appearance
        </h2>
        <p style={{ color: 'rgba(255,248,231,0.6)', marginTop: '0.5rem' }}>
          Fine-tune the visual and motion experience.
        </p>
      </div>

      {/* Animation intensity */}
      <div className="mb-8">
        <div
          className="text-xs font-semibold mb-4 tracking-widest uppercase"
          style={{ color: '#D4AF37' }}
        >
          Animation Intensity
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {INTENSITY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateAppearance({ animationIntensity: opt.value })}
              className="flex flex-col items-start p-4 rounded-xl transition-all text-left"
              style={{
                background: a.animationIntensity === opt.value ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${a.animationIntensity === opt.value ? '#D4AF37' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: a.animationIntensity === opt.value ? '0 0 20px rgba(212,175,55,0.15)' : 'none',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: a.animationIntensity === opt.value ? '#D4AF37' : 'rgba(255,255,255,0.2)' }}
                />
                <span className="text-sm font-semibold" style={{ color: a.animationIntensity === opt.value ? '#D4AF37' : '#FFF8E7' }}>
                  {opt.label}
                </span>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
                {opt.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Ambient effects toggle */}
      <div
        className="flex items-center justify-between p-5 rounded-xl mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div>
          <div className="text-sm font-semibold mb-0.5" style={{ color: '#FFF8E7' }}>
            ✨ Ambient Particles
          </div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Floating golden particles in the background
          </div>
        </div>
        <button
          onClick={() => updateAppearance({ ambientEffects: !a.ambientEffects })}
          className="relative w-12 h-6 rounded-full transition-all shrink-0"
          style={{ background: a.ambientEffects ? '#D4AF37' : 'rgba(255,255,255,0.1)' }}
        >
          <div
            className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
            style={{ left: a.ambientEffects ? '1.5rem' : '0.25rem' }}
          />
        </button>
      </div>

      {/* Info box */}
      <div
        className="p-4 rounded-xl mb-8"
        style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)' }}
      >
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,248,231,0.7)' }}>
          💡 <strong style={{ color: '#FF6B35' }}>Tip:</strong> The template you selected on Step 1 defines the core visual identity. 
          These settings fine-tune the experience for your recipient&apos;s device capabilities.
        </p>
      </div>

      <div className="flex justify-between">
        <button onClick={goPrev} className="px-6 py-2.5 rounded-full text-sm font-medium"
          style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
          ← Back
        </button>
        <button onClick={goNext} className="px-8 py-3 rounded-full font-semibold"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)', color: '#0A0A1A' }}>
          Advanced Settings →
        </button>
      </div>
    </div>
  );
}

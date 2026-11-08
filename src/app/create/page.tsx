'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ExperienceConfig } from '@/types/experience';
import { createExperience, saveDraft, publishExperience } from '@/lib/local-store';
import StepSelectTemplate from '@/components/studio/StepSelectTemplate';
import StepPersonalize from '@/components/studio/StepPersonalize';
import StepAddMemories from '@/components/studio/StepAddMemories';
import StepCustomizeInteractions from '@/components/studio/StepCustomizeInteractions';
import StepAppearance from '@/components/studio/StepAppearance';
import StepAdvanced from '@/components/studio/StepAdvanced';
import StepPreview from '@/components/studio/StepPreview';

const STEPS = [
  { id: 1, label: 'Template' },
  { id: 2, label: 'Personalize' },
  { id: 3, label: 'Memories' },
  { id: 4, label: 'Activities' },
  { id: 5, label: 'Appearance' },
  { id: 6, label: 'Advanced' },
  { id: 7, label: 'Preview' },
];

export default function CreatePage() {
  const router = useRouter();
  const [experience, setExperience] = useState<ExperienceConfig>(() => createExperience());
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const update = useCallback((partial: Partial<ExperienceConfig>) => {
    setExperience(prev => {
      const updated = { ...prev, ...partial };
      saveDraft(updated);
      return updated;
    });
  }, []);

  const goNext = () => setStep(s => Math.min(s + 1, STEPS.length));
  const goPrev = () => setStep(s => Math.max(s - 1, 1));
  const goTo = (s: number) => setStep(s);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const published = publishExperience(experience);
      setExperience(published);
      router.push(`/share/${published.slug}`);
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveDraft = () => {
    setSaving(true);
    saveDraft(experience);
    setSavedMsg(true);
    setTimeout(() => { setSaving(false); setSavedMsg(false); }, 1200);
  };

  const stepProps = { experience, update, goNext, goPrev };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0A0A1A 0%, #0D1B2A 100%)', color: '#FFF8E7' }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 md:px-6 py-3"
        style={{
          background: 'rgba(10,10,26,0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212,175,55,0.15)',
        }}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-1.5 shrink-0 mr-2">
          <span style={{ color: '#D4AF37', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 700 }}>
            🪔 Deepotsav
          </span>
        </a>

        {/* Step indicators - scrollable on mobile */}
        <div className="flex-1 flex items-center gap-0.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={() => goTo(s.id)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all"
                style={{
                  background: s.id === step ? 'rgba(212,175,55,0.15)' : 'transparent',
                }}
              >
                <div
                  className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all shrink-0"
                  style={{
                    background: s.id === step
                      ? '#D4AF37'
                      : s.id < step
                      ? 'rgba(212,175,55,0.3)'
                      : 'rgba(255,255,255,0.08)',
                    color: s.id === step ? '#0A0A1A' : s.id < step ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {s.id < step ? '✓' : s.id}
                </div>
                <span
                  className="hidden md:inline text-xs font-medium whitespace-nowrap"
                  style={{ color: s.id === step ? '#D4AF37' : 'rgba(255,255,255,0.4)' }}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="w-4 h-px shrink-0" style={{ background: s.id < step ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSaveDraft}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: savedMsg ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
              color: savedMsg ? '#22c55e' : 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {savedMsg ? '✓ Saved' : '💾 Save Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)', color: '#0A0A1A' }}
          >
            {publishing ? '...' : '✨ Publish'}
          </button>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {step === 1 && <StepSelectTemplate {...stepProps} />}
        {step === 2 && <StepPersonalize {...stepProps} />}
        {step === 3 && <StepAddMemories {...stepProps} />}
        {step === 4 && <StepCustomizeInteractions {...stepProps} />}
        {step === 5 && <StepAppearance {...stepProps} />}
        {step === 6 && <StepAdvanced {...stepProps} />}
        {step === 7 && (
          <StepPreview
            {...stepProps}
            onPublish={handlePublish}
            publishing={publishing}
          />
        )}
      </div>
    </div>
  );
}

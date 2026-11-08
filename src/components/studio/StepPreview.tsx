'use client';

import { useState } from 'react';
import { ExperienceConfig, TEMPLATES } from '@/types/experience';
import ExperienceEngine from '@/components/experience/ExperienceEngine';

interface Props {
  experience: ExperienceConfig;
  update: (partial: Partial<ExperienceConfig>) => void;
  goNext: () => void;
  goPrev: () => void;
  onPublish: () => void;
  publishing: boolean;
}

export default function StepPreview({ experience, goPrev, onPublish, publishing }: Props) {
  const [previewMode, setPreviewMode] = useState<'mobile' | 'full'>('mobile');
  const [showLiveSim, setShowLiveSim] = useState(false);
  const template = TEMPLATES.find(t => t.id === experience.appearance.templateId);
  const p = experience.personalization;
  const enabledModules = experience.modules.filter(m => m.enabled).sort((a, b) => a.order - b.order);

  return (
    <div className="pb-16">
      <div className="text-center mb-6">
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#D4AF37', fontWeight: 700 }}>
          Preview &amp; Publish
        </h2>
        <p style={{ color: 'rgba(255,248,231,0.6)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
          Test the interactive recipient experience before sharing.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center items-center gap-2 mb-6">
        <button
          onClick={() => { setShowLiveSim(true); setPreviewMode('mobile'); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            showLiveSim && previewMode === 'mobile'
              ? 'bg-[#D4AF37] text-[#0A0A1A] shadow-lg shadow-[#D4AF37]/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          📱 Smartphone Preview (390px)
        </button>
        <button
          onClick={() => { setShowLiveSim(true); setPreviewMode('full'); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            showLiveSim && previewMode === 'full'
              ? 'bg-[#D4AF37] text-[#0A0A1A] shadow-lg shadow-[#D4AF37]/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          🖥️ Fullscreen Interactive Mode
        </button>
        <button
          onClick={() => setShowLiveSim(false)}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            !showLiveSim
              ? 'bg-[#D4AF37] text-[#0A0A1A]'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          📋 Details &amp; Summary
        </button>
      </div>

      {/* Interactive Simulation */}
      {showLiveSim ? (
        <div className="mb-8">
          {previewMode === 'mobile' ? (
            <div className="flex flex-col items-center">
              <div className="text-xs text-[#D4AF37]/80 mb-2 font-medium tracking-wide">
                Simulating Mobile Viewport (Touch &amp; Click Interactive)
              </div>
              <div
                className="relative rounded-[40px] p-3 shadow-2xl border-4 border-[#2A2A3E] bg-[#0A0A1A] overflow-hidden"
                style={{
                  width: '100%',
                  maxWidth: '390px',
                  height: '740px',
                  boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.2)',
                }}
              >
                {/* Phone Notch/Speaker */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#1A1A2E] rounded-full z-50 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-black/60 mr-2" />
                  <div className="w-8 h-1.5 rounded-full bg-white/20" />
                </div>
                {/* Screen container */}
                <div className="w-full h-full rounded-[30px] overflow-y-auto overflow-x-hidden relative">
                  <ExperienceEngine experience={experience} previewMode={true} />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#D4AF37]/30 overflow-hidden shadow-2xl bg-[#0A0A1A]" style={{ minHeight: '650px' }}>
              <ExperienceEngine experience={experience} previewMode={true} />
            </div>
          )}
        </div>
      ) : (
        /* Summary Card */
        <div
          className="p-6 rounded-2xl mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(26,26,46,0.9), rgba(13,27,42,0.95))',
            border: '1px solid rgba(212,175,55,0.3)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold tracking-widest uppercase" style={{ color: '#FF6B35' }}>
              Diwali Experience Breakdown
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
              {template?.name || 'Template'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
            <SummaryRow label="Sender" value={p.senderName || '(Not set)'} />
            <SummaryRow label="Recipient" value={p.recipientName || '(Not set)'} />
            <SummaryRow label="Language" value={p.language} />
            <SummaryRow label="Greeting Tone" value={p.tone} />
            <SummaryRow label="Memories" value={`${experience.media.photos.length} photos added`} />
            <SummaryRow label="Password" value={experience.advanced.passwordProtected ? 'Protected' : 'None'} />
          </div>

          <div className="pt-4 border-t border-[#D4AF37]/15">
            <div className="text-xs font-semibold mb-2 tracking-wide text-white/50">
              ENABLED ACTIVITIES ({enabledModules.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {enabledModules.map(m => (
                <span
                  key={m.id}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20 flex items-center gap-1.5"
                >
                  <span>{getModuleEmoji(m.id)}</span>
                  <span>{m.id.replace(/-/g, ' ')}</span>
                </span>
              ))}
            </div>
          </div>

          {p.mainMessage && (
            <div className="mt-4 pt-4 border-t border-[#D4AF37]/10">
              <div className="text-xs font-semibold mb-2 tracking-wide text-white/50">
                WISH MESSAGE
              </div>
              <p className="text-sm italic text-[#FFF8E7]/90 leading-relaxed bg-black/20 p-3.5 rounded-xl border border-white/5">
                &ldquo;{p.mainMessage}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {/* Publish Call to Action */}
      <div
        className="text-center p-6 sm:p-8 rounded-3xl mb-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(255,107,53,0.08))',
          border: '1px solid rgba(212,175,55,0.4)',
          boxShadow: '0 0 50px rgba(212,175,55,0.15)',
        }}
      >
        <div className="text-4xl sm:text-5xl mb-3">🪔</div>
        <h3
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#D4AF37' }}
        >
          Publish &amp; Share Your Wish
        </h3>
        <p className="text-xs sm:text-sm mb-6 max-w-lg mx-auto text-[#FFF8E7]/70 leading-relaxed">
          Publishing creates an instant, personalized link with WhatsApp 1-tap sharing, QR code generator, and copy-link options. Recipients can open it on mobile immediately.
        </p>

        <button
          onClick={onPublish}
          disabled={publishing}
          className="btn-festive w-full sm:w-auto px-10 py-4 rounded-full text-base sm:text-lg font-bold transition-all disabled:opacity-70 active:scale-95 shadow-xl flex items-center justify-center gap-2 mx-auto"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #FF6B35 50%, #D4AF37 100%)',
            color: '#0A0A1A',
            minHeight: '52px',
          }}
        >
          {publishing ? '✨ Generating Deepotsav Link...' : '✨ Publish & Get Shareable Link'}
        </button>

        <p className="text-[11px] mt-3 text-white/40">
          Client-side instant publishing • Stored in browser • No login or app installation required
        </p>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={goPrev}
          className="px-6 py-3 rounded-full text-sm font-medium transition-all border border-white/20 text-white/80 hover:bg-white/5 min-h-[44px]"
        >
          ← Edit Configuration
        </button>
        <button
          onClick={onPublish}
          disabled={publishing}
          className="px-6 py-3 rounded-full text-sm font-semibold transition-all bg-[#D4AF37] text-[#0A0A1A] hover:bg-[#F0D060] min-h-[44px]"
        >
          Publish →
        </button>
      </div>
    </div>
  );
}

function getModuleEmoji(id: string) {
  switch (id) {
    case 'welcome': return '🎊';
    case 'diya-lighting': return '🪔';
    case 'rangoli': return '🎨';
    case 'fireworks': return '🎆';
    case 'gift-reveal': return '🎁';
    case 'memory-gallery': return '📸';
    case 'personal-wishes': return '💝';
    case 'finale': return '✨';
    default: return '✦';
  }
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider mb-0.5 text-white/40">
        {label}
      </div>
      <div className="text-sm font-medium capitalize text-[#FFF8E7] truncate">{value}</div>
    </div>
  );
}

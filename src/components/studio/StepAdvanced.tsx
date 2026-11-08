'use client';

import { ExperienceConfig } from '@/types/experience';

interface Props {
  experience: ExperienceConfig;
  update: (partial: Partial<ExperienceConfig>) => void;
  goNext: () => void;
  goPrev: () => void;
}

export default function StepAdvanced({ experience, update, goNext, goPrev }: Props) {
  const adv = experience.advanced;

  const updateAdvanced = (partial: Partial<typeof adv>) => {
    update({ advanced: { ...adv, ...partial } });
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '0.75rem',
    color: '#FFF8E7',
    padding: '0.75rem 1rem',
    width: '100%',
    fontSize: '0.9rem',
    outline: 'none',
  };

  const toggleStyle = (active: boolean) => ({
    background: active ? '#D4AF37' : 'rgba(255,255,255,0.1)',
    position: 'relative' as const,
    width: '48px',
    height: '24px',
    borderRadius: '9999px',
    transition: 'background 0.2s',
    flexShrink: 0,
    cursor: 'pointer',
    border: 'none',
  });

  const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button onClick={onClick} style={toggleStyle(active)}>
      <div style={{
        position: 'absolute',
        top: '4px',
        left: active ? '24px' : '4px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: 'white',
        transition: 'left 0.2s',
      }} />
    </button>
  );

  const ToggleRow = ({ label, desc, active, onToggle }: {
    label: string; desc: string; active: boolean; onToggle: () => void;
  }) => (
    <div className="flex items-center justify-between p-4 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '0.75rem' }}>
      <div>
        <div className="text-sm font-medium mb-0.5" style={{ color: '#FFF8E7' }}>{label}</div>
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</div>
      </div>
      <Toggle active={active} onClick={onToggle} />
    </div>
  );

  return (
    <div>
      <div className="text-center mb-10">
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#D4AF37', fontWeight: 700 }}>
          Advanced Settings
        </h2>
        <p style={{ color: 'rgba(255,248,231,0.6)', marginTop: '0.5rem' }}>
          Optional controls for security, scheduling and recipient interactions.
        </p>
      </div>

      {/* Password protection */}
      <div
        className="p-5 rounded-2xl mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold mb-0.5" style={{ color: '#FFF8E7' }}>🔐 Password Protection</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Require a password to open the experience</div>
          </div>
          <Toggle active={adv.passwordProtected} onClick={() => updateAdvanced({ passwordProtected: !adv.passwordProtected })} />
        </div>
        {adv.passwordProtected && (
          <input
            type="password"
            placeholder="Set a password..."
            value={adv.password || ''}
            onChange={e => updateAdvanced({ password: e.target.value })}
            style={inputStyle}
          />
        )}
      </div>

      {/* Scheduled open */}
      <div
        className="p-5 rounded-2xl mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="text-sm font-semibold mb-1" style={{ color: '#FFF8E7' }}>⏰ Schedule Opening</div>
        <div className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>The experience will only open on or after this date and time</div>
        <input
          type="datetime-local"
          value={adv.scheduledOpenAt ? adv.scheduledOpenAt.slice(0, 16) : ''}
          onChange={e => updateAdvanced({ scheduledOpenAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
          style={{ ...inputStyle, colorScheme: 'dark' }}
        />
        {adv.scheduledOpenAt && (
          <button
            className="text-xs mt-2 transition-all"
            style={{ color: '#FF6B35', textDecoration: 'underline' }}
            onClick={() => updateAdvanced({ scheduledOpenAt: undefined })}
          >
            Clear schedule
          </button>
        )}
      </div>

      {/* Expiry */}
      <div
        className="p-5 rounded-2xl mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="text-sm font-semibold mb-1" style={{ color: '#FFF8E7' }}>📅 Expiry Date</div>
        <div className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>The link will stop working after this date</div>
        <input
          type="datetime-local"
          value={adv.expiresAt ? adv.expiresAt.slice(0, 16) : ''}
          onChange={e => updateAdvanced({ expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
          style={{ ...inputStyle, colorScheme: 'dark' }}
        />
        {adv.expiresAt && (
          <button
            className="text-xs mt-2 transition-all"
            style={{ color: '#FF6B35', textDecoration: 'underline' }}
            onClick={() => updateAdvanced({ expiresAt: undefined })}
          >
            Clear expiry
          </button>
        )}
      </div>

      {/* Interaction toggles */}
      <ToggleRow
        label="💬 Allow Recipient Replies"
        desc="Recipients can send a text reply to your experience"
        active={adv.allowReplies}
        onToggle={() => updateAdvanced({ allowReplies: !adv.allowReplies })}
      />
      <ToggleRow
        label="❤️ Allow Reactions"
        desc="Recipients can react with emoji to your experience"
        active={adv.allowReactions}
        onToggle={() => updateAdvanced({ allowReactions: !adv.allowReactions })}
      />

      <div className="flex justify-between mt-8">
        <button onClick={goPrev} className="px-6 py-2.5 rounded-full text-sm font-medium"
          style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
          ← Back
        </button>
        <button onClick={goNext} className="px-8 py-3 rounded-full font-semibold"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)', color: '#0A0A1A' }}>
          Preview & Publish →
        </button>
      </div>
    </div>
  );
}

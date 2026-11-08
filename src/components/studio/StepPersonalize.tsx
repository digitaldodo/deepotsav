'use client';

import { ExperienceConfig, Language, Tone } from '@/types/experience';

interface Props {
  experience: ExperienceConfig;
  update: (partial: Partial<ExperienceConfig>) => void;
  goNext: () => void;
  goPrev: () => void;
}

const LANGUAGES: { value: Language; label: string; flag: string }[] = [
  { value: 'english', label: 'English', flag: '🇬🇧' },
  { value: 'hindi', label: 'हिन्दी', flag: '🇮🇳' },
  { value: 'hinglish', label: 'Hinglish', flag: '✨' },
];

const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: 'traditional', label: 'Traditional', desc: 'Respectful & classic' },
  { value: 'emotional', label: 'Emotional', desc: 'Heartfelt & touching' },
  { value: 'warm', label: 'Warm', desc: 'Friendly & loving' },
  { value: 'funny', label: 'Funny', desc: 'Playful & humorous' },
  { value: 'professional', label: 'Professional', desc: 'Polished & formal' },
];

const SAMPLE_GREETINGS: Record<Tone, Record<Language, string>> = {
  traditional: {
    english: 'May this Diwali illuminate your life with joy and prosperity. Wishing you and your family a blessed festival.',
    hindi: 'दीपावली के इस पावन अवसर पर आपको और आपके परिवार को हार्दिक शुभकामनाएँ। आपका जीवन सदा प्रकाशमान रहे।',
    hinglish: 'Is Diwali par aapko aur aapke parivar ko dher saari shubhkamnayein. Aapka ghar khushi se roshan rahe.',
  },
  emotional: {
    english: 'This Diwali, I want you to know how much you mean to me. You light up my world more than any diya ever could.',
    hindi: 'इस दीपावली पर, मैं चाहता हूँ कि आप जानें कि आप मेरे लिए कितने खास हैं। आप मेरी दुनिया को किसी भी दिये से ज़्यादा रोशन करते हैं।',
    hinglish: 'Is Diwali par, main chahta hoon ki aap jaanein ki aap mere liye kitne khaas hain. Aap mere life mein sabse badi roshni ho.',
  },
  warm: {
    english: 'Happy Diwali! Sending you lots of love, laughter and light on this beautiful festival. Miss you and hope to see you soon!',
    hindi: 'दीपावली मुबारक! इस खूबसूरत त्योहार पर आपके लिए ढेर सारा प्यार, हँसी और रोशनी भेज रहा हूँ।',
    hinglish: 'Happy Diwali yaar! Bahut saari dua aur pyaar bhej raha hoon. Dil se wish kar raha hoon — the best Diwali ever ho aapki!',
  },
  funny: {
    english: 'Happy Diwali! May your year be as bright as your phone screen at full brightness — and may your relatives keep their questions to a minimum! 😄',
    hindi: 'दीपावली मुबारक! इस बार पटाखे कम, मिठाई ज़्यादा! 😄 आपके सारे सवालों के जवाब मिलें — especially रिश्तेदारों के!',
    hinglish: 'Happy Diwali! This year may your bonus be fat, relatives ke questions kam, aur mithai unlimited! 🍮✨',
  },
  professional: {
    english: 'Wishing you a Happy Diwali and a prosperous New Year. May this festival bring success and growth to all your endeavours.',
    hindi: 'दीपावली और नव वर्ष की हार्दिक शुभकामनाएँ। आशा है यह त्योहार आपके सभी कार्यों में सफलता और समृद्धि लेकर आए।',
    hinglish: 'Diwali aur New Year ki dheron shubhkamnayein. May this festive season bring success aur new opportunities aapke liye.',
  },
};

export default function StepPersonalize({ experience, update, goNext, goPrev }: Props) {
  const p = experience.personalization;

  const updatePersonalization = (partial: Partial<typeof p>) => {
    update({ personalization: { ...p, ...partial } });
  };

  const fillSample = () => {
    const sample = SAMPLE_GREETINGS[p.tone][p.language];
    updatePersonalization({ mainMessage: sample });
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
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#D4AF37',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
  };

  return (
    <div>
      <div className="text-center mb-10">
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#D4AF37', fontWeight: 700 }}>
          Personalize Your Experience
        </h2>
        <p style={{ color: 'rgba(255,248,231,0.6)', marginTop: '0.5rem' }}>
          Add names, messages and a personal touch to make it truly special.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Sender name */}
        <div>
          <label style={labelStyle}>Your Name (Sender)</label>
          <input
            type="text"
            placeholder="e.g. Priya"
            value={p.senderName}
            onChange={e => updatePersonalization({ senderName: e.target.value })}
            style={inputStyle}
          />
        </div>

        {/* Recipient name */}
        <div>
          <label style={labelStyle}>Recipient's Name</label>
          <input
            type="text"
            placeholder="e.g. Rajan, Dadi, Team"
            value={p.recipientName}
            onChange={e => updatePersonalization({ recipientName: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Language picker */}
      <div className="mb-6">
        <label style={labelStyle}>Language</label>
        <div className="flex gap-3 flex-wrap">
          {LANGUAGES.map(lang => (
            <button
              key={lang.value}
              onClick={() => updatePersonalization({ language: lang.value })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium text-sm"
              style={{
                background: p.language === lang.value ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${p.language === lang.value ? '#D4AF37' : 'rgba(255,255,255,0.1)'}`,
                color: p.language === lang.value ? '#D4AF37' : 'rgba(255,255,255,0.6)',
                boxShadow: p.language === lang.value ? '0 0 12px rgba(212,175,55,0.2)' : 'none',
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tone picker */}
      <div className="mb-6">
        <label style={labelStyle}>Tone</label>
        <div className="flex gap-3 flex-wrap">
          {TONES.map(tone => (
            <button
              key={tone.value}
              onClick={() => updatePersonalization({ tone: tone.value })}
              className="flex flex-col items-start px-4 py-2.5 rounded-xl transition-all"
              style={{
                background: p.tone === tone.value ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${p.tone === tone.value ? '#D4AF37' : 'rgba(255,255,255,0.1)'}`,
                color: p.tone === tone.value ? '#D4AF37' : 'rgba(255,255,255,0.6)',
              }}
            >
              <span className="text-sm font-semibold">{tone.label}</span>
              <span className="text-xs" style={{ opacity: 0.7 }}>{tone.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-5">
        <label style={labelStyle}>Opening Greeting</label>
        <input
          type="text"
          placeholder="e.g. Wishing you a Happy Diwali!"
          value={p.greeting}
          onChange={e => updatePersonalization({ greeting: e.target.value })}
          style={inputStyle}
        />
      </div>

      {/* Main message */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label style={{ ...labelStyle, marginBottom: 0 }}>Main Message</label>
          <button
            onClick={fillSample}
            className="text-xs font-medium transition-all"
            style={{ color: '#FF6B35', textDecoration: 'underline' }}
          >
            ✨ Fill sample message
          </button>
        </div>
        <textarea
          placeholder="Write your personal Diwali message here..."
          value={p.mainMessage}
          onChange={e => updatePersonalization({ mainMessage: e.target.value })}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Additional wishes */}
      <div className="mb-5">
        <label style={labelStyle}>Additional Wishes (Optional)</label>
        <textarea
          placeholder="Any extra blessings or wishes..."
          value={p.additionalWishes || ''}
          onChange={e => updatePersonalization({ additionalWishes: e.target.value })}
          rows={2}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Signature */}
      <div className="mb-10">
        <label style={labelStyle}>Signature</label>
        <input
          type="text"
          placeholder="e.g. With love, Priya 💛"
          value={p.signature || ''}
          onChange={e => updatePersonalization({ signature: e.target.value })}
          style={inputStyle}
        />
      </div>

      {/* Preview card */}
      {(p.senderName || p.recipientName || p.mainMessage) && (
        <div
          className="p-6 rounded-2xl mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(26,26,46,0.9), rgba(13,27,42,0.95))',
            border: '1px solid rgba(212,175,55,0.3)',
          }}
        >
          <div className="text-xs font-semibold mb-3 tracking-widest uppercase" style={{ color: '#FF6B35' }}>
            Preview
          </div>
          {p.recipientName && (
            <p className="text-sm mb-2" style={{ color: 'rgba(255,248,231,0.6)' }}>
              To: <span style={{ color: '#FFF8E7' }}>{p.recipientName}</span>
            </p>
          )}
          {p.greeting && (
            <p className="text-xl font-bold mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#D4AF37' }}>
              {p.greeting}
            </p>
          )}
          {p.mainMessage && (
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,248,231,0.8)' }}>
              {p.mainMessage}
            </p>
          )}
          {(p.signature || p.senderName) && (
            <p className="text-sm" style={{ color: '#D4AF37' }}>
              — {p.signature || p.senderName}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={goPrev} className="px-6 py-2.5 rounded-full text-sm font-medium transition-all"
          style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
          ← Back
        </button>
        <button onClick={goNext} className="px-8 py-3 rounded-full font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)', color: '#0A0A1A' }}>
          Add Memories →
        </button>
      </div>
    </div>
  );
}

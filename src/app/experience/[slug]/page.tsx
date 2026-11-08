'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ExperienceConfig } from '@/types/experience';
import { getPublishedExperience } from '@/lib/local-store';
import ExperienceEngine from '@/components/experience/ExperienceEngine';

export default function ExperiencePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [experience, setExperience] = useState<ExperienceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const exp = getPublishedExperience(slug);
    if (!exp) {
      setError('not-found');
    } else {
      setExperience(exp);
      if (!exp.advanced.passwordProtected) setUnlocked(true);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A1A' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="text-5xl mb-4" style={{ animation: 'pulse-gold 2s infinite' }}>🪔</div>
          <p style={{ color: 'rgba(255,248,231,0.6)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>
            Lighting your diyas...
          </p>
        </div>
      </div>
    );
  }

  if (error === 'not-found' || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A0A1A' }}>
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6">🕯️</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#D4AF37', marginBottom: '1rem' }}>
            Experience Not Found
          </h1>
          <p style={{ color: 'rgba(255,248,231,0.6)', marginBottom: '2rem' }}>
            This Diwali experience may have expired, been unpublished, or the link may be incorrect.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-3 rounded-full font-semibold"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)', color: '#0A0A1A' }}
          >
            Create Your Own →
          </a>
        </div>
      </div>
    );
  }

  if (experience.advanced.scheduledOpenAt && new Date(experience.advanced.scheduledOpenAt) > new Date()) {
    const openDate = new Date(experience.advanced.scheduledOpenAt);
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A0A1A' }}>
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6">⏰</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#D4AF37', marginBottom: '1rem' }}>
            Coming Soon
          </h1>
          <p style={{ color: 'rgba(255,248,231,0.6)', marginBottom: '1rem' }}>
            This experience will open on:
          </p>
          <p style={{ color: '#FFF8E7', fontWeight: 600, fontSize: '1.1rem' }}>
            {openDate.toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        </div>
      </div>
    );
  }

  if (experience.advanced.passwordProtected && !unlocked) {
    const tryPassword = () => {
      if (passwordInput === experience.advanced.password) {
        setUnlocked(true);
        setPasswordError(false);
      } else {
        setPasswordError(true);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A0A1A' }}>
        <div
          className="max-w-sm w-full p-8 rounded-3xl text-center"
          style={{ background: 'rgba(26,26,46,0.9)', border: '1px solid rgba(212,175,55,0.3)' }}
        >
          <div className="text-5xl mb-4">🔐</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#D4AF37', marginBottom: '0.5rem' }}>
            Protected Experience
          </h1>
          <p style={{ color: 'rgba(255,248,231,0.6)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {experience.personalization.senderName && `${experience.personalization.senderName} has locked this experience.`}
            {' '}Enter the password to open your Diwali surprise.
          </p>
          <input
            type="password"
            placeholder="Enter password..."
            value={passwordInput}
            onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
            onKeyDown={e => e.key === 'Enter' && tryPassword()}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${passwordError ? '#EF4444' : 'rgba(212,175,55,0.2)'}`,
              borderRadius: '0.75rem',
              color: '#FFF8E7',
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              outline: 'none',
            }}
          />
          {passwordError && (
            <p className="text-xs mb-2" style={{ color: '#EF4444' }}>Incorrect password. Please try again.</p>
          )}
          <button
            onClick={tryPassword}
            className="w-full py-3 rounded-xl font-semibold mt-2"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)', color: '#0A0A1A' }}
          >
            Open Experience ✨
          </button>
        </div>
      </div>
    );
  }

  return <ExperienceEngine experience={experience} />;
}

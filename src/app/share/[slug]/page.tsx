'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { ExperienceConfig } from '@/types/experience';
import { getPublishedExperience } from '@/lib/local-store';
import Link from 'next/link';

// =============================================
// Simple canvas QR code renderer (no deps)
// =============================================
function QRCodeCanvas({ value, size = 160 }: { value: string; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);

    const cells = 21;
    const cell = size / cells;

    // Deterministic hash from value
    let hash = 5381;
    for (let i = 0; i < value.length; i++) {
      hash = ((hash << 5) + hash) ^ value.charCodeAt(i);
    }

    ctx.fillStyle = '#0A0A1A';

    const drawFinder = (ox: number, oy: number) => {
      ctx.fillRect(ox * cell, oy * cell, 7 * cell, cell);
      ctx.fillRect(ox * cell, (oy + 6) * cell, 7 * cell, cell);
      ctx.fillRect(ox * cell, oy * cell, cell, 7 * cell);
      ctx.fillRect((ox + 6) * cell, oy * cell, cell, 7 * cell);
      ctx.fillRect((ox + 2) * cell, (oy + 2) * cell, 3 * cell, 3 * cell);
    };
    drawFinder(0, 0);
    drawFinder(cells - 7, 0);
    drawFinder(0, cells - 7);

    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c > cells - 9) || (r > cells - 9 && c < 8)) continue;
        const bit = ((hash ^ (r * 17 + c * 13)) >> (r * c)) & 1;
        if (bit) ctx.fillRect(c * cell, r * cell, cell, cell);
      }
    }
  }, [value, size]);

  return <canvas ref={ref} style={{ display: 'block', borderRadius: '4px' }} />;
}

// =============================================
// SHARE PAGE
// =============================================
export default function SharePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [experience, setExperience] = useState<ExperienceConfig | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(`${window.location.origin}/experience/${slug}`);
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const exp = getPublishedExperience(slug);
    setExperience(exp);
    setLoading(false);
  }, [slug]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // silent
    }
  };

  const handleWhatsApp = () => {
    const p = experience?.personalization;
    const name = p?.recipientName || 'you';
    const sender = p?.senderName || 'Someone';
    const text = encodeURIComponent(
      `🪔 *${sender}* has created a special Diwali experience for *${name}*!\n\nOpen your Deepotsav here 👇\n${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A1A' }}>
        <div className="text-5xl">🪔</div>
      </div>
    );
  }

  const p = experience?.personalization;

  return (
    <div
      className="min-h-screen px-4 py-16 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #0A0A1A 0%, #0D1B2A 100%)', color: '#FFF8E7' }}
    >
      {/* Success banner */}
      <div className="text-center mb-10" style={{ animation: 'bounce-in 0.8s ease-out' }}>
        <div className="text-6xl mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>🎊</div>
        <h1
          className="text-4xl sm:text-5xl font-bold mb-3"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#D4AF37' }}
        >
          Your Deepotsav is Live!
        </h1>
        <p style={{ color: 'rgba(255,248,231,0.6)' }}>
          {p?.recipientName
            ? `${p.recipientName} can now open their surprise.`
            : 'Your experience is ready to share with your loved ones.'}
        </p>
      </div>

      {/* Share card */}
      <div
        className="w-full max-w-md p-6 sm:p-8 rounded-3xl mb-8"
        style={{
          background: 'linear-gradient(135deg, rgba(26,26,46,0.9), rgba(13,27,42,0.95))',
          border: '1px solid rgba(212,175,55,0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* URL display */}
        <div
          className="flex items-center gap-2 p-3 rounded-xl mb-5"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          <span
            className="flex-1 text-xs sm:text-sm truncate"
            style={{ color: '#D4AF37', fontFamily: 'monospace' }}
          >
            {shareUrl || `…/experience/${slug}`}
          </span>
          <button
            onClick={handleCopy}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: copied ? 'rgba(34,197,94,0.2)' : 'rgba(212,175,55,0.2)',
              color: copied ? '#22c55e' : '#D4AF37',
            }}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>

        {/* Share buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm transition-all"
            style={{ background: '#25D366', color: 'white', boxShadow: '0 4px 15px rgba(37,211,102,0.3)' }}
          >
            <span className="text-lg">📱</span> Share on WhatsApp
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: 'rgba(212,175,55,0.1)',
              color: '#D4AF37',
              border: '1px solid rgba(212,175,55,0.3)',
            }}
          >
            <span className="text-lg">🔗</span>
            {copied ? '✓ Link Copied!' : 'Copy Link'}
          </button>
        </div>

        {/* QR Code */}
        <div className="border-t pt-6" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
          <div className="text-center mb-4">
            <div
              className="text-xs font-semibold tracking-widest uppercase mb-1"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              QR Code
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Scan to open the experience instantly
            </p>
          </div>
          <div className="flex justify-center">
            <div className="p-3 rounded-xl" style={{ background: 'white' }}>
              {shareUrl && <QRCodeCanvas value={shareUrl} size={130} />}
            </div>
          </div>
        </div>
      </div>

      {/* Experience details */}
      {experience && (
        <div
          className="w-full max-w-md p-5 rounded-2xl mb-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3
            className="text-sm font-semibold mb-3 tracking-wider uppercase"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Experience Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {p?.senderName && <Detail label="From" value={p.senderName} />}
            {p?.recipientName && <Detail label="To" value={p.recipientName} />}
            <Detail label="Template" value={experience.appearance.templateId.replace(/-/g, ' ')} />
            <Detail
              label="Activities"
              value={`${experience.modules.filter(m => m.enabled).length} modules`}
            />
            {experience.media.photos.length > 0 && (
              <Detail label="Photos" value={`${experience.media.photos.length} included`} />
            )}
            {experience.advanced.passwordProtected && (
              <Detail label="Protected" value="Password required" />
            )}
          </div>
        </div>
      )}

      {/* Action links */}
      <div className="flex flex-wrap justify-center gap-4">
        {shareUrl && (
          <Link
            href={`/experience/${slug}`}
            target="_blank"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.07)',
              color: '#FFF8E7',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            👁️ Preview Experience
          </Link>
        )}
        <Link
          href="/create"
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
          style={{
            background: 'rgba(212,175,55,0.15)',
            color: '#D4AF37',
            border: '1px solid rgba(212,175,55,0.3)',
          }}
        >
          ✨ Create Another
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
          style={{
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          🏠 Home
        </Link>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {label}
      </div>
      <div className="text-sm capitalize" style={{ color: '#FFF8E7' }}>{value}</div>
    </div>
  );
}

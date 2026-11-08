import React from 'react';
import { useGameState } from '../../game/state/useGameState';

export const PhotoInspectionModal: React.FC = () => {
  const { inspectedPhoto, setInspectedPhoto } = useGameState();

  if (!inspectedPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[reveal-up_0.3s_ease-out]">
      <div className="w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-[#1C142B] to-[#0A0A1A] border-2 border-[#D4AF37] shadow-2xl text-center text-white relative">
        <button
          onClick={() => setInspectedPhoto(null)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-white/70 hover:bg-white/20 flex items-center justify-center text-sm"
        >
          ✕
        </button>

        <span className="text-3xl mb-2 inline-block">🖼️</span>
        <h3 className="text-xl font-bold text-[#D4AF37] mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          {inspectedPhoto}
        </h3>
        <p className="text-xs text-white/60 mb-4">A cherished memory of Diwali celebrations together</p>

        {/* Photo Container */}
        <div className="rounded-2xl overflow-hidden border border-white/20 shadow-inner mb-4 aspect-[4/3] bg-black/50 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80"
            alt="Diwali Gathering"
            className="w-full h-full object-cover"
          />
        </div>

        <p className="text-xs italic text-[#FFF8E7]/80 leading-relaxed mb-4">
          &ldquo;May every corner of our home remain illuminated with laughter, love, and sweet memories.&rdquo;
        </p>

        <button
          onClick={() => setInspectedPhoto(null)}
          className="w-full py-3 rounded-full bg-[#D4AF37] text-black font-bold text-xs active:scale-95 transition-all"
        >
          Put Back on Sideboard
        </button>
      </div>
    </div>
  );
};

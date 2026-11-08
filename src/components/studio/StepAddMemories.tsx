'use client';

import { useCallback, useState } from 'react';
import { ExperienceConfig, PhotoItem } from '@/types/experience';
import { nanoid } from 'nanoid';

interface Props {
  experience: ExperienceConfig;
  update: (partial: Partial<ExperienceConfig>) => void;
  goNext: () => void;
  goPrev: () => void;
}

export default function StepAddMemories({ experience, update, goNext, goPrev }: Props) {
  const [dragging, setDragging] = useState(false);
  const photos = experience.media.photos;

  const updateMedia = (partial: Partial<typeof experience.media>) => {
    update({ media: { ...experience.media, ...partial } });
  };

  const addPhotos = useCallback((files: FileList | File[]) => {
    const fileArr = Array.from(files).filter(f => f.type.startsWith('image/'));
    const newPhotos: PhotoItem[] = fileArr.map((file, i) => ({
      id: nanoid(),
      url: URL.createObjectURL(file),
      caption: '',
      order: photos.length + i,
    }));
    updateMedia({ photos: [...photos, ...newPhotos] });
  }, [photos, updateMedia]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addPhotos(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) addPhotos(e.dataTransfer.files);
  };

  const removePhoto = (id: string) => {
    updateMedia({ photos: photos.filter(p => p.id !== id).map((p, i) => ({ ...p, order: i })) });
  };

  const updateCaption = (id: string, caption: string) => {
    updateMedia({ photos: photos.map(p => p.id === id ? { ...p, caption } : p) });
  };

  const movePhoto = (id: string, dir: -1 | 1) => {
    const idx = photos.findIndex(p => p.id === id);
    if (idx === -1) return;
    const newPhotos = [...photos];
    const target = idx + dir;
    if (target < 0 || target >= newPhotos.length) return;
    [newPhotos[idx], newPhotos[target]] = [newPhotos[target], newPhotos[idx]];
    updateMedia({ photos: newPhotos.map((p, i) => ({ ...p, order: i })) });
  };

  return (
    <div>
      <div className="text-center mb-10">
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#D4AF37', fontWeight: 700 }}>
          Add Your Memories
        </h2>
        <p style={{ color: 'rgba(255,248,231,0.6)', marginTop: '0.5rem' }}>
          Upload photos to create a beautiful memory gallery in your experience.
        </p>
      </div>

      {/* Upload dropzone */}
      <label
        className="relative block rounded-2xl cursor-pointer transition-all mb-6"
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? '#D4AF37' : 'rgba(212,175,55,0.3)'}`,
          background: dragging ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.03)',
          borderRadius: '1rem',
          padding: '2.5rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="sr-only"
          onChange={handleFileInput}
        />
        <div className="text-4xl mb-3">{dragging ? '📸' : '🖼️'}</div>
        <p className="text-sm font-semibold mb-1" style={{ color: '#D4AF37' }}>
          {dragging ? 'Drop to add photos' : 'Click or drag photos here'}
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          JPG, PNG, WebP — up to 10 photos
        </p>
      </label>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {photos.map((photo, idx) => (
            <div key={photo.id} className="relative rounded-xl overflow-hidden group"
              style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#0D1B2A' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.caption || `Photo ${idx + 1}`}
                className="w-full h-32 object-cover"
              />
              {/* Controls overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-between p-2"
                style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="flex gap-1">
                  <button onClick={() => movePhoto(photo.id, -1)} disabled={idx === 0}
                    className="w-7 h-7 rounded-full text-xs flex items-center justify-center transition-all disabled:opacity-30"
                    style={{ background: 'rgba(212,175,55,0.9)', color: '#0A0A1A' }}>
                    ←
                  </button>
                  <button onClick={() => movePhoto(photo.id, 1)} disabled={idx === photos.length - 1}
                    className="w-7 h-7 rounded-full text-xs flex items-center justify-center transition-all disabled:opacity-30"
                    style={{ background: 'rgba(212,175,55,0.9)', color: '#0A0A1A' }}>
                    →
                  </button>
                </div>
                <button onClick={() => removePhoto(photo.id)}
                  className="w-7 h-7 rounded-full text-xs flex items-center justify-center transition-all"
                  style={{ background: 'rgba(239,68,68,0.9)', color: 'white' }}>
                  ✕
                </button>
              </div>
              {/* Caption input */}
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Add a caption..."
                  value={photo.caption || ''}
                  onChange={e => updateCaption(photo.id, e.target.value)}
                  className="w-full text-xs rounded px-2 py-1"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(212,175,55,0.15)',
                    color: '#FFF8E7',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Music toggle */}
      <div
        className="flex items-center justify-between p-4 rounded-xl mb-8"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div>
          <div className="text-sm font-semibold mb-0.5" style={{ color: '#FFF8E7' }}>
            🎵 Background Music
          </div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Soft instrumental music plays during the experience
          </div>
        </div>
        <button
          onClick={() => updateMedia({ musicDefaultOff: !experience.media.musicDefaultOff })}
          className="relative w-12 h-6 rounded-full transition-all shrink-0"
          style={{
            background: !experience.media.musicDefaultOff ? '#D4AF37' : 'rgba(255,255,255,0.1)',
          }}
        >
          <div
            className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
            style={{ left: !experience.media.musicDefaultOff ? '1.5rem' : '0.25rem' }}
          />
        </button>
      </div>

      <div className="flex justify-between">
        <button onClick={goPrev} className="px-6 py-2.5 rounded-full text-sm font-medium"
          style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
          ← Back
        </button>
        <button onClick={goNext} className="px-8 py-3 rounded-full font-semibold"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)', color: '#0A0A1A' }}>
          Customize Activities →
        </button>
      </div>
    </div>
  );
}

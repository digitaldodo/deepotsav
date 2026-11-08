import React, { useRef, useState, useEffect } from 'react';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

// Global exported touch control vectors for the 3D loop
export const touchInput = {
  moveX: 0,
  moveY: 0,
  lookDeltaX: 0,
  lookDeltaY: 0,
  isMoving: false,
};

export const MobileVirtualControls: React.FC = () => {
  const { activePrompt, isPaused, setPaused, soundEnabled, setSoundEnabled } = useGameState();
  const [joystickActive, setJoystickActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  // Look touch tracking
  const lookTouchIdRef = useRef<number | null>(null);
  const lastLookPos = useRef<{ x: number; y: number } | null>(null);

  // Reset touch on unmount
  useEffect(() => {
    return () => {
      touchInput.moveX = 0;
      touchInput.moveY = 0;
      touchInput.lookDeltaX = 0;
      touchInput.lookDeltaY = 0;
      touchInput.isMoving = false;
    };
  }, []);

  // Joystick touch handlers
  const handleJoystickStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setJoystickActive(true);
    handleJoystickMove(e);
  };

  const handleJoystickMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!joystickBaseRef.current || touchIdRef.current === null) return;
    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current);
    if (!touch) return;

    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = rect.width / 2;

    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(deltaY, deltaX);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: knobX, y: knobY });
    touchInput.moveX = knobX / maxRadius;
    touchInput.moveY = -knobY / maxRadius; // inverted so up = forward
    touchInput.isMoving = dist > 4;
  };

  const handleJoystickEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current);
    if (touch) {
      touchIdRef.current = null;
      setJoystickActive(false);
      setKnobPos({ x: 0, y: 0 });
      touchInput.moveX = 0;
      touchInput.moveY = 0;
      touchInput.isMoving = false;
    }
  };

  // Right-side swipe look handlers
  const handleLookStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.changedTouches[0];
    lookTouchIdRef.current = touch.identifier;
    lastLookPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleLookMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (lookTouchIdRef.current === null || !lastLookPos.current) return;
    const touch = Array.from(e.changedTouches).find(t => t.identifier === lookTouchIdRef.current);
    if (!touch) return;

    const dx = touch.clientX - lastLookPos.current.x;
    const dy = touch.clientY - lastLookPos.current.y;

    touchInput.lookDeltaX += dx * 0.0055;
    touchInput.lookDeltaY += dy * 0.0055;

    lastLookPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleLookEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = Array.from(e.changedTouches).find(t => t.identifier === lookTouchIdRef.current);
    if (touch) {
      lookTouchIdRef.current = null;
      lastLookPos.current = null;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden touch-none">
      {/* Top Mobile Quick Audio & Pause Controls Bar */}
      <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            audioManager.setMuted(!next);
            if (next) audioManager.playDiyaLight();
          }}
          className="w-11 h-11 rounded-full bg-black/60 border border-[#D4AF37]/30 text-white flex items-center justify-center text-lg active:scale-95 shadow-lg backdrop-blur-md"
          aria-label={soundEnabled ? 'Mute' : 'Enable Sound'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        <button
          onClick={() => setPaused(!isPaused)}
          className="w-11 h-11 rounded-full bg-black/60 border border-[#D4AF37]/30 text-[#D4AF37] font-bold flex items-center justify-center text-sm active:scale-95 shadow-lg backdrop-blur-md"
          aria-label="Pause Menu"
        >
          ⏸
        </button>
      </div>

      {/* Left Virtual Joystick Area */}
      <div
        className="absolute bottom-6 left-6 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-black/40 border-2 border-white/20 pointer-events-auto flex items-center justify-center backdrop-blur-sm touch-none"
        ref={joystickBaseRef}
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Knob */}
        <div
          className={`w-14 h-14 rounded-full border border-[#D4AF37] transition-all shadow-md flex items-center justify-center ${
            joystickActive ? 'bg-[#D4AF37] text-black shadow-[#D4AF37]/60 scale-105' : 'bg-white/25 text-white/80'
          }`}
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        >
          <span className="text-[11px] font-extrabold tracking-tighter">WALK</span>
        </div>
      </div>

      {/* Right Screen Swipe Look Surface */}
      <div
        className="absolute top-16 right-0 bottom-28 w-1/2 pointer-events-auto touch-none"
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        onTouchCancel={handleLookEnd}
      >
        <div className="absolute bottom-3 right-4 text-[10px] text-white/30 tracking-wider pointer-events-none uppercase font-semibold">
          Drag to Look Around 👁️
        </div>
      </div>

      {/* Contextual Interaction Floating Button (>54px touch target) */}
      {activePrompt && (
        <div
          className="absolute bottom-8 right-6 pointer-events-auto animate-[bounce-in_0.35s_ease-out]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <button
            onClick={() => activePrompt.action()}
            className="px-6 py-3.5 rounded-3xl bg-gradient-to-r from-[#D4AF37] via-[#FFA500] to-[#FF6B35] text-[#0A0A1A] font-extrabold text-sm shadow-2xl active:scale-95 flex items-center gap-2.5 border-2 border-white/50"
            style={{
              minWidth: '160px',
              minHeight: '54px',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.7)',
            }}
          >
            <span className="text-xl">✨</span>
            <div className="text-left">
              <div className="leading-tight text-xs sm:text-sm">{activePrompt.label}</div>
              {activePrompt.subtext && (
                <div className="text-[10px] opacity-85 font-normal leading-tight mt-0.5">
                  {activePrompt.subtext}
                </div>
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

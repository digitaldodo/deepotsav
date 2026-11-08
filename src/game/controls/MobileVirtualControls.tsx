import React, { useRef, useState, useEffect } from 'react';

// Global exported touch control vectors for the 3D loop
export const touchInput = {
  moveX: 0,
  moveY: 0,
  lookDeltaX: 0,
  lookDeltaY: 0,
  isMoving: false,
};

export const MobileVirtualControls: React.FC = () => {
  // Joystick dynamic floating state
  const [joystickVisible, setJoystickVisible] = useState(false);
  const [joystickCenter, setJoystickCenter] = useState({ x: 0, y: 0 });
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });

  const movePointerId = useRef<number | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  // Camera look tracking in upper 70%
  const lookPointerId = useRef<number | null>(null);
  const lastLookPos = useRef<{ x: number; y: number } | null>(null);

  // Maximum joystick throw radius in pixels
  const MAX_RADIUS = 48;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      touchInput.moveX = 0;
      touchInput.moveY = 0;
      touchInput.lookDeltaX = 0;
      touchInput.lookDeltaY = 0;
      touchInput.isMoving = false;
    };
  }, []);

  // ==============================================================
  // 1. DYNAMIC VIRTUAL JOYSTICK HANDLERS (LOWER 30% OF SCREEN)
  // ==============================================================
  const handleMovePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only capture first touch in move zone
    if (movePointerId.current !== null) return;
    e.preventDefault();
    e.stopPropagation();

    const pointerId = e.pointerId;
    movePointerId.current = pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(pointerId);

    const clientX = e.clientX;
    const clientY = e.clientY;

    startPos.current = { x: clientX, y: clientY };
    setJoystickCenter({ x: clientX, y: clientY });
    setKnobOffset({ x: 0, y: 0 });
    setJoystickVisible(true);
  };

  const handleMovePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (movePointerId.current !== e.pointerId || !startPos.current) return;
    e.preventDefault();
    e.stopPropagation();

    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const clampedDist = Math.min(dist, MAX_RADIUS);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobOffset({ x: knobX, y: knobY });

    // Normalized movement vector (deadzone of 4px)
    if (dist > 4) {
      touchInput.moveX = knobX / MAX_RADIUS;
      touchInput.moveY = -knobY / MAX_RADIUS; // up is forward (+Z direction in Three)
      touchInput.isMoving = true;
    } else {
      touchInput.moveX = 0;
      touchInput.moveY = 0;
      touchInput.isMoving = false;
    }
  };

  const handleMovePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (movePointerId.current !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    movePointerId.current = null;
    startPos.current = null;
    setJoystickVisible(false);
    setKnobOffset({ x: 0, y: 0 });

    touchInput.moveX = 0;
    touchInput.moveY = 0;
    touchInput.isMoving = false;
  };

  // ==============================================================
  // 2. CAMERA LOOK HANDLERS (UPPER 70% OF SCREEN)
  // ==============================================================
  const handleLookPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only capture first touch in look zone
    if (lookPointerId.current !== null) return;
    // Don't intercept touches if user clicked on a button or menu
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, [role="button"]')) return;

    e.preventDefault();
    e.stopPropagation();

    const pointerId = e.pointerId;
    lookPointerId.current = pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(pointerId);

    lastLookPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleLookPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (lookPointerId.current !== e.pointerId || !lastLookPos.current) return;
    e.preventDefault();
    e.stopPropagation();

    const dx = e.clientX - lastLookPos.current.x;
    const dy = e.clientY - lastLookPos.current.y;

    // Apply smooth look deltas
    touchInput.lookDeltaX += dx * 0.0048;
    touchInput.lookDeltaY += dy * 0.0048;

    lastLookPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleLookPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (lookPointerId.current !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    lookPointerId.current = null;
    lastLookPos.current = null;
  };

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden touch-none z-20"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    >
      {/* ==============================================================
          UPPER 70%: CAMERA LOOK TOUCH ZONE
          ============================================================== */}
      <div
        className="absolute top-0 left-0 w-full pointer-events-auto touch-none"
        style={{ height: '70%' }}
        onPointerDown={handleLookPointerDown}
        onPointerMove={handleLookPointerMove}
        onPointerUp={handleLookPointerUp}
        onPointerCancel={handleLookPointerUp}
      />

      {/* ==============================================================
          LOWER 30%: DYNAMIC JOYSTICK FULL-WIDTH MOVEMENT TOUCH ZONE
          ============================================================== */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-auto touch-none"
        style={{ height: '30%' }}
        onPointerDown={handleMovePointerDown}
        onPointerMove={handleMovePointerMove}
        onPointerUp={handleMovePointerUp}
        onPointerCancel={handleMovePointerUp}
      />

      {/* ==============================================================
          FLOATING DYNAMIC JOYSTICK (VISIBLE ONLY WHILE TOUCHING LOWER 30%)
          ============================================================== */}
      {joystickVisible && (
        <div
          className="fixed pointer-events-none transition-opacity duration-150 z-30"
          style={{
            left: `${joystickCenter.x}px`,
            top: `${joystickCenter.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Outer Base Ring (Semi-transparent dark glass with subtle gold accent) */}
          <div
            className="rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl"
            style={{
              width: `${MAX_RADIUS * 2}px`,
              height: `${MAX_RADIUS * 2}px`,
              background: 'radial-gradient(circle, rgba(0,0,0,0.45) 0%, rgba(20,15,10,0.65) 100%)',
              border: '1.5px solid rgba(212, 175, 55, 0.45)',
              boxShadow: '0 0 18px rgba(212, 175, 55, 0.25), inset 0 0 12px rgba(0,0,0,0.6)',
            }}
          >
            {/* Subtle center crosshair guide */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40" />

            {/* Inner Thumb Knob */}
            <div
              className="absolute rounded-full shadow-lg"
              style={{
                width: '42px',
                height: '42px',
                transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`,
                background: 'radial-gradient(circle at 35% 35%, #FFDF73 0%, #D4AF37 60%, #996515 100%)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 12px rgba(212, 175, 55, 0.5)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

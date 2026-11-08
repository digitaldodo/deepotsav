import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../state/useGameState';
import { audioManager } from '../audio/AudioManager';

export const CinematicCameraRig: React.FC = () => {
  const { camera } = useThree();
  const {
    cinematicActive,
    cinematicPhase,
    setCinematicPhase,
    soundEnabled,
    setSoundEnabled,
    lightTargetDiya,
  } = useGameState();

  const animTimeRef = useRef<number>(0);
  const targetCamPos = useRef(new THREE.Vector3(0, 5.2, 18));
  const targetLookAt = useRef(new THREE.Vector3(0, 2.5, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 2.5, 0));

  // Sequenced diya ignition flags during Scene 2
  const litDiya1 = useRef(false);
  const litDiya2 = useRef(false);
  const litDiya3 = useRef(false);
  const litDiya4 = useRef(false);

  // When cinematic begins, start festive music on user interaction
  useEffect(() => {
    if (cinematicActive && !soundEnabled) {
      // Auto-init audio on first gesture or button
      const onFirstTouch = () => {
        setSoundEnabled(true);
        audioManager.setMuted(false);
        window.removeEventListener('click', onFirstTouch);
        window.removeEventListener('keydown', onFirstTouch);
      };
      window.addEventListener('click', onFirstTouch, { once: true });
      window.addEventListener('keydown', onFirstTouch, { once: true });
    }
  }, [cinematicActive, soundEnabled, setSoundEnabled]);

  useFrame((_, delta) => {
    if (!cinematicActive) return;

    animTimeRef.current += delta;
    const t = animTimeRef.current;

    // SCENE 1 — FESTIVE NIGHT (0s to 4.5s)
    if (t < 4.5) {
      if (cinematicPhase !== 1) setCinematicPhase(1);
      const progress = t / 4.5;
      // Gentle orbital pan
      const angle = progress * 0.25 - 0.12;
      targetCamPos.current.set(Math.sin(angle) * 17, 4.2 - progress * 0.4, Math.cos(angle) * 17);
      targetLookAt.current.set(0, 2.2, 0);
    }
    // SCENE 2 — THE LIGHTING OF DIYAS (4.5s to 9.0s)
    else if (t < 9.0) {
      if (cinematicPhase !== 2) setCinematicPhase(2);
      const progress = (t - 4.5) / 4.5;

      // Dolly forward smoothly to the verandah steps
      targetCamPos.current.set(
        Math.sin(progress * 0.2) * 1.5,
        2.2 - progress * 0.7,
        14 - progress * 9.5
      );
      targetLookAt.current.set(0, 0.4 + progress * 0.6, 1.2);

      // Light diyas in succession
      if (progress > 0.15 && !litDiya1.current) {
        litDiya1.current = true;
        lightTargetDiya('exterior-porch-1');
        audioManager.playDiyaLight();
      }
      if (progress > 0.35 && !litDiya2.current) {
        litDiya2.current = true;
        lightTargetDiya('verandah-left');
        audioManager.playDiyaLight();
      }
      if (progress > 0.60 && !litDiya3.current) {
        litDiya3.current = true;
        lightTargetDiya('verandah-right');
        audioManager.playDiyaLight();
      }
      if (progress > 0.85 && !litDiya4.current) {
        litDiya4.current = true;
        lightTargetDiya('tulsi-diya');
        audioManager.playDiyaLight();
      }
    }
    // SCENE 3 — RANGOLI REVEAL (9.0s to 13.5s)
    else if (t < 13.5) {
      if (cinematicPhase !== 3) setCinematicPhase(3);
      const progress = (t - 9.0) / 4.5;

      // Sweep around the central Rangoli in courtyard at [0, 0.05, 5]
      const orbitAngle = Math.PI * 0.5 + progress * Math.PI * 0.8;
      const radius = 2.8 - Math.sin(progress * Math.PI) * 0.4;

      targetCamPos.current.set(
        Math.cos(orbitAngle) * radius,
        1.5 - Math.sin(progress * Math.PI) * 0.3,
        5 + Math.sin(orbitAngle) * radius
      );
      targetLookAt.current.set(0, 0.08, 5);
    }
    // SCENE 4 — FIREWORKS FINALE (13.5s to 18.0s)
    else if (t < 18.0) {
      if (cinematicPhase !== 4) setCinematicPhase(4);
      const progress = (t - 13.5) / 4.5;

      // Tilt up towards the night sky over the house
      targetCamPos.current.set(
        Math.sin(progress * 0.2) * 2.0,
        2.2,
        10.5 + progress * 1.5
      );
      targetLookAt.current.set(0, 7.5 + progress * 5.0, 4.0);
    }
    // SCENE 5 & 6 — HAPPY DIWALI & ENTER (18.0s+)
    else {
      if (cinematicPhase !== 5 && cinematicPhase !== 6) setCinematicPhase(5);

      // Settle into a breathtaking hero vista of the illuminated courtyard and house
      targetCamPos.current.set(0, 2.5, 12.0);
      targetLookAt.current.set(0, 2.0, 0);
    }

    // Smooth camera damping
    camera.position.lerp(targetCamPos.current, Math.min(delta * 4.5, 1));
    currentLookAt.current.lerp(targetLookAt.current, Math.min(delta * 4.5, 1));
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

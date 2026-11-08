import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState, LocationName } from '../state/useGameState';
import { touchInput } from './MobileVirtualControls';
import { audioManager } from '../audio/AudioManager';

// AABB Obstacle Colliders for Compact Playable World
interface BoxCollider {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  name?: string;
}

const LEVEL_COLLIDERS: BoxCollider[] = [
  // --- HOUSE INTERIOR BOUNDARIES (Z: -8 to 0, X: -5.2 to 5.2) ---
  { minX: -5.4, maxX: 5.4, minZ: -8.4, maxZ: -7.8, name: 'Back Interior Wall' },
  { minX: -5.4, maxX: -4.8, minZ: -8.0, maxZ: 0.0, name: 'Left Interior Wall' },
  { minX: 4.8, maxX: 5.4, minZ: -8.0, maxZ: 0.0, name: 'Right Interior Wall' },

  // House Front Wall with Central Doorway (Doorway is X: -1.2 to 1.2 at Z: 0)
  { minX: -5.4, maxX: -1.2, minZ: -0.3, maxZ: 0.3, name: 'Front Wall Left' },
  { minX: 1.2, maxX: 5.4, minZ: -0.3, maxZ: 0.3, name: 'Front Wall Right' },

  // Interior Furniture
  { minX: 2.0, maxX: 4.8, minZ: -5.8, maxZ: -2.2, name: 'Dining Table' },
  { minX: -4.8, maxX: -1.8, minZ: -4.8, maxZ: -2.2, name: 'Living Room Diwan' },
  { minX: -4.8, maxX: -2.4, minZ: -7.9, maxZ: -5.8, name: 'Puja Mandir Plinth' },

  // --- COURTYARD BOUNDARIES (Z: 0 to 12, X: -6.2 to 6.2) ---
  { minX: -6.4, maxX: -5.8, minZ: 0.0, maxZ: 12.0, name: 'Courtyard Left Wall' },
  { minX: 5.8, maxX: 6.4, minZ: 0.0, maxZ: 12.0, name: 'Courtyard Right Wall' },

  // Tulsi Vrindavan Shrine
  { minX: -4.6, maxX: -3.2, minZ: 5.0, maxZ: 6.8, name: 'Tulsi Shrine' },

  // Courtyard to Garden Gateway Wall at Z: 12.0 (Opening is X: -2.2 to 2.2)
  { minX: -6.2, maxX: -2.2, minZ: 11.7, maxZ: 12.3, name: 'Garden Wall Left' },
  { minX: 2.2, maxX: 6.2, minZ: 11.7, maxZ: 12.3, name: 'Garden Wall Right' },

  // --- GARDEN & FIREWORKS ZONE (Z: 12 to 20, X: -6.2 to 6.2) ---
  { minX: -6.4, maxX: -5.8, minZ: 12.0, maxZ: 20.5, name: 'Garden Left Fence' },
  { minX: 5.8, maxX: 6.4, minZ: 12.0, maxZ: 20.5, name: 'Garden Right Fence' },
  { minX: -6.2, maxX: 6.2, minZ: 19.8, maxZ: 20.6, name: 'Garden Far Wall' },

  // Garden Bench & Fireworks Counter
  { minX: -4.8, maxX: -3.0, minZ: 14.2, maxZ: 16.2, name: 'Garden Bench' },
  { minX: -3.8, maxX: 3.8, minZ: 18.2, maxZ: 19.6, name: 'Fireworks Stall' },
];

export function checkCollides(x: number, z: number, radius = 0.38): boolean {
  for (const box of LEVEL_COLLIDERS) {
    if (
      x + radius > box.minX &&
      x - radius < box.maxX &&
      z + radius > box.minZ &&
      z - radius < box.maxZ
    ) {
      return true;
    }
  }
  return false;
}

// Global active interactive registry
export interface RegisteredInteractive {
  id: string;
  label: string;
  subtext?: string;
  position: THREE.Vector3;
  maxDistance?: number;
  action: () => void;
}

export const interactiveRegistry = new Map<string, RegisteredInteractive>();

export function registerInteractive(item: RegisteredInteractive) {
  interactiveRegistry.set(item.id, item);
}

export function unregisterInteractive(id: string) {
  interactiveRegistry.delete(id);
}

export const FirstPersonController: React.FC = () => {
  const { camera, gl } = useThree();
  const {
    cinematicActive,
    isPaused,
    gameStarted,
    houseDoorOpen,
    activePrompt,
    setActivePrompt,
    mouseSensitivity,
    touchSensitivity,
    reducedMotion,
    currentLocationName,
    setCurrentLocationName,
    playerPosition,
    setPlayerPosition,
    placementMode,
    placementPos,
    placementValid,
    setPlacementPos,
    setPlacementValid,
    placeFireworkOnGround,
    cancelPlacement,
  } = useGameState();

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });

  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const isPointerLocked = useRef(false);

  // Velocity for acceleration/deceleration
  const velocity = useRef(new THREE.Vector3());

  // Head bobbing state
  const bobTimer = useRef(0);
  const footstepTimer = useRef(0);

  // Raycaster for center-screen object detection and pointer placement
  const raycaster = useRef(new THREE.Raycaster());
  const placementRaycaster = useRef(new THREE.Raycaster());
  const hoveredInteractiveId = useRef<string | null>(null);

  // Synchronized refs to avoid stale closures in listeners
  const activePromptRef = useRef(activePrompt);
  activePromptRef.current = activePrompt;

  const placementModeRef = useRef(placementMode);
  placementModeRef.current = placementMode;

  const placementPosRef = useRef(placementPos);
  placementPosRef.current = placementPos;

  const placementValidRef = useRef(placementValid);
  placementValidRef.current = placementValid;

  // Initial camera placement in courtyard facing the house
  useEffect(() => {
    if (!cinematicActive) {
      camera.position.set(0, 1.65, 8.5);
      euler.current.set(0, 0, 0);
      camera.quaternion.setFromEuler(euler.current);
    }
  }, [cinematicActive, camera]);

  // Support camera position teleport if state playerPosition changes significantly
  const lastStatePos = useRef(playerPosition);
  useEffect(() => {
    const [px, py, pz] = playerPosition;
    const [lx, ly, lz] = lastStatePos.current;
    const distSq = (px - lx) ** 2 + (py - ly) ** 2 + (pz - lz) ** 2;
    if (distSq > 0.4) {
      camera.position.set(px, py, pz);
      lastStatePos.current = playerPosition;
    }
  }, [playerPosition, camera]);

  // Raycast from 2D Normalized Device Coordinates onto ground plane
  const updateGroundPlacement = (ndcX: number, ndcY: number) => {
    placementRaycaster.current.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.02);
    const hitPoint = new THREE.Vector3();
    const hit = placementRaycaster.current.ray.intersectPlane(groundPlane, hitPoint);

    if (hit) {
      // Valid celebration ground area: Open outdoor Courtyard & Fireworks Park (Z: 0.5 to 19.5, X: -5.4 to 5.4)
      const insideZone =
        hitPoint.z >= 0.5 && hitPoint.z <= 19.5 && Math.abs(hitPoint.x) <= 5.4;
      const collides = checkCollides(hitPoint.x, hitPoint.z, 0.42);
      const valid = insideZone && !collides;

      setPlacementPos([hitPoint.x, 0.03, hitPoint.z]);
      setPlacementValid(valid);
    }
  };

  // When entering placement mode: temporarily unlock mouse cursor
  useEffect(() => {
    if (placementMode) {
      if (document.pointerLockElement) {
        try {
          document.exitPointerLock?.();
        } catch {}
      }
      // Compute default placement in front of camera
      const lookDir = camera.getWorldDirection(new THREE.Vector3());
      const initX = Math.max(-5.0, Math.min(5.0, camera.position.x + lookDir.x * 2.8));
      const initZ = Math.max(12.5, Math.min(18.0, camera.position.z + lookDir.z * 2.8));
      const valid = !checkCollides(initX, initZ, 0.42);
      setPlacementPos([initX, 0.03, initZ]);
      setPlacementValid(valid);
    }
  }, [placementMode, camera, setPlacementPos, setPlacementValid]);

  // Pointer lock, mouse look, and direct click interaction
  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === canvas;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isPaused || cinematicActive) return;

      if (placementModeRef.current || useGameState.getState().placementMode) {
        // In placement mode, mouse cursor is free: calculate exact raycast hit
        const rect = canvas.getBoundingClientRect();
        const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        updateGroundPlacement(ndcX, ndcY);
        return;
      }

      if (!isPointerLocked.current) return;

      const factor = 0.0022 * mouseSensitivity;
      euler.current.y -= (e.movementX || 0) * factor;
      euler.current.x -= (e.movementY || 0) * factor;

      // Clamp vertical pitch (-82 deg to +82 deg) to prevent neck inversion
      euler.current.x = Math.max(-1.42, Math.min(1.42, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    };

    const onClick = (e: MouseEvent) => {
      if (isPaused || !gameStarted || cinematicActive) return;

      if (placementModeRef.current) {
        // In placement mode: Click confirms placement at pointer's world coordinates!
        if (placementValidRef.current) {
          placeFireworkOnGround(placementPosRef.current);
          audioManager.playPowderPickup();
          // Restore pointer lock after placing
          if (!('ontouchstart' in window)) {
            canvas.requestPointerLock?.();
          }
        }
        return;
      }

      if (document.pointerLockElement === canvas) {
        // When pointer is locked: direct left-click directly interacts with targeted object!
        if (activePromptRef.current) {
          activePromptRef.current.action();
        }
      } else {
        // Direct click interacts immediately, then requests pointer lock
        if (activePromptRef.current) {
          activePromptRef.current.action();
        }
        if (!('ontouchstart' in window)) {
          canvas.requestPointerLock?.();
        }
      }
    };

    const onContextMenu = (e: MouseEvent) => {
      if (placementModeRef.current) {
        e.preventDefault();
        cancelPlacement();
        if (!('ontouchstart' in window)) {
          canvas.requestPointerLock?.();
        }
      }
    };

    // Mobile touch placement listener
    const onTouchMove = (e: TouchEvent) => {
      if (placementModeRef.current && e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const ndcX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const ndcY = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        updateGroundPlacement(ndcX, ndcY);
      }
    };

    document.addEventListener('pointerlockchange', onPointerLockChange);
    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('contextmenu', onContextMenu);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, [
    gl,
    isPaused,
    gameStarted,
    cinematicActive,
    mouseSensitivity,
    camera,
    placeFireworkOnGround,
    cancelPlacement,
  ]);

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isPaused || cinematicActive) return;

      if (e.code === 'Escape' && placementModeRef.current) {
        cancelPlacement();
        const canvas = gl.domElement;
        if (!('ontouchstart' in window)) {
          canvas.requestPointerLock?.();
        }
        return;
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.sprint = true;
          break;
        case 'KeyE':
          if (placementModeRef.current && placementValidRef.current) {
            placeFireworkOnGround(placementPosRef.current);
            audioManager.playPowderPickup();
          } else if (activePromptRef.current) {
            activePromptRef.current.action();
          }
          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.sprint = false;
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isPaused, cinematicActive, cancelPlacement, placeFireworkOnGround, gl]);

  // Frame Update Loop
  useFrame((_, delta) => {
    if (cinematicActive || isPaused || !gameStarted) return;

    // 1. Mobile Touch Look
    if (touchInput.lookDeltaX !== 0 || touchInput.lookDeltaY !== 0) {
      const factor = 1.0 * touchSensitivity;
      euler.current.y -= touchInput.lookDeltaX * factor;
      euler.current.x -= touchInput.lookDeltaY * factor;
      euler.current.x = Math.max(-1.42, Math.min(1.42, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);

      touchInput.lookDeltaX = 0;
      touchInput.lookDeltaY = 0;
    }

    // 2. Compute Movement Vectors
    let forwardInput = 0;
    let sideInput = 0;

    if (keys.current.forward) forwardInput += 1;
    if (keys.current.backward) forwardInput -= 1;
    if (keys.current.left) sideInput -= 1;
    if (keys.current.right) sideInput += 1;

    if (touchInput.isMoving) {
      forwardInput += touchInput.moveY;
      sideInput += touchInput.moveX;
    }

    const yawQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      euler.current.y
    );
    const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(yawQuat).normalize();
    const rightDir = new THREE.Vector3(1, 0, 0).applyQuaternion(yawQuat).normalize();

    const targetSpeed = keys.current.sprint ? 5.2 : 3.2;
    const moveDir = new THREE.Vector3()
      .addScaledVector(forwardDir, forwardInput)
      .addScaledVector(rightDir, sideInput);

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize().multiplyScalar(targetSpeed);
    }

    // Smooth acceleration & deceleration (lerp velocity)
    const accelRate = moveDir.lengthSq() > 0 ? 12 : 10;
    velocity.current.lerp(moveDir, Math.min(delta * accelRate, 1));

    const stepX = velocity.current.x * delta;
    const stepZ = velocity.current.z * delta;

    // Door check: X: [-1.2, 1.2], Z: 0
    const targetX = camera.position.x + stepX;
    const targetZ = camera.position.z + stepZ;

    let doorBlocked = false;
    if (!houseDoorOpen && Math.abs(targetX) < 1.3 && targetZ > -0.5 && targetZ < 0.5) {
      doorBlocked = true;
    }

    // Slide-along-wall collision resolution
    if (!doorBlocked && !checkCollides(targetX, camera.position.z)) {
      camera.position.x = targetX;
    }
    if (!doorBlocked && !checkCollides(camera.position.x, targetZ)) {
      camera.position.z = targetZ;
    }

    // 3. Subtle Human Head Bob & Footstep Rhythm
    const isMoving = velocity.current.length() > 0.4;
    let headBobOffset = 0;

    if (isMoving && !reducedMotion) {
      const bobFreq = keys.current.sprint ? 12.0 : 8.5;
      bobTimer.current += delta * bobFreq;
      headBobOffset = Math.sin(bobTimer.current) * 0.035;

      // Footstep audio timing
      footstepTimer.current += delta * (keys.current.sprint ? 1.4 : 1.0);
      if (footstepTimer.current > 0.42) {
        footstepTimer.current = 0;
        const z = camera.position.z;
        const surface = z < 0 ? 'marble' : 'stone';
        audioManager.playFootstep(surface);
      }
    } else {
      bobTimer.current = 0;
      footstepTimer.current = 0.35;
    }

    camera.position.y = 1.65 + headBobOffset;

    // Sync player position in state for 3D audio distance calculations
    setPlayerPosition([camera.position.x, camera.position.y, camera.position.z]);

    // 4. Center-Screen Raycasting for Physical Interactions
    if (!placementModeRef.current) {
      raycaster.current.set(camera.position, camera.getWorldDirection(new THREE.Vector3()));
      let nearestDist = 999.0;
      let bestInteractive: RegisteredInteractive | null = null;
      const lookDir = camera.getWorldDirection(new THREE.Vector3());

      // Raycast towards all registered interactive objects
      interactiveRegistry.forEach(item => {
        const toItem = item.position.clone().sub(camera.position);
        const dist = toItem.length();
        const maxDist = item.maxDistance || 2.8;

        if (dist <= maxDist) {
          const dir = toItem.clone().normalize();
          const dot3D = lookDir.dot(dir);

          // Horizontal alignment check to allow comfortable eye height interaction
          const toHoriz = new THREE.Vector2(toItem.x, toItem.z).normalize();
          const lookHoriz = new THREE.Vector2(lookDir.x, lookDir.z).normalize();
          const dotHoriz = lookHoriz.dot(toHoriz);

          if ((dot3D > 0.65 || (dist < 2.2 && dotHoriz > 0.82)) && dist < nearestDist) {
            nearestDist = dist;
            bestInteractive = item;
          }
        }
      });

      if (bestInteractive) {
        const it = bestInteractive as RegisteredInteractive;
        if (hoveredInteractiveId.current !== it.id) {
          hoveredInteractiveId.current = it.id;
          setActivePrompt({
            id: it.id,
            label: it.label,
            subtext: it.subtext,
            action: it.action,
          });
        }
      } else {
        if (hoveredInteractiveId.current !== null) {
          hoveredInteractiveId.current = null;
          setActivePrompt(null);
        }
      }
    } else {
      // In placement mode, clear normal prompt so placement instructions take priority
      if (hoveredInteractiveId.current !== null) {
        hoveredInteractiveId.current = null;
        setActivePrompt(null);
      }
    }

    // 5. Update Location Name (only when changed)
    const z = camera.position.z;
    const x = camera.position.x;
    let nextLoc: LocationName = 'Front Gate & Courtyard';

    if (z <= 0) {
      if (x < -2.2 && z < -4.5) nextLoc = 'Puja Corner';
      else if (x > 1.2 && z < -1.8) nextLoc = 'Dining & Sweets';
      else nextLoc = 'Living Room';
    } else if (z > 0 && z <= 12) {
      nextLoc = 'Front Gate & Courtyard';
    } else if (z > 12 && z <= 16) {
      nextLoc = 'Neighbourhood Pathway';
    } else {
      nextLoc = 'Community Park';
    }

    if (nextLoc !== currentLocationName) {
      setCurrentLocationName(nextLoc);
      audioManager.adaptLocationAudio(nextLoc);
    }
  });

  return null;
};

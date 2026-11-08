import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState, LocationName } from '../state/useGameState';
import { touchInput } from './MobileVirtualControls';

// Simple bounding boxes for obstacle collision in the Diwali world
interface BoundingBox2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  name?: string;
}

const COLLIDERS: BoundingBox2D[] = [
  // World Outer Boundaries
  { minX: -26, maxX: -24, minZ: -16, maxZ: 42 }, // Left boundary wall
  { minX: 24, maxX: 26, minZ: -16, maxZ: 42 },   // Right boundary wall
  { minX: -25, maxX: 25, minZ: -16, maxZ: -14 }, // Back house wall
  { minX: -25, maxX: 25, minZ: 40, maxZ: 42 },   // Far park boundary

  // House Exterior Front Wall with Doorway gap around X: [-1.2, 1.2] at Z: 0
  { minX: -16, maxX: -1.2, minZ: -0.3, maxZ: 0.3 }, // Left front wall
  { minX: 1.2, maxX: 16, minZ: -0.3, maxZ: 0.3 },   // Right front wall
  { minX: -16, maxX: -15, minZ: -14, maxZ: 0 },     // House left wall
  { minX: 15, maxX: 16, minZ: -14, maxZ: 0 },       // House right wall

  // Interior Divider (Puja room / Living room divider)
  { minX: -8, maxX: -2.5, minZ: -7, maxZ: -6.5 },
  // Dining Table Collider (in living/dining room)
  { minX: 2.5, maxX: 6.5, minZ: -6.5, maxZ: -3.5, name: 'Dining Table' },
  // Sofa Collider
  { minX: -7.5, maxX: -3.5, minZ: -4, maxZ: -2, name: 'Sofa' },
  // Puja Mandir Collider
  { minX: -6.5, maxX: -3.5, minZ: -13.5, maxZ: -11.5, name: 'Mandir' },

  // Park Fence / Boundary between Courtyard & Park (with pathway gate open at X: [-3, 3])
  { minX: -24, maxX: -3, minZ: 14.8, maxZ: 15.2 },
  { minX: 3, maxX: 24, minZ: 14.8, maxZ: 15.2 },
];

function checkCollision(x: number, z: number, playerRadius: number = 0.45): boolean {
  for (const box of COLLIDERS) {
    if (
      x + playerRadius > box.minX &&
      x - playerRadius < box.maxX &&
      z + playerRadius > box.minZ &&
      z - playerRadius < box.maxZ
    ) {
      return true; // Collision detected!
    }
  }
  return false;
}

export const FirstPersonController: React.FC = () => {
  const { camera, gl } = useThree();
  const {
    isPaused,
    gameStarted,
    setPlayerPosition,
    setCurrentLocationName,
    activePrompt,
    houseDoorOpen,
  } = useGameState();

  // Keyboard state
  const keys = useRef<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    sprint: boolean;
  }>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });

  // Euler angles for camera rotation
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const isLocked = useRef(false);

  // Initial camera setup
  useEffect(() => {
    camera.position.set(0, 1.6, 9); // Start in courtyard looking towards house
    euler.current.set(0, Math.PI, 0); // facing front door
    camera.quaternion.setFromEuler(euler.current);
  }, [camera]);

  // Keyboard Event Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

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
          if (activePrompt) {
            activePrompt.action();
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
  }, [isPaused, activePrompt]);

  // Pointer Lock on Desktop Canvas Click
  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerLockChange = () => {
      isLocked.current = document.pointerLockElement === canvas;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked.current || isPaused) return;

      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      euler.current.y -= movementX * 0.0022;
      euler.current.x -= movementY * 0.0022;
      // Clamp pitch to avoid neck snapping
      euler.current.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, euler.current.x));

      camera.quaternion.setFromEuler(euler.current);
    };

    const onClick = () => {
      if (!isPaused && gameStarted && document.pointerLockElement !== canvas) {
        // Request pointer lock only on non-touch devices
        if (!('ontouchstart' in window)) {
          canvas.requestPointerLock?.();
        }
      }
    };

    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
    };
  }, [gl, isPaused, gameStarted, camera]);

  // Movement Frame Loop
  useFrame((_, delta) => {
    if (isPaused || !gameStarted) return;

    // Apply mobile touch look rotation
    if (touchInput.lookDeltaX !== 0 || touchInput.lookDeltaY !== 0) {
      euler.current.y -= touchInput.lookDeltaX;
      euler.current.x -= touchInput.lookDeltaY;
      euler.current.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);

      // Dampen delta
      touchInput.lookDeltaX = 0;
      touchInput.lookDeltaY = 0;
    }

    // Determine movement direction vector
    let forwardInput = 0;
    let sideInput = 0;

    // Keyboard inputs
    if (keys.current.forward) forwardInput += 1;
    if (keys.current.backward) forwardInput -= 1;
    if (keys.current.left) sideInput -= 1;
    if (keys.current.right) sideInput += 1;

    // Combine with Mobile Joystick input
    if (touchInput.isMoving) {
      forwardInput += touchInput.moveY;
      sideInput += touchInput.moveX;
    }

    if (forwardInput !== 0 || sideInput !== 0) {
      const moveSpeed = (keys.current.sprint ? 5.5 : 3.2) * delta;

      // Extract yaw rotation only (prevent flying/sinking when looking up/down)
      const yawQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), euler.current.y);
      const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(yawQuat).normalize();
      const rightDir = new THREE.Vector3(1, 0, 0).applyQuaternion(yawQuat).normalize();

      const moveVec = new THREE.Vector3()
        .addScaledVector(forwardDir, forwardInput)
        .addScaledVector(rightDir, sideInput)
        .normalize()
        .multiplyScalar(moveSpeed);

      const targetX = camera.position.x + moveVec.x;
      const targetZ = camera.position.z + moveVec.z;

      // Closed Door Block: Door at X: [-1.2, 1.2], Z: 0
      let doorBlocked = false;
      if (!houseDoorOpen && Math.abs(targetX) < 1.4 && targetZ > -0.6 && targetZ < 0.6) {
        doorBlocked = true;
      }

      // Test X collision
      if (!doorBlocked && !checkCollision(targetX, camera.position.z)) {
        camera.position.x = targetX;
      }
      // Test Z collision
      if (!doorBlocked && !checkCollision(camera.position.x, targetZ)) {
        camera.position.z = targetZ;
      }
    }

    // Keep camera grounded at human eye height (1.6m)
    camera.position.y = 1.6;

    // Sync position to state periodically
    setPlayerPosition([camera.position.x, camera.position.y, camera.position.z]);

    // Update location name based on coords
    const z = camera.position.z;
    const x = camera.position.x;
    let loc: LocationName = 'Front Gate & Courtyard';

    if (z <= 0) {
      if (x < -2.5 && z < -6) loc = 'Puja Corner';
      else if (x > 1 && z < -2) loc = 'Dining & Sweets';
      else loc = 'Living Room';
    } else if (z > 0 && z <= 13) {
      loc = 'Front Gate & Courtyard';
    } else if (z > 13 && z <= 22) {
      loc = 'Neighbourhood Pathway';
    } else {
      loc = 'Community Park';
    }

    setCurrentLocationName(loc);
  });

  return null;
};

import * as THREE from 'three';

export interface RaycastHitResult {
  hitPoint: THREE.Vector3;
  uv: THREE.Vector2;
  inside: boolean;
  distanceFromCenter?: number;
}

export interface GroundPlacementResult {
  hitPoint: THREE.Vector3;
  valid: boolean;
  ndc: { x: number; y: number };
}

/**
 * ScreenRaycaster:
 * Unified, precision screen-to-world raycasting architecture shared across:
 * - Rangoli drawing & powder sprinkling
 * - Firework placement preview & final positioning
 * - Object targeting & inspection
 */
export class ScreenRaycaster {
  private static raycaster = new THREE.Raycaster();
  private static planeCache = new Map<number, THREE.Plane>();

  /**
   * Convert raw client viewport coordinates (clientX, clientY) to Normalized Device Coordinates (NDC: [-1, 1]).
   * Strictly accounts for canvas position, bounding rectangle, and viewport offset without DPR double-multiplication.
   */
  public static screenToNDC(
    clientX: number,
    clientY: number,
    canvas: HTMLCanvasElement
  ): { x: number; y: number; rect: DOMRect } {
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
    return { x, y, rect };
  }

  /**
   * Constructs a Three.js Raycaster configured for the exact pointer coordinates.
   */
  public static getRaycaster(
    clientX: number,
    clientY: number,
    canvas: HTMLCanvasElement,
    camera: THREE.Camera
  ): THREE.Raycaster {
    const { x, y } = this.screenToNDC(clientX, clientY, canvas);
    this.raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    return this.raycaster;
  }

  /**
   * Intersect with the Rangoli drawing canvas surface.
   * Returns exact 3D world hitPoint and mapped UV coordinate [0, 1].
   */
  public static raycastRangoli(
    clientX: number,
    clientY: number,
    canvas: HTMLCanvasElement,
    camera: THREE.Camera,
    rangoliMesh?: THREE.Mesh | null,
    centerX: number = 0,
    centerZ: number = 5.0,
    surfaceY: number = 0.046,
    radius: number = 2.0
  ): RaycastHitResult | null {
    const raycaster = this.getRaycaster(clientX, clientY, canvas, camera);

    // 1. Try direct mesh intersection if provided
    if (rangoliMesh) {
      const intersects = raycaster.intersectObject(rangoliMesh, false);
      if (intersects.length > 0) {
        const hit = intersects[0];
        if (hit.point && hit.uv) {
          const dist = Math.hypot(hit.point.x - centerX, hit.point.z - centerZ);
          return {
            hitPoint: hit.point.clone(),
            uv: hit.uv.clone(),
            inside: dist <= radius,
            distanceFromCenter: dist,
          };
        }
      }
    }

    // 2. Analytic horizontal plane fallback
    let plane = this.planeCache.get(surfaceY);
    if (!plane) {
      plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -surfaceY);
      this.planeCache.set(surfaceY, plane);
    }

    const hitPoint = new THREE.Vector3();
    const hit = raycaster.ray.intersectPlane(plane, hitPoint);
    if (!hit) return null;

    const dx = hitPoint.x - centerX;
    const dz = hitPoint.z - centerZ;
    const dist = Math.hypot(dx, dz);
    const inside = dist <= radius;

    // Map circular surface to [0, 1] UV space (center at 0.5, 0.5)
    const u = dx / (2 * radius) + 0.5;
    const v = dz / (2 * radius) + 0.5;

    return {
      hitPoint,
      uv: new THREE.Vector2(Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v))),
      inside,
      distanceFromCenter: dist,
    };
  }

  /**
   * Intersect with celebration ground plane for firework placement and ghost preview.
   */
  public static raycastGroundPlacement(
    clientX: number,
    clientY: number,
    canvas: HTMLCanvasElement,
    camera: THREE.Camera,
    groundY: number = 0.02,
    colliderCheck?: (x: number, z: number, r: number) => boolean
  ): GroundPlacementResult | null {
    const { x, y } = this.screenToNDC(clientX, clientY, canvas);
    this.raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    let plane = this.planeCache.get(groundY);
    if (!plane) {
      plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -groundY);
      this.planeCache.set(groundY, plane);
    }

    const hitPoint = new THREE.Vector3();
    const hit = this.raycaster.ray.intersectPlane(plane, hitPoint);
    if (!hit) return null;

    // Outdoor celebration zones: Courtyard & Fireworks park (Z: 0.5 to 19.5, X: -5.4 to 5.4)
    const insideZone =
      hitPoint.z >= 0.5 && hitPoint.z <= 19.5 && Math.abs(hitPoint.x) <= 5.4;
    const collides = colliderCheck ? colliderCheck(hitPoint.x, hitPoint.z, 0.42) : false;
    const valid = insideZone && !collides;

    return {
      hitPoint,
      valid,
      ndc: { x, y },
    };
  }

  /**
   * Interpolate between previous and current UVs for seamless continuous drawing strokes.
   */
  public static interpolateUV(
    prev: THREE.Vector2,
    curr: THREE.Vector2,
    maxDistance: number = 0.015
  ): THREE.Vector2[] {
    const dist = prev.distanceTo(curr);
    if (dist <= maxDistance) return [curr];

    const steps = Math.min(64, Math.ceil(dist / maxDistance));
    const points: THREE.Vector2[] = [];
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      points.push(new THREE.Vector2(
        prev.x + (curr.x - prev.x) * t,
        prev.y + (curr.y - prev.y) * t
      ));
    }
    return points;
  }
}

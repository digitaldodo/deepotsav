import React from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// 1. Traditional Brass Pot / Vessel (Poly Haven CC0)
export const BrassPotModel: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1.0 }) => {
  const { scene } = useGLTF('/assets/models/brass_pot_01/brass_pot_01.gltf');
  const clone = React.useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clone}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
};

// 2. Painted Wooden Bench (Poly Haven CC0)
export const BenchModel: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1.0 }) => {
  const { scene } = useGLTF('/assets/models/painted_wooden_bench/painted_wooden_bench.gltf');
  const clone = React.useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clone}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
};

// 3. Brass & Glass Lantern (Poly Haven CC0)
export const LanternModel: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1.0 }) => {
  const { scene } = useGLTF('/assets/models/Lantern_01/Lantern_01.gltf');
  const clone = React.useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clone}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
    />
  );
};

// 4. Clay Planter Pot (Poly Haven CC0)
export const PlanterPotModel: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1.0 }) => {
  const { scene } = useGLTF('/assets/models/planter_pot_clay/planter_pot_clay.gltf');
  const clone = React.useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clone}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
};

// 5. Potted Plant (Poly Haven CC0)
export const PottedPlantModel: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1.0 }) => {
  const { scene } = useGLTF('/assets/models/potted_plant_01/potted_plant_01.gltf');
  const clone = React.useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clone}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
};

// Preload models for instantaneous rendering
useGLTF.preload('/assets/models/brass_pot_01/brass_pot_01.gltf');
useGLTF.preload('/assets/models/painted_wooden_bench/painted_wooden_bench.gltf');
useGLTF.preload('/assets/models/Lantern_01/Lantern_01.gltf');
useGLTF.preload('/assets/models/planter_pot_clay/planter_pot_clay.gltf');
useGLTF.preload('/assets/models/potted_plant_01/potted_plant_01.gltf');

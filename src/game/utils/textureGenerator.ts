import * as THREE from 'three';

// Procedural texture cache to avoid re-generating
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Creates high-quality procedural Jaisalmer Sandstone texture
 */
export function getSandstoneTexture(colorHex = '#C68B59'): THREE.CanvasTexture {
  const key = `sandstone_${colorHex}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 512, 512);

  // Sandstone speckle & sediment layering
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 28;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.9));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.7));
  }
  ctx.putImageData(imgData, 0, 0);

  // Subtle sedimentary horizontal banding
  ctx.fillStyle = 'rgba(120, 60, 20, 0.08)';
  for (let y = 0; y < 512; y += 40 + Math.random() * 40) {
    ctx.fillRect(0, y, 512, 8 + Math.random() * 12);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(key, texture);
  return texture;
}

/**
 * Creates Makrana white marble floor with grey veins
 */
export function getMarbleFloorTexture(): THREE.CanvasTexture {
  const key = 'marble_floor';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm ivory-white base
  ctx.fillStyle = '#FBF8F0';
  ctx.fillRect(0, 0, 512, 512);

  // Draw natural subtle marble veins
  ctx.strokeStyle = 'rgba(180, 170, 160, 0.25)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let v = 0; v < 6; v++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < 512) {
      x += (Math.random() - 0.5) * 60;
      y += 20 + Math.random() * 30;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Polished tile grout grid
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)'; // Thin gold inlay line
  ctx.lineWidth = 2;
  ctx.strokeRect(4, 4, 504, 504);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(key, texture);
  return texture;
}

/**
 * Creates carved Sheesham / Teak wood grain texture
 */
export function getCarvedWoodTexture(): THREE.CanvasTexture {
  const key = 'carved_wood';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#422212';
  ctx.fillRect(0, 0, 512, 512);

  // Wood grain lines
  ctx.strokeStyle = 'rgba(30, 12, 5, 0.35)';
  for (let y = 0; y < 512; y += 3 + Math.random() * 4) {
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y + (Math.random() - 0.5) * 8, 340, y + (Math.random() - 0.5) * 8, 512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(key, texture);
  return texture;
}

/**
 * Creates Terracotta Tile texture for courtyard
 */
export function getTerracottaTileTexture(): THREE.CanvasTexture {
  const key = 'terracotta_tile';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#A35334';
  ctx.fillRect(0, 0, 512, 512);

  // 4-tile grid with aged mortar
  const tileSize = 250;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const x = c * 256 + 6;
      const y = r * 256 + 6;
      ctx.fillStyle = (r + c) % 2 === 0 ? '#B25D3D' : '#9E4E30';
      ctx.fillRect(x, y, tileSize, tileSize);

      // Subtle traditional floral circular stamp in center of each tile
      ctx.strokeStyle = 'rgba(218, 165, 32, 0.28)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + tileSize / 2, y + tileSize / 2, 45, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Dark mortar lines
  ctx.strokeStyle = '#482012';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(256, 0);
  ctx.lineTo(256, 512);
  ctx.moveTo(0, 256);
  ctx.lineTo(512, 256);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(key, texture);
  return texture;
}

/**
 * Creates ornate Indian Jali lattice alpha mask
 */
export function getJaliAlphaTexture(): THREE.CanvasTexture {
  const key = 'jali_alpha';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#000000'; // transparent / cut-out
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#FFFFFF'; // solid stone
  // Star and octagonal lattice pattern
  for (let x = 32; x < 256; x += 64) {
    for (let y = 32; y < 256; y += 64) {
      // Octagon
      ctx.beginPath();
      const r = 24;
      for (let a = 0; a < 8; a++) {
        const angle = (a * Math.PI) / 4;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Punch out center hole
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(key, texture);
  return texture;
}

/**
 * Creates Silver Vark (edible silver foil) texture for Kaju Katli
 */
export function getSilverVarkTexture(): THREE.CanvasTexture {
  const key = 'silver_vark';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Smooth cashew paste base
  ctx.fillStyle = '#EAE2D2';
  ctx.fillRect(0, 0, 256, 256);

  // Irregular patches of crinkled silver foil
  ctx.fillStyle = '#F5F5FA';
  for (let i = 0; i < 8; i++) {
    const cx = Math.random() * 200 + 28;
    const cy = Math.random() * 200 + 28;
    ctx.beginPath();
    ctx.arc(cx, cy, 35 + Math.random() * 40, 0, Math.PI * 2);
    ctx.fill();
  }

  // Crinkle lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 256, Math.random() * 256);
    ctx.lineTo(Math.random() * 256, Math.random() * 256);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Creates Motichoor Laddoo texture (golden boondi beads + pistachio specks)
 */
export function getMotichoorTexture(): THREE.CanvasTexture {
  const key = 'motichoor';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Warm saffron orange base
  ctx.fillStyle = '#FF9500';
  ctx.fillRect(0, 0, 256, 256);

  // Hundreds of golden boondi droplets
  for (let i = 0; i < 400; i++) {
    const bx = Math.random() * 256;
    const by = Math.random() * 256;
    const r = 3 + Math.random() * 4;
    ctx.fillStyle = Math.random() > 0.4 ? '#FFB800' : '#FF7A00';
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pistachio and almond garnish flakes
  ctx.fillStyle = '#4CAF50';
  for (let i = 0; i < 24; i++) {
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 4, 2);
  }
  ctx.fillStyle = '#FFF8DC';
  for (let i = 0; i < 18; i++) {
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 5, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}

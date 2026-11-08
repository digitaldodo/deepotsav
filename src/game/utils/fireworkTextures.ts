import * as THREE from 'three';

// Cache generated textures so we don't recreate them every frame
const textureCache = new Map<string, THREE.CanvasTexture>();

function createBaseCanvas(width = 512, height = 512): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

/**
 * 1. Zameen Chakri Top Circular Label
 * Traditional spiral sunburst pattern with saffron, crimson, gold rings and festive motifs
 */
export function getChakriLabelTexture(): THREE.CanvasTexture {
  if (textureCache.has('chakri_label')) {
    return textureCache.get('chakri_label')!;
  }

  const [canvas, ctx] = createBaseCanvas(512, 512);

  // Background circle
  ctx.fillStyle = '#D84315'; // Deep orange-red cardboard
  ctx.fillRect(0, 0, 512, 512);

  const cx = 256;
  const cy = 256;

  // Concentric decorative rings
  const rings = [
    { r: 240, color: '#FFD700', width: 8 },
    { r: 220, color: '#B71C1C', width: 14 },
    { r: 200, color: '#FF9800', width: 6 },
    { r: 180, color: '#FFF8E1', width: 12 },
    { r: 160, color: '#E65100', width: 10 },
  ];

  rings.forEach(({ r, color, width }) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  });

  // Sunburst chakra spokes
  ctx.save();
  ctx.translate(cx, cy);
  const spokes = 16;
  for (let i = 0; i < spokes; i++) {
    ctx.rotate((Math.PI * 2) / spokes);
    ctx.fillStyle = i % 2 === 0 ? '#FFD54F' : '#E65100';
    ctx.beginPath();
    ctx.moveTo(35, -8);
    ctx.lineTo(170, 0);
    ctx.lineTo(35, 8);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Spiral swirl in center
  ctx.beginPath();
  ctx.arc(cx, cy, 38, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.strokeStyle = '#B71C1C';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Center spindle brass eyelet
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#212121';
  ctx.fill();
  ctx.strokeStyle = '#DAA520';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Circular curved typography "STANDARD SPECIAL CHAKRI"
  ctx.save();
  ctx.translate(cx, cy);
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const text = '★ STANDARD SPECIAL CHAKRI ★';
  for (let i = 0; i < text.length; i++) {
    const angle = -Math.PI * 0.75 + (i / text.length) * (Math.PI * 1.5);
    ctx.save();
    ctx.rotate(angle);
    ctx.translate(0, -210);
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  textureCache.set('chakri_label', tex);
  return tex;
}

/**
 * 2. Anar (Flower Pot) Conical Wrapper Texture
 * Ornate festive pattern with marigold motifs, gold trim, and Indian typography
 */
export function getAnarWrapperTexture(variant: 'gold' | 'silver' | 'tricolor' = 'gold'): THREE.CanvasTexture {
  const cacheKey = `anar_wrapper_${variant}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const [canvas, ctx] = createBaseCanvas(512, 512);

  // Gradient base paper
  const bgGrad = ctx.createLinearGradient(0, 0, 512, 512);
  if (variant === 'gold') {
    bgGrad.addColorStop(0, '#880E4F'); // Rich magenta/crimson
    bgGrad.addColorStop(0.5, '#C2185B');
    bgGrad.addColorStop(1, '#AD1457');
  } else if (variant === 'silver') {
    bgGrad.addColorStop(0, '#0D47A1');
    bgGrad.addColorStop(0.5, '#1976D2');
    bgGrad.addColorStop(1, '#1565C0');
  } else {
    bgGrad.addColorStop(0, '#E65100');
    bgGrad.addColorStop(0.5, '#F57C00');
    bgGrad.addColorStop(1, '#FF8F00');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Gold foil decorative borders top & bottom
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(0, 0, 512, 28);
  ctx.fillRect(0, 484, 512, 28);

  // Decorative border zigzag
  ctx.strokeStyle = '#FFF8E1';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x <= 512; x += 16) {
    ctx.lineTo(x, x % 32 === 0 ? 12 : 24);
  }
  ctx.stroke();

  ctx.beginPath();
  for (let x = 0; x <= 512; x += 16) {
    ctx.lineTo(x, x % 32 === 0 ? 490 : 502);
  }
  ctx.stroke();

  // Repeating floral/peacock Paisley motifs
  for (let x = 40; x < 512; x += 110) {
    ctx.save();
    ctx.translate(x, 260);

    // Golden frame oval
    ctx.beginPath();
    ctx.ellipse(0, 0, 36, 60, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#4A148C';
    ctx.fill();

    // Flower petal burst inside oval
    ctx.fillStyle = '#FFEB3B';
    for (let p = 0; p < 8; p++) {
      const angle = (p * Math.PI) / 4;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * 16, Math.sin(angle) * 22, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    // Center dot
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#E91E63';
    ctx.fill();

    ctx.restore();
  }

  // Center Banner
  ctx.fillStyle = '#FFF8E1';
  ctx.fillRect(20, 110, 472, 64);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 110, 472, 64);

  // Brand text
  ctx.fillStyle = '#B71C1C';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DELUXE FLOWER POTS (ANAR)', 256, 146);

  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('★ GOLDEN SHOWER SPARKS ★', 256, 168);

  const tex = new THREE.CanvasTexture(canvas);
  textureCache.set(cacheKey, tex);
  return tex;
}

/**
 * 3. Awaaz Rocket Body Label
 * Warning hazard stripes, star print, rocket branding
 */
export function getRocketLabelTexture(): THREE.CanvasTexture {
  if (textureCache.has('rocket_label')) {
    return textureCache.get('rocket_label')!;
  }

  const [canvas, ctx] = createBaseCanvas(512, 256);

  // Cyan-blue gradient paper
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, '#006064');
  grad.addColorStop(0.5, '#00838F');
  grad.addColorStop(1, '#006064');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Hazard diagonal stripes at base
  ctx.fillStyle = '#FFD600';
  for (let x = -50; x < 550; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 220);
    ctx.lineTo(x + 18, 220);
    ctx.lineTo(x + 8, 256);
    ctx.lineTo(x - 10, 256);
    ctx.closePath();
    ctx.fill();
  }

  // Golden stars
  ctx.fillStyle = '#FFF59D';
  for (let i = 0; i < 24; i++) {
    const sx = Math.random() * 512;
    const sy = 20 + Math.random() * 180;
    ctx.beginPath();
    ctx.arc(sx, sy, 3 + Math.random() * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Central emblem
  ctx.fillStyle = '#FFF';
  ctx.fillRect(60, 60, 392, 110);
  ctx.strokeStyle = '#D50000';
  ctx.lineWidth = 5;
  ctx.strokeRect(60, 60, 392, 110);

  ctx.fillStyle = '#D50000';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SUPER AWAAZ ROCKET', 256, 110);

  ctx.fillStyle = '#004D40';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('HIGH ALTITUDE CHRYSANTHEMUM BURST', 256, 145);

  const tex = new THREE.CanvasTexture(canvas);
  textureCache.set('rocket_label', tex);
  return tex;
}

/**
 * 4. 1000-Wala Ladi Header Card Label
 */
export function getLadiHeaderTexture(): THREE.CanvasTexture {
  if (textureCache.has('ladi_header')) {
    return textureCache.get('ladi_header')!;
  }

  const [canvas, ctx] = createBaseCanvas(512, 256);

  // Red and Gold auspicious header
  ctx.fillStyle = '#B71C1C';
  ctx.fillRect(0, 0, 512, 256);

  // Gold ornamental border
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 8;
  ctx.strokeRect(12, 12, 488, 232);

  ctx.strokeStyle = '#FFF';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 472, 216);

  // Big 1000 Number
  ctx.fillStyle = '#FFD700';
  ctx.font = '900 68px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('1000 WALA', 256, 95);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('DELUXE RED GARLAND CRACKERS', 256, 145);

  ctx.fillStyle = '#FFE082';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('RAPID MACHINE-GUN SEQUENTIAL BURSTS', 256, 185);

  const tex = new THREE.CanvasTexture(canvas);
  textureCache.set('ladi_header', tex);
  return tex;
}

/**
 * 5. Sita-Geeta Special Two-Stage Label
 */
export function getSitaGeetaTexture(): THREE.CanvasTexture {
  if (textureCache.has('sita_geeta_label')) {
    return textureCache.get('sita_geeta_label')!;
  }

  const [canvas, ctx] = createBaseCanvas(512, 512);

  // Royal Purple background
  ctx.fillStyle = '#4A148C';
  ctx.fillRect(0, 0, 512, 512);

  // Gold trim
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 10;
  ctx.strokeRect(16, 16, 480, 480);

  // Dual oval frames
  [-110, 110].forEach(ox => {
    ctx.save();
    ctx.translate(256 + ox, 220);
    ctx.beginPath();
    ctx.ellipse(0, 0, 80, 110, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#7B1FA2';
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ox < 0 ? 'SITA' : 'GEETA', 0, 10);
    ctx.restore();
  });

  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 40px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SITA - GEETA', 256, 80);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('TWO-STAGE TWIN CELEBRATION', 256, 390);

  ctx.fillStyle = '#E1BEE7';
  ctx.font = '18px sans-serif';
  ctx.fillText('Fountain Phase ➔ Twin Flare Aerial Burst', 256, 430);

  const tex = new THREE.CanvasTexture(canvas);
  textureCache.set('sita_geeta_label', tex);
  return tex;
}

/**
 * 6. Ganga-Jamuna Dual Stream Label
 */
export function getGangaJamunaTexture(): THREE.CanvasTexture {
  if (textureCache.has('ganga_jamuna_label')) {
    return textureCache.get('ganga_jamuna_label')!;
  }

  const [canvas, ctx] = createBaseCanvas(512, 512);

  // Split gold & silver wave design
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#B71C1C');
  grad.addColorStop(0.5, '#E65100');
  grad.addColorStop(1, '#880E4F');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Gold stream wave (Ganga)
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.bezierCurveTo(150, 150, 350, 300, 512, 220);
  ctx.lineTo(512, 320);
  ctx.bezierCurveTo(350, 400, 150, 250, 0, 300);
  ctx.closePath();
  ctx.fillStyle = '#FFD700';
  ctx.fill();

  // Silver stream wave (Jamuna)
  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.bezierCurveTo(150, 300, 350, 150, 512, 280);
  ctx.lineTo(512, 360);
  ctx.bezierCurveTo(350, 230, 150, 380, 0, 330);
  ctx.closePath();
  ctx.fillStyle = '#E0E0E0';
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 38px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GANGA - JAMUNA', 256, 90);

  ctx.fillStyle = '#FFD54F';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('GOLD & SILVER INTERTWINED STREAMS', 256, 440);

  const tex = new THREE.CanvasTexture(canvas);
  textureCache.set('ganga_jamuna_label', tex);
  return tex;
}

/**
 * 7. Phuljhadi Multipack Box Label
 */
export function getSparklerBoxTexture(): THREE.CanvasTexture {
  if (textureCache.has('sparkler_box_label')) {
    return textureCache.get('sparkler_box_label')!;
  }

  const [canvas, ctx] = createBaseCanvas(256, 512);

  // Red and green festive pack
  ctx.fillStyle = '#C62828';
  ctx.fillRect(0, 0, 256, 512);

  // Ornate gold border
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 236, 492);

  // Title
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('STANDARD', 128, 50);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 30px sans-serif';
  ctx.fillText('PHULJHARI', 128, 90);

  ctx.fillStyle = '#FFE082';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('SPARKLERS (10 Pcs)', 128, 120);

  // Sparkler illustration in center
  ctx.strokeStyle = '#B0BEC5';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(128, 440);
  ctx.lineTo(128, 200);
  ctx.stroke();

  // Chemical coat
  ctx.strokeStyle = '#424242';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(128, 340);
  ctx.lineTo(128, 200);
  ctx.stroke();

  // Spark stars at top
  ctx.fillStyle = '#FFF59D';
  for (let i = 0; i < 20; i++) {
    const angle = (i * Math.PI) / 10;
    const dist = 15 + Math.random() * 35;
    ctx.beginPath();
    ctx.arc(128 + Math.cos(angle) * dist, 195 + Math.sin(angle) * dist, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  textureCache.set('sparkler_box_label', tex);
  return tex;
}

/**
 * 8. Fireworks Stall Header Banner
 */
export function getStallBannerTexture(): THREE.CanvasTexture {
  if (textureCache.has('stall_banner')) {
    return textureCache.get('stall_banner')!;
  }

  const [canvas, ctx] = createBaseCanvas(1024, 256);

  // Saffron/Marigold Banner
  ctx.fillStyle = '#FF6F00';
  ctx.fillRect(0, 0, 1024, 256);

  // Golden arch frame
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 12;
  ctx.strokeRect(16, 16, 992, 224);

  // Hindi and English Title
  ctx.fillStyle = '#FFF8E1';
  ctx.font = 'bold 54px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('दीपोत्सव पटाखा भण्डार', 512, 95);

  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('DEEPOTSAV AUTHENTIC DIWALI FIREWORKS', 512, 165);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('★ PURE JOY & LIGHT ★ TRADITIONAL INDIAN PYROTECHNICS ★', 512, 210);

  const tex = new THREE.CanvasTexture(canvas);
  textureCache.set('stall_banner', tex);
  return tex;
}

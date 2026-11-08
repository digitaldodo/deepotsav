import * as THREE from 'three';

export type RangoliToolMode = 'brush' | 'line' | 'circle' | 'kolam_dots' | 'stencil' | 'petal_stamp';
export type StencilType = 'lotus' | 'peacock' | 'diya' | 'mandala' | 'kalash' | 'paisley';
export type PetalType = 'marigold_orange' | 'marigold_yellow' | 'rose_red' | 'jasmine_white';

export interface RangoliDrawOptions {
  color: string;
  brushSize: number; // in pixels (e.g. 6 to 36)
  symmetry: 1 | 2 | 4 | 6 | 8 | 12;
  mirror: boolean;
  toolMode: RangoliToolMode;
  stencil?: StencilType;
  petalType?: PetalType;
}

export class RangoliCanvasEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private undoStack: ImageData[] = [];
  private redoStack: ImageData[] = [];
  private maxHistory = 25;
  private isDrawing = false;
  private lastU = 0.5;
  private lastV = 0.5;
  private storageKey = 'deepotsav_rangoli_canvas_art';

  public width = 1024;
  public height = 1024;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    const context = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Could not create 2D canvas context for Rangoli engine');
    this.ctx = context;

    // Base background: clean warm terracotta / sand base
    this.clearBackground();

    // Create Three.js CanvasTexture
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.generateMipmaps = true;
    this.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    // Load from LocalStorage if available, otherwise draw initial decorative guide
    if (!this.loadFromStorage()) {
      this.drawTraditionalStartingGuide();
    }
    this.saveState();
  }

  public getTexture(): THREE.CanvasTexture {
    return this.texture;
  }

  public clearBackground() {
    // Warm terracotta courtyard ground with subtle circular geometric inlays
    this.ctx.fillStyle = '#9C4A28';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Outer sacred brass / gold border ring
    this.ctx.strokeStyle = 'rgba(218, 165, 32, 0.45)';
    this.ctx.lineWidth = 14;
    this.ctx.beginPath();
    this.ctx.arc(this.width / 2, this.height / 2, this.width * 0.48, 0, Math.PI * 2);
    this.ctx.stroke();

    // Concentric guideline rings
    this.ctx.strokeStyle = 'rgba(255, 235, 205, 0.15)';
    this.ctx.lineWidth = 2;
    for (const r of [0.12, 0.24, 0.36, 0.44]) {
      this.ctx.beginPath();
      this.ctx.arc(this.width / 2, this.height / 2, this.width * r, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  public saveState() {
    try {
      const snap = this.ctx.getImageData(0, 0, this.width, this.height);
      this.undoStack.push(snap);
      if (this.undoStack.length > this.maxHistory) {
        this.undoStack.shift();
      }
      this.redoStack = []; // clear redo on new action
      this.saveToStorage();
    } catch (e) {
      console.warn('Rangoli saveState error:', e);
    }
  }

  public undo(): boolean {
    if (this.undoStack.length <= 1) return false;
    const current = this.undoStack.pop();
    if (current) this.redoStack.push(current);
    const prev = this.undoStack[this.undoStack.length - 1];
    if (prev) {
      this.ctx.putImageData(prev, 0, 0);
      this.texture.needsUpdate = true;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public redo(): boolean {
    if (this.redoStack.length === 0) return false;
    const next = this.redoStack.pop();
    if (next) {
      this.undoStack.push(next);
      this.ctx.putImageData(next, 0, 0);
      this.texture.needsUpdate = true;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public clearAll() {
    this.saveState();
    this.clearBackground();
    this.drawKolamGrid();
    this.texture.needsUpdate = true;
    this.saveToStorage();
  }

  // Draw natural grainy powder dot at (px, py)
  private drawPowderDab(px: number, py: number, radius: number, hexColor: string) {
    this.ctx.save();

    // Soft feathered powder falloff
    const grad = this.ctx.createRadialGradient(px, py, 0, px, py, radius);
    grad.addColorStop(0, hexColor);
    grad.addColorStop(0.7, hexColor);
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(px, py, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Micro speckle grains around edge to mimic real powdered chalk / sindoor
    const grainCount = Math.floor(radius * 0.9);
    this.ctx.fillStyle = hexColor;
    for (let i = 0; i < grainCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = radius * (0.4 + Math.random() * 0.75);
      const gx = px + Math.cos(angle) * dist;
      const gy = py + Math.sin(angle) * dist;
      const gSize = 1.0 + Math.random() * 1.8;
      this.ctx.globalAlpha = 0.5 + Math.random() * 0.45;
      this.ctx.fillRect(gx - gSize / 2, gy - gSize / 2, gSize, gSize);
    }

    this.ctx.restore();
  }

  // Draw stroke with symmetry
  public beginStroke(u: number, v: number, _options: RangoliDrawOptions) {
    this.saveState();
    this.isDrawing = true;
    this.lastU = u;
    this.lastV = v;
  }

  public applyPointOrStroke(u: number, v: number, options: RangoliDrawOptions) {
    const cx = this.width / 2;
    const cy = this.height / 2;

    const currentX = u * this.width;
    const currentY = v * this.height;
    const prevX = this.lastU * this.width;
    const prevY = this.lastV * this.height;

    const sym = options.symmetry;
    const angles: number[] = [];
    for (let i = 0; i < sym; i++) {
      angles.push((i * 2 * Math.PI) / sym);
    }

    // Number of intermediate steps for smooth powder line
    const dist = Math.hypot(currentX - prevX, currentY - prevY);
    const steps = Math.max(1, Math.floor(dist / (options.brushSize * 0.35)));

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const interpX = prevX + (currentX - prevX) * t;
      const interpY = prevY + (currentY - prevY) * t;

      // Relative to center
      const relX = interpX - cx;
      const relY = interpY - cy;

      angles.forEach(rot => {
        // Rotate around center
        const rx = relX * Math.cos(rot) - relY * Math.sin(rot);
        const ry = relX * Math.sin(rot) + relY * Math.cos(rot);
        this.drawPowderDab(cx + rx, cy + ry, options.brushSize, options.color);

        if (options.mirror) {
          // Mirror along Y-axis
          const mx = -relX * Math.cos(rot) - relY * Math.sin(rot);
          const my = -relX * Math.sin(rot) + relY * Math.cos(rot);
          this.drawPowderDab(cx + mx, cy + my, options.brushSize, options.color);
        }
      });
    }

    this.lastU = u;
    this.lastV = v;
    this.texture.needsUpdate = true;
  }

  public endStroke() {
    this.isDrawing = false;
    this.saveToStorage();
  }

  // ==============================================================
  // FLOWER PETAL STAMP
  // ==============================================================
  public stampPetals(u: number, v: number, petalType: PetalType, symmetry: 1 | 2 | 4 | 6 | 8 | 12) {
    this.saveState();
    const cx = this.width / 2;
    const cy = this.height / 2;
    const px = u * this.width;
    const py = v * this.height;

    const relX = px - cx;
    const relY = py - cy;
    const sym = symmetry;

    const petalColors: Record<PetalType, { fill: string; stroke: string }> = {
      marigold_orange: { fill: '#FF6F00', stroke: '#E65100' },
      marigold_yellow: { fill: '#FFD54F', stroke: '#FFA000' },
      rose_red: { fill: '#C2185B', stroke: '#880E4F' },
      jasmine_white: { fill: '#FFFFFF', stroke: '#E0E0E0' },
    };

    const cfg = petalColors[petalType] || petalColors.marigold_orange;

    for (let i = 0; i < sym; i++) {
      const rot = (i * 2 * Math.PI) / sym;
      const rx = relX * Math.cos(rot) - relY * Math.sin(rot);
      const ry = relX * Math.sin(rot) + relY * Math.cos(rot);

      const targetX = cx + rx;
      const targetY = cy + ry;

      // Petal heading points radially outward from center
      const heading = Math.atan2(ry, rx) + Math.PI / 2;

      this.ctx.save();
      this.ctx.translate(targetX, targetY);
      this.ctx.rotate(heading);

      // Organic curved petal silhouette
      this.ctx.fillStyle = cfg.fill;
      this.ctx.strokeStyle = cfg.stroke;
      this.ctx.lineWidth = 2.5;

      this.ctx.beginPath();
      this.ctx.moveTo(0, -22);
      this.ctx.bezierCurveTo(14, -14, 12, 10, 0, 20);
      this.ctx.bezierCurveTo(-12, 10, -14, -14, 0, -22);
      this.ctx.fill();
      this.ctx.stroke();

      // Petal central vein
      this.ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -18);
      this.ctx.lineTo(0, 14);
      this.ctx.stroke();

      this.ctx.restore();
    }

    this.texture.needsUpdate = true;
    this.saveToStorage();
  }

  // ==============================================================
  // TRADITIONAL STENCILS
  // ==============================================================
  public applyStencil(stencil: StencilType, color: string) {
    this.saveState();
    const cx = this.width / 2;
    const cy = this.height / 2;

    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = 8;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    switch (stencil) {
      case 'lotus': {
        // Multi-petal sacred lotus
        for (let i = 0; i < 8; i++) {
          const rot = (i * Math.PI) / 4;
          this.ctx.save();
          this.ctx.translate(cx, cy);
          this.ctx.rotate(rot);

          this.ctx.beginPath();
          this.ctx.moveTo(0, 0);
          this.ctx.bezierCurveTo(45, -70, 75, -160, 0, -230);
          this.ctx.bezierCurveTo(-75, -160, -45, -70, 0, 0);
          this.ctx.stroke();
          this.ctx.restore();
        }
        // Golden seed center
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 32, 0, Math.PI * 2);
        this.ctx.fill();
        break;
      }

      case 'diya': {
        // Auspicious central clay lamp with glowing flame
        this.ctx.save();
        this.ctx.translate(cx, cy + 40);

        // Diya bowl
        this.ctx.fillStyle = '#C86432';
        this.ctx.beginPath();
        this.ctx.moveTo(-160, 0);
        this.ctx.quadraticCurveTo(0, 130, 160, 0);
        this.ctx.lineTo(-160, 0);
        this.ctx.fill();
        this.ctx.stroke();

        // Decorative rim beads
        this.ctx.fillStyle = '#FFD700';
        for (let bx = -140; bx <= 140; bx += 28) {
          this.ctx.beginPath();
          this.ctx.arc(bx, 0, 7, 0, Math.PI * 2);
          this.ctx.fill();
        }

        // Flame
        const flameGrad = this.ctx.createRadialGradient(0, -60, 5, 0, -60, 70);
        flameGrad.addColorStop(0, '#FFFFFF');
        flameGrad.addColorStop(0.3, '#FFEB3B');
        flameGrad.addColorStop(0.7, '#FF6D00');
        flameGrad.addColorStop(1, 'rgba(255, 69, 0, 0)');
        this.ctx.fillStyle = flameGrad;

        this.ctx.beginPath();
        this.ctx.moveTo(0, -150);
        this.ctx.bezierCurveTo(45, -110, 40, -40, 0, -10);
        this.ctx.bezierCurveTo(-40, -40, -45, -110, 0, -150);
        this.ctx.fill();

        this.ctx.restore();
        break;
      }

      case 'peacock': {
        // Stylized regal Mayur motif
        this.ctx.save();
        this.ctx.translate(cx, cy);

        // Body
        this.ctx.beginPath();
        this.ctx.ellipse(0, 40, 60, 90, 0.2, 0, Math.PI * 2);
        this.ctx.stroke();

        // Neck & Head
        this.ctx.beginPath();
        this.ctx.moveTo(25, 0);
        this.ctx.quadraticCurveTo(60, -90, 20, -140);
        this.ctx.bezierCurveTo(10, -165, -20, -160, -25, -135);
        this.ctx.quadraticCurveTo(-15, -90, -10, -10);
        this.ctx.stroke();

        // Crown Kalgi
        for (let a = -0.5; a <= 0.5; a += 0.35) {
          this.ctx.beginPath();
          this.ctx.moveTo(0, -160);
          const kx = Math.sin(a) * 45;
          const ky = -160 - Math.cos(a) * 45;
          this.ctx.lineTo(kx, ky);
          this.ctx.stroke();
          this.ctx.beginPath();
          this.ctx.arc(kx, ky, 6, 0, Math.PI * 2);
          this.ctx.fill();
        }

        // Radiating feather eyelets
        for (let i = 0; i < 9; i++) {
          const rot = -Math.PI * 0.8 + (i * Math.PI * 0.8) / 4;
          const fx = Math.cos(rot) * 230;
          const fy = Math.sin(rot) * 230 + 30;

          this.ctx.beginPath();
          this.ctx.moveTo(0, 60);
          this.ctx.quadraticCurveTo(fx * 0.5, fy * 0.5 - 40, fx, fy);
          this.ctx.stroke();

          this.ctx.beginPath();
          this.ctx.ellipse(fx, fy, 22, 34, rot + Math.PI / 2, 0, Math.PI * 2);
          this.ctx.stroke();
        }
        this.ctx.restore();
        break;
      }

      case 'mandala': {
        // Elaborate sacred geometric concentric circles
        for (let r = 80; r <= 360; r += 70) {
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
          this.ctx.stroke();

          const count = Math.floor(r / 12);
          for (let i = 0; i < count; i++) {
            const rot = (i * 2 * Math.PI) / count;
            const px = cx + Math.cos(rot) * r;
            const py = cy + Math.sin(rot) * r;
            this.ctx.beginPath();
            this.ctx.arc(px, py, 6, 0, Math.PI * 2);
            this.ctx.fill();
          }
        }
        break;
      }

      case 'kalash': {
        // Sacred Purna Kalash with coconut and mango leaves
        this.ctx.save();
        this.ctx.translate(cx, cy);

        // Pot
        this.ctx.beginPath();
        this.ctx.arc(0, 45, 95, 0.4, Math.PI - 0.4);
        this.ctx.stroke();

        // Rim
        this.ctx.strokeRect(-65, -35, 130, 22);

        // Coconut & Mango leaves
        this.ctx.beginPath();
        this.ctx.arc(0, -75, 45, 0, Math.PI * 2);
        this.ctx.stroke();

        for (const a of [-0.6, -0.3, 0, 0.3, 0.6]) {
          this.ctx.save();
          this.ctx.translate(0, -35);
          this.ctx.rotate(a);
          this.ctx.beginPath();
          this.ctx.moveTo(0, 0);
          this.ctx.quadraticCurveTo(24, -50, 0, -90);
          this.ctx.quadraticCurveTo(-24, -50, 0, 0);
          this.ctx.stroke();
          this.ctx.restore();
        }
        this.ctx.restore();
        break;
      }

      case 'paisley': {
        // Traditional Kalka / Kairi mango motif
        for (let i = 0; i < 4; i++) {
          const rot = (i * Math.PI) / 2;
          this.ctx.save();
          this.ctx.translate(cx, cy);
          this.ctx.rotate(rot);

          this.ctx.beginPath();
          this.ctx.moveTo(30, -50);
          this.ctx.bezierCurveTo(140, -120, 160, 80, 50, 120);
          this.ctx.bezierCurveTo(-40, 140, -60, 40, -30, -20);
          this.ctx.bezierCurveTo(-10, -70, 0, -140, 70, -170);
          this.ctx.bezierCurveTo(40, -150, 20, -100, 30, -50);
          this.ctx.stroke();
          this.ctx.restore();
        }
        break;
      }
    }

    this.ctx.restore();
    this.texture.needsUpdate = true;
    this.saveToStorage();
  }

  // ==============================================================
  // KOLAM PULLI GRID (Traditional Dot Matrix)
  // ==============================================================
  public drawKolamGrid() {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const spacing = 70;
    const dots = 7; // 7x7 grid

    this.ctx.save();
    this.ctx.fillStyle = '#FFFFFF';

    for (let row = -Math.floor(dots / 2); row <= Math.floor(dots / 2); row++) {
      for (let col = -Math.floor(dots / 2); col <= Math.floor(dots / 2); col++) {
        const x = cx + col * spacing;
        const y = cy + row * spacing;

        // Circular boundary limit
        if (Math.hypot(x - cx, y - cy) < this.width * 0.42) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, 4.5, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }

    this.ctx.restore();
    this.texture.needsUpdate = true;
  }

  // Draw traditional starting guide for initial beautiful look
  public drawTraditionalStartingGuide() {
    this.clearBackground();
    this.drawKolamGrid();

    // Center lotus outline
    this.applyStencil('lotus', '#FF9933');
    // Inner golden accent
    const cx = this.width / 2;
    const cy = this.height / 2;
    this.drawPowderDab(cx, cy, 28, '#FFD700');
  }

  // LocalStorage persistence
  private saveToStorage() {
    try {
      const dataUrl = this.canvas.toDataURL('image/jpeg', 0.85);
      localStorage.setItem(this.storageKey, dataUrl);
    } catch {}
  }

  private loadFromStorage(): boolean {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const img = new Image();
        img.onload = () => {
          this.ctx.drawImage(img, 0, 0);
          this.texture.needsUpdate = true;
        };
        img.src = saved;
        return true;
      }
    } catch {}
    return false;
  }
}

// Global singleton instance for easy cross-component access
export const rangoliEngine = new RangoliCanvasEngine();

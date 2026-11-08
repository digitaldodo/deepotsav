// ==============================================================
// DEEPOTSAV — AUDIO MANAGER
// High-fidelity audio integration using supplied authentic Indian Diwali assets
// Located in /audio/deepotsav/
// ==============================================================

class DeepotsavAudioManager {
  private ctx: AudioContext | null = null;

  // Master and Channel Gain Nodes
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Active looping source nodes
  private musicSource: AudioBufferSourceNode | null = null;
  private ambienceSource: AudioBufferSourceNode | null = null;
  private distantFireworksSource: AudioBufferSourceNode | null = null;
  private sparklerLoopSource: AudioBufferSourceNode | null = null;

  // Decoded Audio Buffer Cache
  private buffers: Map<string, AudioBuffer> = new Map();
  private loaded: boolean = false;
  private isMuted: boolean = true;
  private volume: number = 0.75;

  // Sound Asset Mapping to supplied MP3 files in /audio/deepotsav/
  private static readonly SOUND_URLS: Record<string, string> = {
    music: '/audio/deepotsav/01_festive_instrumental_loop.mp3',
    ambience: '/audio/deepotsav/02_diwali_neighbourhood_ambience_loop.mp3',
    bell: '/audio/deepotsav/03_temple_bell.mp3',
    manjira: '/audio/deepotsav/04_manjira_chime.mp3',
    diya_ignite: '/audio/deepotsav/05_diya_ignite.mp3',
    door_creak: '/audio/deepotsav/06_wooden_door_creak.mp3',
    pickup: '/audio/deepotsav/07_soft_pickup.mp3',
    sparkler_loop: '/audio/deepotsav/08_phuljhari_sparkler_loop.mp3',
    chakri: '/audio/deepotsav/09_chakri_spin_loop.mp3',
    anar: '/audio/deepotsav/10_anar_fountain.mp3',
    rocket: '/audio/deepotsav/11_rocket_launch_and_burst.mp3',
    ladi: '/audio/deepotsav/12_ladi_sequential_bursts.mp3',
    sita_geeta: '/audio/deepotsav/13_sita_geeta_special_display.mp3',
    ganga_jamuna: '/audio/deepotsav/14_ganga_jamuna_paired_display.mp3',
    distant_fireworks: '/audio/deepotsav/15_distant_fireworks_loop.mp3',
    finale: '/audio/deepotsav/16_fireworks_finale.mp3',
  };

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Master Bus
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Music Bus (softer, non-intrusive)
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        // Ambient Environment Bus
        this.ambienceGain = this.ctx.createGain();
        this.ambienceGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
        this.ambienceGain.connect(this.masterGain);

        // SFX Bus
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.loadAllBuffers();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private async loadAllBuffers() {
    if (!this.ctx || this.loaded) return;
    this.loaded = true;

    for (const [key, url] of Object.entries(DeepotsavAudioManager.SOUND_URLS)) {
      try {
        const resp = await fetch(url);
        if (resp.ok) {
          const arrBuf = await resp.arrayBuffer();
          const decoded = await this.ctx.decodeAudioData(arrBuf);
          this.buffers.set(key, decoded);
        }
      } catch (err) {
        console.warn(`[Audio] Failed to load ${url}:`, err);
      }
    }

    // If unmuted, start background loops now that buffers are loaded
    if (!this.isMuted) {
      this.startBackgroundLoops();
    }
  }

  // Set Mute
  setMuted(muted: boolean) {
    this.isMuted = muted;
    this.initContext();

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }

    if (!muted) {
      this.startBackgroundLoops();
    } else {
      this.stopBackgroundLoops();
    }
  }

  // Set Master Volume
  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  // Adapt background audio levels based on player's current location
  adaptLocationAudio(location: string) {
    if (!this.ctx || !this.musicGain || !this.ambienceGain) return;
    const now = this.ctx.currentTime;

    if (location === 'Living Room' || location === 'Puja Corner' || location === 'Dining & Sweets') {
      // Interior: Softer music, intimate room acoustic, reduced outdoor ambience
      this.musicGain.gain.setTargetAtTime(0.22, now, 0.8);
      this.ambienceGain.gain.setTargetAtTime(0.12, now, 0.8);
    } else if (location === 'Community Park') {
      // Park: Distant fireworks ambience elevated, festive music lively
      this.musicGain.gain.setTargetAtTime(0.32, now, 0.8);
      this.ambienceGain.gain.setTargetAtTime(0.38, now, 0.8);
    } else {
      // Courtyard & Pathway: Balanced festive atmosphere
      this.musicGain.gain.setTargetAtTime(0.30, now, 0.8);
      this.ambienceGain.gain.setTargetAtTime(0.25, now, 0.8);
    }
  }

  // Background Ambience & Music Loops
  private startBackgroundLoops() {
    if (this.isMuted || !this.ctx) return;

    // 1. Festive Instrumental Music Loop (01_festive_instrumental_loop.mp3)
    if (!this.musicSource && this.musicGain) {
      const musicBuf = this.buffers.get('music');
      if (musicBuf) {
        this.musicSource = this.ctx.createBufferSource();
        this.musicSource.buffer = musicBuf;
        this.musicSource.loop = true;
        this.musicSource.connect(this.musicGain);
        this.musicSource.start();
      }
    }

    // 2. Neighbourhood Ambience Loop (02_diwali_neighbourhood_ambience_loop.mp3)
    if (!this.ambienceSource && this.ambienceGain) {
      const ambBuf = this.buffers.get('ambience');
      if (ambBuf) {
        this.ambienceSource = this.ctx.createBufferSource();
        this.ambienceSource.buffer = ambBuf;
        this.ambienceSource.loop = true;
        this.ambienceSource.connect(this.ambienceGain);
        this.ambienceSource.start();
      }
    }

    // 3. Distant Fireworks Loop (15_distant_fireworks_loop.mp3)
    if (!this.distantFireworksSource && this.ambienceGain) {
      const distBuf = this.buffers.get('distant_fireworks');
      if (distBuf) {
        this.distantFireworksSource = this.ctx.createBufferSource();
        this.distantFireworksSource.buffer = distBuf;
        this.distantFireworksSource.loop = true;
        this.distantFireworksSource.connect(this.ambienceGain);
        this.distantFireworksSource.start();
      }
    }
  }

  private stopBackgroundLoops() {
    try {
      this.musicSource?.stop();
      this.ambienceSource?.stop();
      this.distantFireworksSource?.stop();
      this.sparklerLoopSource?.stop();
    } catch {}
    this.musicSource = null;
    this.ambienceSource = null;
    this.distantFireworksSource = null;
    this.sparklerLoopSource = null;
  }

  // Play One-Shot Sound Helper
  private playOneShot(key: string, volumeScale = 1.0): boolean {
    if (this.isMuted) return false;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return false;

    const buf = this.buffers.get(key);
    if (!buf) {
      return false; // will fallback to procedural synth below
    }

    const source = ctx.createBufferSource();
    source.buffer = buf;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volumeScale, ctx.currentTime);

    source.connect(gainNode);
    gainNode.connect(this.sfxGain);
    source.start();
    return true;
  }

  // ==============================================================
  // SPECIFIC INTERACTION SOUND TRIGGERS
  // ==============================================================

  // 1. Temple Bell (03_temple_bell.mp3)
  playPujaBell() {
    if (this.playOneShot('bell', 0.9)) return;
    this.synthesizeBell();
  }

  // 2. Manjira Chime (04_manjira_chime.mp3)
  playManjiraChime() {
    if (this.playOneShot('manjira', 0.8)) return;
    this.synthesizeBell();
  }

  // 3. Diya Ignition (05_diya_ignite.mp3)
  playDiyaLight() {
    if (this.playOneShot('diya_ignite', 0.75)) return;
    this.synthesizeWhoosh();
  }

  // 4. Wooden Front Door Creak (06_wooden_door_creak.mp3)
  playDoorToggle() {
    if (this.playOneShot('door_creak', 0.8)) return;
    this.synthesizeDoor();
  }

  // 5. Soft Pickup (07_soft_pickup.mp3)
  playPowderPickup() {
    if (this.playOneShot('pickup', 0.6)) return;
    this.synthesizePickup();
  }

  // 6. Powder Sprinkling
  playPowderSprinkle() {
    if (this.playOneShot('pickup', 0.45)) return;
    this.synthesizeSprinkle();
  }

  // 7. Sweet Bite / Savor
  playEatSweet() {
    if (this.playOneShot('pickup', 0.7)) {
      this.playManjiraChime();
      return;
    }
    this.synthesizeEat();
  }

  // 8. Gift Box Opening
  playGiftOpen() {
    this.playOneShot('pickup', 0.8);
    setTimeout(() => this.playManjiraChime(), 150);
  }

  // 9. Rangoli Complete Chime
  playRangoliCompleteChime() {
    this.playManjiraChime();
    setTimeout(() => this.playPujaBell(), 200);
  }

  // 11. Footstep Sound
  playFootstep(surface: 'stone' | 'wood' | 'marble' = 'stone') {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (surface === 'wood') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95 + Math.random() * 20, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    } else if (surface === 'marble') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140 + Math.random() * 30, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.06);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    } else {
      // stone / terracotta
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110 + Math.random() * 25, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.07);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    }

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // 10. Phuljhari Sparkler Continuous Loop (08_phuljhari_sparkler_loop.mp3)
  startSparklerLoop() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    this.stopSparklerLoop();

    const buf = this.buffers.get('sparkler_loop');
    if (buf) {
      this.sparklerLoopSource = ctx.createBufferSource();
      this.sparklerLoopSource.buffer = buf;
      this.sparklerLoopSource.loop = true;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.65, ctx.currentTime);
      this.sparklerLoopSource.connect(gain);
      gain.connect(this.sfxGain);
      this.sparklerLoopSource.start();
    } else {
      this.synthesizeSparklerLoop();
    }
  }

  stopSparklerLoop() {
    try {
      this.sparklerLoopSource?.stop();
    } catch {}
    this.sparklerLoopSource = null;
  }

  // 11. Chakri / Ground Spinner (09_chakri_spin_loop.mp3)
  playChakriSpin() {
    if (this.playOneShot('chakri', 0.85)) return;
    this.synthesizeChakri();
  }

  // 12. Anar / Flower Pot (10_anar_fountain.mp3)
  playAnarFountain() {
    if (this.playOneShot('anar', 0.9)) return;
    this.synthesizeAnar();
  }

  // 13. Rocket Launch & Aerial Burst (11_rocket_launch_and_burst.mp3)
  playRocketLaunch() {
    if (this.playOneShot('rocket', 0.95)) return;
    this.synthesizeRocket();
  }

  // 14. 1000-Wala Ladi Chain Crackers (12_ladi_sequential_bursts.mp3)
  playLadiChain() {
    if (this.playOneShot('ladi', 0.9)) return;
    this.synthesizeLadi();
  }

  // 15. Pencil / Sparkler Pot
  playPencilFountain() {
    if (this.playOneShot('anar', 0.6)) return;
    this.synthesizeAnar();
  }

  // 16. Sita-Geeta Special Two-Stage (13_sita_geeta_special_display.mp3)
  playSitaGeeta() {
    if (this.playOneShot('sita_geeta', 0.95)) return;
    this.playAnarFountain();
  }

  // 17. Ganga-Jamuna Paired Display (14_ganga_jamuna_paired_display.mp3)
  playGangaJamuna() {
    if (this.playOneShot('ganga_jamuna', 0.95)) return;
    this.playAnarFountain();
  }

  // 18. Grand Fireworks Finale (16_fireworks_finale.mp3)
  playFinaleSequence() {
    if (this.playOneShot('finale', 1.0)) return;
    this.synthesizeFinale();
  }

  // Generic firework aerial burst
  playFirework() {
    if (this.playOneShot('rocket', 0.8)) return;
    this.synthesizeRocket();
  }

  // ==============================================================
  // RESILIENT PROCEDURAL SYNTHESIZERS (Zero-Asset Fallback)
  // ==============================================================
  private synthesizeBell() {
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    [1046.5, 2093.0, 3135.9].forEach(freq => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now);
      osc.stop(now + 1.8);
    });
  }

  private synthesizeWhoosh() {
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  private synthesizeDoor() {
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.3);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  private synthesizePickup() {
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  private synthesizeSprinkle() {
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  private synthesizeEat() {
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.07);
      gain.gain.setValueAtTime(0.18, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.2);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.2);
    });
  }

  private synthesizeSparklerLoop() {
    // Handled gracefully via one-shot
  }

  private synthesizeChakri() {
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 1.0);
    osc.frequency.exponentialRampToValueAtTime(60, now + 4.5);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 4.5);
  }

  private synthesizeAnar() {
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 5.0);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 5.0);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 5.0);
  }

  private synthesizeRocket() {
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(2200, now + 1.2);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 1.3);
  }

  private synthesizeLadi() {
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 20; i++) {
      const popTime = now + (i / 20) * 3.5;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140 + Math.random() * 80, popTime);
      gain.gain.setValueAtTime(0.25, popTime);
      gain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.05);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(popTime);
      osc.stop(popTime + 0.05);
    }
  }

  private synthesizeFinale() {
    this.synthesizeAnar();
    for (let i = 0; i < 6; i++) {
      setTimeout(() => this.synthesizeRocket(), i * 900);
    }
  }
}

export const audioManager = new DeepotsavAudioManager();

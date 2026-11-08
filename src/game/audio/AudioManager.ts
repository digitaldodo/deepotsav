// Procedural Web Audio API Sound Engine for Deepotsav 3D
// Zero external audio files required — 100% reliable, zero network latency, responsive.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private sparklerNoiseNode: AudioNode | null = null;
  private isMuted: boolean = true;
  private volume: number = 0.7;

  private initContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.sfxGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.volume * 0.35, this.ctx.currentTime);
        this.musicGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.initContext();
      this.startAmbientMusic();
    } else {
      this.stopAmbientMusic();
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.35, this.ctx.currentTime);
    }
  }

  // 1. Temple Bell (Ghanti in Puja Corner)
  playPujaBell() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const freqs = [1046.5, 2093.0, 3135.9]; // C6, C7, G7 brass bell harmonics
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.99, now + 1.8);

      const amp = 0.25 / (idx + 1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now);
      osc.stop(now + 2.0);
    });
  }

  // 2. Diya Lighting Whoosh & Glow
  playDiyaLight() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.5);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // 3. Sweet Bite / Chew Sound
  playEatSweet() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    // Pleasant melodic eating sound with light chew crunch
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.25);
    });
  }

  // 4. Door Creak / Open
  playDoorToggle() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(160, now + 0.35);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // 5. Sparkler Crackle
  startSparklerLoop() {
    if (this.isMuted || this.sparklerNoiseNode) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    // Create crackle noise buffer
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Crackle pops
      if (Math.random() < 0.08) {
        data[i] = (Math.random() * 2 - 1) * 0.8;
      } else {
        data[i] = (Math.random() * 2 - 1) * 0.05;
      }
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1400;

    const gain = ctx.createGain();
    gain.gain.value = 0.15;

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noiseSource.start();
    this.sparklerNoiseNode = noiseSource;
  }

  stopSparklerLoop() {
    if (this.sparklerNoiseNode) {
      try {
        (this.sparklerNoiseNode as AudioScheduledSourceNode).stop();
      } catch {
        // Ignore
      }
      this.sparklerNoiseNode = null;
    }
  }

  // 6. Firework Launch & Boom
  playFirework() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    // Whistle launch
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.4);

    oscGain.gain.setValueAtTime(0.08, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.4);

    // Deep Explosion Boom (delayed by 0.4s)
    setTimeout(() => {
      if (!ctx || this.isMuted) return;
      const boomTime = ctx.currentTime;
      const boomOsc = ctx.createOscillator();
      const boomGain = ctx.createGain();

      boomOsc.type = 'sine';
      boomOsc.frequency.setValueAtTime(130, boomTime);
      boomOsc.frequency.exponentialRampToValueAtTime(35, boomTime + 0.8);

      boomGain.gain.setValueAtTime(0.4, boomTime);
      boomGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 1.2);

      boomOsc.connect(boomGain);
      boomGain.connect(this.sfxGain!);
      boomOsc.start(boomTime);
      boomOsc.stop(boomTime + 1.2);
    }, 400);
  }

  // 7. Ambient Festive Music Drone (Indian Tanpura / Raag Yaman Harmonics)
  private startAmbientMusic() {
    this.stopAmbientMusic();
    const ctx = this.initContext();
    if (!ctx || !this.musicGain) return;

    // Peaceful Sa-Pa drone chord: C3 (130.81Hz), G3 (196.00Hz), C4 (261.63Hz), E4 (329.63Hz)
    const droneFreqs = [130.81, 196.0, 261.63, 329.63];
    const now = ctx.currentTime;

    droneFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle frequency vibrato
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.2 + idx * 0.1;
      lfoGain.gain.value = 1.2;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + 3);

      osc.connect(gain);
      gain.connect(this.musicGain!);
      osc.start();

      this.ambientOscillators.push(osc);
    });
  }

  private stopAmbientMusic() {
    this.ambientOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch {
        // Ignore
      }
    });
    this.ambientOscillators = [];
  }
}

export const audioManager = new SoundEngine();

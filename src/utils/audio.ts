/**
 * Retro 8-bit Sound Synthesizer using Web Audio API
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private bgmOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private bgmPlaying: boolean = false;
  private bgmInterval: number | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(enabled?: boolean): boolean {
    if (enabled !== undefined) {
      this.soundEnabled = enabled;
    } else {
      this.soundEnabled = !this.soundEnabled;
    }
    if (!this.soundEnabled) {
      this.stopBgm();
    }
    return this.soundEnabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  // Play a simple tone
  private playTone(freq: number, type: OscillatorType, duration: number, startGain = 0.15, endGain = 0.001) {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(startGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(endGain, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore audio errors on un-interacted page
    }
  }

  // Sound: Menu select / Beep
  public playSelect() {
    this.playTone(520, 'square', 0.08, 0.1);
  }

  public playConfirm() {
    this.playTone(680, 'square', 0.06, 0.1);
    setTimeout(() => this.playTone(880, 'square', 0.1, 0.12), 60);
  }

  public playCancel() {
    this.playTone(400, 'square', 0.08, 0.1);
    setTimeout(() => this.playTone(280, 'square', 0.1, 0.1), 70);
  }

  // Sound: Correct math answer (100% precision or high precision)
  public playCorrect(isPerfect: boolean = false) {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = isPerfect ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.15, 0.18);
        }, idx * 70);
      });
    } catch {
      // Ignore
    }
  }

  // Sound: Wrong answer / Attack fail
  public playWrong() {
    this.playTone(220, 'sawtooth', 0.15, 0.15);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.25, 0.15), 120);
  }

  // Sound: Attack laser/energy blast
  public playAttack(element: string = 'Raízes') {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = element === 'Delta' ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(element === 'Vértice' ? 880 : 600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  }

  // Sound: Hit impact on enemy or player
  public playHit() {
    this.playTone(120, 'triangle', 0.18, 0.25);
    setTimeout(() => this.playTone(80, 'square', 0.12, 0.2), 40);
  }

  // Sound: Critical Hit
  public playCrit() {
    this.playTone(300, 'square', 0.1, 0.2);
    setTimeout(() => this.playTone(600, 'sawtooth', 0.2, 0.25), 50);
    setTimeout(() => this.playTone(120, 'triangle', 0.3, 0.3), 100);
  }

  // Sound: Shield / Defend
  public playShield() {
    this.playTone(350, 'sine', 0.15, 0.2);
    setTimeout(() => this.playTone(700, 'sine', 0.3, 0.25), 60);
  }

  // Sound: Combo Streak Up!
  public playCombo(comboCount: number) {
    const baseFreq = 440 + Math.min(comboCount * 60, 600);
    this.playTone(baseFreq, 'square', 0.1, 0.15);
    setTimeout(() => this.playTone(baseFreq * 1.25, 'triangle', 0.18, 0.18), 70);
  }

  // Sound: Level Up Fanfare
  public playLevelUp() {
    const notes = [440, 554.37, 659.25, 880, 783.99, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.18, 0.2);
      }, idx * 110);
    });
  }

  // Sound: Evolution Fanfare
  public playEvolution() {
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'square', 0.2, 0.2);
      }, idx * 100);
    });
  }

  // Sound: Victory
  public playVictory() {
    const notes = [523.25, 523.25, 523.25, 523.25, 415.3, 466.16, 523.25, 466.16, 523.25];
    const delays = [0, 120, 240, 360, 480, 600, 720, 840, 960];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.2, 0.22);
      }, delays[idx]);
    });
  }

  // Background 8-bit battle music loop
  public toggleBgm(): boolean {
    if (this.bgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public isBgmPlaying(): boolean {
    return this.bgmPlaying;
  }

  public startBgm() {
    if (!this.soundEnabled || this.bgmPlaying) return;
    this.initCtx();
    this.bgmPlaying = true;

    // Classic 8-bit battle bassline progression in A minor
    const bassline = [
      220, 220, 261.63, 220, 293.66, 261.63, 246.94, 196,
      220, 220, 329.63, 293.66, 261.63, 246.94, 220, 196
    ];
    let step = 0;

    this.bgmInterval = window.setInterval(() => {
      if (!this.bgmPlaying || !this.soundEnabled) return;
      const freq = bassline[step % bassline.length];
      this.playTone(freq / 2, 'triangle', 0.12, 0.04);
      if (step % 4 === 0) {
        this.playTone(freq, 'square', 0.08, 0.03);
      }
      step++;
    }, 160);
  }

  public stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sound = new SoundController();

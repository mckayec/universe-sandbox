type SoundName = 'place' | 'impact' | 'accretion' | 'transform' | 'supernova' | 'pulsar' | 'ui';

export class ExhibitAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  muted = false;

  ensure() {
    if (this.context) {
      if (this.context.state === 'suspended') void this.context.resume();
      return;
    }
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;
    this.context = new AudioContextConstructor();
    this.master = this.context.createGain();
    this.master.gain.value = 0.16;
    this.master.connect(this.context.destination);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.context) this.master.gain.setTargetAtTime(muted ? 0 : 0.16, this.context.currentTime, 0.04);
  }

  play(name: SoundName, strength = 1) {
    if (this.muted) return;
    this.ensure();
    const context = this.context,
      master = this.master;
    if (!context || !master) return;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const settings: Record<SoundName, [OscillatorType, number, number, number]> = {
      place: ['sine', 180, 340, 0.13],
      impact: ['sawtooth', 90, 34, 0.34],
      accretion: ['triangle', 240, 110, 0.22],
      transform: ['sine', 210, 760, 0.6],
      supernova: ['sawtooth', 76, 24, 1.15],
      pulsar: ['square', 520, 420, 0.09],
      ui: ['sine', 330, 390, 0.07],
    };
    const [wave, start, end, duration] = settings[name];
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(start, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, end), now + duration);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(name === 'supernova' ? 900 : 1800, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, Math.min(0.28, 0.07 * strength)), now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  }
}

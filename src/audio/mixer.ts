// src/audio/mixer.ts
import * as Tone from "tone";

export const mixer = {
  // Effects chains
  chorus: new Tone.Chorus(4, 2.5, 0.5).start(),
  phaser: new Tone.Phaser({
    frequency: 15,
    octaves: 5,
    baseFrequency: 1000,
  }),

  // Individual channel strips
  polyGain: new Tone.Gain(1),
  monoGain: new Tone.Gain(1),
  drumGain: new Tone.Gain(1),

  // Master output
  masterGain: new Tone.Gain(1).toDestination(),

  // Init function to wire it all together
  init() {
    // Insert FX: Chorus → Phaser
    this.chorus.connect(this.phaser);

    // Chain PolySynth → Chorus → Phaser → Poly Gain
    this.phaser.connect(this.polyGain);

    // Connect each gain to master
    this.polyGain.connect(this.masterGain);
    this.monoGain.connect(this.masterGain);
    this.drumGain.connect(this.masterGain);
  },
};

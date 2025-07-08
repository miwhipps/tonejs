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

  // Individual channel strips with EQ and panning
  polyEQ: new Tone.EQ3(0, 0, 0),
  polyPanner: new Tone.Panner(0),
  polyGain: new Tone.Gain(1),
  
  monoEQ: new Tone.EQ3(0, 0, 0),
  monoPanner: new Tone.Panner(0),
  monoGain: new Tone.Gain(1),
  
  drumEQ: new Tone.EQ3(0, 0, 0),
  drumPanner: new Tone.Panner(0),
  drumGain: new Tone.Gain(1),

  // Master output
  masterGain: new Tone.Gain(1).toDestination(),

  // Init function to wire it all together
  init() {
    // Insert FX: Chorus → Phaser
    this.chorus.connect(this.phaser);

    // Chain PolySynth → Chorus → Phaser → Poly EQ → Poly Panner → Poly Gain
    this.phaser.connect(this.polyEQ);
    this.polyEQ.connect(this.polyPanner);
    this.polyPanner.connect(this.polyGain);

    // Chain MonoSynth → Mono EQ → Mono Panner → Mono Gain
    this.monoEQ.connect(this.monoPanner);
    this.monoPanner.connect(this.monoGain);

    // Chain Drums → Drum EQ → Drum Panner → Drum Gain
    this.drumEQ.connect(this.drumPanner);
    this.drumPanner.connect(this.drumGain);

    // Connect each gain to master
    this.polyGain.connect(this.masterGain);
    this.monoGain.connect(this.masterGain);
    this.drumGain.connect(this.masterGain);
  },
};

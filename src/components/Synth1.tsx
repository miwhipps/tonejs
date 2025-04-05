import * as Tone from "tone";
import { Piano, KeyboardShortcuts } from "react-piano";
import { useState, useEffect } from "react";
import "react-piano/build/styles.css";

const Synth1: React.FC = () => {
  const [synth] = useState(() => new Tone.Synth().toDestination());
  console.log(synth.get());

  const [config, setConfig] = useState<{
    frequency: string;
    detune: number;
    oscillatorType: Tone.ToneOscillatorType;
    oscillatorFreq: number;
    envelopeAttack: number;
    envelopeDecay: number;
    envelopeSustain: number;
    envelopeRelease: number;
    portamento: number;
    volume: number;
  }>({
    frequency: "C5",
    detune: 0,
    oscillatorType: "triangle",
    oscillatorFreq: 440,
    envelopeAttack: 0.005,
    envelopeDecay: 0.1,
    envelopeSustain: 0.9,
    envelopeRelease: 1,
    portamento: 0,
    volume: 0,
  });

  useEffect(() => {
    synth.oscillator.type = config.oscillatorType;
    synth.oscillator.frequency.value = config.oscillatorFreq;
    synth.volume.value = config.volume;
    synth.frequency.value = config.frequency;
    synth.detune.value = config.detune;
    synth.envelope.attack = config.envelopeAttack;
    synth.envelope.decay = config.envelopeDecay;
    synth.envelope.sustain = config.envelopeSustain;
    synth.envelope.release = config.envelopeRelease;
    synth.portamento = config.portamento;
  }, [config, synth]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const firstNote = 24; // MIDI number for C1
  const lastNote = 41; // MIDI number for F2

  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  const playNote = (midiNumber: number) => {
    const note = Tone.Frequency(midiNumber, "midi").toNote();
    synth.triggerAttack(note);
  };

  const stopNote = () => {
    synth.triggerRelease();
  };

  return (
    <div>
      <h1>Synth1</h1>
      <div>
        <h3>Oscillator</h3>
        <label>
          Type:
          <select
            name="oscillatorType"
            value={config.oscillatorType}
            onChange={handleChange}
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </label>
        <label>
          Frequency:
          <input
            type="range"
            max="1000"
            step="1"
            name="oscillatorFreq"
            value={config.oscillatorFreq}
            onChange={handleChange}
          />
        </label>
        <label>
          Detune:
          <input
            type="range"
            max="100"
            step="1"
            name="detune"
            value={config.detune}
            onChange={handleChange}
          />
        </label>
        <label>
          Frequency:
          <input
            type="text"
            name="frequency"
            value={config.frequency}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <h3>Envelope</h3>
        <label>
          Attack:
          <input
            type="range"
            max="1"
            step="0.02"
            name="envelopeAttack"
            value={config.envelopeAttack}
            onChange={handleChange}
          />
        </label>
        <label>
          Decay:
          <input
            type="range"
            max="1"
            step="0.02"
            name="envelopeDecay"
            value={config.envelopeDecay}
            onChange={handleChange}
          />
        </label>
        <label>
          Sustain:
          <input
            type="range"
            max="1"
            step="0.02"
            name="envelopeSustain"
            value={config.envelopeSustain}
            onChange={handleChange}
          />
        </label>
        <label>
          Release:
          <input
            type="range"
            max="1"
            step="0.02"
            name="envelopeRelease"
            value={config.envelopeRelease}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <h3>Control</h3>
        <label>
          Portamento:
          <input
            type="range"
            max="1"
            step="0.02"
            name="portamento"
            value={config.portamento}
            onChange={handleChange}
          />
        </label>
        <label>
          Volume:
          <input
            type="range"
            max="1"
            step="0.02"
            name="volume"
            value={config.volume}
            onChange={handleChange}
          />
        </label>
      </div>
      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        onPlayNote={playNote}
        onStopNote={stopNote}
        width={1000}
        keyboardShortcuts={keyboardShortcuts}
      />
    </div>
  );
};

export default Synth1;

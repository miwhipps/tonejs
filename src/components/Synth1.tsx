import * as Tone from "tone";
import { Piano, KeyboardShortcuts } from "react-piano";
import { useState, useEffect } from "react";
import "react-piano/build/styles.css";

const Synth1: React.FC = () => {
  const [synth] = useState(() => new Tone.Synth().toDestination());
  console.log(synth.get());

  const [config, setConfig] = useState({
    frequency: "C1",
    detune: 0,
    oscillatorType: "square",
    envelopeAttack: 0.005,
    envelopeDecay: 0.1,
    envelopeSustain: 0.9,
    envelopeRelease: 1,
  });

  useEffect(() => {
    synth.frequency.value = config.frequency;
    synth.detune.value = config.detune;
    synth.envelope.attack = config.envelopeAttack;
    synth.envelope.decay = config.envelopeDecay;
    synth.envelope.sustain = config.envelopeSustain;
    synth.envelope.release = config.envelopeRelease;
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

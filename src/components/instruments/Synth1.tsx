import * as Tone from "tone";
import { Piano, KeyboardShortcuts } from "react-piano";
import { useState, useEffect, forwardRef, useMemo } from "react";
import "react-piano/build/styles.css";

export type Synth1Handle = {
  getSynth: () => Tone.Synth;
  trigger: (note: string, time?: Tone.Unit.Time) => void;
};

const Synth1 = forwardRef<Synth1Handle>(() => {
  const notes = useMemo(
    () => ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    []
  );
  const [synth] = useState(() => new Tone.Synth());

  // Synth configuration
  const [config, setConfig] = useState({
    frequency: "C5",
    detune: 0,
    oscillatorType: "triangle" as Tone.ToneOscillatorType,
    oscillatorFreq: 440,
    envelopeAttack: 0.005,
    envelopeDecay: 0.1,
    envelopeSustain: 0.9,
    envelopeRelease: 1,
    portamento: 0,
    volume: 0,
  });

  // Initialize synth
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

  // Update synth parameters when config changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]:
        typeof prev[name as keyof typeof prev] === "number" ? +value : value,
    }));
  };

  const firstNote = 24;
  const lastNote = 41;
  const [keyboardIsOpen, setKeyboardIsOpen] = useState(false);
  const toggleKeyboard = () => {
    setKeyboardIsOpen((prev) => !prev);
  };

  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote,
    lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  const playNote = (midiNumber: number) => {
    const note = Tone.Frequency(midiNumber, "midi").toNote();
    synth.triggerAttack(note);
  };

  const stopNote = () => {
    synth.triggerRelease();
  };

  const steps = 16; // Number of steps in the sequencer

  const [patterns, setPatterns] = useState(
    notes.map(() => Array(steps).fill(false)) // Create one pattern for each note
  );
  const [currentStep, setCurrentStep] = useState(0);

  const toggleStep = (noteIndex: number, stepIndex: number) => {
    const newPatterns = [...patterns];
    newPatterns[noteIndex][stepIndex] = !newPatterns[noteIndex][stepIndex];
    setPatterns(newPatterns);
  };

  // Play the sequence
  useEffect(() => {
    const seq = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        notes.forEach((note, noteIndex) => {
          if (patterns[noteIndex][step]) {
            synth.triggerAttackRelease(note, "8n", time);
          }
        });
      },
      Array.from({ length: steps }, (_, i) => i),
      "16n"
    );

    seq.start(0);

    return () => {
      seq.dispose();
    };
  }, [notes, patterns, synth]);

  return (
    <>
      <div className="bg-[var(--color-surface)] text-[var(--color-text-base)] p-6 shadow-[var(--shadow-glow)] max-w-6xl mx-auto mt-8 border border-[var(--color-border)]">
        <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
          Synth One
        </h1>

        <section className="mb-6">
          <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2">
            Oscillator
          </h3>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col">
              <span>Type:</span>
              <select
                name="oscillatorType"
                value={config.oscillatorType}
                onChange={handleChange}
                className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2"
              >
                <option value="sine">Sine</option>
                <option value="square">Square</option>
                <option value="sawtooth">Sawtooth</option>
                <option value="triangle">Triangle</option>
              </select>
            </label>
            <label className="flex flex-col">
              <span>Frequency:</span>
              <input
                type="range"
                max="1000"
                step="1"
                name="oscillatorFreq"
                value={config.oscillatorFreq}
                onChange={handleChange}
                className="accent-[var(--color-primary)]"
              />
            </label>
            <label className="flex flex-col">
              <span>Detune:</span>
              <input
                type="range"
                max="100"
                step="1"
                name="detune"
                value={config.detune}
                onChange={handleChange}
                className="accent-[var(--color-primary)]"
              />
            </label>
            <label className="flex flex-col">
              <span>Note:</span>
              <input
                type="text"
                name="frequency"
                value={config.frequency}
                onChange={handleChange}
                className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2"
              />
            </label>
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2">
            Envelope
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {["Attack", "Decay", "Sustain", "Release"].map((param) => (
              <label key={param} className="flex flex-col">
                <span>{param}:</span>
                <input
                  type="range"
                  max="1"
                  step="0.02"
                  name={`envelope${param}`}
                  value={
                    config[`envelope${param}` as keyof typeof config] as number
                  }
                  onChange={handleChange}
                  className="accent-[var(--color-accent)]"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2">
            Control
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span>Portamento:</span>
              <input
                type="range"
                max="1"
                step="0.02"
                name="portamento"
                value={config.portamento}
                onChange={handleChange}
                className="accent-[var(--color-primary)]"
              />
            </label>
            <label className="flex flex-col">
              <span>Volume:</span>
              <input
                type="range"
                min="-60"
                max="0"
                step="1"
                name="volume"
                value={config.volume}
                onChange={handleChange}
                className="accent-[var(--color-primary)]"
              />
            </label>
          </div>
        </section>

        <div className="p-4">
          {notes.map((note, noteIndex) => (
            <div key={noteIndex} className="mb-4">
              <div className="font-bold">{note}</div>
              <div className="flex gap-1 mt-2 justify-center">
                {patterns[noteIndex].map((active, stepIndex) => (
                  <button
                    key={stepIndex}
                    onClick={() => toggleStep(noteIndex, stepIndex)}
                    className={`w-6 h-6 rounded ${
                      active
                        ? "bg-[var(--color-primary)]"
                        : "bg-[var(--color-surface)]"
                    } border border-[var(--color-border)]
                  ${
                    currentStep === stepIndex
                      ? "ring-2 ring-[var(--color-accent)]"
                      : ""
                  }`}
                  />
                ))}
              </div>
            </div>
          ))}
          {keyboardIsOpen && (
            <>
              <button
                onClick={toggleKeyboard}
                className="bg-[var(--color-primary)] text-white rounded-lg p-2 mb-4"
              >
                Hide Keys
              </button>
              <Piano
                noteRange={{ first: firstNote, last: lastNote }}
                onPlayNote={playNote}
                onStopNote={stopNote}
                width={1000}
                keyboardShortcuts={keyboardShortcuts}
              />
            </>
          )}
          {!keyboardIsOpen && (
            <button
              onClick={toggleKeyboard}
              className="bg-[var(--color-primary)] text-white rounded-lg p-2 mb-4"
            >
              Keys
            </button>
          )}
        </div>
      </div>
    </>
  );
});

export default Synth1;

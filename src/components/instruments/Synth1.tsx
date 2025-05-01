import * as Tone from "tone";
import { Piano, KeyboardShortcuts } from "react-piano";
import { useState, useEffect, forwardRef, useMemo } from "react";
import "react-piano/build/styles.css";

export type Synth1Handle = {
  getSynth: () => Tone.PolySynth;
  trigger: (note: string, time?: Tone.Unit.Time) => void;
};

type BasicOscillatorType = "sine" | "square" | "triangle" | "sawtooth";
type Octave = "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7" | "C8";

const Synth1 = forwardRef<Synth1Handle, object>((_, ref) => {
  const notes = useMemo(
    () => ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    []
  );
  const [synth] = useState(() => new Tone.PolySynth());

  useEffect(() => {
    if (ref) {
      if (typeof ref === "function") {
        ref({
          getSynth: () => synth,
          trigger: (note, time) => synth.triggerAttackRelease(note, "8n", time),
        });
      } else {
        ref.current = {
          getSynth: () => synth,
          trigger: (note, time) => synth.triggerAttackRelease(note, "8n", time),
        };
      }
    }
  }, [ref, synth]);

  // Synth configuration
  const [config, setConfig] = useState({
    frequency: "C5" as Octave,
    detune: 0,
    oscillatorType: "triangle" as BasicOscillatorType,
    oscillatorFreq: 440,
    envelopeAttack: 0.005,
    envelopeDecay: 0.1,
    envelopeSustain: 0.9,
    envelopeRelease: 1,
    portamento: 0,
    volume: 0,
  });

  // Initialize synth
  synth.set({
    oscillator: {
      type: config.oscillatorType,
    },
    volume: config.volume,
    detune: config.detune,
    envelope: {
      attack: config.envelopeAttack,
      decay: config.envelopeDecay,
      sustain: config.envelopeSustain,
      release: config.envelopeRelease,
    },
    portamento: config.portamento,
  });

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

  const stopNote = (midiNumber: number) => {
    const note = Tone.Frequency(midiNumber, "midi").toNote();
    synth.triggerRelease(note);
  };

  const steps = 32; // Number of steps in the sequencer

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
      <div className=" bg-[var(--color-surface)] text-[var(--color-text-base)] p-6 shadow-xl mx-6 my-6 border border-[var(--color-border)]">
        <h1 className="flex items-baseline gap-2 text-2xl font-bold text-[var(--color-primary)] mb-4">
          シンセ
          <span className="text-xl font-normal">one</span>
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
              <span>Detune:</span>
              <select
                name="oscillatorFreq"
                value={config.oscillatorFreq}
                onChange={handleChange}
                className="accent-[var(--color-primary)]"
              />
            </label>
            <label className="flex flex-col">
              <span>Octave:</span>
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

        <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2">
          Sequencer
        </h3>
        <div className="space-y-2 p-4">
          {notes.map((note, noteIndex) => (
            <div
              key={noteIndex}
              className="flex items-center justify-center gap-2"
            >
              <div className="w-8 text-right text-sm text-[var(--color-text-muted)]">
                {note}
              </div>
              <div className="flex gap-1">
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
        </div>

        <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2 flex items-center">
          Keyboard
          <button
            onClick={toggleKeyboard}
            className="p-0 hover:opacity-80 focus:outline-none bg-[#161b22] shadow-none"
            aria-label="Toggle keyboard"
          >
            <svg
              className={`w-6 h-6 ml-2 transition-transform ${
                keyboardIsOpen ? "rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="var(--color-accent)"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </h3>

        {keyboardIsOpen && (
          <div className="flex justify-center my-4">
            <Piano
              noteRange={{ first: firstNote, last: lastNote }}
              onPlayNote={playNote}
              onStopNote={stopNote}
              width={1000}
              keyboardShortcuts={keyboardShortcuts}
            />
          </div>
        )}
      </div>
    </>
  );
});

export default Synth1;

import * as Tone from "tone";
import { useState, useEffect, forwardRef, useMemo } from "react";
import { mixer } from "../../audio/mixer";

export type PolyHandle = {
  getSynth: () => Tone.PolySynth;
  trigger: (note: string, time?: Tone.Unit.Time) => void;
};

type BasicOscillatorType = "sine" | "square" | "triangle" | "sawtooth";
type FilterType =
  | "lowpass"
  | "highpass"
  | "bandpass"
  | "lowshelf"
  | "highshelf"
  | "notch"
  | "allpass"
  | "peaking";
type FilterRolloff = -12 | -24 | -48 | -96;
type Octave = "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7" | "C8";

const PolySynth = forwardRef<PolyHandle, object>((_, ref) => {
  const notes = useMemo(
    () => ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    []
  );
  const [synth] = useState(() => new Tone.PolySynth());
  const [filter] = useState(() => new Tone.Filter(800, "lowpass"));

  useEffect(() => {
    synth.connect(filter);
    filter.connect(mixer.polyGain);
    // filter.connect(mixer.chorus);
    // filter.connect(mixer.phaser);
  }, [synth, filter]);

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
    envelopeSustain: 0.1,
    envelopeRelease: 0.1,
    portamento: 0,
    volume: 0,
    filterFrequency: 800,
    filterType: "lowpass" as FilterType,
    filterQ: 0,
    filterRolloff: -12 as FilterRolloff,
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

  // Initialize filter
  filter.set({
    frequency: config.filterFrequency,
    type: config.filterType,
    Q: config.filterQ,
    rolloff: config.filterRolloff,
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

  // const [keyboardIsOpen, setKeyboardIsOpen] = useState(false);
  const [sequencerIsOpen, setSequencerIsOpen] = useState(true);

  // const toggleKeyboard = () => {
  //   setKeyboardIsOpen((prev) => !prev);
  // };

  const toggleSequencer = () => {
    setSequencerIsOpen((prev) => !prev);
  };

  const [stepCount, setStepCount] = useState(16); // Default 16 steps
  // const stepOptions = [4, 8, 16, 32, 64];
  // const stepOptions = Array.from({ length: 32 }, (_, i) => i + 1);
  // const steps = Array.from({ length: 64 }, (_, i) => i + 1);

  const [patterns, setPatterns] = useState(
    notes.map(() => Array(stepCount).fill(false)) // Create one pattern for each note
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
      Array.from({ length: stepCount }, (_, i) => i),
      "16n"
    );

    seq.start(0);

    return () => {
      seq.dispose();
    };
  }, [notes, patterns, synth, stepCount]);

  const clearSequence = () => {
    setPatterns(notes.map(() => Array(stepCount).fill(false)));
  };

  useEffect(() => {
    setPatterns((prev) =>
      prev.map((pattern) => {
        if (pattern.length < stepCount) {
          return [...pattern, ...Array(stepCount - pattern.length).fill(false)];
        } else if (pattern.length > stepCount) {
          return pattern.slice(0, stepCount);
        }
        return pattern;
      })
    );
  }, [stepCount]);

  return (
    <>
      <div className="bg-[var(--color-surface)] text-[var(--color-text-base)] p-4 sm:p-6 m-4 sm:mx-6 sm:my-6 shadow-xl border border-[var(--color-border)]">
        <h1 className="flex items-baseline gap-2 text-2xl font-bold text-[var(--color-primary)] mb-4">
          シンセ
          <span className="text-xl font-normal">one</span>
        </h1>
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-6 mb-4">
          <section className="w-full flex flex-col items-start">
            <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2">
              Oscillator
            </h3>
            <div className="flex flex-col gap-3 w-full">
              <label className="flex flex-col gap-2">
                <span>Waveform:</span>
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
              <label className="flex flex-col gap-2">
                <span>Detune:</span>
                <input
                  type="range"
                  max="1200"
                  min="0"
                  step="0.02"
                  name="oscillatorFreq"
                  value={config.oscillatorFreq}
                  onChange={handleChange}
                  className="accent-[var(--color-accent)]"
                />
                <span className="text-[var(--color-text-muted)] text-sm">
                  {config.oscillatorFreq.toFixed(1)} Hz
                </span>
              </label>
              <label className="flex flex-col gap-2">
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

          <section className="w-full flex flex-col items-start">
            <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2">
              Filter
            </h3>
            <div className="flex flex-col gap-3 w-full">
              <label className="flex flex-col gap-2">
                <span>Type:</span>
                <select
                  name="filterType"
                  value={config.filterType}
                  onChange={handleChange}
                  className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2"
                >
                  <option value="lowpass">Lowpass</option>
                  <option value="highpass">Highpass</option>
                  <option value="bandpass">Bandpass</option>
                  <option value="notch">Notch</option>
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span>Cutoff Frequency:</span>
                <input
                  type="range"
                  min="40"
                  max="20000"
                  step="10"
                  name="filterFrequency"
                  value={config.filterFrequency}
                  onChange={handleChange}
                  className="accent-[var(--color-accent)]"
                />
                <span className="text-[var(--color-text-muted)] text-sm">
                  {config.filterFrequency.toFixed(1)} Hz
                </span>
              </label>
            </div>
          </section>

          <section className="w-full flex flex-col items-start">
            <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2">
              Envelope
            </h3>
            <div className="grid grid-cols-2 gap-3 w-full">
              {["Attack", "Decay", "Sustain", "Release"].map((param) => (
                <label key={param} className="flex flex-col gap-2">
                  <span>{param}:</span>
                  <input
                    type="range"
                    max="1"
                    step="0.02"
                    name={`envelope${param}`}
                    value={
                      config[
                        `envelope${param}` as keyof typeof config
                      ] as number
                    }
                    onChange={handleChange}
                    className="accent-[var(--color-accent)]"
                  />
                  <span className="text-[var(--color-text-muted)] text-sm">
                    {(
                      config[
                        `envelope${param}` as keyof typeof config
                      ] as number
                    ).toFixed(2)}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="w-full flex flex-col items-start">
            <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2">
              Control
            </h3>
            <div className="grid grid-cols-2 gap-3 w-full">
              <label className="flex flex-col gap-2">
                <span>Portamento:</span>
                <input
                  type="range"
                  max="1"
                  step="0.02"
                  name="portamento"
                  value={config.portamento}
                  onChange={handleChange}
                  className="accent-[var(--color-accent)]"
                />
                <span className="text-[var(--color-text-muted)] text-sm">
                  {config.portamento.toFixed(1)}
                </span>
              </label>
              <label className="flex flex-col gap-2">
                <span>Volume:</span>
                <input
                  type="range"
                  min="-60"
                  max="0"
                  step="1"
                  name="volume"
                  value={config.volume}
                  onChange={handleChange}
                  className="accent-[var(--color-accent)]"
                />
                <span className="text-[var(--color-text-muted)] text-sm">
                  {config.volume.toFixed(1)} dB
                </span>
              </label>
            </div>
          </section>
        </div>

        <div className="">
          <div className="flex justify-between">
            <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2 flex items-center">
              Sequencer
              <button
                onClick={toggleSequencer}
                className="p-0 hover:opacity-80 focus:outline-none bg-[#161b22] shadow-none"
                aria-label="Toggle sequencer"
              >
                <svg
                  className={`w-6 h-6 ml-2 transition-transform ${
                    sequencerIsOpen ? "rotate-180" : ""
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

            {/* <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2 flex items-center">
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
            </h3> */}
          </div>

          {sequencerIsOpen && (
            <div className="space-y-4">
              {notes.map((note, noteIndex) => (
                <div
                  key={noteIndex}
                  className="flex flex-col sm:flex-row sm:items-center justify-center gap-2"
                >
                  <div className="w-8 text-sm text-[var(--color-text-muted)] sm:text-left sm:w-12 ">
                    {note}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 32 }, (_, stepIndex) => {
                      const isActive = stepIndex < stepCount;
                      const isOn = patterns[noteIndex]?.[stepIndex] ?? false;

                      return (
                        <button
                          key={stepIndex}
                          onClick={() =>
                            isActive && toggleStep(noteIndex, stepIndex)
                          }
                          disabled={!isActive}
                          className={`w-6 h-6 rounded border text-xs mx-auto
                  ${
                    stepIndex % 4 === 0
                      ? "ring-1 ring-[var(--color-accent)]"
                      : "border-[var(--color-border)]"
                  }
                  ${
                    isActive
                      ? isOn
                        ? "bg-[var(--color-primary)]"
                        : "bg-[var(--color-surface)]"
                      : "bg-gray-300 opacity-10 cursor-not-allowed"
                  }
                  ${
                    currentStep === stepIndex
                      ? "ring-2 ring-[var(--color-accent)]"
                      : ""
                  }
                `}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-6">
                <div className="w-full sm:w-1/2 max-w-xs">
                  <label
                    htmlFor="stepCount"
                    className="text-sm text-[var(--color-text-muted)]"
                  >
                    Steps: {stepCount}
                  </label>
                  <input
                    id="stepCount"
                    type="range"
                    min={1}
                    max={32}
                    value={stepCount}
                    onChange={(e) => setStepCount(Number(e.target.value))}
                    className="accent-[var(--color-primary)] w-full"
                  />
                  <div className="relative h-6 w-full mt-2">
                    {[4, 8, 16, 32].map((val) => {
                      const leftPercent = ((val - 1) / 31) * 100;
                      return (
                        <div
                          key={val}
                          className="absolute flex flex-col items-center"
                          style={{
                            left: `${leftPercent}%`,
                            transform: "translateX(-50%)",
                          }}
                        >
                          <div className="w-px h-2 bg-[var(--color-border)]" />
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end sm:justify-start">
                  <button
                    onClick={clearSequence}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* {keyboardIsOpen && (
            <div className="flex justify-center my-4">

            </div>
          )} */}
        </div>
      </div>
    </>
  );
});

export default PolySynth;

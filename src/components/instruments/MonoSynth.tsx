import { useState } from "react";
import * as Tone from "tone";
import SVGKnobMedium from "../SVGKnobMedium";

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
// type FilterRolloff = -12 | -24 | -48 | -96;
type Octave = "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7" | "C8";

const MonoSynth = () => {
  const [config, setConfig] = useState({
    frequency: "C4" as Octave,
    detune: 0,
    oscillatorType: "sawtooth" as BasicOscillatorType,
    oscillatorFreq: 440,
    envelopeAttack: 0.01,
    envelopeDecay: 0.2,
    envelopeSustain: 0.4,
    envelopeRelease: 0.3,
    portamento: 0.05,
    volume: -8,
    filterFrequency: 1200,
    filterType: "lowpass" as FilterType,
    filterQ: 1.2,
  });

  const synth = new Tone.MonoSynth().toDestination();

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
    filter: {
      type: config.filterType,
      frequency: config.filterFrequency,
      Q: config.filterQ,
    },
    portamento: config.portamento,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setConfig((prev) => ({
      ...prev,
      [name]: type === "number" || !isNaN(Number(value)) ? +value : value,
    }));
  };

  const handleKnobChange = (name: keyof typeof config, value: number) => {
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className=" bg-[var(--color-surface)] text-[var(--color-text-base)] p-6 shadow-xl mx-6 my-6 border border-[var(--color-border)]">
      <h1 className="flex items-baseline gap-2 text-2xl font-bold text-[var(--color-primary)] mb-4">
        モノシンセ
      </h1>
      <div className="flex justify-between mb-4">
        <section className="mb-6 w-full flex flex-col justify-between items-start">
          <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2">
            Oscillator
          </h3>
          <div className="flex flex-col gap-3 w-full pr-6">
            <label className="flex flex-col gap-2">
              <span>Oscillator Type:</span>
              <select
                name="oscillatorType"
                value={config.oscillatorType}
                onChange={handleChange}
                className="bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] rounded px-2 py-1"
              >
                {["sine", "triangle", "square", "sawtooth"].map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span>Frequency:</span>
              <select
                name="frequency"
                value={config.frequency}
                onChange={handleChange}
                className="bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] rounded px-2 py-1"
              >
                {["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8"].map(
                  (octave) => (
                    <option key={octave} value={octave}>
                      {octave}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span>Detune:</span>
              <input
                type="number"
                name="detune"
                value={config.detune}
                onChange={handleChange}
                className="bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] rounded px-2 py-1"
              />
            </label>
          </div>
        </section>
        <section className="mb-6 w-full flex flex-col justify-between items-start">
          <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2">
            Envelope
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {["Attack", "Decay", "Sustain", "Release"].map((param) => {
              const paramKey = `envelope${param}` as keyof typeof config;
              const value = config[paramKey] as number;

              return (
                <div key={param} className="flex flex-col items-center">
                  <SVGKnobMedium
                    min={0}
                    max={1}
                    step={0.01}
                    value={value}
                    onChange={(val) => handleKnobChange(paramKey, val)}
                  />
                  <span className="text-sm text-[var(--color-text-muted)] mt-2">
                    {param}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
export default MonoSynth;

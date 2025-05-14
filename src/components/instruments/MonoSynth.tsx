import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import * as Tone from "tone";
import SVGKnobMedium from "../SVGKnobMedium";
import SVGKnobLarge from "../SVGKnobLarge";

export interface MonoHandle {
  getSynth: () => Tone.MonoSynth;
}

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

const notes = [
  "C2",
  "D2",
  "E2",
  "F2",
  "G2",
  "A2",
  "B2",
  "C3",
  "D3",
  "E3",
  "F3",
  "G3",
];
const steps = 16;

const rolloffValues: FilterRolloff[] = [-12, -24, -48, -96];

const MonoSynth = forwardRef<MonoHandle>(
  (_: unknown, ref: Ref<unknown> | undefined) => {
    useImperativeHandle(ref, () => ({
      getSynth: () => synthRef.current!,
    }));

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
      filterRolloff: -12 as FilterRolloff,
      filterType: "lowpass" as FilterType,
      filterQ: 1.2,
      filterEnvelopeAttack: 0.01,
      filterEnvelopeDecay: 0.2,
      filterEnvelopeSustain: 0.5,
      filterEnvelopeRelease: 0.3,
    });
    const [currentStep, setCurrentStep] = useState<number>(0);

    const synthRef = useRef<Tone.MonoSynth | null>(null);

    useEffect(() => {
      if (!synthRef.current) {
        synthRef.current = new Tone.MonoSynth().toDestination();
      }

      synthRef.current.set({
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
          Q: config.filterQ,
          type: config.filterType,
          rolloff: config.filterRolloff,
        },
        portamento: config.portamento,
      });
    }, [config]);

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
      console.log(name, value);
      setConfig((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const [sequence, setSequence] = useState<boolean[][]>(() =>
      notes.map(() => Array(steps).fill(false))
    );

    // Toggle a pad on/off
    const toggleStep = (row: number, col: number) => {
      setSequence((prev) =>
        prev.map((r, i) =>
          i === row ? r.map((val, j) => (j === col ? !val : val)) : r
        )
      );
    };

    // Play the sequence
    useEffect(() => {
      if (!synthRef.current) return;

      const seq = new Tone.Sequence(
        (time, step) => {
          setCurrentStep(step);
          notes.forEach((note, rowIndex) => {
            if (sequence[rowIndex][step] && synthRef.current) {
              synthRef.current.triggerAttackRelease(note, "8n", time);
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
    }, [sequence]);

    return (
      <div className=" bg-[var(--color-surface)] text-[var(--color-text-base)] p-6 shadow-xl mx-6 my-6 border border-[var(--color-border)]">
        <h1 className="flex items-baseline gap-2 text-2xl font-bold text-[var(--color-primary)] mb-4">
          モノシンセ
        </h1>
        <div className="flex justify-between mb-4">
          <section className="mb-6 w-full flex flex-col items-start">
            <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2">
              Oscillator
            </h3>
            <div className="flex flex-col gap-3 w-full pr-6">
              <label className="flex flex-col gap-2">
                <span className="text-[var(--color-text)]">Waveform:</span>
                <select
                  name="oscillatorType"
                  value={config.oscillatorType}
                  onChange={handleChange}
                  className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2"
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
                  className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2 "
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
                  className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2"
                />
              </label>
            </div>
          </section>

          <section className="mb-6 w-full flex flex-col items-start">
            <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2">
              Filter
            </h3>
            <div className="flex flex-col gap-3 w-full pr-6 justify-start">
              <label className="flex flex-col gap-2">
                <span>Type:</span>
                <select
                  name="filterType"
                  value={config.filterType}
                  onChange={handleChange}
                  className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2"
                >
                  {[
                    "lowpass",
                    "highpass",
                    "bandpass",
                    "lowshelf",
                    "highshelf",
                    "notch",
                    "allpass",
                    "peaking",
                  ].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-col gap-3 w-full ">
                <div className="flex flex-col gap-2">
                  <span className="text-[var(--color-text)]">Rolloff:</span>
                  <div className="flex gap-2 justify-between">
                    {rolloffValues.map((val) => (
                      <button
                        key={val}
                        className={`px-3 py-1 rounded border text-sm transition shadow-none w-full
                        ${
                          config.filterRolloff === val
                            ? "bg-blue-600 text-[var(--color-text)] border-blue-600"
                            : "bg-transparent text-[var(--color-text)] border-gray-500 hover:bg-gray-700"
                        }`}
                        onClick={() => handleKnobChange("filterRolloff", val)}
                      >
                        {val} dB
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <label className="flex flex-col gap-2">
                    <span>Res:</span>
                    <div className="flex mt-2 justify-center">
                      <SVGKnobLarge
                        min={0.1}
                        max={20}
                        step={0.1}
                        value={config.filterQ}
                        onChange={(val) => handleKnobChange("filterQ", val)}
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </section>
          <div className="mb-6 w-full flex flex-col justify-between items-start">
            <section className="mb-6 w-full flex flex-col justify-between items-start">
              <h3 className="text-lg text-[var(--color-accent)] font-semibold mb-2">
                Filter Envelope
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {["Attack", "Decay", "Sustain", "Release"].map((param) => {
                  const key = `filterEnvelope${param}` as keyof typeof config;
                  const value = config[key] as number;

                  return (
                    <div key={param} className="flex flex-col items-center">
                      <SVGKnobMedium
                        min={0}
                        max={1}
                        step={0.01}
                        value={value}
                        onChange={(val) => handleKnobChange(key, val)}
                      />
                      <span className="text-sm text-[var(--color-text-muted)] mt-2">
                        {param}
                      </span>
                    </div>
                  );
                })}
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
          <div className=" space-y-2 p-4">
            {sequence.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex items-center justify-center gap-2"
              >
                <div className="w-8 text-right text-sm text-[var(--color-text-muted)]">
                  {notes[rowIndex]}
                </div>
                <div className="flex gap-1">
                  {row.map((active, colIndex) => (
                    <button
                      key={colIndex}
                      onClick={() => toggleStep(rowIndex, colIndex)}
                      className={`w-6 h-6 rounded items-center ${
                        active
                          ? "bg-[var(--color-primary)]"
                          : "bg-[var(--color-surface)]"
                      } border border-[var(--color-border)]
            ${
              currentStep === colIndex
                ? "ring-2 ring-[var(--color-accent)]"
                : ""
            }     ${
                        colIndex % 4 === 0
                          ? "ring-1 ring-[var(--color-accent)]"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
export default MonoSynth;

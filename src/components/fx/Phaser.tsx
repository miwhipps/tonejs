import * as Tone from "tone";
import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  ChangeEvent,
} from "react";

export type PhaserHandle = {
  getPhaser: () => Tone.Phaser;
};

const Phaser = forwardRef<PhaserHandle>((_, ref) => {
  const [phaser] = useState(
    () =>
      new Tone.Phaser({
        frequency: 0.5,
        octaves: 3,
        baseFrequency: 350,
        wet: 0.5,
      })
  );

  const [config, setConfig] = useState({
    frequency: 0.5,
    octaves: 3,
    baseFrequency: 350,
    wet: 0.5,
  });

  // Update phaser parameters when config changes
  useEffect(() => {
    phaser.frequency.value = config.frequency;
    phaser.octaves = config.octaves;
    phaser.baseFrequency = config.baseFrequency;
    phaser.wet.value = config.wet;
  }, [config, phaser]);

  useImperativeHandle(
    ref,
    () => ({
      getPhaser: () => phaser,
    }),
    [phaser]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: +value,
    }));
  };

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-text-base)] p-6 shadow-[var(--shadow-glow)] w-full mx-auto mt-8 border border-[var(--color-border)]">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
        Phaser Effect
      </h2>

      <section className="mb-6">
        <label className="flex flex-col mb-3">
          <span className="text-[var(--color-accent)]">Frequency:</span>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            name="frequency"
            value={config.frequency}
            onChange={handleChange}
            className="accent-[var(--color-primary)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-2"
          />
          <span className="text-[var(--color-text-muted)]">
            {config.frequency.toFixed(1)} Hz
          </span>
        </label>

        <label className="flex flex-col mb-3">
          <span className="text-[var(--color-accent)]">Octaves:</span>
          <input
            type="range"
            min="0"
            max="6"
            step="1"
            name="octaves"
            value={config.octaves}
            onChange={handleChange}
            className="accent-[var(--color-primary)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-2"
          />
          <span className="text-[var(--color-text-muted)]">
            {config.octaves}
          </span>
        </label>

        <label className="flex flex-col mb-3">
          <span className="text-[var(--color-accent)]">Base Frequency:</span>
          <input
            type="range"
            min="100"
            max="1000"
            step="10"
            name="baseFrequency"
            value={config.baseFrequency}
            onChange={handleChange}
            className="accent-[var(--color-primary)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-2"
          />
          <span className="text-[var(--color-text-muted)]">
            {config.baseFrequency.toFixed(0)} Hz
          </span>
        </label>

        <label className="flex flex-col">
          <span className="text-[var(--color-accent)]">Wet:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            name="wet"
            value={config.wet}
            onChange={handleChange}
            className="accent-[var(--color-primary)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-2"
          />
          <span className="text-[var(--color-text-muted)]">
            {config.wet.toFixed(2)}
          </span>
        </label>
      </section>
    </div>
  );
});

export default Phaser;

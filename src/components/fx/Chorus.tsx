import * as Tone from "tone";
import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  ChangeEvent,
} from "react";

export type ChorusHandle = {
  getChorus: () => Tone.Chorus;
};

const Chorus = forwardRef<ChorusHandle>((_, ref) => {
  const [chorus] = useState(() => new Tone.Chorus(4, 2.5, 0.5).start());

  const [config, setConfig] = useState({
    frequency: 4,
    delayTime: 2.5,
    depth: 0.5,
    wet: 0.5,
  });

  // Update chorus when config changes
  useEffect(() => {
    chorus.frequency.value = config.frequency;
    chorus.delayTime = config.delayTime;
    chorus.depth = config.depth;
    chorus.wet.value = config.wet;
  }, [config, chorus]);

  useImperativeHandle(
    ref,
    () => ({
      getChorus: () => chorus,
    }),
    [chorus]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: +value,
    }));
  };

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-text-base)] p-6 shadow-[var(--shadow-glow)] max-w-6xl mx-auto mt-8 border border-[var(--color-border)]">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
        Chorus Effect
      </h2>

      <section className="mb-6">
        <label className="flex flex-col mb-3">
          <span className="text-[var(--color-accent)]">Frequency:</span>
          <input
            type="range"
            min="0.1"
            max="10"
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
          <span className="text-[var(--color-accent)]">Delay Time:</span>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            name="delayTime"
            value={config.delayTime}
            onChange={handleChange}
            className="accent-[var(--color-primary)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-2"
          />
          <span className="text-[var(--color-text-muted)]">
            {config.delayTime.toFixed(1)} ms
          </span>
        </label>

        <label className="flex flex-col mb-3">
          <span className="text-[var(--color-accent)]">Depth:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            name="depth"
            value={config.depth}
            onChange={handleChange}
            className="accent-[var(--color-primary)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-2"
          />
          <span className="text-[var(--color-text-muted)]">
            {config.depth.toFixed(2)}
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

export default Chorus;

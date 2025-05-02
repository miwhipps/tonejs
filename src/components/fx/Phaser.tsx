import * as Tone from "tone";
import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  //   ChangeEvent,
} from "react";
import SVGKnobMedium from "../SVGKnobMedium";

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

  //   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     setConfig((prev) => ({
  //       ...prev,
  //       [name]: +value,
  //     }));
  //   };

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-text-base)] p-6 shadow-xl border border-[var(--color-border)] min-w-50">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
        Phaser
      </h2>

      <section className="mb-6 flex flex-col gap-4">
        <label className="flex flex-col items-center">
          <span className="text-[var(--color-accent)] mb-2">Frequency:</span>
          <SVGKnobMedium
            min={0.1}
            max={5}
            step={0.1}
            value={config.frequency}
            onChange={(value) =>
              setConfig((prev) => ({ ...prev, frequency: value }))
            }
          />
          <span className="text-[var(--color-text-muted)]">
            {config.frequency.toFixed(1)} Hz
          </span>
        </label>

        <label className="flex flex-col items-center">
          <span className="text-[var(--color-accent)] mb-2">Octaves:</span>
          <SVGKnobMedium
            min={0}
            max={6}
            step={1}
            value={config.octaves}
            onChange={(value) =>
              setConfig((prev) => ({ ...prev, octaves: value }))
            }
          />
          <span className="text-[var(--color-text-muted)]">
            {config.octaves}
          </span>
        </label>

        <label className="flex flex-col items-center">
          <span className="text-[var(--color-accent)] mb-2">
            Base Frequency:
          </span>
          <SVGKnobMedium
            min={100}
            max={1000}
            step={10}
            value={config.baseFrequency}
            onChange={(value) =>
              setConfig((prev) => ({ ...prev, baseFrequency: value }))
            }
          />
          <span className="text-[var(--color-text-muted)]">
            {config.baseFrequency.toFixed(0)} Hz
          </span>
        </label>

        <label className="flex flex-col items-center">
          <span className="text-[var(--color-accent)] mb-2">Wet:</span>
          <SVGKnobMedium
            min={0}
            max={1}
            step={0.01}
            value={config.wet}
            onChange={(value) => setConfig((prev) => ({ ...prev, wet: value }))}
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

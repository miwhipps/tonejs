import * as Tone from "tone";
import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  //   ChangeEvent,
} from "react";
import SVGKnobMedium from "../SVGKnobMedium";

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

  //   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     setConfig((prev) => ({
  //       ...prev,
  //       [name]: +value,
  //     }));
  //   };

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-text-base)] p-6 shadow-xl border border-[var(--color-border)]">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
        Chorus
      </h2>

      <section className="mb-6 flex flex-col gap-4">
        <label className="flex flex-col items-center">
          <span className="text-[var(--color-accent)] mb-2">Frequency:</span>
          <SVGKnobMedium
            value={config.frequency}
            min={0.2}
            max={20}
            step={0.1}
            onChange={(value) =>
              setConfig((prev) => ({ ...prev, frequency: value }))
            }
          />
          <span className="text-[var(--color-text-muted)]">
            {config.frequency.toFixed(1)} Hz
          </span>
        </label>

        <label className="flex flex-col items-center">
          <span className="text-[var(--color-accent)] mb-2">Delay Time:</span>
          <SVGKnobMedium
            value={config.delayTime}
            min={0}
            max={20}
            step={0.1}
            onChange={(value) =>
              setConfig((prev) => ({ ...prev, delayTime: value }))
            }
          />
          <span className="text-[var(--color-text-muted)]">
            {config.delayTime.toFixed(1)} ms
          </span>
        </label>

        <label className="flex flex-col items-center">
          <span className="text-[var(--color-accent)] mb-2">Depth:</span>
          <SVGKnobMedium
            value={config.depth}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) =>
              setConfig((prev) => ({ ...prev, depth: value }))
            }
          />
          <span className="text-[var(--color-text-muted)]">
            {config.depth.toFixed(2)}
          </span>
        </label>

        <label className="flex flex-col items-center">
          <span className="text-[var(--color-accent)] mb-2">Wet:</span>
          <SVGKnobMedium
            value={config.wet}
            min={0}
            max={1}
            step={0.01}
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

export default Chorus;

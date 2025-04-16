import * as Tone from "tone";
import { useEffect, useState } from "react";
import { SamplerHandle } from "../instruments/Sampler";

type Props = {
  samplerRef: React.RefObject<SamplerHandle | null>;
};

const drumNotes = ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"];
const steps = 16;

const DrumSequencer: React.FC<Props> = ({ samplerRef }) => {
  const [sequence, setSequence] = useState<boolean[][]>(() =>
    drumNotes.map(() => Array(steps).fill(false))
  );
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Toggle a pad on/off
  const toggleStep = (row: number, col: number) => {
    setSequence((prev) =>
      prev.map((r, i) =>
        i === row ? r.map((val, j) => (j === col ? !val : val)) : r
      )
    );
  };

  // Create the sequence synced with Tone.Transport
  useEffect(() => {
    const toneSequence = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        drumNotes.forEach((note, rowIndex) => {
          if (sequence[rowIndex][step]) {
            const sampler = samplerRef.current?.getSampler();
            sampler?.triggerAttackRelease(note, "8n", time);
          }
        });
      },
      Array.from({ length: steps }, (_, i) => i),
      "16n"
    );

    toneSequence.start(0); // sync with global transport

    return () => {
      toneSequence.dispose(); // cleanup when component unmounts
    };
  }, [sequence, samplerRef]);

  return (
    <div className="space-y-2">
      {sequence.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-2">
          <div className="w-8 text-right text-sm text-[var(--color-text-muted)]">
            {drumNotes[rowIndex]}
          </div>
          <div className="flex gap-1">
            {row.map((active, colIndex) => (
              <button
                key={colIndex}
                onClick={() => toggleStep(rowIndex, colIndex)}
                className={`w-6 h-6 rounded ${
                  active
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-surface)]"
                } border border-[var(--color-border)]
            ${
              currentStep === colIndex
                ? "ring-2 ring-[var(--color-accent)]"
                : ""
            }`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DrumSequencer;

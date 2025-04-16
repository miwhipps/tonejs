import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";

const steps = 16;
const rows = 4;

const Sequencer = () => {
  const [sequence, setSequence] = useState(
    Array(rows)
      .fill(null)
      .map(() => Array(steps).fill(false))
  );
  const [currentStep, setCurrentStep] = useState(0);
  const synths = useRef<Array<Tone.Synth>>([]);

  useEffect(() => {
    synths.current = Array(rows)
      .fill(null)
      .map(() => new Tone.Synth().toDestination());

    const loop = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        sequence.forEach((row, rowIndex) => {
          if (row[step]) {
            synths.current[rowIndex].triggerAttackRelease("C4", "8n", time);
          }
        });
      },
      Array.from({ length: steps }, (_, i) => i),
      "16n"
    );

    loop.start(0);
    Tone.Transport.start();

    return () => {
      loop.dispose();
      Tone.Transport.stop();
    };
  }, [sequence]);

  const toggleStep = (rowIndex: number, stepIndex: number) => {
    setSequence((prev) => {
      const newSeq = prev.map((row) => [...row]);
      newSeq[rowIndex][stepIndex] = !newSeq[rowIndex][stepIndex];
      return newSeq;
    });
  };

  return (
    <div className="p-4">
      {sequence.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 mb-2">
          {row.map((active, stepIndex) => (
            <button
              key={stepIndex}
              onClick={() => toggleStep(rowIndex, stepIndex)}
              className={`w-6 h-6 rounded ${
                active
                  ? "bg-[var(--color-primary)]"
                  : "bg-[var(--color-surface)]"
              } border border-[var(--color-border)]
              ${
                stepIndex === currentStep
                  ? "ring-2 ring-[var(--color-accent)]"
                  : ""
              }
              `}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sequencer;

import * as Tone from "tone";
import { useEffect, useState } from "react";
import { SamplerHandle } from "../instruments/Sampler";

type Props = {
  samplerRef: React.RefObject<SamplerHandle | null>;
};

const drumNotes = ["C3", "D#3", "F#3", "A3"];
const steps = 16;

const DrumSequencer: React.FC<Props> = ({ samplerRef }) => {
  const [sequence, setSequence] = useState<boolean[][]>(() =>
    drumNotes.map(() => Array(steps).fill(false))
  );

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
        <div key={rowIndex} className="flex gap-1">
          {row.map((active, colIndex) => (
            <button
              key={colIndex}
              onClick={() => toggleStep(rowIndex, colIndex)}
              className={`w-6 h-6 rounded ${
                active ? "bg-green-500" : "bg-gray-700"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default DrumSequencer;

import * as Tone from "tone";
import { useEffect, useState } from "react";
import { Synth1Handle } from "../instruments/Synth1";

// List of notes for each row
const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];

type Synth1SequencerProps = {
  synthRef: React.RefObject<Synth1Handle | null>;
};

const Synth1Sequencer = ({ synthRef }: Synth1SequencerProps) => {
  const steps = 16; // Number of steps in the sequencer
  const [patterns, setPatterns] = useState(
    notes.map(() => Array(steps).fill(false)) // Create one pattern for each note
  );
  const [currentStep, setCurrentStep] = useState(0);

  const toggleStep = (noteIndex: number, stepIndex: number) => {
    const newPatterns = [...patterns];
    newPatterns[noteIndex][stepIndex] = !newPatterns[noteIndex][stepIndex];
    setPatterns(newPatterns);
  };

  useEffect(() => {
    const seq = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        notes.forEach((note, noteIndex) => {
          if (patterns[noteIndex][step]) {
            synthRef.current?.getSynth().triggerAttackRelease(note, "8n", time);
          }
        });
      },
      Array.from({ length: steps }, (_, i) => i),
      "16n"
    );

    seq.start(0); // Schedule to start at the beginning of the transport

    return () => {
      seq.dispose();
    };
  }, [patterns, synthRef]);

  return (
    <div className="p-4">
      {notes.map((note, noteIndex) => (
        <div key={noteIndex} className="mb-4">
          <div className="font-bold">{note}</div>
          <div className="flex gap-1 mt-2">
            {patterns[noteIndex].map((active, stepIndex) => (
              <button
                key={stepIndex}
                onClick={() => toggleStep(noteIndex, stepIndex)}
                className={`w-6 h-6 rounded ${
                  active
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-surface)]"
                } border border-[var(--color-border)]
                  ${
                    currentStep === stepIndex
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

export default Synth1Sequencer;

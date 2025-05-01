import { useEffect, useState } from "react";

import * as Tone from "tone";

const drumNotes = ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"];
const steps = 16;

const DrumMachine = () => {
  const [sampler, setSampler] = useState<Tone.Sampler | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Initialize the sampler with drum samples
  useEffect(() => {
    const newSampler = new Tone.Sampler(
      {
        C3: "/samples/BD_LMClip_MPC2K.wav",
        D3: "/samples/BD_909ish_MPC2K.wav",
        E3: "/samples/BD_Bounce_MPC2K.wav",
        F3: "/samples/SD_Verb_MPC2K.wav",
        G3: "/samples/CP_909_Hi_MPC2K.wav",
        A3: "/samples/Huh_MPC2K.wav",
        B3: "/samples/CH_909Tail_MPC2K.wav",
        C4: "/samples/OH_Anlg_Hi_MPC2K.wav",
      },
      {
        onload: () => {
          console.log("Sampler loaded successfully");
          setIsLoaded(true);
        },
      }
    ).toDestination();

    setSampler(newSampler);

    return () => {
      newSampler.dispose();
    };
  }, []);

  // Play a sample when a button is clicked
  const playSample = (note: string) => {
    if (isLoaded && sampler) {
      sampler.triggerAttackRelease(note, "8n");
    } else {
      console.warn("Sampler not loaded yet.");
    }
  };
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

  // Play the sequence
  useEffect(() => {
    if (!sampler || !isLoaded) return;

    const seq = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        drumNotes.forEach((note, rowIndex) => {
          if (sequence[rowIndex][step]) {
            sampler.triggerAttackRelease(note, "8n", time);
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
  }, [sampler, isLoaded, sequence]);

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-text-base)] p-6 shadow-xl mx-6 border border-[var(--color-border)]">
      <h1 className="text-xl font-bold mb-4">ドラムマシン</h1>
      <div className="flex flex-col-2 items-center justify-center">
        {!isLoaded && <p>Loading samples...</p>}
        <div className=" space-y-2 p-4">
          <div className="grid grid-cols-4 gap-4 max-w-150 mx-auto">
            <button
              onClick={() => playSample("C3")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              BD LMClip
            </button>
            <button
              onClick={() => playSample("D3")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              BD 909ish
            </button>
            <button
              onClick={() => playSample("E3")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              BD Bounce
            </button>
            <button
              onClick={() => playSample("F3")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              SD Verb
            </button>
            <button
              onClick={() => playSample("G3")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              CP 909 Hi
            </button>
            <button
              onClick={() => playSample("A3")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              Huh
            </button>
            <button
              onClick={() => playSample("B3")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              CH 909Tail
            </button>
            <button
              onClick={() => playSample("C3")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              OH Anlg Hi
            </button>
          </div>
        </div>
        <div className=" space-y-2 p-4">
          {sequence.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex items-center justify-center gap-2"
            >
              <div className="w-8 text-right text-sm text-[var(--color-text-muted)]">
                {drumNotes[rowIndex]}
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
};

export default DrumMachine;

import { useEffect, useState } from "react";

import * as Tone from "tone";

const drumNotes = [
  "C3",
  "D3",
  "E3",
  "F3",
  "G3",
  "A3",
  "B3",
  "C4",
  "D4",
  "E4",
  "F4",
  "G4",
];
const steps = 16;

const DrumMachine = () => {
  const [sampler, setSampler] = useState<Tone.Sampler | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [patterns, setPatterns] = useState<boolean[][][]>([
    drumNotes.map(() => Array(steps).fill(false)),
  ]);
  const [activePatternIndex, setActivePatternIndex] = useState(0);
  const sequence =
    patterns[activePatternIndex] ||
    drumNotes.map(() => Array(steps).fill(false));

  // Initialize the sampler with drum samples
  useEffect(() => {
    const newSampler = new Tone.Sampler(
      {
        C3: "/samples/909-Lo-Kit/BD-909-Sat-A-04.wav",
        D3: "/samples/909-Lo-Kit/BD-909-Tap-Sat-02-BB01.wav",
        E3: "/samples/909-Lo-Kit/BD-909-Various-01.wav",
        F3: "/samples/909-Lo-Kit/BD-909-Various-06.wav",
        G3: "/samples/909-Lo-Kit/BD-909-Various-49.wav",
        A3: "/samples/909-Lo-Kit/CH-909-Clean-02.wav",
        B3: "/samples/909-Lo-Kit/OH-909-Clean-01.wav",
        C4: "/samples/909-Lo-Kit/Ride-909-Clean-A-01.wav",
        D4: "/samples/909-Lo-Kit/Ride-909-MPC.wav",
        E4: "/samples/909-Lo-Kit/SD-909-Various-26.wav",
        F4: "/samples/909-Lo-Kit/SD-909-Various-27.wav",
        G4: "/samples/909-Lo-Kit/SD-909-Various-30.wav",
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

  // Toggle a pad on/off
  const toggleStep = (row: number, col: number) => {
    setPatterns((prev) => {
      const updated = [...prev];
      const newSeq = updated[activePatternIndex].map((r, i) =>
        i === row ? r.map((val, j) => (j === col ? !val : val)) : r
      );
      updated[activePatternIndex] = newSeq;
      return updated;
    });
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
              <span className="text-2xl">C3</span>
              <br />
              BD-909-Sat-A
            </button>
            <button
              onClick={() => playSample("D3")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              <span className="text-2xl">D3</span>
              <br />
              BD-909-Sat-B
            </button>
            <button
              onClick={() => playSample("E3")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              <span className="text-2xl">E3</span>
              <br />
              D-909-Various-01
            </button>
            <button
              onClick={() => playSample("F3")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              <span className="text-2xl">F3</span>
              <br />
              BD-909-Various-06
            </button>
            <button
              onClick={() => playSample("G3")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              <span className="text-2xl">G3</span>
              <br />
              BD-909-Various-49
            </button>
            <button
              onClick={() => playSample("A3")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              <span className="text-2xl">A3</span>
              <br />
              CH-909-Clean-02
            </button>
            <button
              onClick={() => playSample("B3")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              <span className="text-2xl">B3</span>
              <br />
              OH-909-Clean-01
            </button>
            <button
              onClick={() => playSample("C4")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              <span className="text-2xl">C4</span>
              <br />
              Ride-909-Clean-A-01
            </button>
            <button
              onClick={() => playSample("D4")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              <span className="text-2xl">D4</span>
              <br />
              Ride-909-MPC
            </button>
            <button
              onClick={() => playSample("E4")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              <span className="text-2xl">E4</span>
              <br />
              SD-909-Various-26
            </button>
            <button
              onClick={() => playSample("F4")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              <span className="text-2xl">F4</span>
              <br />
              SD-909-Various-27
            </button>
            <button
              onClick={() => playSample("G4")}
              className="p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-35 w-35"
            >
              <span className="text-2xl">G4</span>
              <br />
              SD-909-Various-30
            </button>
          </div>
        </div>
        <div className="flex gap-2 flex-col mb-4">
          <select
            value={activePatternIndex}
            onChange={(e) => setActivePatternIndex(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {patterns.map((_, idx) => (
              <option key={idx} value={idx}>
                Pattern {idx + 1}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              setPatterns((prev) => [
                ...prev,
                drumNotes.map(() => Array(steps).fill(false)),
              ])
            }
            className="px-2 py-1 bg-blue-600 text-[var(--color-text)] border-blue-600 shadow-none rounded hover:bg-blue-700 transition-colors"
          >
            + New Pattern
          </button>
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
                    className={`w-6 h-6 rounded items-center border border-[var(--color-border)]
                   ${
                     active
                       ? "bg-[var(--color-primary)]"
                       : "bg-[var(--color-surface)]"
                   }
                   ${
                     colIndex % 4 === 0
                       ? "ring-1 ring-[var(--color-accent)]"
                       : ""
                   }
                   ${
                     currentStep === colIndex
                       ? "ring-2 ring-[var(--color-accent)]"
                       : ""
                   }
                 `}
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

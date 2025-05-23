import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import * as Tone from "tone";
import { mixer } from "../../audio/mixer";

export interface DrumMachineHandle {
  getOutput: () => Tone.Gain;
}

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

const DrumMachine = forwardRef<DrumMachineHandle>((_, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [patterns, setPatterns] = useState<boolean[][][]>([
    drumNotes.map(() => Array(steps).fill(false)),
  ]);
  const [activePatternIndex, setActivePatternIndex] = useState(0);
  const output = useRef<Tone.Gain>(new Tone.Gain().connect(mixer.drumGain));
  const samplerRef = useRef<Tone.Sampler | null>(null);

  const sequence =
    patterns[activePatternIndex] ||
    drumNotes.map(() => Array(steps).fill(false));

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    const sampler = new Tone.Sampler(
      {
        C3: `${base}samples/909-Lo-Kit/BD-909-Sat-A-04.wav`,
        D3: `${base}samples/909-Lo-Kit/BD-909-Tap-Sat-02-BB01.wav`,
        E3: `${base}samples/909-Lo-Kit/BD-909-Various-01.wav`,
        F3: `${base}samples/909-Lo-Kit/BD-909-Various-06.wav`,
        G3: `${base}samples/909-Lo-Kit/BD-909-Various-49.wav`,
        A3: `${base}samples/909-Lo-Kit/CH-909-Clean-02.wav`,
        B3: `${base}samples/909-Lo-Kit/OH-909-Clean-01.wav`,
        C4: `${base}samples/909-Lo-Kit/Ride-909-Clean-A-01.wav`,
        D4: `${base}samples/909-Lo-Kit/Ride-909-MPC.wav`,
        E4: `${base}samples/909-Lo-Kit/SD-909-Various-26.wav`,
        F4: `${base}samples/909-Lo-Kit/SD-909-Various-27.wav`,
        G4: `${base}samples/909-Lo-Kit/SD-909-Various-30.wav`,
      },
      {
        onload: () => {
          setIsLoaded(true);
        },
      }
    ).connect(output.current);

    samplerRef.current = sampler;

    return () => {
      sampler.dispose();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getOutput: () => output.current,
  }));

  useEffect(() => {
    if (!samplerRef.current || !isLoaded) return;

    const seq = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        drumNotes.forEach((note, rowIndex) => {
          if (sequence[rowIndex][step]) {
            samplerRef.current!.triggerAttackRelease(note, "8n", time);
          }
        });
      },
      Array.from({ length: steps }, (_, i) => i),
      "16n"
    ).start(0);

    return () => {
      seq.dispose();
    };
  }, [isLoaded, sequence]);

  const playSample = (note: string) => {
    if (isLoaded && samplerRef.current) {
      samplerRef.current.triggerAttackRelease(note, "8n");
    }
  };

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
    if (!samplerRef.current || !isLoaded) return;

    const seq = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        drumNotes.forEach((note, rowIndex) => {
          if (sequence[rowIndex][step]) {
            samplerRef.current!.triggerAttackRelease(note, "8n", time);
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
  }, [samplerRef, isLoaded, sequence]);

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-text-base)] p-4 sm:p-6 shadow-xl mx-3 sm:mx-6 border border-[var(--color-border)]">
      <h1 className="text-lg sm:text-xl font-bold mb-4">ドラムマシン</h1>

      <div className="flex flex-col items-center justify-center gap-4">
        {!isLoaded && <p>Loading samples...</p>}

        <div className="space-y-2 p-2 sm:p-4 flex-grow w-full max-w-full sm:max-w-[550px]">
          {/* Responsive grid: 2 cols on xs, 3 on sm, 4 on md+ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-full mx-auto">
            {/* Buttons */}
            {[
              ["C3", "BD-909-Sat-A"],
              ["D3", "BD-909-Sat-B"],
              ["E3", "D-909-Various-01"],
              ["F3", "BD-909-Various-06"],
              ["G3", "BD-909-Various-49"],
              ["A3", "CH-909-Clean-02"],
              ["B3", "OH-909-Clean-01"],
              ["C4", "Ride-909-Clean-A-01"],
              ["D4", "Ride-909-MPC"],
              ["E4", "SD-909-Various-26"],
              ["F4", "SD-909-Various-27"],
              ["G4", "SD-909-Various-30"],
            ].map(([note, label]) => (
              <button
                key={note}
                onClick={() => playSample(note)}
                className="p-3 sm:p-4 bg-[#656565] text-gray-200 rounded-sm hover:bg-gray-700 h-20 sm:h-30 w-full sm:w-30 text-sm sm:text-base"
              >
                <span className="text-xl sm:text-2xl">{note}</span>
                <br />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-4 w-full max-w-[200px]">
          {patterns.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActivePatternIndex(idx)}
              className={`border px-2 py-1 rounded min-w-20 sm:min-w-40 text-sm sm:text-base ${
                activePatternIndex === idx
                  ? "bg-blue-600 text-[var(--color-text)] border-blue-600 hover:bg-blue-700"
                  : "border-none"
              }`}
            >
              Pattern {idx + 1}
            </button>
          ))}

          <div className="flex flex-col gap-2 mt-2">
            {patterns.length < 8 && (
              <button
                onClick={() =>
                  setPatterns((prev) => [
                    ...prev,
                    drumNotes.map(() => Array(steps).fill(false)),
                  ])
                }
                className="px-2 py-1 bg-blue-600 text-[var(--color-text)] border-blue-600 rounded hover:bg-blue-700 text-sm sm:text-base w-full"
              >
                + Add
              </button>
            )}
            {patterns.length > 1 && (
              <button
                onClick={() => {
                  setPatterns((prev) => {
                    const updated = [...prev];
                    updated.splice(activePatternIndex, 1);
                    return updated;
                  });
                  setActivePatternIndex((prevIndex) =>
                    prevIndex > 0 ? prevIndex - 1 : 0
                  );
                }}
                className="px-2 py-1 bg-[#656565] text-[var(--color-text)] border-red-600 rounded hover:bg-gray-700 text-sm sm:text-base w-full"
              >
                - Del
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 p-2 sm:p-4 w-full max-w-full overflow-x-auto">
        {sequence.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center justify-center gap-1 sm:gap-2"
          >
            <div className="w-6 sm:w-8 text-right text-xs sm:text-sm text-[var(--color-text-muted)]">
              {drumNotes[rowIndex]}
            </div>
            <div className="flex gap-1 overflow-x-auto">
              {row.map((active, colIndex) => (
                <button
                  key={colIndex}
                  onClick={() => toggleStep(rowIndex, colIndex)}
                  className={`w-5 sm:w-6 h-5 sm:h-6 rounded border border-[var(--color-border)]
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
  );
});

export default DrumMachine;

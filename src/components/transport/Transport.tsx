import * as Tone from "tone";
import { useState, useEffect, useCallback } from "react";
import SVGKnobLarge from "../SVGKnobLarge";

const Transport = () => {
  const transport = Tone.getTransport();
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(Tone.Transport.bpm.value);
  const [swing, setSwing] = useState(0); // 0 = no shuffle, 1 = extreme shuffle

  const handleTransportToggle = useCallback(() => {
    if (isPlaying) {
      transport.stop();
    } else {
      transport.start();
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying, transport]);

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = parseInt(e.target.value, 10);
    if (!isNaN(newBpm)) {
      setBpm(newBpm);
      transport.bpm.value = newBpm;
    }
  };

  // Handle spacebar press to toggle transport
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        handleTransportToggle();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleTransportToggle, isPlaying]); // Include isPlaying to get updated state

  useEffect(() => {
    transport.swingSubdivision = "16n";
  }, []);

  return (
    <div className="fixed bottom-3 right-3 text-gray-700 p-2 w-full max-w-[calc(100vw-1.5rem)] sm:max-w-fit overflow-x-auto">
      <div className="flex flex-row items-center justify-center gap-3 bg-[#161b22] p-3 shadow-lg border border-[var(--color-border)]">
        {/* Swing knob */}
        <div className="flex justify-center items-center">
          <SVGKnobLarge
            value={swing}
            onChange={(value) => {
              setSwing(value);
              transport.swing = value;
            }}
          />
        </div>

        {/* BPM input */}
        <div>
          <input
            type="number"
            min="30"
            max="300"
            value={bpm}
            onChange={handleBpmChange}
            className="w-24 sm:w-32 h-16 sm:h-24 text-center text-3xl sm:text-5xl font-light rounded border border-[var(--color-border)] bg-[var(--color-background)] p-1"
          />
        </div>

        {/* Play and Stop buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleTransportToggle}
            className="text-[var(--color-base)] hover:text-[var(--color-text-base)] p-2 sm:p-0"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 sm:w-10 h-8 sm:h-10"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <button
            onClick={handleTransportToggle}
            className="text-[var(--color-base)] hover:text-[var(--color-text-base)] p-2 sm:p-0"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 sm:w-10 h-8 sm:h-10"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transport;

import * as Tone from "tone";
import { useState, useEffect, useCallback } from "react";

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
    <div className="fixed bottom-3 right-3 text-gray-700 text-center p-3 space-y-2">
      <div className="flex justify-center gap-2 bg-[#161b22] p-2 shadow-lg border border-[var(--color-border)]">
        <div className="space-y-2 flex justify-center items-center">
          {/* <label className="block text-sm">Shuffle!</label> */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={swing}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setSwing(value);
              transport.swing = value;
            }}
            className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)] bg-accent-[var(--color-primary)]"
          />
        </div>

        <div>
          <input
            type="number"
            min="30"
            max="300"
            value={bpm}
            onChange={handleBpmChange}
            className="w-32 h-24 text-center text-5xl font-light rounded border border-[var(--color-border)] bg-[var(--color-background)] p-1"
          />
        </div>
        <button
          onClick={handleTransportToggle}
          className="text-[var(--color-base)] hover:text-[var(--color-text-base)]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <button
          onClick={handleTransportToggle}
          className="text-[var(--color-base)] hover:text-[var(--color-text-base)]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Transport;

import * as Tone from "tone";
import { useState } from "react";

const Transport = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(Tone.Transport.bpm.value);

  const handleTransportToggle = () => {
    if (isPlaying) {
      Tone.Transport.stop();
    } else {
      Tone.Transport.start();
    }
    setIsPlaying(!isPlaying);
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = parseInt(e.target.value, 10);
    if (!isNaN(newBpm)) {
      setBpm(newBpm);
      Tone.Transport.bpm.value = newBpm;
    }
  };

  return (
    <div className="fixed bottom-3 right-3 text-gray-700 text-center p-3 space-y-2">
      <div className="flex justify-center gap-2">
        <div>
          {/* <label className="block text-sm mb-1">Tempo (BPM):</label> */}
          <input
            type="number"
            min="30"
            max="300"
            value={bpm}
            onChange={handleBpmChange}
            className="w-32 h-24 text-center text-5xl rounded border border-[var(--color-border)] bg-[var(--color-background)] p-1"
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

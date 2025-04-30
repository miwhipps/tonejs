import * as Tone from "tone";
import { useState } from "react";

const Transport = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTransportToggle = () => {
    const transport = Tone.getTransport();

    if (isPlaying) {
      transport.stop();
    } else {
      transport.start();
    }

    setIsPlaying(!isPlaying);
  };
  return (
    <div className="fixed bottom-4 left-4 text-gray-700 text-center p-4">
      <button
        onClick={handleTransportToggle}
        className="  text-[var(--color-base)] hover:text-[var(--color-text-base)] border-gray-900 border-1"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
      <button
        onClick={handleTransportToggle}
        className="  text-[var(--color-base)] hover:text-[var(--color-text-base)] border-gray-900 border-1"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12"
        >
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      </button>
    </div>
  );
};
export default Transport;

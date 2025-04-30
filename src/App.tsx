import "./App.css";
import * as Tone from "tone";
import { useState, useRef, useEffect } from "react";
import Synth1, { Synth1Handle } from "./components/instruments/Synth1.tsx";
import Chorus, { ChorusHandle } from "./components/fx/Chorus.tsx";
import Phaser, { PhaserHandle } from "./components/fx/Phaser.tsx";
import DrumMachine from "./components/instruments/DrumMachine.tsx";
import Transport from "./components/transport/Transport.tsx";
import dugaLogo from "/public/images/duga-logo-SCREENSHOT.png";

function App() {
  const synthRef = useRef<Synth1Handle | null>(null);
  const chorusRef = useRef<ChorusHandle | null>(null);
  const phaserRef = useRef<PhaserHandle | null>(null);

  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    if (audioStarted) {
      const synth = synthRef.current?.getSynth();
      const chorus = chorusRef.current?.getChorus();
      const phaser = phaserRef.current?.getPhaser();

      if (synth && chorus && phaser) {
        synth.connect(chorus);
        chorus.connect(phaser);
        phaser.toDestination();
      } else {
        console.warn("Synth, Chorus, or Phaser is null");
      }
    }
  }, [audioStarted]);

  // Handle audio context start
  const handleStartAudio = async () => {
    try {
      await Tone.start();
      console.log("AudioContext state:", Tone.getContext().state); // Should be "running"
      setAudioStarted(true);
    } catch (error) {
      console.error("Error starting audio:", error);
    }
  };

  return (
    <>
      {!audioStarted ? (
        <button
          onClick={handleStartAudio}
          className="flex justify-center items-center mx-auto my-8 p-4 bg-[var(--color-primary)] text-white rounded-xl shadow-lg hover:bg-[var(--color-accent)] transition-colors"
        >
          🔊 Start Audio
        </button>
      ) : (
        <>
          <div className="fixed top-4 right-4 text-gray-700 text-center p-4">
            <img
              src={dugaLogo}
              alt="Duga Logo"
              className="mx-auto my-8 w-32 h-32 rounded-full shadow-[var(--shadow-glow)] scale-3d"
              style={{
                filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
              }}
            />
          </div>
          <DrumMachine />
          <Synth1 ref={synthRef} />
          <div className="flex flex-col-2 items-center">
            <Chorus ref={chorusRef} />
            <Phaser ref={phaserRef} />
          </div>
          <Transport />
        </>
      )}
    </>
  );
}

export default App;

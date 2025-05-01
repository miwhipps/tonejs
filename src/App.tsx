import "./App.css";
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
  const handleStartAudio = () => {
    setAudioStarted(true);
  };

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleStartAudio();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <>
      {!audioStarted ? (
        <div className="flex items-center bg-[url(/public/images/duga-bg.png)] bg-cover bg-center h-screen w-screen">
          <img
            src={dugaLogo}
            alt="Duga Logo"
            className="mx-auto w-42 h-42 rounded-full  scale-3d"
            style={{
              filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
            }}
          />
          <p className="text-6xl text-white border-8 mt-3">Transmit</p>
          <button
            onClick={handleStartAudio}
            onKeyDown={handleKeyPress}
            className="mx-auto p-4 bg-[#656565] text-white text-6xl rounded-xl shadow-lg hover:bg-[var(--color-accent)] transition-colors"
          >
            ↵
          </button>
        </div>
      ) : (
        <>
          <div className="bg-[url(/public/images/duga-bg.png)] bg-cover bg-center h-full w-screen py-8">
            <div className="fixed top-4 right-4 text-gray-700 text-center">
              <img
                src={dugaLogo}
                alt="Duga Logo"
                className="mx-auto w-24 h-24 rounded-full  scale-3d"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
                }}
              />
              <p className="text-m text-gray-500 mt-3">Transmit</p>
            </div>
            <DrumMachine />
            <Synth1 ref={synthRef} />
            <div className="flex flex-col-2 items-center">
              <Chorus ref={chorusRef} />
              <Phaser ref={phaserRef} />
            </div>
            <Transport />
          </div>
        </>
      )}
    </>
  );
}

export default App;

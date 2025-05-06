import "./App.css";
import { useState, useRef, useEffect } from "react";
import PolySynth, { PolyHandle } from "./components/instruments/PolySynth";
import Chorus, { ChorusHandle } from "./components/fx/Chorus.tsx";
import Phaser, { PhaserHandle } from "./components/fx/Phaser.tsx";
import DrumMachine from "./components/instruments/DrumMachine.tsx";
import Transport from "./components/transport/Transport.tsx";
import dugaLogo from "/src/images/duga-logo-SCREENSHOT.png";
import * as Tone from "tone";
import MonoSynth from "./components/instruments/MonoSynth.tsx";

function App() {
  const synthRef = useRef<PolyHandle | null>(null);
  const chorusRef = useRef<ChorusHandle | null>(null);
  const phaserRef = useRef<PhaserHandle | null>(null);

  const [audioStarted, setAudioStarted] = useState(false);
  const [audioState, setAudioState] = useState("suspended");

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
    await Tone.start(); // <- Required to enable audio playback
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

  useEffect(() => {
    const context = Tone.getContext();

    const updateState = () => {
      setAudioState(context.state);
    };

    context.on("statechange", updateState);
    updateState(); // set initial

    return () => {
      context.off("statechange", updateState);
    };
  }, []);

  return (
    <>
      {!audioStarted ? (
        <div className="bg-[url(/src/images/duga-bg.png)] bg-cover bg-center flex flex-col items-center justify-center h-screen w-screen">
          <div className="flex flex-col-3 items-center justify-center h-screen w-screen">
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={dugaLogo}
                alt="Duga Logo"
                className="w-42 h-42 rounded-full scale-3d"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
                }}
              />
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-6xl text-white border-8 px-4">Transmit</p>
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <button
                onClick={handleStartAudio}
                onKeyDown={handleKeyPress}
                className="p-4 w-24 bg-[#656565] text-white text-6xl rounded-xl shadow-lg hover:bg-[var(--color-accent)] transition-colors"
              >
                ↵
              </button>
            </div>
          </div>

          <p className="text-white text-xs mb-8">
            Built upon the Tone.js framework.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-[url(/src/images/duga-bg.png)] bg-cover bg-center h-full w-screen py-2">
            <div className="fixed top-4 right-4 text-gray-700 text-center">
              <img
                src={dugaLogo}
                alt="Duga Logo"
                className="mx-auto w-18 h-18 rounded-full  scale-3d"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
                }}
              />
              <p className="text-m text-gray-500 mt-2">Transmit</p>
              <div className="flex items-center justify-center gap-2 text-white text-sm mt-2">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    audioState === "running"
                      ? "bg-green-400 shadow-[0_0_8px_2px_rgba(34,197,94,0.8)] animate-pulse"
                      : "bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.8)]"
                  }`}
                ></span>
              </div>
            </div>
            <DrumMachine />
            <MonoSynth />
            <PolySynth ref={synthRef} />
            <div className="flex flex-col-2 gap-4 mx-6">
              <Chorus ref={chorusRef} />
              <Phaser ref={phaserRef} />
            </div>
            <div className="h-[150px]"></div>
            <Transport />
          </div>
        </>
      )}
    </>
  );
}

export default App;

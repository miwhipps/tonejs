import "./App.css";
import * as Tone from "tone";
import { useState, useRef, useEffect } from "react";
import Synth1, { Synth1Handle } from "./components/instruments/Synth1.tsx";
import Chorus, { ChorusHandle } from "./components/fx/Chorus.tsx";
import Phaser, { PhaserHandle } from "./components/fx/Phaser.tsx";
import Synth1Sequencer from "./components/sequencers/Synth1Sequencer.tsx";
import DrumMachine from "./components/instruments/DrumMachine.tsx";

function App() {
  const synthRef = useRef<Synth1Handle | null>(null);
  const chorusRef = useRef<ChorusHandle | null>(null);
  const phaserRef = useRef<PhaserHandle | null>(null);

  const [audioStarted, setAudioStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTransportToggle = () => {
    if (isPlaying) {
      Tone.Transport.stop();
    } else {
      Tone.Transport.start();
    }
    setIsPlaying(!isPlaying);
  };

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

  // Debugging: Ensure Tone.Transport state when audio is started
  useEffect(() => {
    if (audioStarted) {
      console.log("Tone.Transport state:", Tone.Transport.state);
    }
  }, [audioStarted]);

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
          <button
            onClick={handleTransportToggle}
            className="p-4 bg-purple-500 text-white rounded-xl shadow-md my-4"
          >
            {isPlaying ? "⏹ Stop" : "▶️ Start"}
          </button>

          <DrumMachine />
          <Synth1 ref={synthRef} />
          <Synth1Sequencer synthRef={synthRef} />
          <Chorus ref={chorusRef} />
          <Phaser ref={phaserRef} />
        </>
      )}
    </>
  );
}

export default App;

import "./App.css";
import * as Tone from "tone";
import { useState, useRef, useEffect } from "react";
import Synth1, { Synth1Handle } from "./components/instruments/Synth1.tsx";
import Chorus, { ChorusHandle } from "./components/fx/Chorus.tsx";
import Phaser, { PhaserHandle } from "./components/fx/Phaser.tsx";
import Sequencer from "./components/sequencers/Sequencer.tsx";

function App() {
  const synthRef = useRef<Synth1Handle>(null);
  const chorusRef = useRef<ChorusHandle>(null);
  const phaserRef = useRef<PhaserHandle>(null);

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
  // This is necessary for Tone.js to work in some browsers
  // due to autoplay policies
  const handleStartAudio = async () => {
    await Tone.start();
    console.log("AudioContext state:", Tone.getContext().state); // Should be "running"

    setAudioStarted(true);
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
          <Synth1 ref={synthRef} />
          <Sequencer />
          <Chorus ref={chorusRef} />
          <Phaser ref={phaserRef} />
        </>
      )}
    </>
  );
}

export default App;

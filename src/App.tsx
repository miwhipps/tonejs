import "./App.css";
import * as Tone from "tone";
import { useState, useRef, useEffect } from "react";
import Synth1, { Synth1Handle } from "./components/instruments/Synth1.tsx";
import Chorus, { ChorusHandle } from "./components/fx/Chorus.tsx";

function App() {
  const synthRef = useRef<Synth1Handle>(null);
  const chorusRef = useRef<ChorusHandle>(null);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    if (audioStarted) {
      const synth = synthRef.current?.getSynth();
      const chorus = chorusRef.current?.getChorus();

      if (synth && chorus) {
        console.log("Connecting synth to chorus...");
        synth.connect(chorus);
        chorus.toDestination();
        console.log("Synth and chorus connected!");
      } else {
        console.warn("Synth or Chorus is null");
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
      <h1>TONEJS</h1>
      {!audioStarted ? (
        <button onClick={handleStartAudio}>🔊 Start Audio</button>
      ) : (
        <>
          <Synth1 ref={synthRef} />
          <Chorus ref={chorusRef} />
        </>
      )}
    </>
  );
}

export default App;

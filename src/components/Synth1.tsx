import * as Tone from "tone";
import { Piano, KeyboardShortcuts } from "react-piano";
import { useState } from "react";

const Synth1: React.FC = () => {
  const [synth] = useState(() => new Tone.Synth().toDestination());

  const firstNote = 24; // MIDI number for C1
  const lastNote = 41; // MIDI number for F2

  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  const playNote = (midiNumber: number) => {
    const note = Tone.Frequency(midiNumber, "midi").toNote();
    synth.triggerAttack(note);
  };

  const stopNote = () => {
    synth.triggerRelease();
  };

  return (
    <div>
      <h1>Synth1</h1>
      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        onPlayNote={playNote}
        onStopNote={stopNote}
        width={1000}
        keyboardShortcuts={keyboardShortcuts}
      />
    </div>
  );
};

export default Synth1;

import { Piano, KeyboardShortcuts } from "react-piano";

// CSS styles are required in order to render piano correctly.
// Importing CSS requires a CSS loader. You can also copy the CSS file directly from src/styles.css.
import "react-piano/build/styles.css";

const Keyboard: React.FC = () => {
  // Implement audio playback

  //   function playNote(midiNumber) { ... }
  //   function stopNote(midiNumber) { ... }

  const firstNote = 48;
  const lastNote = 77;

  return (
    <Piano
      noteRange={{ first: firstNote, last: lastNote }}
      //   onPlayNote={playNote}
      //   onStopNote={stopNote}
      width={1000}
      keyboardShortcuts={KeyboardShortcuts.create({
        firstNote: firstNote,
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
      })}
    />
  );
};

export default Keyboard;

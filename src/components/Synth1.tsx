import * as Tone from "tone";

const Synth1: React.FC = () => {
  //create a synth and connect it to the main output (your speakers)
  const synth = new Tone.Synth().toDestination();

  //play a middle 'C' for the duration of an 8th note
  synth.triggerAttackRelease("C4", "8n");

  return (
    <div>
      <h1>Synth1</h1>
    </div>
  );
};

export default Synth1;

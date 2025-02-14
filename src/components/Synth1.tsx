import * as Tone from "tone";

const Synth1: React.FC = () => {
  const synth = new Tone.Synth().toDestination();
  const now = Tone.now();
  synth.triggerAttackRelease("C4", "8n", now);
  synth.triggerAttackRelease("E4", "8n", now + 0.5);
  synth.triggerAttackRelease("G4", "8n", now + 1);
  return (
    <div>
      <h1>Synth1</h1>
    </div>
  );
};

export default Synth1;

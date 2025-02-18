import * as Tone from "tone";

const Sampler: React.FC = () => {
  const sampler = new Tone.Sampler(
    {
      C3: "/Users/michaelwhipps/Documents/tonejs/tonejs/MPC2000 Snacks/BD 808LngHiMPC2K.wav",
      "D#3":
        "/Users/michaelwhipps/Documents/tonejs/tonejs/MPC2000 Snacks/BD 909ish MPC2K.wav",
      "F#3":
        "/Users/michaelwhipps/Documents/tonejs/tonejs/MPC2000 Snacks/BD Bounce MPC2K.wav",
      A3: "/Users/michaelwhipps/Documents/tonejs/tonejs/MPC2000 Snacks/BD LMClip MPC2K.wav",
    },
    function () {
      //sampler will repitch the closest sample
      sampler.triggerAttack("C3");
    }
  );
  return (
    <div>
      <h1>Sampler</h1>
    </div>
  );
};

export default Sampler;

import * as Tone from "tone";

const Sampler: React.FC = () => {
  const sampler = new Tone.Sampler(
    {
      C3: "path/to/C3.mp3",
      "D#3": "path/to/Dsharp3.mp3",
      "F#3": "path/to/Fsharp3.mp3",
      A3: "path/to/A3.mp3",
    },
    function () {
      //sampler will repitch the closest sample
      sampler.triggerAttack("D3");
    }
  );
  return (
    <div>
      <h1>Sampler</h1>
    </div>
  );
};

export default Sampler;

import { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import * as Tone from "tone";

export type SamplerHandle = {
  getSampler: () => Tone.Sampler;
};

const Sampler = forwardRef<SamplerHandle>((_, ref) => {
  const [sampler, setSampler] = useState<Tone.Sampler | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const newSampler = new Tone.Sampler(
      {
        C3: "/samples/BD_808LngHiMPC2K.wav",
        "D#3": "/samples/BD_909ish_MPC2K.wav",
        "F#3": "/samples/BD_Bounce_MPC2K.wav",
        A3: "/samples/BD_LMClip_MPC2K.wav",
      },
      {
        onload: () => {
          console.log("Sampler loaded successfully");
          setIsLoaded(true);
        },
      }
    ).toDestination();

    setSampler(newSampler);

    return () => {
      newSampler.dispose();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getSampler: () => sampler!,
  }));

  const playSample = (note: string) => {
    if (isLoaded && sampler) {
      sampler.triggerAttackRelease(note, "8n");
    } else {
      console.warn("Sampler not loaded yet.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Drum Machine</h1>
      {!isLoaded && <p>Loading samples...</p>}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => playSample("C3")}
          className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          BD 808
        </button>
        <button
          onClick={() => playSample("D#3")}
          className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-700"
        >
          BD 909
        </button>
        <button
          onClick={() => playSample("F#3")}
          className="p-4 bg-red-500 text-white rounded-lg hover:bg-red-700"
        >
          BD Bounce
        </button>
        <button
          onClick={() => playSample("A3")}
          className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700"
        >
          BD LMClip
        </button>
      </div>
    </div>
  );
});

export default Sampler;

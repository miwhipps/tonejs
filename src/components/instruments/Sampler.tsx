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
        C3: "/samples/BD_LMClip_MPC2K.wav",
        D3: "/samples/BD_909ish_MPC2K.wav",
        E3: "/samples/BD_Bounce_MPC2K.wav",
        F3: "/samples/SD_Verb_MPC2K.wav",
        G3: "/samples/CP_909_Hi_MPC2K.wav",
        A3: "/samples/Huh_MPC2K.wav",
        B3: "/samples/CH_909Tail_MPC2K.wav",
        C4: "/samples/OH_Anlg_Hi_MPC2K.wav",
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
          className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-700"
        >
          BD LMClip
        </button>
        <button
          onClick={() => playSample("D3")}
          className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-700"
        >
          BD 909ish
        </button>
        <button
          onClick={() => playSample("E3")}
          className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-700"
        >
          BD Bounce
        </button>
        <button
          onClick={() => playSample("F3")}
          className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-700"
        >
          SD Verb
        </button>
        <button
          onClick={() => playSample("G3")}
          className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-700"
        >
          CP 909 Hi
        </button>
        <button
          onClick={() => playSample("A3")}
          className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-700"
        >
          Huh
        </button>
        <button
          onClick={() => playSample("B3")}
          className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-700"
        >
          CH 909Tail
        </button>
        <button
          onClick={() => playSample("C3")}
          className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-700"
        >
          OH Anlg Hi
        </button>
      </div>
    </div>
  );
});

export default Sampler;

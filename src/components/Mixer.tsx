// src/components/mixer/Mixer.tsx
import { useState, useEffect } from "react";
import { mixer } from "../audio/mixer";
import * as Tone from "tone";

export default function Mixer() {
  const [polyVol, setPolyVol] = useState(0); // in dB
  const [monoVol, setMonoVol] = useState(0);
  const [drumVol, setDrumVol] = useState(0);
  const [masterVol, setMasterVol] = useState(0);

  useEffect(() => {
    mixer.polyGain.gain.setValueAtTime(Tone.dbToGain(polyVol), Tone.now());
  }, [polyVol]);

  useEffect(() => {
    mixer.monoGain.gain.setValueAtTime(Tone.dbToGain(monoVol), Tone.now());
  }, [monoVol]);

  useEffect(() => {
    mixer.drumGain.gain.setValueAtTime(Tone.dbToGain(drumVol), Tone.now());
  }, [drumVol]);

  useEffect(() => {
    mixer.masterGain.gain.setValueAtTime(Tone.dbToGain(masterVol), Tone.now());
  }, [masterVol]);

  const Slider = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (val: number) => void;
  }) => (
    <div className="flex flex-col items-center w-20">
      <label className="text-xs text-white mb-2">
        {label} ({value} dB)
      </label>
      <div className="relative h-32 w-6 flex items-center justify-center">
        <input
          type="range"
          min={-60}
          max={0}
          step={1}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-32 h-6 rotate-[-90deg] origin-center bg-gray-700 accent-[var(--color-accent)]"
        />
      </div>
    </div>
  );

  return (
    <div className="flex gap-6 bg-black/50 p-4 rounded-xl shadow-lg fixed bottom-4 left-1/2 transform -translate-x-1/2 backdrop-blur">
      <Slider label="Poly" value={polyVol} onChange={setPolyVol} />
      <Slider label="Mono" value={monoVol} onChange={setMonoVol} />
      <Slider label="Drums" value={drumVol} onChange={setDrumVol} />
      <Slider label="Master" value={masterVol} onChange={setMasterVol} />
    </div>
  );
}

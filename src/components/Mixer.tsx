// src/components/mixer/Mixer.tsx
import { useState, useEffect } from "react";
import { mixer } from "../audio/mixer";
import * as Tone from "tone";

// Add custom slider styles
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    border: 2px solid #333;
  }
  
  .slider::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    border: 2px solid #333;
  }
  
  .slider::-webkit-slider-track {
    height: 4px;
    background: #4b5563;
    border-radius: 2px;
  }
  
  .slider::-moz-range-track {
    height: 4px;
    background: #4b5563;
    border-radius: 2px;
  }
`;

export default function Mixer() {
  const [isOpen, setIsOpen] = useState(false);
  
  const [polyVol, setPolyVol] = useState(-12); // in dB
  const [monoVol, setMonoVol] = useState(-12);
  const [drumVol, setDrumVol] = useState(-12);
  const [masterVol, setMasterVol] = useState(-12);

  // EQ states
  const [polyEQ, setPolyEQ] = useState({ low: 0, mid: 0, high: 0 });
  const [monoEQ, setMonoEQ] = useState({ low: 0, mid: 0, high: 0 });
  const [drumEQ, setDrumEQ] = useState({ low: 0, mid: 0, high: 0 });

  // Pan states
  const [polyPan, setPolyPan] = useState(0);
  const [monoPan, setMonoPan] = useState(0);
  const [drumPan, setDrumPan] = useState(0);

  useEffect(() => {
    mixer.polyGain.gain.setValueAtTime(Tone.dbToGain(polyVol), Tone.now());
    console.log("Poly gain:", Tone.dbToGain(polyVol));
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

  // EQ effects
  useEffect(() => {
    mixer.polyEQ.low.setValueAtTime(polyEQ.low, Tone.now());
    mixer.polyEQ.mid.setValueAtTime(polyEQ.mid, Tone.now());
    mixer.polyEQ.high.setValueAtTime(polyEQ.high, Tone.now());
  }, [polyEQ]);

  useEffect(() => {
    mixer.monoEQ.low.setValueAtTime(monoEQ.low, Tone.now());
    mixer.monoEQ.mid.setValueAtTime(monoEQ.mid, Tone.now());
    mixer.monoEQ.high.setValueAtTime(monoEQ.high, Tone.now());
  }, [monoEQ]);

  useEffect(() => {
    mixer.drumEQ.low.setValueAtTime(drumEQ.low, Tone.now());
    mixer.drumEQ.mid.setValueAtTime(drumEQ.mid, Tone.now());
    mixer.drumEQ.high.setValueAtTime(drumEQ.high, Tone.now());
  }, [drumEQ]);

  // Pan effects
  useEffect(() => {
    mixer.polyPanner.pan.setValueAtTime(polyPan, Tone.now());
  }, [polyPan]);

  useEffect(() => {
    mixer.monoPanner.pan.setValueAtTime(monoPan, Tone.now());
  }, [monoPan]);

  useEffect(() => {
    mixer.drumPanner.pan.setValueAtTime(drumPan, Tone.now());
  }, [drumPan]);

  const Slider = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (val: number) => void;
  }) => (
    <div className="flex flex-col items-center w-full">
      <label className="text-xs text-white mb-2">
        {label} ({value} dB)
      </label>
      <input
        type="range"
        min={-60}
        max={0}
        step={1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  const EQControls = ({
    label,
    eq,
    onChange,
  }: {
    label: string;
    eq: { low: number; mid: number; high: number };
    onChange: (eq: { low: number; mid: number; high: number }) => void;
  }) => (
    <div className="flex flex-col items-center gap-1">
      <label className="text-xs text-white">{label} EQ</label>
      <div className="flex flex-col gap-1">
        {/* High */}
        <div className="flex flex-col items-center">
          <label className="text-xs text-blue-400">H</label>
          <input
            type="range"
            min={-12}
            max={12}
            step={0.5}
            value={eq.high}
            onChange={(e) => {
              console.log("High EQ slider changed:", e.target.value);
              onChange({ ...eq, high: parseFloat(e.target.value) });
            }}
            className="w-16 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-blue-400">
            {eq.high > 0 ? "+" : ""}
            {eq.high}
          </span>
        </div>

        {/* Mid */}
        <div className="flex flex-col items-center">
          <label className="text-xs text-green-400">M</label>
          <input
            type="range"
            min={-12}
            max={12}
            step={0.5}
            value={eq.mid}
            onChange={(e) => {
              console.log("Mid EQ slider changed:", e.target.value);
              onChange({ ...eq, mid: parseFloat(e.target.value) });
            }}
            className="w-16 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-green-400">
            {eq.mid > 0 ? "+" : ""}
            {eq.mid}
          </span>
        </div>

        {/* Low */}
        <div className="flex flex-col items-center">
          <label className="text-xs text-red-400">L</label>
          <input
            type="range"
            min={-12}
            max={12}
            step={0.5}
            value={eq.low}
            onChange={(e) => {
              console.log("Low EQ slider changed:", e.target.value);
              onChange({ ...eq, low: parseFloat(e.target.value) });
            }}
            className="w-16 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-red-400">
            {eq.low > 0 ? "+" : ""}
            {eq.low}
          </span>
        </div>
      </div>
    </div>
  );

  const PanControl = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (val: number) => void;
  }) => (
    <div className="flex flex-col items-center gap-1">
      <label className="text-xs text-yellow-400">Pan</label>
      <input
        type="range"
        min={-1}
        max={1}
        step={0.1}
        value={value}
        onChange={(e) => {
          console.log("Pan slider changed:", e.target.value);
          onChange(parseFloat(e.target.value));
        }}
        className="w-16 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
      />
      <span className="text-xs text-yellow-400">
        {Math.abs(value) < 0.1
          ? "C"
          : value > 0
          ? `R${Math.round(Math.abs(value) * 10)}`
          : `L${Math.round(Math.abs(value) * 10)}`}
      </span>
    </div>
  );

  const ChannelStrip = ({
    label,
    volume,
    onVolumeChange,
    eq,
    onEQChange,
    pan,
    onPanChange,
  }: {
    label: string;
    volume: number;
    onVolumeChange: (val: number) => void;
    eq: { low: number; mid: number; high: number };
    onEQChange: (eq: { low: number; mid: number; high: number }) => void;
    pan: number;
    onPanChange: (val: number) => void;
  }) => (
    <div className="flex flex-col gap-4 p-4 bg-gray-800/50 rounded-lg w-full">
      <h3 className="text-sm text-white font-semibold text-center">{label}</h3>
      <div className="flex gap-4 items-start">
        <EQControls label="" eq={eq} onChange={onEQChange} />
        <PanControl value={pan} onChange={onPanChange} />
      </div>
      <Slider label="Volume" value={volume} onChange={onVolumeChange} />
    </div>
  );

  return (
    <>
      <style>{sliderStyles}</style>
      
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-3 rounded-r-lg shadow-lg transition-all duration-300 ${
          isOpen ? 'left-80' : 'left-0'
        }`}
        aria-label={isOpen ? 'Close Mixer' : 'Open Mixer'}
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Mixer Panel */}
      <div 
        className={`flex flex-col gap-4 bg-black/50 p-4 rounded-r-xl shadow-lg fixed top-4 left-0 backdrop-blur w-80 h-[calc(100vh-2rem)] overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
      <ChannelStrip
        label="Poly"
        volume={polyVol}
        onVolumeChange={setPolyVol}
        eq={polyEQ}
        onEQChange={setPolyEQ}
        pan={polyPan}
        onPanChange={setPolyPan}
      />
      <ChannelStrip
        label="Mono"
        volume={monoVol}
        onVolumeChange={setMonoVol}
        eq={monoEQ}
        onEQChange={setMonoEQ}
        pan={monoPan}
        onPanChange={setMonoPan}
      />
      <ChannelStrip
        label="Drums"
        volume={drumVol}
        onVolumeChange={setDrumVol}
        eq={drumEQ}
        onEQChange={setDrumEQ}
        pan={drumPan}
        onPanChange={setDrumPan}
      />
      <div className="flex flex-col gap-4 p-4 bg-gray-800/50 rounded-lg w-full">
        <h3 className="text-sm text-white font-semibold text-center">Master</h3>
        <Slider label="Volume" value={masterVol} onChange={setMasterVol} />
      </div>
      </div>
    </>
  );
}

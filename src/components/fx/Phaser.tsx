import * as Tone from "tone";
import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  ChangeEvent,
} from "react";

export type PhaserHandle = {
  getPhaser: () => Tone.Phaser;
};

const Phaser = forwardRef<PhaserHandle>((_, ref) => {
  const [phaser] = useState(
    () =>
      new Tone.Phaser({
        frequency: 0.5,
        octaves: 3,
        baseFrequency: 350,
        wet: 0.5,
      })
  );

  const [config, setConfig] = useState({
    frequency: 0.5,
    octaves: 3,
    baseFrequency: 350,
    wet: 0.5,
  });

  // Update phaser parameters when config changes
  useEffect(() => {
    phaser.frequency.value = config.frequency;
    phaser.octaves = config.octaves;
    phaser.baseFrequency = config.baseFrequency;
    phaser.wet.value = config.wet;
  }, [config, phaser]);

  useImperativeHandle(
    ref,
    () => ({
      getPhaser: () => phaser,
    }),
    [phaser]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: +value,
    }));
  };

  return (
    <div>
      <h2>Phaser Effect</h2>
      <label>
        Frequency:
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          name="frequency"
          value={config.frequency}
          onChange={handleChange}
        />
        <span>{config.frequency.toFixed(1)} Hz</span>
      </label>
      <br />
      <label>
        Octaves:
        <input
          type="range"
          min="0"
          max="6"
          step="1"
          name="octaves"
          value={config.octaves}
          onChange={handleChange}
        />
        <span>{config.octaves}</span>
      </label>
      <br />
      <label>
        Base Frequency:
        <input
          type="range"
          min="100"
          max="1000"
          step="10"
          name="baseFrequency"
          value={config.baseFrequency}
          onChange={handleChange}
        />
        <span>{config.baseFrequency.toFixed(0)} Hz</span>
      </label>
      <br />
      <label>
        Wet:
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          name="wet"
          value={config.wet}
          onChange={handleChange}
        />
        <span>{config.wet.toFixed(2)}</span>
      </label>
    </div>
  );
});

export default Phaser;

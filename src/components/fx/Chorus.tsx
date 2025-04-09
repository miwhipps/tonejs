import * as Tone from "tone";
import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  ChangeEvent,
} from "react";

export type ChorusHandle = {
  getChorus: () => Tone.Chorus;
};

const Chorus = forwardRef<ChorusHandle>((_, ref) => {
  const [chorus] = useState(() => new Tone.Chorus(4, 2.5, 0.5).start());

  const [config, setConfig] = useState({
    frequency: 4,
    delayTime: 2.5,
    depth: 0.5,
    wet: 0.5,
  });

  // Update chorus when config changes
  useEffect(() => {
    chorus.frequency.value = config.frequency;
    chorus.delayTime = config.delayTime;
    chorus.depth = config.depth;
    chorus.wet.value = config.wet;
  }, [config, chorus]);

  useImperativeHandle(
    ref,
    () => ({
      getChorus: () => chorus,
    }),
    [chorus]
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
      <h2>Chorus Effect</h2>
      <label>
        Frequency:
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          name="frequency"
          value={config.frequency}
          onChange={handleChange}
        />
        <span>{config.frequency.toFixed(1)} Hz</span>
      </label>
      <br />
      <label>
        Delay Time:
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          name="delayTime"
          value={config.delayTime}
          onChange={handleChange}
        />
        <span>{config.delayTime.toFixed(1)} ms</span>
      </label>
      <br />
      <label>
        Depth:
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          name="depth"
          value={config.depth}
          onChange={handleChange}
        />
        <span>{config.depth.toFixed(2)}</span>
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

export default Chorus;

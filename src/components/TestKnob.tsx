import { useState } from "react";
import SVGKnobMedium from "./SVGKnobMedium";

const TestKnob = () => {
  const [val, setVal] = useState(0.5);

  return (
    <div className="p-6 bg-neutral-900 text-white min-h-screen">
      <h1 className="text-xl mb-4">Custom SVG Knob</h1>
      <SVGKnobMedium value={val} onChange={setVal} />
      <p className="mt-4">Value: {val.toFixed(2)}</p>
    </div>
  );
};

export default TestKnob;

import React, { useRef, useState } from "react";

type SVGKnobProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  sensitivity?: number;
  size?: number;
};

const SVGKnobMedium: React.FC<SVGKnobProps> = ({
  size = 75,
  value,
  onChange,
  sensitivity = 0.005,
}) => {
  const knobRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const lastY = useRef(0);

  const radius = size / 2;
  const angle = value * 270 - 225;
  // -225° to 45°
  const knobX = radius + radius * 0.7 * Math.cos((angle * Math.PI) / 180);
  const knobY = radius + radius * 0.7 * Math.sin((angle * Math.PI) / 180);

  const startDrag = (e: React.MouseEvent) => {
    setDragging(true);
    lastY.current = e.clientY;
  };

  const stopDrag = () => setDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    const dy = lastY.current - e.clientY; // Up = positive
    const delta = dy * sensitivity;
    let newVal = value + delta;
    newVal = Math.min(Math.max(newVal, 0), 1);
    onChange(newVal);
    lastY.current = e.clientY;
  };

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging, value]);

  return (
    <svg
      ref={knobRef}
      width={size}
      height={size}
      onMouseDown={startDrag}
      style={{ cursor: "ns-resize", userSelect: "none" }}
    >
      <circle
        cx={radius}
        cy={radius}
        r={radius - 5}
        fill="#333"
        stroke="#999"
        strokeWidth="3"
      />
      <line
        x1={radius}
        y1={radius}
        x2={knobX}
        y2={knobY}
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default SVGKnobMedium;

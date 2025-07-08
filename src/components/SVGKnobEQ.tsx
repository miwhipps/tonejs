import React, { useRef, useState, useEffect } from "react";

type SVGKnobEQProps = {
  size?: number;
  value: number; // -12 to 12 dB
  onChange: (val: number) => void;
  sensitivity?: number;
  min?: number;
  max?: number;
  label?: string;
  color?: string;
};

const SVGKnobEQ: React.FC<SVGKnobEQProps> = ({
  size = 40,
  value,
  onChange,
  sensitivity = 0.5,
  min = -12,
  max = 12,
  label = "",
  color = "#fff",
}) => {
  const knobRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const lastY = useRef(0);

  const radius = size / 2;
  
  // Normalize value from dB range to 0-1 range for angle calculation
  const normalizedValue = (value - min) / (max - min);
  const angle = normalizedValue * 270 - 225; // -225° to 45°
  
  const knobX = radius + radius * 0.6 * Math.cos((angle * Math.PI) / 180);
  const knobY = radius + radius * 0.6 * Math.sin((angle * Math.PI) / 180);

  const startDrag = (e: React.MouseEvent | React.PointerEvent) => {
    console.log("EQ Knob startDrag called");
    setDragging(true);
    lastY.current = e.clientY;
    e.preventDefault();
    e.stopPropagation();
    
    // Capture pointer to ensure we get all mouse events even outside the element
    if (knobRef.current && 'pointerId' in e) {
      knobRef.current.setPointerCapture(e.pointerId);
    }
    
    // Also prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
  };

  const stopDrag = () => {
    setDragging(false);
    
    // Release pointer capture - try both common pointer IDs
    if (knobRef.current) {
      try {
        // Try to release any active pointer captures
        for (let i = 0; i < 10; i++) {
          if (knobRef.current.hasPointerCapture && knobRef.current.hasPointerCapture(i)) {
            knobRef.current.releasePointerCapture(i);
          }
        }
      } catch (e) {
        // Ignore errors if pointer capture wasn't set
      }
    }
    
    // Restore text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const dy = lastY.current - e.clientY; // Up = positive
    const delta = dy * sensitivity;
    let newVal = value + delta;
    newVal = Math.min(Math.max(newVal, min), max);
    console.log("EQ Mouse Move:", { dy, delta, oldVal: value, newVal });
    onChange(Math.round(newVal * 10) / 10); // Round to 1 decimal
    lastY.current = e.clientY;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const dy = lastY.current - e.clientY; // Up = positive
    const delta = dy * sensitivity;
    let newVal = value + delta;
    newVal = Math.min(Math.max(newVal, min), max);
    console.log("EQ Pointer Move:", { dy, delta, oldVal: value, newVal });
    onChange(Math.round(newVal * 10) / 10); // Round to 1 decimal
    lastY.current = e.clientY;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };
  }, [dragging, value]);

  return (
    <div className="flex flex-col items-center gap-1">
      {label && <label className="text-xs text-gray-400">{label}</label>}
      <svg
        ref={knobRef}
        width={size}
        height={size}
        onMouseDown={startDrag}
        onPointerDown={startDrag}
        style={{ cursor: "ns-resize", userSelect: "none", touchAction: "none" }}
      >
        {/* Outer ring */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - 3}
          fill="#2a2a2a"
          stroke="#555"
          strokeWidth="2"
        />
        
        {/* Center dot when at 0dB */}
        {Math.abs(value) < 0.5 && (
          <circle
            cx={radius}
            cy={radius}
            r="2"
            fill="#22c55e"
          />
        )}
        
        {/* Indicator line */}
        <line
          x1={radius}
          y1={radius}
          x2={knobX}
          y2={knobY}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Value indicator marks */}
        <circle
          cx={radius + radius * 0.8 * Math.cos((-225 * Math.PI) / 180)}
          cy={radius + radius * 0.8 * Math.sin((-225 * Math.PI) / 180)}
          r="1"
          fill="#666"
        />
        <circle
          cx={radius + radius * 0.8 * Math.cos((0 * Math.PI) / 180)}
          cy={radius + radius * 0.8 * Math.sin((0 * Math.PI) / 180)}
          r="1"
          fill="#22c55e"
        />
        <circle
          cx={radius + radius * 0.8 * Math.cos((45 * Math.PI) / 180)}
          cy={radius + radius * 0.8 * Math.sin((45 * Math.PI) / 180)}
          r="1"
          fill="#666"
        />
      </svg>
      <span className="text-xs text-gray-400">{value > 0 ? '+' : ''}{value}</span>
    </div>
  );
};

export default SVGKnobEQ;
import React, { useRef, useState, useEffect } from "react";

type SVGKnobPanProps = {
  size?: number;
  value: number; // -1 to 1 (left to right)
  onChange: (val: number) => void;
  sensitivity?: number;
  label?: string;
};

const SVGKnobPan: React.FC<SVGKnobPanProps> = ({
  size = 40,
  value,
  onChange,
  sensitivity = 0.05,
  label = "Pan",
}) => {
  const knobRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const lastY = useRef(0);

  const radius = size / 2;
  
  // Normalize value from -1 to 1 range to 0-1 range for angle calculation
  const normalizedValue = (value + 1) / 2;
  const angle = normalizedValue * 270 - 225; // -225° to 45°
  
  const knobX = radius + radius * 0.6 * Math.cos((angle * Math.PI) / 180);
  const knobY = radius + radius * 0.6 * Math.sin((angle * Math.PI) / 180);

  const startDrag = (e: React.MouseEvent | React.PointerEvent) => {
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
    
    // Release pointer capture
    if (knobRef.current) {
      try {
        knobRef.current.releasePointerCapture(knobRef.current.hasPointerCapture(0) ? 0 : 1);
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
    newVal = Math.min(Math.max(newVal, -1), 1);
    onChange(Math.round(newVal * 10) / 10); // Round to 1 decimal
    lastY.current = e.clientY;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const dy = lastY.current - e.clientY; // Up = positive
    const delta = dy * sensitivity;
    let newVal = value + delta;
    newVal = Math.min(Math.max(newVal, -1), 1);
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

  const getPanLabel = () => {
    if (Math.abs(value) < 0.1) return 'C';
    return value > 0 ? `R${Math.round(Math.abs(value) * 10)}` : `L${Math.round(Math.abs(value) * 10)}`;
  };

  const getPanColor = () => {
    if (Math.abs(value) < 0.1) return '#22c55e'; // Green for center
    return value > 0 ? '#f59e0b' : '#3b82f6'; // Amber for right, Blue for left
  };

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
        
        {/* Center dot when centered */}
        {Math.abs(value) < 0.1 && (
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
          stroke={getPanColor()}
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Pan position marks */}
        {/* Left */}
        <circle
          cx={radius + radius * 0.8 * Math.cos((-225 * Math.PI) / 180)}
          cy={radius + radius * 0.8 * Math.sin((-225 * Math.PI) / 180)}
          r="1"
          fill="#3b82f6"
        />
        {/* Center */}
        <circle
          cx={radius + radius * 0.8 * Math.cos((-90 * Math.PI) / 180)}
          cy={radius + radius * 0.8 * Math.sin((-90 * Math.PI) / 180)}
          r="1"
          fill="#22c55e"
        />
        {/* Right */}
        <circle
          cx={radius + radius * 0.8 * Math.cos((45 * Math.PI) / 180)}
          cy={radius + radius * 0.8 * Math.sin((45 * Math.PI) / 180)}
          r="1"
          fill="#f59e0b"
        />
      </svg>
      <span className="text-xs" style={{ color: getPanColor() }}>
        {getPanLabel()}
      </span>
    </div>
  );
};

export default SVGKnobPan;
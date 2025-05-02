import { useRef, useEffect } from "react";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  sensitivity?: number;
};

const SVGKnobMedium: React.FC<Props> = ({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  sensitivity = 0.005,
}) => {
  const startYRef = useRef<number | null>(null);
  const startValRef = useRef<number>(value);

  const handleMouseDown = (e: React.MouseEvent) => {
    startYRef.current = e.clientY;
    startValRef.current = value;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (startYRef.current !== null) {
        const deltaY = startYRef.current - moveEvent.clientY;
        let newValue = startValRef.current + deltaY * sensitivity;
        newValue = Math.max(
          min,
          Math.min(max, Math.round(newValue / step) * step)
        );
        onChange(parseFloat(newValue.toFixed(4)));
      }
    };

    const handleMouseUp = () => {
      startYRef.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    startValRef.current = value;
  }, [value]);

  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 100 100"
      onMouseDown={handleMouseDown}
      style={{ cursor: "ns-resize", userSelect: "none" }}
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#666"
        strokeWidth="10"
        fill="#222"
      />
      <line
        x1="50"
        y1="50"
        x2={
          50 +
          30 *
            Math.cos(((value - min) / (max - min)) * 2 * Math.PI - Math.PI / 2)
        }
        y2={
          50 +
          30 *
            Math.sin(((value - min) / (max - min)) * 2 * Math.PI - Math.PI / 2)
        }
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default SVGKnobMedium;

"use client";

import { useEffect, useId, useState } from "react";

const VIRTUAL_HEIGHT = 1000;
const AXIS_X = 18;
const RADIUS = 9;
const FREQUENCY = 0.07; // higher = tighter coils ("threads" per page)

interface Segment {
  side: "front" | "back";
  d: string;
}

function buildSegments(): Segment[] {
  const segs: Segment[] = [];
  let buffer: string[] = [];
  let lastSide: "front" | "back" | null = null;
  const flush = () => {
    if (buffer.length > 1 && lastSide) {
      segs.push({ side: lastSide, d: "M " + buffer.join(" L ") });
    }
    buffer = [];
  };
  for (let y = 0; y <= VIRTUAL_HEIGHT; y += 1.5) {
    const s = Math.sin(y * FREQUENCY);
    const x = AXIS_X + s * RADIUS;
    const side: "front" | "back" = s >= 0 ? "front" : "back";
    if (side !== lastSide && buffer.length > 0) {
      flush();
    }
    buffer.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
    lastSide = side;
  }
  flush();
  return segs;
}

const SEGMENTS = buildSegments();

function helixPoint(progress: number) {
  const y = progress * VIRTUAL_HEIGHT;
  const s = Math.sin(y * FREQUENCY);
  const x = AXIS_X + s * RADIUS;
  // Slight z-cue: dots in front are larger, dots in back smaller / lighter.
  return { x, y, side: s >= 0 ? "front" : "back" as "front" | "back" };
}

export function SpiralScrollbar() {
  const [progress, setProgress] = useState(0);
  const clipId = useId();

  useEffect(() => {
    const update = () => {
      const max =
        (document.documentElement.scrollHeight || document.body.scrollHeight) -
        window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const dot = helixPoint(progress);
  const fillY = progress * VIRTUAL_HEIGHT;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 36 ${VIRTUAL_HEIGHT}`}
      preserveAspectRatio="none"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100vh",
        width: 36,
        pointerEvents: "none",
        zIndex: 60,
      }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="36" height={fillY} />
        </clipPath>
      </defs>

      {/* Central axis line — the "shaft" the helix wraps around */}
      <line
        x1={AXIS_X}
        y1={0}
        x2={AXIS_X}
        y2={VIRTUAL_HEIGHT}
        stroke="#E5E2D9"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />

      {/* Unfilled helix — back arcs dashed (suggest "behind the shaft"),
          front arcs solid but light. This is the resting state. */}
      {SEGMENTS.map((seg, i) => (
        <path
          key={`base-${i}`}
          d={seg.d}
          fill="none"
          stroke={seg.side === "front" ? "#C8D2C8" : "#DDD9CE"}
          strokeWidth={seg.side === "front" ? 2 : 1.2}
          strokeDasharray={seg.side === "back" ? "2 3" : undefined}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Filled portion — same helix in primary green, clipped by scroll progress */}
      <g clipPath={`url(#${clipId})`}>
        <line
          x1={AXIS_X}
          y1={0}
          x2={AXIS_X}
          y2={VIRTUAL_HEIGHT}
          stroke="#2D5A41"
          strokeOpacity={0.25}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        {SEGMENTS.map((seg, i) => (
          <path
            key={`fill-${i}`}
            d={seg.d}
            fill="none"
            stroke={seg.side === "front" ? "#2D5A41" : "#5C8A6F"}
            strokeWidth={seg.side === "front" ? 2.6 : 1.6}
            strokeDasharray={seg.side === "back" ? "2 3" : undefined}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>

      {/* Bead riding the helix — bigger when in front, smaller behind */}
      <circle
        cx={dot.x}
        cy={dot.y}
        r={dot.side === "front" ? 4.5 : 3}
        fill={dot.side === "front" ? "#D95D39" : "#B5530B"}
        opacity={dot.side === "front" ? 1 : 0.7}
      />
    </svg>
  );
}

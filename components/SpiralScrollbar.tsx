"use client";

import { useEffect, useState } from "react";

const VIRTUAL_HEIGHT = 1000;

function buildPath() {
  const points: string[] = [];
  for (let y = 0; y <= VIRTUAL_HEIGHT; y += 3) {
    // Two overlaid sine components give the line a coiled / springlike feel
    // rather than a flat wave — reads as "spiraling down" the side.
    const x = 14 + Math.sin(y * 0.05) * 7 + Math.sin(y * 0.13) * 2;
    points.push(`${x.toFixed(2)} ${y}`);
  }
  return "M " + points.join(" L ");
}

const PATH = buildPath();
const DASH = 2400;

export function SpiralScrollbar() {
  const [progress, setProgress] = useState(0);

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

  // Dot follows along the same path so it visually "rides" the spiral
  const dotY = progress * VIRTUAL_HEIGHT;
  const dotX = 14 + Math.sin(dotY * 0.05) * 7 + Math.sin(dotY * 0.13) * 2;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 28 ${VIRTUAL_HEIGHT}`}
      preserveAspectRatio="none"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100vh",
        width: 28,
        pointerEvents: "none",
        zIndex: 60,
      }}
    >
      <path
        d={PATH}
        fill="none"
        stroke="#E5E2D9"
        strokeWidth={1.4}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={PATH}
        fill="none"
        stroke="#2D5A41"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={DASH}
        strokeDashoffset={DASH * (1 - progress)}
        vectorEffect="non-scaling-stroke"
        style={{ transition: "stroke-dashoffset 80ms linear" }}
      />
      <circle cx={dotX} cy={dotY} r={4} fill="#D95D39" />
    </svg>
  );
}

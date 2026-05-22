import type { CSSProperties } from "react";

export function Logo({
  size = 28,
  withWordmark = true,
  style,
}: {
  size?: number;
  withWordmark?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "var(--font-heading)",
        fontWeight: 500,
        fontSize: 19,
        letterSpacing: "-0.01em",
        color: "var(--ink)",
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
        <rect width="32" height="32" rx="9" fill="#2D5A41" />
        {/* Stylized frog leap arc — two dots + an arc */}
        <path
          d="M7 22 C 10 12, 22 12, 25 22"
          fill="none"
          stroke="#F4F1EA"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="7" cy="22" r="2.3" fill="#F4F1EA" />
        <circle cx="25" cy="22" r="2.3" fill="#D95D39" />
      </svg>
      {withWordmark && <span>Leapfrog</span>}
    </span>
  );
}

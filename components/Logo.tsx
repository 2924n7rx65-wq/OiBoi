import Image from "next/image";
import type { CSSProperties } from "react";

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  /** "dark" wraps the mark in a cream circle so it stays readable on green surfaces. */
  variant?: "light" | "dark";
  style?: CSSProperties;
}

export function Logo({
  size = 30,
  withWordmark = true,
  variant = "light",
  style,
}: LogoProps) {
  const onDark = variant === "dark";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "var(--font-heading)",
        fontWeight: 500,
        fontSize: 20,
        letterSpacing: "-0.015em",
        color: onDark ? "var(--paper)" : "var(--ink)",
        ...style,
      }}
    >
      <span
        style={{
          width: size,
          height: size,
          borderRadius: 10,
          background: onDark ? "var(--paper)" : "transparent",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: onDark ? 3 : 0,
        }}
      >
        <Image
          src="/leapfrog-logo.png"
          alt="Leapfrog"
          width={size}
          height={size}
          priority
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </span>
      {withWordmark && <span>Leapfrog</span>}
    </span>
  );
}

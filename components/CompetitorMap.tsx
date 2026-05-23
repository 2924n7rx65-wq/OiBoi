"use client";

import dynamic from "next/dynamic";
import type { MapPin } from "./MapInner";

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 280,
        borderRadius: 14,
        border: "1px solid var(--rule)",
        background: "var(--cream)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--ink-soft)",
        fontSize: 13,
      }}
    >
      Loading map…
    </div>
  ),
});

export type { MapPin };

export function CompetitorMap(props: React.ComponentProps<typeof MapInner>) {
  return <MapInner {...props} />;
}

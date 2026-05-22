"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Business } from "@/lib/types";
import { TopNav } from "@/components/TopNav";
import { IconArrowRight, IconBag, IconCup, IconDumbbell, IconFork, IconCheck } from "@/components/Icons";
import type { JSX } from "react";

const ICONS: Record<string, JSX.Element> = {
  "gym-001": <IconDumbbell width={22} height={22} />,
  "restaurant-001": <IconFork width={22} height={22} />,
  "cafe-001": <IconCup width={22} height={22} />,
  "retail-001": <IconBag width={22} height={22} />,
};

const VERTICAL_LABEL: Record<string, string> = {
  "gym-001": "Gym",
  "restaurant-001": "Restaurant",
  "cafe-001": "Cafe",
  "retail-001": "Op-shop & retail",
};

export default function HomePage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/businesses")
      .then((r) => r.json())
      .then((d: Business[]) => setBusinesses(d));
  }, []);

  async function loginAs(b: Business) {
    setLoading(b.id);
    await fetch("/api/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ businessId: b.id }),
    });
    router.push(b.onboarded ? "/analytics" : "/onboarding");
  }

  return (
    <>
      <TopNav variant="marketing" />
      <main className="container" style={{ padding: "56px 28px 80px" }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          <span className="pill pill-cream">Demo mode</span>
          <h1 style={{ marginTop: 18, fontSize: 44 }}>
            Pick a <span className="italic-accent">test business</span> to log in as.
          </h1>
          <p style={{ color: "var(--ink-soft)", marginTop: 12 }}>
            Each one is a real Brisbane operator. Already-onboarded businesses go straight to the
            dashboard; fresh ones run through the onboarding flow first.
          </p>
        </div>

        <div className="grid-2" style={{ marginTop: 40, maxWidth: 880, marginInline: "auto" }}>
          {businesses.map((b) => (
            <button
              key={b.id}
              onClick={() => loginAs(b)}
              disabled={loading === b.id}
              className="card"
              style={{
                textAlign: "left",
                cursor: "pointer",
                padding: 22,
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                alignItems: "center",
                gap: 16,
                background: "var(--paper)",
                opacity: loading === b.id ? 0.6 : 1,
              }}
            >
              <span
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "var(--green-soft)",
                  color: "var(--green)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {ICONS[b.id]}
              </span>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: 20 }}>{b.name}</div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>
                  {VERTICAL_LABEL[b.id]} ·{" "}
                  {b.onboarded ? (
                    <span style={{ color: "var(--green)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <IconCheck width={12} height={12} /> Onboarded — go to dashboard
                    </span>
                  ) : (
                    "Not onboarded yet"
                  )}
                </div>
              </div>
              <span
                style={{
                  color: "var(--ink-soft)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                }}
              >
                Continue <IconArrowRight width={14} height={14} />
              </span>
            </button>
          ))}
        </div>
      </main>
    </>
  );
}

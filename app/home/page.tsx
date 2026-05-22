"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Business } from "@/lib/types";

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
    <main style={{ padding: 32, maxWidth: 720, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>ScoutFeed</h1>
      <p style={{ color: "#666" }}>Pick a test business to log in as.</p>
      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        {businesses.map((b) => (
          <button
            key={b.id}
            onClick={() => loginAs(b)}
            disabled={loading === b.id}
            style={{
              textAlign: "left",
              padding: 16,
              border: "1px solid #eee",
              borderRadius: 12,
              background: "white",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <div style={{ fontWeight: 600 }}>{b.name}</div>
            <div style={{ fontSize: 13, color: "#666" }}>
              {b.onboarded ? "Onboarded — go to analytics" : "Not onboarded yet"}
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}

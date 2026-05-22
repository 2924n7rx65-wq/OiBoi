"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Business, Niche } from "@/lib/types";

const NICHES: { value: Niche; label: string }[] = [
  { value: "gym", label: "Gym" },
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Cafe" },
  { value: "retail", label: "Retail / Op-shop" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [niche, setNiche] = useState<Niche>("gym");
  const [businessType, setBusinessType] = useState("");
  const [city, setCity] = useState("Brisbane");
  const [suburb, setSuburb] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await fetch("/api/session");
      const j = (await r.json()) as { businessId: string | null; business: Business | null };
      if (cancelled) return;
      if (!j.businessId) {
        router.replace("/home");
        return;
      }
      setBusinessId(j.businessId);
      if (j.business?.niche) setNiche(j.business.niche);
      if (j.business?.businessType) setBusinessType(j.business.businessType);
      if (j.business?.location) {
        setCity(j.business.location.city);
        setSuburb(j.business.location.suburb);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!businessId) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/businesses/${businessId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        niche,
        businessType,
        location: { city, suburb },
      }),
    });
    if (!res.ok) {
      setError(`Save failed (${res.status})`);
      setSubmitting(false);
      return;
    }
    router.push("/analytics");
  }

  if (!businessId) {
    return (
      <main style={{ padding: 32 }}>
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 32, maxWidth: 540, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 4 }}>Onboarding</h1>
      <p style={{ color: "#666", marginTop: 0 }}>
        Tell us about your business so we can match you against the right competitors.
      </p>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 16, marginTop: 24 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Niche</span>
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value as Niche)}
            style={inputStyle}
          >
            {NICHES.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Business type</span>
          <input
            type="text"
            placeholder="e.g. strength gym, brunch spot, vintage clothes"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            style={inputStyle}
            required
          />
        </label>

        <div style={{ display: "grid", gap: 6, gridTemplateColumns: "1fr 1fr" }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 600 }}>City</span>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={inputStyle}
              required
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 600 }}>Suburb</span>
            <input
              type="text"
              placeholder="e.g. Fortitude Valley"
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
              style={inputStyle}
              required
            />
          </label>
        </div>

        {error && <p style={{ color: "#c00", margin: 0 }}>{error}</p>}

        <button type="submit" disabled={submitting} style={buttonStyle}>
          {submitting ? "Saving…" : "Continue to analytics"}
        </button>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "inherit",
};

const buttonStyle: React.CSSProperties = {
  marginTop: 8,
  padding: "12px 16px",
  background: "#111",
  color: "white",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
};

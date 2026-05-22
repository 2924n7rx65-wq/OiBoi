"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Business, Niche } from "@/lib/types";
import { TopNav } from "@/components/TopNav";
import { IconArrowRight } from "@/components/Icons";

const NICHES: { value: Niche; label: string }[] = [
  { value: "gym", label: "Gym" },
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Cafe" },
  { value: "retail", label: "Retail / Op-shop" },
];

const BRISBANE_SUBURBS = [
  "West End",
  "Fortitude Valley",
  "New Farm",
  "Paddington",
  "Teneriffe",
  "South Brisbane",
  "Newstead",
  "Woolloongabba",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
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
      if (j.business) {
        setBusinessName(j.business.name);
        if (j.business.niche) setNiche(j.business.niche);
        if (j.business.businessType) setBusinessType(j.business.businessType);
        if (j.business.location) {
          setCity(j.business.location.city);
          setSuburb(j.business.location.suburb);
        }
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
      body: JSON.stringify({ niche, businessType, location: { city, suburb } }),
    });
    if (!res.ok) {
      setError(`Save failed (${res.status})`);
      setSubmitting(false);
      return;
    }
    router.push("/analytics");
  }

  return (
    <>
      <TopNav variant="marketing" />
      <main className="container" style={{ padding: "56px 28px 80px", maxWidth: 720 }}>
        <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
          <span className="pill pill-cream">Step 1 of 1 · 60 seconds</span>
          <h1 style={{ marginTop: 18, fontSize: 44 }}>
            Tell us about your <span className="italic-accent">business</span>.
          </h1>
          <p style={{ color: "var(--ink-soft)", marginTop: 12 }}>
            We'll match you against six local rivals and four inspiration accounts further afield.
            {businessName && (
              <>
                {" "}You're signed in as <strong style={{ color: "var(--ink)" }}>{businessName}</strong>.
              </>
            )}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="card"
          style={{ marginTop: 32, padding: 28, display: "grid", gap: 18 }}
        >
          <Field label="Niche">
            <select className="input" value={niche} onChange={(e) => setNiche(e.target.value as Niche)}>
              {NICHES.map((n) => (
                <option key={n.value} value={n.value}>
                  {n.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Business type" hint="A short description — strength gym, brunch spot, vintage clothes.">
            <input
              className="input"
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="e.g. specialty roaster, strength gym"
              required
            />
          </Field>

          <div className="grid-2">
            <Field label="City">
              <input
                className="input"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Field>
            <Field label="Suburb">
              <select
                className="input"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                required
              >
                <option value="" disabled>
                  Pick a suburb
                </option>
                {BRISBANE_SUBURBS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {error && (
            <p style={{ color: "var(--orange)", margin: 0, fontSize: 14 }}>{error}</p>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
            <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
              We never share your details — public profile data only.
            </span>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? "Saving…" : "Continue to dashboard"}
              {!submitting && <IconArrowRight width={14} height={14} />}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span className="eyebrow" style={{ color: "var(--ink-soft)" }}>
        {label}
      </span>
      {children}
      {hint && <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{hint}</span>}
    </label>
  );
}

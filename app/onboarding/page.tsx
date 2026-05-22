"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Business, Competitor, Niche } from "@/lib/types";
import { TopNav } from "@/components/TopNav";
import { IconArrowRight, IconCheck } from "@/components/Icons";
import { CompetitorMap, type MapPin } from "@/components/CompetitorMap";
import { coordsForSuburb, jitterCoord } from "@/lib/suburbCoords";
import { discoverablesFor } from "@/lib/discoverables";

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
  const [step, setStep] = useState<1 | 2>(1);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [niche, setNiche] = useState<Niche>("gym");
  const [businessType, setBusinessType] = useState("");
  const [city, setCity] = useState("Brisbane");
  const [suburb, setSuburb] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  // Load competitors once we hit step 2 (so we have the businessId)
  useEffect(() => {
    if (step !== 2 || !businessId) return;
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/competitors?businessId=${businessId}`);
      const j = (await res.json()) as { local: Competitor[]; inspiration: Competitor[] };
      if (cancelled) return;
      setCompetitors(j.local);
      // Default: track everyone we already found.
      setSelectedIds(new Set(j.local.map((c) => c.id)));
    })();
    return () => {
      cancelled = true;
    };
  }, [step, businessId]);

  const discoverables = useMemo(() => discoverablesFor(niche), [niche]);

  function goNext(e: React.FormEvent) {
    e.preventDefault();
    if (!suburb) return;
    setStep(2);
  }

  async function finish() {
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
    // For the MVP we acknowledge the selections but the analytics route still
    // returns all seeded competitors. Persist selection to localStorage so a
    // future API revision can read it.
    try {
      localStorage.setItem(
        `leapfrog:selected:${businessId}`,
        JSON.stringify([...selectedIds]),
      );
    } catch {}
    router.push("/analytics");
  }

  return (
    <>
      <TopNav variant="marketing" />
      <main className="container" style={{ padding: "56px 28px 80px", maxWidth: 980 }}>
        <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
          <span className="pill pill-cream">Step {step} of 2 · 60 seconds</span>
          <h1 style={{ marginTop: 18, fontSize: 44 }}>
            {step === 1 ? (
              <>
                Tell us about your <span className="italic-accent">business</span>.
              </>
            ) : (
              <>
                Pick your <span className="italic-accent">competitors</span>.
              </>
            )}
          </h1>
          <p style={{ color: "var(--ink-soft)", marginTop: 12 }}>
            {step === 1 ? (
              <>
                We'll match you against six local rivals and four inspiration accounts further
                afield.
                {businessName && (
                  <>
                    {" "}You're signed in as <strong style={{ color: "var(--ink)" }}>{businessName}</strong>.
                  </>
                )}
              </>
            ) : (
              <>
                Found {competitors.length} businesses within walking distance of {suburb || "your suburb"}.
                Pick the ones you want to track — uncheck any you don't care about.
              </>
            )}
          </p>
        </div>

        {step === 1 && (
          <form
            onSubmit={goNext}
            className="card"
            style={{ marginTop: 32, padding: 28, display: "grid", gap: 18, maxWidth: 720, marginInline: "auto" }}
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

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                We never share your details — public profile data only.
              </span>
              <button type="submit" className="btn btn-primary" disabled={!suburb}>
                Find my competitors <IconArrowRight width={14} height={14} />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <Step2
            niche={niche}
            suburb={suburb}
            competitors={competitors}
            discoverables={discoverables}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onBack={() => setStep(1)}
            onFinish={finish}
            submitting={submitting}
            error={error}
            businessName={businessName}
          />
        )}
      </main>
    </>
  );
}

function Step2({
  niche,
  suburb,
  competitors,
  discoverables,
  selectedIds,
  setSelectedIds,
  onBack,
  onFinish,
  submitting,
  error,
  businessName,
}: {
  niche: Niche;
  suburb: string;
  competitors: Competitor[];
  discoverables: ReturnType<typeof discoverablesFor>;
  selectedIds: Set<string>;
  setSelectedIds: (s: Set<string>) => void;
  onBack: () => void;
  onFinish: () => void;
  submitting: boolean;
  error: string | null;
  businessName: string;
}) {
  const yourCoords = coordsForSuburb(suburb);

  const trackedPins: MapPin[] = competitors.map((c) => {
    const base = coordsForSuburb(c.suburb);
    const j = jitterCoord(base, c.id);
    const selected = selectedIds.has(c.id);
    return {
      id: c.id,
      lat: j.lat,
      lon: j.lon,
      label: c.name,
      sublabel: `${c.suburb} · ${selected ? "Tracking" : "Skipped"}`,
      tone: selected ? "tracked" : "discoverable",
    };
  });

  const discoverablePins: MapPin[] = discoverables.map((d) => {
    const base = coordsForSuburb(d.suburb);
    const j = jitterCoord(base, d.id);
    return {
      id: d.id,
      lat: j.lat,
      lon: j.lon,
      label: d.name,
      sublabel: `${d.suburb} · ${d.plan} plan`,
      tone: "discoverable",
    };
  });

  const youPin: MapPin = {
    id: "you",
    lat: yourCoords.lat,
    lon: yourCoords.lon,
    label: businessName || "Your business",
    sublabel: `${suburb} · You`,
    tone: "you",
  };

  function toggle(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  return (
    <div
      style={{
        marginTop: 32,
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr",
        gap: 20,
        alignItems: "flex-start",
      }}
    >
      <div className="card" style={{ padding: 16 }}>
        <div style={{ marginBottom: 10 }}>
          <strong style={{ fontSize: 14 }}>On your block</strong>
          <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>
            You're the green star. Terracotta pins are tracked, grey pins are extras you'll
            unlock on Pro.
          </div>
        </div>
        <CompetitorMap
          center={yourCoords}
          zoom={14}
          pins={[youPin, ...trackedPins, ...discoverablePins]}
          height={420}
        />
      </div>

      <div className="card" style={{ padding: 20, display: "grid", gap: 14 }}>
        <div>
          <p className="eyebrow">Pick competitors</p>
          <strong style={{ fontSize: 16, display: "block", marginTop: 6 }}>
            {competitors.length} {niche === "retail" ? "retailers" : niche === "cafe" ? "cafes" : niche === "gym" ? "gyms" : "restaurants"} found near {suburb || "you"}
          </strong>
          <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>
            Default: track them all. Uncheck any you don't want in your feed.
          </div>
        </div>

        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
          {competitors.map((c) => {
            const selected = selectedIds.has(c.id);
            return (
              <li key={c.id}>
                <label
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    border: "1px solid var(--rule)",
                    borderRadius: 10,
                    background: selected ? "var(--green-soft)" : "var(--paper)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggle(c.id)}
                    style={{ accentColor: "var(--green)" }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                      {c.handle} · {c.suburb} · {c.distanceKm} km
                    </div>
                  </div>
                  {selected && <IconCheck width={16} height={16} style={{ color: "var(--green)" }} />}
                </label>
              </li>
            );
          })}
        </ul>

        {discoverables.length > 0 && (
          <>
            <div style={{ marginTop: 6 }}>
              <p className="eyebrow" style={{ color: "var(--ink-soft)" }}>
                Also nearby · {discoverables.length} more on Pro
              </p>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 }}>
              {discoverables.map((d) => (
                <li
                  key={d.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 12px",
                    border: "1px dashed var(--rule)",
                    borderRadius: 10,
                    opacity: 0.7,
                  }}
                >
                  <input type="checkbox" disabled style={{ accentColor: "var(--ink-soft)" }} />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                      {d.handle} · {d.suburb}
                    </div>
                  </div>
                  <span className="pill pill-cream" style={{ fontSize: 10 }}>
                    {d.plan}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {error && <p style={{ color: "var(--orange)", margin: 0, fontSize: 14 }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <button onClick={onBack} className="btn btn-secondary" type="button">
            Back
          </button>
          <button
            onClick={onFinish}
            disabled={submitting || selectedIds.size === 0}
            className="btn btn-primary"
          >
            {submitting ? "Saving…" : `Track ${selectedIds.size} and go to dashboard`}
            {!submitting && <IconArrowRight width={14} height={14} />}
          </button>
        </div>
      </div>
    </div>
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

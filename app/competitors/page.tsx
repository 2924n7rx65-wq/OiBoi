"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Business, Competitor } from "@/lib/types";
import { TopNav } from "@/components/TopNav";
import { IconUsers } from "@/components/Icons";

type EnrichedCompetitor = Competitor & {
  signalCount: number;
  lastSignalAt: string | null;
};

export default function CompetitorsPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [local, setLocal] = useState<EnrichedCompetitor[]>([]);
  const [inspiration, setInspiration] = useState<EnrichedCompetitor[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const sess = await fetch("/api/session").then((r) => r.json());
      if (cancelled) return;
      if (!sess.businessId) {
        router.replace("/home");
        return;
      }
      setBusiness(sess.business);
      const res = await fetch(`/api/competitors?businessId=${sess.businessId}`);
      const j = (await res.json()) as { local: EnrichedCompetitor[]; inspiration: EnrichedCompetitor[] };
      if (!cancelled) {
        setLocal(j.local);
        setInspiration(j.inspiration);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!business) {
    return (
      <>
        <TopNav variant="app" />
        <main className="container" style={{ padding: 48 }}>
          <p style={{ color: "var(--ink-soft)" }}>Loading competitors…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <TopNav variant="app" />
      <main className="container" style={{ padding: "40px 28px 80px" }}>
        <div>
          <p className="eyebrow">Tracking · {business.location?.suburb ?? "—"}</p>
          <h1 style={{ marginTop: 8, fontSize: 44 }}>
            Who you're up <span className="italic-accent">against</span>
          </h1>
          <p style={{ color: "var(--ink-soft)", marginTop: 6 }}>
            Six businesses on your block. Four further afield to steal ideas from.
          </p>
        </div>

        <Section title="Local rivals" subtitle="On your block — and your block-and-a-bit.">
          <Grid items={local} />
        </Section>

        <Section title="Inspiration" subtitle="Bigger accounts in your category. Watch what works for them, then localise.">
          <Grid items={inspiration} />
        </Section>
      </main>
    </>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: 40 }}>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 22 }}>{title}</h2>
        <p style={{ color: "var(--ink-soft)", marginTop: 4 }}>{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function Grid({ items }: { items: EnrichedCompetitor[] }) {
  return (
    <div className="grid-3">
      {items.map((c) => (
        <div key={c.id} className="card" style={{ padding: 18, display: "grid", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.avatarUrl}
              alt=""
              width={40}
              height={40}
              style={{ borderRadius: 999, background: "var(--cream)" }}
            />
            <div>
              <strong style={{ fontSize: 15, lineHeight: 1.2, display: "block" }}>{c.name}</strong>
              <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{c.handle}</span>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            {c.suburb}, {c.city} · {c.distanceKm < 100 ? `${c.distanceKm} km away` : `${c.distanceKm.toLocaleString()} km away`}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 4,
              fontSize: 12,
              color: "var(--ink-soft)",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <IconUsers width={13} height={13} /> baseline ~{c.baselineLikes.toLocaleString()} likes
            </span>
            <span>{c.signalCount} signals</span>
          </div>
        </div>
      ))}
    </div>
  );
}

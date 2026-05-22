"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsResponse, Business, SignalType } from "@/lib/types";

type Pill = "promo" | "new-product" | "viral-post" | "pricing";

const PILL_STYLE: Record<Pill, { label: string; bg: string; fg: string }> = {
  promo: { label: "Promo", bg: "#FFF1E6", fg: "#B5530B" },
  "new-product": { label: "New product", bg: "#E8F0FF", fg: "#1F4FBF" },
  "viral-post": { label: "Viral post", bg: "#FCE7F3", fg: "#A2196F" },
  pricing: { label: "Pricing", bg: "#EDE9FE", fg: "#5B21B6" },
};

function pillFor(signalType: SignalType, engagementDelta: number): Pill {
  if (engagementDelta > 0.75) return "viral-post";
  if (signalType === "price_change") return "pricing";
  if (signalType === "launch" || signalType === "menu_change") return "new-product";
  return "promo";
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      const res = await fetch(`/api/analytics?businessId=${sess.businessId}`);
      if (!res.ok) {
        setError(`Analytics fetch failed (${res.status})`);
        return;
      }
      const j = (await res.json()) as AnalyticsResponse;
      if (!cancelled) setData(j);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  // Combine each competitor's weekly engagement into one chart payload keyed by weekStart.
  const engagementChart = useMemo(() => {
    if (!data) return { rows: [], names: [] as string[] };
    const byWeek = new Map<string, Record<string, number | string>>();
    for (const c of data.engagement) {
      for (const w of c.weeks) {
        const row = byWeek.get(w.weekStart) ?? { weekStart: w.weekStart };
        row[c.competitorName] = w.avgLikes;
        byWeek.set(w.weekStart, row);
      }
    }
    const rows = [...byWeek.values()].sort((a, b) =>
      (a.weekStart as string) < (b.weekStart as string) ? -1 : 1,
    );
    return { rows, names: data.engagement.map((c) => c.competitorName) };
  }, [data]);

  const postsChart = useMemo(() => {
    if (!data) return { rows: [], names: [] as string[] };
    const byWeek = new Map<string, Record<string, number | string>>();
    for (const c of data.postsPerWeek) {
      for (const w of c.weeks) {
        const row = byWeek.get(w.weekStart) ?? { weekStart: w.weekStart };
        row[c.competitorName] = w.count;
        byWeek.set(w.weekStart, row);
      }
    }
    const rows = [...byWeek.values()].sort((a, b) =>
      (a.weekStart as string) < (b.weekStart as string) ? -1 : 1,
    );
    return { rows, names: data.postsPerWeek.map((c) => c.competitorName) };
  }, [data]);

  if (error) {
    return (
      <main style={{ padding: 32 }}>
        <p style={{ color: "#c00" }}>{error}</p>
      </main>
    );
  }
  if (!data || !business) {
    return (
      <main style={{ padding: 32 }}>
        <p>Loading…</p>
      </main>
    );
  }

  // Top 5 competitors used for charts so things stay readable.
  const focusNames = data.topMovers.slice(0, 5).map((m) => m.competitorName);

  return (
    <main style={{ padding: 32, maxWidth: 1100, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>{business.name}</h1>
        <p style={{ color: "#666", marginTop: 4 }}>
          {business.location?.suburb}, {business.location?.city} · {business.businessType ?? business.niche}
        </p>
      </header>

      <section style={{ marginBottom: 40 }}>
        <h2 style={sectionTitle}>What competitors are running right now</h2>
        <p style={{ color: "#666", marginTop: 0 }}>
          Initiatives you may want to react to — promos, new products, pricing moves, and viral posts.
        </p>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {data.initiatives.slice(0, 12).map((s) => {
            const pill = pillFor(s.signalType, s.engagementDelta);
            const style = PILL_STYLE[pill];
            return (
              <div key={s.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <strong style={{ fontSize: 14 }}>{s.competitorName}</strong>
                  <span
                    style={{
                      background: style.bg,
                      color: style.fg,
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    {style.label}
                  </span>
                </div>
                <p style={{ margin: "8px 0 6px", fontSize: 14, fontWeight: 500 }}>{s.summary}</p>
                <blockquote
                  style={{
                    margin: 0,
                    padding: "6px 10px",
                    borderLeft: "3px solid #ddd",
                    color: "#555",
                    fontSize: 13,
                    fontStyle: "italic",
                  }}
                >
                  "{s.evidenceQuote}"
                </blockquote>
                <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
                  Engagement {s.engagementDelta >= 0 ? "+" : ""}
                  {Math.round(s.engagementDelta * 100)}% vs baseline
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={sectionTitle}>Engagement over the last 12 weeks</h2>
        <p style={{ color: "#666", marginTop: 0 }}>Average likes per post, top 5 movers.</p>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={engagementChart.rows} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="weekStart" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {focusNames.map((name, i) => (
                <Line
                  key={name}
                  dataKey={name}
                  type="monotone"
                  stroke={COLORS[i % COLORS.length]}
                  dot={false}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={sectionTitle}>Posts per week</h2>
        <p style={{ color: "#666", marginTop: 0 }}>How active each competitor has been.</p>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={postsChart.rows} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="weekStart" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {focusNames.map((name, i) => (
                <Bar key={name} dataKey={name} fill={COLORS[i % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h2 style={sectionTitle}>Top movers</h2>
        <p style={{ color: "#666", marginTop: 0 }}>
          Competitors with the biggest recent jump in engagement.
        </p>
        <ol style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
          {data.topMovers.map((m, i) => (
            <li
              key={m.competitorId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: i % 2 ? "#fafafa" : "white",
                borderRadius: 8,
              }}
            >
              <span>
                <span style={{ color: "#999", marginRight: 8 }}>#{i + 1}</span>
                {m.competitorName}
              </span>
              <span
                style={{
                  fontWeight: 600,
                  color: m.engagementDeltaPct >= 0 ? "#0a7a3b" : "#b00020",
                }}
              >
                {m.engagementDeltaPct >= 0 ? "+" : ""}
                {m.engagementDeltaPct}%
              </span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

const sectionTitle: React.CSSProperties = { fontSize: 18, margin: "0 0 4px" };

const cardStyle: React.CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 14,
  background: "white",
};

const COLORS = ["#1F4FBF", "#B5530B", "#0A7A3B", "#A2196F", "#5B21B6"];

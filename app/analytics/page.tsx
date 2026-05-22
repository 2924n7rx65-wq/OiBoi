"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsResponse, Business, Competitor, Post, Signal, SignalType } from "@/lib/types";
import { recommendationFor, strengthsFor } from "@/lib/recommendations";
import { TopNav } from "@/components/TopNav";
import {
  IconArrowRight,
  IconBolt,
  IconClose,
  IconRadar,
  IconSparkle,
} from "@/components/Icons";

type Pill = "promo" | "new-product" | "viral-post" | "pricing";

const PILL_STYLE: Record<Pill, { label: string; bg: string; fg: string }> = {
  promo: { label: "Promo", bg: "#FBE7DE", fg: "#B5530B" },
  "new-product": { label: "New product", bg: "#E8EFE9", fg: "#2D5A41" },
  "viral-post": { label: "Viral post", bg: "#F4E2EA", fg: "#A2196F" },
  pricing: { label: "Pricing", bg: "#EAE6F3", fg: "#5B21B6" },
};

function pillFor(signalType: SignalType, engagementDelta: number): Pill {
  if (engagementDelta > 0.75) return "viral-post";
  if (signalType === "price_change") return "pricing";
  if (signalType === "launch" || signalType === "menu_change") return "new-product";
  return "promo";
}

const FILTERS: { id: "all" | Pill; label: string }[] = [
  { id: "all", label: "All signals" },
  { id: "promo", label: "Promo" },
  { id: "new-product", label: "New product" },
  { id: "viral-post", label: "Viral" },
  { id: "pricing", label: "Pricing" },
];

export default function AnalyticsPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<(Signal & { competitorName: string }) | null>(null);
  const [postCache, setPostCache] = useState<Record<string, Post>>({});
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [competitors, setCompetitors] = useState<Competitor[]>([]);

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
      const [analyticsRes, competitorsRes] = await Promise.all([
        fetch(`/api/analytics?businessId=${sess.businessId}`),
        fetch(`/api/competitors?businessId=${sess.businessId}`),
      ]);
      if (!analyticsRes.ok) {
        setError(`Analytics fetch failed (${analyticsRes.status})`);
        return;
      }
      const j = (await analyticsRes.json()) as AnalyticsResponse;
      const competitorsJson = (await competitorsRes.json()) as {
        local: Competitor[];
        inspiration: Competitor[];
      };
      if (!cancelled) {
        setData(j);
        setCompetitors([...competitorsJson.local, ...competitorsJson.inspiration]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function openSignal(s: Signal & { competitorName: string }) {
    setSelected(s);
    if (postCache[s.postId]) return;
    const res = await fetch(`/api/competitors/${s.competitorId}`);
    if (!res.ok) return;
    const j = (await res.json()) as { posts: Post[] };
    const post = j.posts.find((p) => p.id === s.postId);
    if (post) setPostCache((c) => ({ ...c, [s.postId]: post }));
  }

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data.initiatives;
    return data.initiatives.filter((s) => pillFor(s.signalType, s.engagementDelta) === filter);
  }, [data, filter]);

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

  // Total market-wide posting volume per week — one series, more legible than
  // ten near-identical per-competitor bars.
  const volumeChart = useMemo(() => {
    if (!data) return [] as { weekStart: string; count: number }[];
    const byWeek = new Map<string, number>();
    for (const c of data.postsPerWeek) {
      for (const w of c.weeks) {
        byWeek.set(w.weekStart, (byWeek.get(w.weekStart) ?? 0) + w.count);
      }
    }
    return [...byWeek.entries()]
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([weekStart, count]) => ({ weekStart, count }));
  }, [data]);

  const peakWeek = useMemo(
    () => volumeChart.reduce((m, r) => (r.count > m.count ? r : m), { weekStart: "", count: 0 }),
    [volumeChart],
  );

  if (error) {
    return (
      <>
        <TopNav variant="app" />
        <main className="container" style={{ padding: 48 }}>
          <p style={{ color: "var(--orange)" }}>{error}</p>
        </main>
      </>
    );
  }
  if (!data || !business) {
    return (
      <>
        <TopNav variant="app" />
        <main className="container" style={{ padding: 48 }}>
          <p style={{ color: "var(--ink-soft)" }}>Loading your intelligence hub…</p>
        </main>
      </>
    );
  }

  const focusNames = data.topMovers.slice(0, 5).map((m) => m.competitorName);
  const totalSignals = data.initiatives.length;
  const viralCount = data.initiatives.filter((s) => s.engagementDelta > 0.75).length;

  return (
    <>
      <TopNav variant="app" />

      <main className="container" style={{ padding: "40px 28px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
          <div>
            <p className="eyebrow">Overview · {business.location?.suburb ?? "—"}</p>
            <h1 style={{ marginTop: 8, fontSize: 44 }}>
              Intelligence <span className="italic-accent">Hub</span>
            </h1>
            <p style={{ color: "var(--ink-soft)", marginTop: 6 }}>
              What the shops on your block are doing this week.{" "}
              <strong style={{ color: "var(--ink)" }}>{business.name}</strong> ·{" "}
              {business.businessType ?? business.niche}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" onClick={() => alert("Demo: this would email a fresh PDF digest")}>
              New report
            </button>
          </div>
        </div>

        {/* Top stat row */}
        <div className="grid-4" style={{ marginTop: 28 }}>
          <BigStat label="Signals this week" value={String(totalSignals)} />
          <BigStat label="Viral posts" value={String(viralCount)} accent />
          <BigStat
            label="Top mover"
            value={data.topMovers[0]?.competitorName ?? "—"}
            sub={data.topMovers[0] ? `+${data.topMovers[0].engagementDeltaPct}% engagement` : ""}
            small
          />
          <BigStat label="Competitors tracked" value="10" />
        </div>

        {/* Main two-column layout: feed + side panel */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 24, marginTop: 32 }}>
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h2 style={{ fontSize: 22 }}>Real-time feed</h2>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      border: "1px solid var(--rule)",
                      background: filter === f.id ? "var(--ink)" : "var(--paper)",
                      color: filter === f.id ? "var(--paper)" : "var(--ink-soft)",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {filtered.slice(0, 12).map((s) => (
                <FeedCard key={s.id} signal={s} onOpen={() => openSignal(s)} />
              ))}
              {filtered.length === 0 && (
                <div className="card" style={{ textAlign: "center", padding: 32, color: "var(--ink-soft)" }}>
                  No signals match this filter yet.
                </div>
              )}
            </div>
          </section>

          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <CompetitorRadar
              competitors={competitors.filter((c) => c.tier === "local")}
              topMovers={data.topMovers}
              initiatives={data.initiatives}
            />
            <WeeklySummary
              totalSignals={totalSignals}
              viralCount={viralCount}
              suburb={business.location?.suburb ?? "your block"}
            />
            <TopMoversCard topMovers={data.topMovers} />
          </aside>
        </div>

        {/* Charts */}
        <section style={{ marginTop: 48 }}>
          <div style={{ marginBottom: 14 }}>
            <p className="eyebrow">Trends</p>
            <h2 style={{ marginTop: 6, fontSize: 22 }}>The last 12 weeks at a glance</h2>
          </div>

          <div className="grid-2">
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <strong>Engagement (avg likes)</strong>
                <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>Top 5 movers</span>
              </div>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={engagementChart.rows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EFEDE5" />
                    <XAxis dataKey="weekStart" fontSize={10} stroke="#5A6660" />
                    <YAxis fontSize={10} stroke="#5A6660" />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
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
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <strong>Market posting volume</strong>
                <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                  Posts across all competitors · peak week highlighted
                </span>
              </div>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={volumeChart} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EFEDE5" vertical={false} />
                    <XAxis dataKey="weekStart" fontSize={10} stroke="#5A6660" />
                    <YAxis fontSize={10} stroke="#5A6660" />
                    <Tooltip cursor={{ fill: "rgba(45, 90, 65, 0.06)" }} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {volumeChart.map((row) => (
                        <Cell
                          key={row.weekStart}
                          fill={row.weekStart === peakWeek.weekStart ? "#D95D39" : "#2D5A41"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                  fontSize: 12,
                  color: "var(--ink-soft)",
                }}
              >
                <span>
                  Peak week:{" "}
                  <strong style={{ color: "var(--orange)" }}>
                    {peakWeek.weekStart || "—"}
                  </strong>{" "}
                  with {peakWeek.count} posts
                </span>
                <span>Avg ≈ {Math.round(volumeChart.reduce((a, r) => a + r.count, 0) / Math.max(1, volumeChart.length))}/wk</span>
              </div>
            </div>
          </div>
        </section>

        <RecommendedActions
          initiatives={data.initiatives}
          onOpen={openSignal}
        />
      </main>

      {selected && (
        <SignalDetail
          signal={selected}
          post={postCache[selected.postId] ?? null}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

const COLORS = ["#2D5A41", "#D95D39", "#5B21B6", "#A2196F", "#1F4FBF"];

function BigStat({
  label,
  value,
  sub,
  accent,
  small,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className="card"
      style={{
        padding: 20,
        background: accent ? "var(--green)" : "var(--paper)",
        color: accent ? "var(--paper)" : "var(--ink)",
        borderColor: accent ? "var(--green-deep)" : "var(--rule)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: small ? 22 : 38,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: accent ? "#C7D8CB" : "var(--ink-soft)", marginTop: 4 }}>{sub}</div>
      )}
      <div
        className="eyebrow"
        style={{ marginTop: 10, color: accent ? "#C7D8CB" : "var(--ink-soft)" }}
      >
        {label}
      </div>
    </div>
  );
}

function FeedCard({
  signal,
  onOpen,
}: {
  signal: Signal & { competitorName: string };
  onOpen: () => void;
}) {
  const pill = pillFor(signal.signalType, signal.engagementDelta);
  const style = PILL_STYLE[pill];
  const when = formatWhen(signal.postedAt);
  return (
    <button
      onClick={onOpen}
      className="card"
      style={{
        textAlign: "left",
        cursor: "pointer",
        padding: 18,
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: 14,
        alignItems: "flex-start",
        borderLeft: `3px solid ${style.fg}`,
      }}
    >
      <span
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: style.bg,
          color: style.fg,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconBolt width={20} height={20} />
      </span>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <strong style={{ fontSize: 15 }}>{signal.competitorName}</strong>
          <span className="pill" style={{ background: style.bg, color: style.fg }}>
            {style.label}
          </span>
        </div>
        <p style={{ margin: "6px 0 8px", fontSize: 14 }}>{signal.summary}</p>
        <p style={{ margin: 0, fontSize: 13, color: "var(--ink-soft)", fontStyle: "italic" }}>
          "{signal.evidenceQuote}"
        </p>
      </div>
      <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{when}</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: signal.engagementDelta >= 0 ? "var(--green)" : "var(--orange)",
          }}
        >
          {signal.engagementDelta >= 0 ? "+" : ""}
          {Math.round(signal.engagementDelta * 100)}%
        </span>
      </div>
    </button>
  );
}

function CompetitorRadar({
  initiatives,
}: {
  competitors: Competitor[];
  topMovers: AnalyticsResponse["topMovers"];
  initiatives: (Signal & { competitorName: string })[];
}) {
  // Bubble chart: 4 columns, one per signal-pill type. Each bubble is a
  // single initiative — Y = engagement vs baseline, size = importance.
  // Reads at a glance as "what kind of moves are landing this week".
  const [hovered, setHovered] = useState<string | null>(null);

  const COLS: Pill[] = ["promo", "new-product", "viral-post", "pricing"];
  const W = 280;
  const H = 220;
  const PAD_T = 18;
  const PAD_B = 36;
  const PAD_L = 30;
  const PAD_R = 8;
  const chartH = H - PAD_T - PAD_B;
  const colW = (W - PAD_L - PAD_R) / COLS.length;

  const positive = initiatives.filter((s) => s.engagementDelta >= 0);
  const maxDelta = Math.max(0.6, ...positive.map((s) => s.engagementDelta));
  const tickValues = [0, 0.5, 1].map((t) => Math.round(t * maxDelta * 100));

  const bubbles = positive.map((s) => {
    const pill = pillFor(s.signalType, s.engagementDelta);
    const colIdx = COLS.indexOf(pill);
    // deterministic horizontal jitter inside the column
    const hash = Array.from(s.id).reduce((a, ch) => a + ch.charCodeAt(0), 0);
    const jitter = ((hash % 1000) / 1000) * (colW - 18) + 9;
    const cx = PAD_L + colIdx * colW + jitter;
    const cy = PAD_T + (1 - s.engagementDelta / maxDelta) * chartH;
    const r = 5 + s.importance * 8;
    return { s, pill, cx, cy, r };
  });

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ marginBottom: 6 }}>
        <strong style={{ fontSize: 14 }}>What's working in your market</strong>
        <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 2 }}>
          Each bubble is a competitor move · size = importance · height = engagement
        </div>
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="What's working bubble chart">
        {/* Column backgrounds */}
        {COLS.map((p, i) => (
          <rect
            key={p}
            x={PAD_L + i * colW}
            y={PAD_T - 6}
            width={colW}
            height={chartH + 6}
            fill={i % 2 === 0 ? "var(--cream)" : "transparent"}
            opacity={0.6}
          />
        ))}

        {/* Y axis ticks */}
        {[0, 0.5, 1].map((t, i) => {
          const y = PAD_T + (1 - t) * chartH;
          return (
            <g key={t}>
              <line x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke="var(--rule)" strokeWidth={0.5} />
              <text x={PAD_L - 4} y={y + 3} fontSize={9} fill="var(--ink-soft)" textAnchor="end">
                +{tickValues[i]}%
              </text>
            </g>
          );
        })}

        {/* Bubbles — sorted so smaller draw on top */}
        {[...bubbles]
          .sort((a, b) => b.r - a.r)
          .map((b) => {
            const isHot = b.s.engagementDelta > 1;
            const color = PILL_STYLE[b.pill].fg;
            return (
              <g
                key={b.s.id}
                onMouseEnter={() => setHovered(b.s.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                {isHot && <circle cx={b.cx} cy={b.cy} r={b.r + 6} fill={color} opacity={0.1} />}
                <circle
                  cx={b.cx}
                  cy={b.cy}
                  r={b.r}
                  fill={color}
                  fillOpacity={hovered === b.s.id ? 1 : 0.7}
                  stroke={color}
                  strokeWidth={hovered === b.s.id ? 2 : 0}
                />
              </g>
            );
          })}

        {/* X axis column labels */}
        {COLS.map((p, i) => {
          const style = PILL_STYLE[p];
          return (
            <g key={`label-${p}`}>
              <rect
                x={PAD_L + i * colW + colW / 2 - 26}
                y={H - PAD_B + 8}
                width={52}
                height={18}
                rx={9}
                fill={style.bg}
              />
              <text
                x={PAD_L + i * colW + colW / 2}
                y={H - PAD_B + 20}
                fontSize={9.5}
                fontWeight={600}
                fill={style.fg}
                textAnchor="middle"
              >
                {style.label}
              </text>
            </g>
          );
        })}

        {/* Hover tooltip */}
        {hovered &&
          (() => {
            const b = bubbles.find((x) => x.s.id === hovered);
            if (!b) return null;
            const label = `${b.s.competitorName} · +${Math.round(b.s.engagementDelta * 100)}%`;
            const w = label.length * 5.4 + 14;
            const tx = Math.min(W - w - 4, Math.max(4, b.cx - w / 2));
            const ty = Math.max(2, b.cy - b.r - 22);
            return (
              <g pointerEvents="none">
                <rect x={tx} y={ty} width={w} height={18} rx={4} fill="var(--ink)" />
                <text x={tx + 7} y={ty + 12} fontSize={9.5} fill="var(--paper)">
                  {label}
                </text>
              </g>
            );
          })()}
      </svg>

      {/* Per-column summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 6,
          marginTop: 6,
          fontSize: 10,
          color: "var(--ink-soft)",
        }}
      >
        {COLS.map((p) => {
          const count = bubbles.filter((b) => b.pill === p).length;
          return (
            <span key={p} style={{ textAlign: "center" }}>
              {count} {count === 1 ? "move" : "moves"}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function WeeklySummary({
  totalSignals,
  viralCount,
  suburb,
}: {
  totalSignals: number;
  viralCount: number;
  suburb: string;
}) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <strong style={{ fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <IconSparkle width={14} height={14} style={{ color: "var(--green)" }} /> Weekly summary
        </strong>
      </div>
      <SummaryRow label="Total signals" value={String(totalSignals)} />
      <SummaryRow label="Market volatility" value="Elevated" valueColor="var(--orange)" />
      <SummaryRow label="Viral candidates" value={String(viralCount)} />
      <p
        style={{
          margin: "12px 0 0",
          fontSize: 12,
          color: "var(--ink-soft)",
          padding: 10,
          background: "var(--cream)",
          borderRadius: 10,
          fontStyle: "italic",
        }}
      >
        Promo activity in {suburb} is up materially this week. Worth reviewing your member
        pricing and any standing weekly deals before the weekend.
      </p>
    </div>
  );
}

function SummaryRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid var(--rule-soft)",
        fontSize: 13,
      }}
    >
      <span style={{ color: "var(--ink-soft)" }}>{label}</span>
      <span style={{ fontWeight: 600, color: valueColor ?? "var(--ink)" }}>{value}</span>
    </div>
  );
}

function TopMoversCard({ topMovers }: { topMovers: AnalyticsResponse["topMovers"] }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <strong style={{ fontSize: 14 }}>Top movers</strong>
        <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>Last 3 posts vs baseline</span>
      </div>
      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {topMovers.slice(0, 6).map((m, i) => (
          <li
            key={m.competitorId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: i < 5 ? "1px solid var(--rule-soft)" : "none",
              fontSize: 13,
            }}
          >
            <span style={{ color: "var(--ink)" }}>
              <span style={{ color: "var(--ink-soft)", marginRight: 6 }}>#{i + 1}</span>
              {m.competitorName}
            </span>
            <span
              style={{
                fontWeight: 600,
                color: m.engagementDeltaPct >= 0 ? "var(--green)" : "var(--orange)",
              }}
            >
              {m.engagementDeltaPct >= 0 ? "+" : ""}
              {m.engagementDeltaPct}%
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function RecommendedActions({
  initiatives,
  onOpen,
}: {
  initiatives: (Signal & { competitorName: string })[];
  onOpen: (s: Signal & { competitorName: string }) => void;
}) {
  // Sort by importance + engagement, take top 3
  const ranked = [...initiatives]
    .sort((a, b) => b.importance + b.engagementDelta - (a.importance + a.engagementDelta))
    .slice(0, 3);

  if (ranked.length === 0) return null;

  return (
    <section
      style={{
        marginTop: 48,
        background: "var(--green-deep)",
        color: "var(--paper)",
        borderRadius: 22,
        padding: "32px 32px 28px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none" }}>
        <DecorPattern />
      </div>

      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22, gap: 16, flexWrap: "wrap" }}>
          <div>
            <p className="eyebrow" style={{ color: "#9ABFA6" }}>This week</p>
            <h2 style={{ marginTop: 6, fontSize: 28, color: "var(--paper)" }}>
              Recommended <span className="italic-accent" style={{ color: "#D9C589" }}>actions</span>
            </h2>
            <p style={{ color: "#C7D8CB", marginTop: 6, fontSize: 14, maxWidth: 540 }}>
              Three moves your block is making that deserve a response. Click any card for the
              full playbook.
            </p>
          </div>
        </div>

        <div className="grid-3">
          {ranked.map((s, i) => {
            const priority = i === 0 ? "Urgent" : i === 1 ? "High" : "Medium";
            const priorityColor = i === 0 ? "var(--orange)" : i === 1 ? "#D9C589" : "#9ABFA6";
            const pill = pillFor(s.signalType, s.engagementDelta);
            return (
              <button
                key={s.id}
                onClick={() => onOpen(s)}
                style={{
                  textAlign: "left",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 16,
                  padding: 18,
                  color: "var(--paper)",
                  cursor: "pointer",
                  display: "grid",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: priorityColor,
                      color: "var(--green-deep)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconBolt width={16} height={16} />
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: priorityColor }}>
                    Priority · {priority}
                  </span>
                </div>
                <strong style={{ fontSize: 15, lineHeight: 1.3 }}>{s.summary}</strong>
                <span style={{ fontSize: 12, color: "#C7D8CB" }}>
                  {s.competitorName} · {PILL_STYLE[pill].label}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--paper)" }}>
                  Open playbook <IconArrowRight width={14} height={14} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DecorPattern() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.2" fill="#F4F1EA" />
        </pattern>
      </defs>
      <rect width="800" height="300" fill="url(#dots)" />
    </svg>
  );
}

function formatWhen(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const hours = (now - then) / 36e5;
  if (hours < 24) return `${Math.max(1, Math.round(hours))}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

function SignalDetail({
  signal,
  post,
  onClose,
}: {
  signal: Signal & { competitorName: string };
  post: Post | null;
  onClose: () => void;
}) {
  const pill = pillFor(signal.signalType, signal.engagementDelta);
  const style = PILL_STYLE[pill];
  const rec = recommendationFor(signal);
  const strengths = strengthsFor(signal);
  const postedAt = new Date(signal.postedAt).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26, 31, 27, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 70,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--paper)",
          maxWidth: 720,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: 20,
          padding: 28,
          boxShadow: "0 30px 80px rgba(26, 31, 27, 0.35)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <span className="eyebrow">{signal.competitorName} · {postedAt}</span>
            <h2 style={{ marginTop: 6, fontSize: 26 }}>{signal.summary}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "1px solid var(--rule)",
              background: "var(--paper)",
              borderRadius: 8,
              padding: 6,
              cursor: "pointer",
              color: "var(--ink-soft)",
            }}
          >
            <IconClose width={16} height={16} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
          <span className="pill" style={{ background: style.bg, color: style.fg }}>
            {style.label}
          </span>
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
            Engagement {signal.engagementDelta >= 0 ? "+" : ""}
            {Math.round(signal.engagementDelta * 100)}% vs baseline · confidence{" "}
            {Math.round(signal.confidence * 100)}%
          </span>
        </div>

        {post && (
          <div
            style={{
              marginTop: 22,
              display: "grid",
              gap: 14,
              gridTemplateColumns: "140px 1fr",
              padding: 14,
              background: "var(--cream)",
              borderRadius: 14,
            }}
          >
            <a href={post.mediaUrl} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.mediaUrl}
                alt=""
                style={{ width: 140, height: 140, borderRadius: 12, objectFit: "cover", display: "block" }}
              />
            </a>
            <div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{post.caption}</p>
              <p style={{ marginTop: 8, fontSize: 12, color: "var(--ink-soft)" }}>
                {post.likeCount.toLocaleString()} likes · {post.commentCount.toLocaleString()} comments ·{" "}
                <a href={post.mediaUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)" }}>
                  view original post →
                </a>
              </p>
            </div>
          </div>
        )}

        <section style={{ marginTop: 22 }}>
          <h3 style={{ fontSize: 16 }}>What they're doing well</h3>
          <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--ink)" }}>{strengths}</p>
          <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "var(--ink)" }}>{rec.doingWell}</p>
        </section>

        <section style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 16 }}>How to counter</h3>
          <ul style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 14, lineHeight: 1.6 }}>
            {rec.undercut.map((line, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {line}
              </li>
            ))}
          </ul>
        </section>

        <p style={{ marginTop: 22, fontSize: 11, color: "var(--ink-soft)" }}>
          Recommendations are template-based heuristics for the MVP. A production version would use
          an LLM grounded on your business context.
        </p>
      </div>
    </div>
  );
}

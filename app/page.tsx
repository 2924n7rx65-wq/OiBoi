"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useTransform, useMotionValue } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Logo } from "@/components/Logo";
import { TopNav } from "@/components/TopNav";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import {
  IconArrowRight,
  IconBag,
  IconBolt,
  IconCalendar,
  IconChart,
  IconCoin,
  IconCup,
  IconDumbbell,
  IconFork,
  IconHash,
  IconHeart,
  IconMegaphone,
  IconRadar,
  IconSparkle,
  IconTag,
} from "@/components/Icons";

export default function HeroHome() {
  return (
    <>
      {/* Hero wrapper — full viewport, distinct background */}
      <div
        style={{
          position: "relative",
          background: "var(--cream)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Full-width background: dot grid + green radial glow ── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {/* Dot grid */}
          <svg
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0 }}
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern
                id="heroDots"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1.5" cy="1.5" r="1.5" fill="var(--green)" opacity="0.10" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heroDots)" />
          </svg>
          {/* Radial fade: clear in center (behind text), tinted at edges */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 72% 60% at 50% 42%, var(--cream) 35%, transparent 100%)",
            }}
          />
          {/* Ambient green glow — drifts slowly */}
          <div
            style={{
              position: "absolute",
              width: 700,
              height: 460,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(45,90,65,0.1) 0%, transparent 68%)",
              top: "12%",
              left: "50%",
              transform: "translateX(-50%)",
              animation: "ambientDrift 14s ease-in-out infinite",
            }}
          />
        </div>

        <TopNav variant="marketing" />

        <section
          className="container"
          style={{
            position: "relative",
            paddingTop: 80,
            paddingBottom: 100,
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <HeroIconBackdrop />

          <div
            style={{
              position: "relative",
              textAlign: "center",
              maxWidth: 880,
              margin: "0 auto",
              zIndex: 1,
            }}
          >
            <h1 style={{ marginTop: 0, fontSize: "clamp(48px, 8vw, 88px)" }}>
              Own <span className="italic-accent">Your Market.</span>
            </h1>
            <p
              style={{
                marginTop: 24,
                fontSize: 21,
                lineHeight: 1.55,
                color: "var(--ink-soft)",
                maxWidth: 640,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Leapfrog watches the shops on your block. Promos, pricing moves,
              viral posts. Surfaced the morning they go live, with plain-English
              suggestions on how to stay one step ahead.
            </p>

            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                marginTop: 40,
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/home"
                className="btn btn-primary"
                style={{ fontSize: 17, padding: "16px 30px", borderRadius: 12 }}
              >
                Start free trial <IconArrowRight width={16} height={16} />
              </Link>
              <Link
                href="/onboarding"
                className="btn btn-secondary"
                style={{ fontSize: 17, padding: "16px 30px", borderRadius: 12 }}
              >
                Set up my business
              </Link>
            </div>
          </div>
        </section>
      </div>

      <DashboardScrollSection />
      <WhyLeapfrog />
      <Industries />
      <HowItWorks />
      <Footer />
    </>
  );
}

/* ─── Hero backdrop ─────────────────────────────────────────────────────────── */

function HeroIconBackdrop() {
  const items = [
    { left: "4%",  top: 8,   icon: <IconChart width={42} height={42} />,     rot: -6,  tone: "soft" },
    { left: "14%", top: 120, icon: <IconCalendar width={36} height={36} />,  rot: 5,   tone: "softer" },
    { left: "8%",  top: 230, icon: <IconHeart width={34} height={34} />,     rot: -10, tone: "soft" },
    { left: "22%", top: 24,  icon: <IconHash width={30} height={30} />,      rot: 8,   tone: "softer" },
    { left: "44%", top: -6,  icon: <IconSparkle width={30} height={30} />,   rot: 0,   tone: "soft" },
    { left: "70%", top: 14,  icon: <IconMegaphone width={38} height={38} />, rot: -8,  tone: "softer" },
    { left: "82%", top: 100, icon: <IconTag width={36} height={36} />,       rot: 6,   tone: "soft" },
    { left: "90%", top: 230, icon: <IconCoin width={34} height={34} />,      rot: -4,  tone: "softer" },
    { left: "78%", top: 250, icon: <IconBolt width={28} height={28} />,      rot: 12,  tone: "soft" },
    { left: "30%", top: 220, icon: <IconRadar width={36} height={36} />,     rot: -3,  tone: "softer" },
  ];
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {items.map((it, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: it.left,
            top: it.top,
            transform: `rotate(${it.rot}deg)`,
            color: it.tone === "soft" ? "#7F9F87" : "#9AAA90",
            animation: "breathe 4s ease-in-out infinite alternate",
            animationDelay: `${(i * 2.4 / (items.length - 1)).toFixed(2)}s`,
          }}
        >
          {it.icon}
        </span>
      ))}
    </div>
  );
}

/* ─── Side Annotation ───────────────────────────────────────────────────────── */

function SideAnnotation({
  label,
  body,
  side,
}: {
  label: string;
  body: string;
  side: "left" | "right";
}) {
  return (
    <div>
      <div
        style={{
          textAlign: side === "right" ? "right" : "left",
          marginBottom: 12,
          // Fixed block height so the arrow sits at the same y on all three
          // annotations regardless of how their body text wraps.
          minHeight: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 18,
            fontWeight: 500,
            color: "var(--ink)",
            lineHeight: 1.1,
            marginBottom: 5,
          }}
        >
          {label}
        </div>
        <p
          style={{
            fontSize: 11,
            color: "var(--ink-soft)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {body}
        </p>
      </div>

      {/* Connector line + arrowhead — SVG so the head sits flush with the line */}
      <ConnectorArrow side={side} />
    </div>
  );
}

function ConnectorArrow({ side }: { side: "left" | "right" }) {
  // 16px tall SVG with a 1.5px line + crisp triangle. Single element keeps
  // the line and head perfectly aligned regardless of font metrics.
  const arrow = side === "left" ? (
    <svg
      width="100%"
      height="10"
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      style={{ display: "block", opacity: 0.85 }}
      aria-hidden
    >
      <defs>
        <linearGradient id="connL" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#2D5A41" stopOpacity="0" />
          <stop offset="100%" stopColor="#2D5A41" stopOpacity="1" />
        </linearGradient>
      </defs>
      <line x1="0" y1="5" x2="94" y2="5" stroke="url(#connL)" strokeWidth="1.5" />
      <polygon points="100,5 92,1 92,9" fill="#2D5A41" />
    </svg>
  ) : (
    <svg
      width="100%"
      height="10"
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      style={{ display: "block", opacity: 0.85 }}
      aria-hidden
    >
      <defs>
        <linearGradient id="connR" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#2D5A41" stopOpacity="1" />
          <stop offset="100%" stopColor="#2D5A41" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points="0,5 8,1 8,9" fill="#2D5A41" />
      <line x1="6" y1="5" x2="100" y2="5" stroke="url(#connR)" strokeWidth="1.5" />
    </svg>
  );
  return <div style={{ width: "100%" }}>{arrow}</div>;
}

/* ─── Dashboard Scroll Section ──────────────────────────────────────────────── */

function DashboardScrollSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Manual scroll → MotionValue.
  // This is more reliable than useScroll({ target }) across all Framer Motion versions.
  // Formula matches "start end / end start" — 0 when section enters, 1 when it exits.
  const progressMV = useMotionValue(0);
  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      progressMV.set(Math.max(0, Math.min(1, (vh - rect.top) / (rect.height + vh))));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [progressMV]);

  // Annotations never translate — they sit pinned (sticky) exactly where their arrows
  // point at the card, and simply SNAP on (a fast fade over a tiny scroll window) once
  // the card is locked flat. The clamp keeps opacity at 1 afterwards, so they never move.
  const annotationOpacity = useTransform(progressMV, [0.36, 0.40], [0, 1], { clamp: true });

  return (
    <div ref={wrapperRef} style={{ background: "var(--paper)" }}>
      <div className="dashboard-scroll-grid">

        {/* Left col — annotation lives in normal flow so it travels with the
            dashboard card as the section scrolls up the page. */}
        <div className="annotation-col">
          <div
            style={{
              height: "100%",
              padding: "0 8px 0 16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <motion.div style={{ opacity: annotationOpacity }}>
              <SideAnnotation
                label="Rival Feed"
                body="Every competitor post, classified live."
                side="left"
              />
            </motion.div>
          </div>
        </div>

        {/* Center: the scroll + card */}
        <ContainerScroll
          titleComponent={
            <h2
              style={{
                fontSize: "clamp(26px, 3.6vw, 46px)",
                maxWidth: 620,
                margin: "0 auto",
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
              }}
            >
              See every move your rivals make.
              <br />
              <span className="italic-accent">
                Before your customers notice.
              </span>
            </h2>
          }
        >
          <LiveDashboard />
        </ContainerScroll>

        {/* Right col — both annotations centered with the card and traveling
            with it as the section scrolls up. */}
        <div className="annotation-col">
          <div
            style={{
              height: "100%",
              padding: "0 16px 0 8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 90,
            }}
          >
            <motion.div style={{ opacity: annotationOpacity }}>
              <SideAnnotation
                label="Analytics"
                body="Spot when rivals go quiet. That is your window."
                side="right"
              />
            </motion.div>
            <motion.div style={{ opacity: annotationOpacity }}>
              <SideAnnotation
                label="Weekly Edge"
                body="One clear action for your block."
                side="right"
              />
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Live Dashboard ─────────────────────────────────────────────────────────── */

const activityPool = [
  { name: "Grill'd Fortitude Valley",   note: "BOGO burger deal, ends Sunday",            pill: "promo" },
  { name: "Blackstar Coffee Newstead",   note: "New seasonal brew menu dropped",            pill: "new-product" },
  { name: "Goodlife Fortitude Valley",   note: "Launched $0 joining fee, locked $19/wk",   pill: "promo" },
  { name: "Nandos South Bank",           note: "Loyalty points doubled this week",          pill: "promo" },
  { name: "Single O Newstead",           note: "Loyalty punch card, 10th coffee free",      pill: "new-product" },
  { name: "Burger Project",              note: "Price drop on all lunch specials",           pill: "price-move" },
  { name: "August Restaurant",           note: "Wine pairing dinner Sat, $145pp",           pill: "promo" },
  { name: "Veneziano Coffee",            note: "Barista masterclass, Friday evening",        pill: "new-product" },
];

const rivalActivityData = [
  { day: "M", activity: 2, quiet: 4 },
  { day: "T", activity: 6, quiet: 4 },
  { day: "W", activity: 1, quiet: 4 },
  { day: "T", activity: 4, quiet: 4 },
  { day: "F", activity: 8, quiet: 4 },
  { day: "S", activity: 3, quiet: 4 },
  { day: "S", activity: 1, quiet: 4 },
];

type FeedItem = typeof activityPool[number] & { when: string; id: number };

function LiveDashboard() {
  const [feed, setFeed] = useState<FeedItem[]>(() =>
    activityPool.slice(0, 5).map((item, i) => ({
      ...item,
      when: ["Just now", "12m ago", "1h ago", "2h ago", "3h ago"][i],
      id: i,
    }))
  );
  const [newestId, setNewestId] = useState<number | null>(0);
  const poolIdx = useRef(5);

  useEffect(() => {
    const interval = setInterval(() => {
      const idx = poolIdx.current % activityPool.length;
      const id = Date.now();
      setFeed((f) => [
        { ...activityPool[idx], when: "Just now", id },
        ...f.slice(0, 4),
      ]);
      setNewestId(id);
      poolIdx.current += 1;
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "var(--font-body)",
        fontSize: 13,
      }}
    >
      {/* Browser chrome — dots at top-left, URL bar centered */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 14px",
          background: "var(--cream)",
          borderBottom: "1px solid var(--rule)",
          flexShrink: 0,
        }}
      >
        <div className="browser-dots">
          <span />
          <span />
          <span />
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <span
            style={{
              fontSize: 11,
              color: "var(--ink-soft)",
              background: "var(--paper)",
              border: "1px solid var(--rule)",
              borderRadius: 6,
              padding: "2px 16px",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--green)",
                display: "inline-block",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
            leapfrog.app
          </span>
        </div>
        <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>2m ago</span>
      </div>

      {/* Two-column content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40% 60%",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Left: Live feed */}
        <div
          style={{
            borderRight: "1px solid var(--rule)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 14px",
              borderBottom: "1px solid var(--rule)",
              display: "flex",
              alignItems: "center",
              gap: 7,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--green)",
                display: "inline-block",
                animation: "pulse 1.5s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <span style={{ fontWeight: 600, fontSize: 12, color: "var(--ink)" }}>
              Competitor activity
            </span>
            <span
              className="pill pill-green"
              style={{ fontSize: 9, marginLeft: "auto", padding: "3px 8px" }}
            >
              Live
            </span>
          </div>

          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 8,
              overflowY: "hidden",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {feed.map((item) => (
              <li
                key={item.id}
                style={{
                  padding: "9px 11px",
                  borderRadius: 11,
                  border: `1px solid ${
                    item.id === newestId
                      ? "rgba(45,90,65,0.28)"
                      : "var(--rule)"
                  }`,
                  background:
                    item.id === newestId
                      ? "rgba(45,90,65,0.05)"
                      : "var(--paper)",
                  transition: "background 0.4s ease, border-color 0.4s ease",
                  animation:
                    item.id === newestId ? "slideInFeed 0.4s ease" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 12,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "var(--ink)",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--ink-soft)",
                        marginTop: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.note}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span
                      className={`pill ${
                        item.pill === "new-product"
                          ? "pill-orange"
                          : item.pill === "price-move"
                          ? "pill-cream"
                          : "pill-green"
                      }`}
                      style={{ fontSize: 9, padding: "3px 7px" }}
                    >
                      {item.pill === "new-product"
                        ? "New"
                        : item.pill === "price-move"
                        ? "Price"
                        : "Promo"}
                    </span>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--ink-soft)",
                        marginTop: 3,
                      }}
                    >
                      {item.when}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Analytics */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "14px 16px",
            gap: 12,
            overflow: "hidden",
          }}
        >
          {/* Stat badges */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["12 rivals tracked", "3 alerts today", "2.1km radius"].map(
              (s) => (
                <span
                  key={s}
                  className="pill pill-cream"
                  style={{ fontSize: 10 }}
                >
                  {s}
                </span>
              )
            )}
          </div>

          {/* Chart */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <p className="eyebrow" style={{ fontSize: 10, margin: 0 }}>
                Rival activity this week
              </p>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 9,
                    color: "var(--ink-soft)",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 2,
                      background: "var(--green)",
                      display: "inline-block",
                      borderRadius: 1,
                    }}
                  />
                  Activity
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 9,
                    color: "var(--ink-soft)",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 1,
                      background: "var(--orange)",
                      display: "inline-block",
                    }}
                  />
                  Your target
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={88}>
              <AreaChart
                data={rivalActivityData}
                margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
              >
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 9, fill: "var(--ink-soft)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Area
                  type="monotone"
                  dataKey="activity"
                  stroke="var(--green)"
                  fill="var(--green-soft)"
                  strokeWidth={2}
                  dot={false}
                />
                <ReferenceLine
                  y={4}
                  stroke="var(--orange)"
                  strokeDasharray="3 2"
                  strokeWidth={1.5}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--paper)",
                    border: "1px solid var(--rule)",
                    borderRadius: 8,
                    fontSize: 11,
                    padding: "4px 10px",
                  }}
                  labelStyle={{ color: "var(--ink-soft)", fontSize: 9 }}
                  formatter={(value, name) => [
                    `${value ?? 0} moves`,
                    name === "activity" ? "Rival activity" : "Your target",
                  ]}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recommendation card */}
          <div
            style={{
              flex: 1,
              background: "var(--green-soft)",
              borderRadius: 14,
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 7,
              minHeight: 0,
            }}
          >
            <p
              className="eyebrow"
              style={{ color: "var(--green)", fontSize: 10, margin: 0 }}
            >
              Your move this week
            </p>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.3,
                color: "var(--ink)",
              }}
            >
              Friday is your highest-risk window. Match any promo before noon.
            </div>
            <div
              style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.4 }}
            >
              Rivals peak on Tuesday and Friday. Wednesday is your quiet window.
            </div>
            <span
              className="pill pill-green"
              style={{ alignSelf: "flex-start", fontSize: 10, marginTop: 2 }}
            >
              High impact
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Why Leapfrog ───────────────────────────────────────────────────────────── */

function WhyLeapfrog() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
        background: "var(--paper)",
        padding: "72px 0",
      }}
    >
      {/* Soft colour blobs so the liquid-glass panels have something to refract */}
      <div
        aria-hidden
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
      >
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 420,
            left: "-6%",
            bottom: "-12%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45,90,65,0.20), transparent 68%)",
            filter: "blur(20px)",
            animation: "ambientDrift 16s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 460,
            height: 380,
            right: "-4%",
            top: "-10%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217,93,57,0.16), transparent 68%)",
            filter: "blur(20px)",
            animation: "ambientDrift 19s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 52px" }}
        >
          <p className="eyebrow">Why it matters</p>
          <h2 style={{ marginTop: 8, fontSize: 32, lineHeight: 1.2 }}>
            The café down the street has a marketing team.{" "}
            <span className="italic-accent">Now you do too.</span>
          </h2>
        </div>

        <div
          className="grid-3"
          style={{ gap: 20, marginTop: 0 }}
        >
          {/* Before */}
          <div
            className="liquid-panel"
            style={{
              padding: 32,
              ["--tint" as string]: "rgba(26,31,27,0.06)",
              ["--tint-strong" as string]: "rgba(26,31,27,0.13)",
              ["--tint-border" as string]: "rgba(26,31,27,0.12)",
              ["--sheen-delay" as string]: "0s",
            }}
          >
            <p className="eyebrow" style={{ marginBottom: 16 }}>
              Without Leapfrog
            </p>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 19,
                lineHeight: 1.45,
                fontStyle: "italic",
                color: "var(--ink-soft)",
                margin: 0,
              }}
            >
              &ldquo;Grill&apos;d ran a BOGO all Friday. I found out when a
              regular mentioned it Saturday night. We&apos;d already lost the
              week.&rdquo;
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--ink-soft)",
                marginTop: 20,
                marginBottom: 0,
              }}
            >
              Restaurant owner, Brisbane
            </p>
          </div>

          {/* After */}
          <div
            className="liquid-panel"
            style={{
              padding: 32,
              ["--tint" as string]: "rgba(45,90,65,0.10)",
              ["--tint-strong" as string]: "rgba(45,90,65,0.20)",
              ["--tint-border" as string]: "rgba(45,90,65,0.28)",
              ["--sheen-delay" as string]: "2.6s",
            }}
          >
            <p
              className="eyebrow"
              style={{ marginBottom: 16, color: "var(--green)" }}
            >
              With Leapfrog
            </p>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 19,
                lineHeight: 1.45,
                fontStyle: "italic",
                color: "var(--ink)",
                margin: 0,
              }}
            >
              &ldquo;Monday 8am: Leapfrog flagged the BOGO. We matched it
              before lunch. Friday we were fully booked.&rdquo;
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--ink-soft)",
                marginTop: 20,
                marginBottom: 0,
              }}
            >
              Same restaurant, with Leapfrog
            </p>
          </div>

          {/* Third: different vertical */}
          <div
            className="liquid-panel"
            style={{
              padding: 32,
              ["--tint" as string]: "rgba(244,241,234,0.35)",
              ["--tint-strong" as string]: "rgba(244,241,234,0.6)",
              ["--tint-border" as string]: "rgba(229,226,217,0.8)",
              ["--sheen-delay" as string]: "5.2s",
            }}
          >
            <p
              className="eyebrow"
              style={{ marginBottom: 16, color: "var(--ink-soft)" }}
            >
              Different industry, same edge
            </p>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 19,
                lineHeight: 1.45,
                fontStyle: "italic",
                color: "var(--ink)",
                margin: 0,
              }}
            >
              &ldquo;Gym next door slashed fees Tuesday. We ran a free trial
              weekend instead of matching them. Memberships up.&rdquo;
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--ink-soft)",
                marginTop: 20,
                marginBottom: 0,
              }}
            >
              Gym owner, Fortitude Valley
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Industries ─────────────────────────────────────────────────────────────── */

function Industries() {
  const cards = [
    { name: "Gyms & studios", icon: <IconDumbbell width={22} height={22} /> },
    { name: "Restaurants",    icon: <IconFork width={22} height={22} /> },
    { name: "Cafes",          icon: <IconCup width={22} height={22} /> },
    { name: "Local retail",   icon: <IconBag width={22} height={22} /> },
  ];

  return (
    <section
      id="industries"
      style={{
        background: "var(--paper)",
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
        padding: "64px 0",
      }}
    >
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto" }}>
          <p className="eyebrow">For the businesses that make your block</p>
          <h2 style={{ marginTop: 8, fontSize: 32 }}>
            Designed for any local vertical
          </h2>
          <p style={{ color: "var(--ink-soft)", marginTop: 8 }}>
            Tailored intelligence for the businesses that drive your community.
            Pick your niche and Leapfrog tunes the signal types and
            recommendations to match.
          </p>
        </div>

        <div className="grid-4" style={{ marginTop: 36 }}>
          {cards.map((c, i) => (
            <motion.div
              key={c.name}
              className="card glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{
                y: -6,
                transition: { type: "spring", stiffness: 350, damping: 22 },
              }}
              style={{
                textAlign: "center",
                padding: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                cursor: "default",
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--green-soft)",
                  color: "var(--green)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {c.icon}
              </span>
              <span
                style={{ fontFamily: "var(--font-heading)", fontSize: 17 }}
              >
                {c.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ───────────────────────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Add your rivals",
      body: "Your niche, your suburb, 6 competitors. Onboarded in 60 seconds.",
    },
    {
      n: "02",
      title: "We do the watching",
      body: "Every post, every promo, every price move. Scanned and classified daily.",
    },
    {
      n: "03",
      title: "You act first",
      body: "Monday morning email. Live dashboard. One clear move while they are still catching up.",
    },
  ];

  return (
    <section id="how" className="container" style={{ padding: "72px 0" }}>
      <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
        <p className="eyebrow">How it works</p>
        <h2 style={{ marginTop: 8, fontSize: 32 }}>
          Three quiet steps. One loud advantage.
        </h2>
      </div>

      <div style={{ position: "relative", marginTop: 36 }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 42,
            left: "16.67%",
            right: "16.67%",
            height: 0,
            borderTop: "2px dashed var(--rule-soft)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <div className="grid-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              className="card glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 350, damping: 22 },
              }}
              style={{
                padding: 24,
                position: "relative",
                zIndex: 1,
                cursor: "default",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--green-soft)",
                  color: "var(--green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-heading)",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 14,
                }}
              >
                {s.n}
              </div>
              <h3 style={{ fontSize: 19 }}>{s.title}</h3>
              <p
                style={{
                  color: "var(--ink-soft)",
                  marginTop: 8,
                  fontSize: 14,
                }}
              >
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer
      style={{
        background: "var(--green)",
        color: "var(--paper)",
        position: "relative",
        overflow: "hidden",
        padding: "56px 0 32px",
        marginTop: 24,
      }}
    >
      <svg
        aria-hidden
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, opacity: 0.08 }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="footerDots"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#F4F1EA" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#footerDots)" />
      </svg>

      <div
        className="container"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
          gap: 32,
          alignItems: "flex-start",
        }}
      >
        <div>
          <Logo variant="dark" size={32} />
          <p
            style={{
              marginTop: 12,
              fontSize: 13,
              color: "#C7D8CB",
              maxWidth: 280,
            }}
          >
            Stay one hop ahead of the shop next door. Real-time competitor radar
            for small local businesses.
          </p>
        </div>

        <FooterCol
          title="Product"
          links={["Features", "Pricing", "Integrations", "Changelog"]}
        />
        <FooterCol
          title="Company"
          links={["About", "Industries", "Customers", "Careers"]}
        />
        <FooterCol
          title="Legal"
          links={["Privacy", "Terms", "Security", "Contact"]}
        />
      </div>

      <div
        className="container"
        style={{
          position: "relative",
          marginTop: 40,
          paddingTop: 20,
          borderTop: "1px solid rgba(244, 241, 234, 0.18)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
          color: "#C7D8CB",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span>
          &copy; {new Date().getFullYear()} Leapfrog. Built for the hackathon.
        </span>
        <span>Brisbane. Made with care.</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="eyebrow" style={{ color: "#9ABFA6", marginBottom: 10 }}>
        {title}
      </div>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gap: 8,
        }}
      >
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              style={{ color: "var(--paper)", fontSize: 13, opacity: 0.85 }}
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { TopNav } from "@/components/TopNav";
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
      <TopNav variant="marketing" />

      <HeroBanner />

      <section className="container" style={{ position: "relative", paddingTop: 72, paddingBottom: 80 }}>
        <HeroIconBackdrop />

        <div style={{ position: "relative", textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
          <h1 style={{ marginTop: 0 }}>
            Know what your <span className="italic-accent">competitors</span> are doing before your
            customers do.
          </h1>
          <p style={{ marginTop: 18, fontSize: 17, color: "var(--ink-soft)" }}>
            Leapfrog watches the shops on your block. Promos, pricing moves, viral posts — surfaced
            the morning they go live, with plain-English suggestions on how to stay one step ahead.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            <Link href="/home" className="btn btn-primary">
              Start free trial <IconArrowRight width={14} height={14} />
            </Link>
            <Link href="/onboarding" className="btn btn-secondary">
              Set up my business
            </Link>
          </div>
        </div>

        <div id="preview" style={{ position: "relative", marginTop: 56 }}>
          <PreviewCard />
        </div>
      </section>

      <Industries />
      <HowItWorks />
      <Footer />
    </>
  );
}

function HeroBanner() {
  return (
    <div
      style={{
        background: "var(--green)",
        color: "var(--paper)",
        overflow: "hidden",
        position: "relative",
        borderBottom: "1px solid var(--green-deep)",
      }}
    >
      <div
        className="container"
        style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", gap: 16 }}
      >
        <span style={{ fontSize: 13, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <IconSparkle width={14} height={14} style={{ color: "#9ABFA6" }} /> Now monitoring 40 Brisbane businesses across 4 verticals
        </span>
        <span style={{ fontSize: 12, color: "#B6CDB9" }}>v0.1 · hackathon build</span>
      </div>
      {/* Decorative icons in lighter/darker green */}
      <BannerDecor />
    </div>
  );
}

function HeroIconBackdrop() {
  // Lighter-tone icons scattered behind the headline — analytics, events,
  // tags, hashtags, hearts — to suggest "everything competitors do, watched"
  // without competing with the headline.
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
            color: it.tone === "soft" ? "#B6CDB9" : "#D7DBC5",
            opacity: 0.55,
          }}
        >
          {it.icon}
        </span>
      ))}
    </div>
  );
}

function BannerDecor() {
  // Icons sprinkled in a lighter and darker green over the banner
  const items = [
    { left: "6%", icon: <IconDumbbell />, tone: "light" as const, rot: -8 },
    { left: "18%", icon: <IconFork />, tone: "dark" as const, rot: 4 },
    { left: "32%", icon: <IconCup />, tone: "light" as const, rot: -2 },
    { left: "62%", icon: <IconBag />, tone: "dark" as const, rot: 6 },
    { left: "78%", icon: <IconRadar />, tone: "light" as const, rot: -4 },
    { left: "92%", icon: <IconBolt />, tone: "dark" as const, rot: 10 },
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
            top: "50%",
            transform: `translateY(-50%) rotate(${it.rot}deg)`,
            color: it.tone === "light" ? "#5C8A6F" : "#1B3D2A",
            opacity: 0.35,
          }}
        >
          {it.icon}
        </span>
      ))}
    </div>
  );
}

function PreviewCard() {
  const activity = [
    { name: "Goodlife Fortitude Valley", suburb: "Fortitude Valley", note: "Launched $0 joining fee — locked $19/wk", pill: "promo", when: "2h ago" },
    { name: "Single O Newstead", suburb: "Newstead", note: "New loyalty punch card — 10th coffee free", pill: "new-product", when: "Yesterday" },
    { name: "August Restaurant", suburb: "West End", note: "Wine pairing dinner Sat, $145pp, 14 seats", pill: "promo", when: "2 days ago" },
  ];
  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: "hidden",
        boxShadow: "0 24px 60px -32px rgba(45, 90, 65, 0.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          background: "var(--cream)",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <div className="browser-dots"><span /><span /><span /></div>
        <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>leapfrog.app · live</span>
        <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>refreshed 2m ago</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid var(--rule)" }}>
        <Stat label="Competitors tracked" value="12" />
        <Stat label="New alerts today" value="3" />
        <Stat label="Avg. distance" value="2.1km" />
      </div>

      <div style={{ padding: "10px 18px 18px" }}>
        <p className="eyebrow" style={{ marginTop: 12 }}>Latest competitor activity</p>
        <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "grid", gap: 8 }}>
          {activity.map((a) => (
            <li
              key={a.name}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                padding: "14px 16px",
                border: "1px solid var(--rule)",
                borderRadius: 14,
                background: "var(--paper)",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>
                  {a.suburb} · {a.note}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className={`pill ${a.pill === "new-product" ? "pill-orange" : "pill-green"}`}>
                  {a.pill === "new-product" ? "New product" : "Promo"}
                </span>
                <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 4 }}>{a.when}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: "20px 22px", borderRight: "1px solid var(--rule)" }}>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: 34, lineHeight: 1 }}>{value}</div>
      <div className="eyebrow" style={{ marginTop: 8 }}>{label}</div>
    </div>
  );
}

function Industries() {
  const cards = [
    { name: "Gyms & studios", icon: <IconDumbbell width={22} height={22} /> },
    { name: "Restaurants", icon: <IconFork width={22} height={22} /> },
    { name: "Cafes", icon: <IconCup width={22} height={22} /> },
    { name: "Local retail", icon: <IconBag width={22} height={22} /> },
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
          <h2 style={{ marginTop: 8, fontSize: 32 }}>Designed for any local vertical</h2>
          <p style={{ color: "var(--ink-soft)", marginTop: 8 }}>
            Tailored intelligence for the businesses that drive your community. Pick your niche
            and Leapfrog tunes the signal types and recommendations to match.
          </p>
        </div>

        <div className="grid-4" style={{ marginTop: 36 }}>
          {cards.map((c) => (
            <div
              key={c.name}
              className="card"
              style={{
                textAlign: "center",
                padding: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
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
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 17 }}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Tell us who you're up against", body: "Onboard in 60 seconds — niche, suburb and your handle. Leapfrog matches you with 6 local rivals and 4 inspiration accounts further afield." },
    { n: "02", title: "We watch the public posts", body: "Every day, Leapfrog reads what your rivals post. New menus, price moves, viral content, referral campaigns — all classified and ranked." },
    { n: "03", title: "You get the cheat sheet", body: "Monday morning email and a live dashboard with plain-English suggestions for how to react. No spreadsheets, no scrolling Instagram for an hour." },
  ];
  return (
    <section id="how" className="container" style={{ padding: "72px 0" }}>
      <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
        <p className="eyebrow">How it works</p>
        <h2 style={{ marginTop: 8, fontSize: 32 }}>Three quiet steps. One loud advantage.</h2>
      </div>
      <div className="grid-3" style={{ marginTop: 36 }}>
        {steps.map((s) => (
          <div key={s.n} className="card" style={{ padding: 24 }}>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 14,
                color: "var(--green)",
                letterSpacing: "0.06em",
              }}
            >
              {s.n}
            </div>
            <h3 style={{ marginTop: 8, fontSize: 19 }}>{s.title}</h3>
            <p style={{ color: "var(--ink-soft)", marginTop: 8, fontSize: 14 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--rule)",
        background: "var(--paper)",
        padding: "32px 0",
      }}
    >
      <div
        className="container"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 6,
                background: "var(--green)",
                display: "inline-block",
              }}
            />
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 500 }}>Leapfrog</span>
          </span>
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
            Stay one hop ahead of the shop next door.
          </span>
        </div>
        <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
          © {new Date().getFullYear()} Leapfrog · Built for the hackathon
        </span>
      </div>
    </footer>
  );
}

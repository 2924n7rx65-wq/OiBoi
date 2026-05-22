"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Business } from "@/lib/types";
import { Logo } from "./Logo";

export function TopNav({ variant = "marketing" }: { variant?: "marketing" | "app" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    fetch("/api/session")
      .then((r) => r.json())
      .then((j) => setBusiness(j.business ?? null))
      .catch(() => {});
  }, [pathname]);

  async function logout() {
    await fetch("/api/session", { method: "DELETE" });
    router.push("/");
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "rgba(244, 241, 234, 0.85)",
        backdropFilter: "saturate(140%) blur(10px)",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <div
        className="container"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px" }}
      >
        <Link href="/" aria-label="Leapfrog home">
          <Logo />
        </Link>

        {variant === "marketing" && (
          <nav style={{ display: "flex", gap: 28, fontSize: 14, color: "var(--ink-soft)" }}>
            <a href="#how">How it works</a>
            <a href="#industries">Industries</a>
            <a href="#preview">Live preview</a>
          </nav>
        )}

        {variant === "app" && (
          <nav style={{ display: "flex", gap: 24, fontSize: 14 }}>
            <Link href="/analytics" style={navLinkStyle(pathname === "/analytics")}>
              Dashboard
            </Link>
            <Link href="/competitors" style={navLinkStyle(pathname === "/competitors")}>
              Competitors
            </Link>
            <Link href="/onboarding" style={navLinkStyle(pathname === "/onboarding")}>
              Profile
            </Link>
          </nav>
        )}

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {business ? (
            <>
              <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                Signed in as <strong style={{ color: "var(--ink)" }}>{business.name}</strong>
              </span>
              <button onClick={logout} className="btn btn-secondary" style={{ padding: "8px 14px" }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/home" className="btn btn-secondary" style={{ padding: "8px 14px" }}>
                Log in
              </Link>
              <Link href="/home" className="btn btn-primary" style={{ padding: "8px 14px" }}>
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function navLinkStyle(active: boolean): React.CSSProperties {
  return {
    color: active ? "var(--ink)" : "var(--ink-soft)",
    borderBottom: active ? "2px solid var(--green)" : "2px solid transparent",
    paddingBottom: 4,
  };
}

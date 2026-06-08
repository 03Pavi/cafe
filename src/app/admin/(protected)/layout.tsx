"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-config";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        router.push("/admin/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (err) {
      console.error("Log out failed:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--color-cream)" }}>
        <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--color-espresso)" }}>Verifying authorization credentials...</p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const links = [
    { label: "📊 Dashboard", href: "/admin" },
    { label: "📦 Orders", href: "/admin/orders" },
    { label: "🍽️ Menu Items", href: "/admin/menu" },
    { label: "📁 Categories", href: "/admin/categories" },
    { label: "🎟️ Coupons", href: "/admin/discounts" },
    { label: "🖼️ Gallery", href: "/admin/gallery" },
    { label: "⚙️ Settings", href: "/admin/settings" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
      <aside
        style={{
          background: "var(--color-espresso)",
          color: "var(--color-cream)",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid rgba(59, 47, 47, 0.1)"
        }}
      >
        <div>
          <div style={{ borderBottom: "1px solid rgba(255, 243, 230, 0.15)", paddingBottom: "16px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0, color: "var(--color-cream)" }}>Brew Haven</h2>
            <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>Admin Console</span>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    color: isActive ? "var(--color-espresso)" : "var(--color-cream)",
                    background: isActive ? "var(--color-cream)" : "transparent",
                    fontWeight: isActive ? "bold" : "normal",
                    transition: "background 180ms ease, color 180ms ease"
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="button button--ghost"
          style={{ width: "100%", background: "transparent", color: "var(--color-cream)", border: "1px solid rgba(255, 243, 230, 0.3)" }}
        >
          🚪 Log Out
        </button>
      </aside>

      <main style={{ padding: "32px", background: "rgba(255, 250, 244, 0.4)", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}

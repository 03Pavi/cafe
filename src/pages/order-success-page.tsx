"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/shared/config/site";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId");

  return (
    <main className="page-surface">
      <div className="container" style={{ textAlign: "center", maxWidth: "600px", padding: "48px 24px" }}>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎉</div>
        <h1 style={{ marginBottom: "16px", color: "var(--color-espresso)" }}>Order Placed Successfully!</h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "24px", color: "var(--color-muted)" }}>
          Thank you for choosing {siteConfig.cafeName}. We are preparing your freshly brewed coffee and hot snacks right now!
        </p>

        {orderId && (
          <div
            style={{
              background: "rgba(122, 139, 111, 0.12)",
              border: "1px dashed var(--color-green)",
              borderRadius: "var(--radius-md)",
              padding: "16px",
              marginBottom: "32px"
            }}
          >
            <p style={{ margin: 0, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px" }}>Order ID</p>
            <strong style={{ fontSize: "1.3rem", color: "var(--color-green)" }}>{orderId}</strong>
          </div>
        )}

        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <Link href="/" className="button button--ghost">
            Back to Home
          </Link>
          <Link href="/menu" className="button button--primary">
            Order More
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "48px" }}>Loading confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-config";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Redirect immediately if already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/admin");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      console.error("Login failure:", err);
      setErrorMsg(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-surface" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <form className="contact-form" onSubmit={handleLogin} style={{ width: "100%", maxWidth: "420px", padding: "32px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <span style={{ fontSize: "2rem" }}>🔑</span>
          <h1 style={{ fontSize: "1.8rem", marginTop: "8px", color: "var(--color-espresso)" }}>Admin Portal</h1>
          <p style={{ margin: "4px 0 0", fontSize: "0.9rem" }}>Log in to manage your café business</p>
        </div>

        {errorMsg && (
          <div style={{ color: "red", background: "rgba(255, 0, 0, 0.08)", border: "1px solid red", borderRadius: "var(--radius-sm)", padding: "10px", fontSize: "0.85rem", marginBottom: "16px", textAlign: "center" }}>
            {errorMsg}
          </div>
        )}

        <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
          Email Address
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@brewhaven.com"
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px" }}>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>

        <button type="submit" disabled={loading} className="button button--primary" style={{ width: "100%", padding: "12px" }}>
          {loading ? "Authenticating..." : "Login"}
        </button>
      </form>
    </main>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-config";
import { useRouter } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/Email";
import CoffeeIcon from "@mui/icons-material/Coffee";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 1. Redirect immediately if already logged in as admin
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === process.env.ADMIN_EMAIL) {
        router.push("/admin");
      }
    });

    // 2. Check if the page was opened from a Firebase email sign-in link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailForSignIn = window.localStorage.getItem("emailForSignIn");
      if (!emailForSignIn) {
        emailForSignIn = window.prompt("Please enter your email to confirm sign-in:");
      }
      if (emailForSignIn) {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
        signInWithEmailLink(auth, emailForSignIn, window.location.href)
          .then((result) => {
            window.localStorage.removeItem("emailForSignIn");
            const user = result.user;
            if (user && user.email === process.env.ADMIN_EMAIL) {
              router.push("/admin");
            } else {
              router.push("/");
            }
          })
          .catch((err) => {
            console.error("Email link sign-in error:", err);
            setErrorMsg(err.message || "Failed to complete sign-in with email link.");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }

    return () => unsubscribe();
  }, [router]);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const actionCodeSettings = {
      // Directs the user back to the login page to verify the token
      url: window.location.origin + "/admin/login",
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setSuccessMsg("A secure login link has been sent to your email. Please check your inbox!");
      setTimeout(() => {
        setSuccessMsg("");
      }, 1000);
    } catch (err: any) {
      console.error("Failed to send sign-in link:", err);
      setErrorMsg(err.message || "Failed to send login link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user && user.email === process.env.ADMIN_EMAIL) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Google Login failure:", err);
      setErrorMsg(err.message || "Google Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-surface" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <form className="contact-form" onSubmit={handleSendLink} style={{ width: "100%", maxWidth: "420px", padding: "32px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <CoffeeIcon style={{ fontSize: "2.5rem", color: "var(--color-espresso)" }} />
          <h1 style={{ fontSize: "1.8rem", marginTop: "8px", color: "var(--color-espresso)" }}>Welcome to Cafe</h1>
          <p style={{ margin: "4px 0 0", fontSize: "0.9rem" }}>Log in passwordless or via Google</p>
        </div>

        {errorMsg && (
          <div style={{ color: "red", background: "rgba(255, 0, 0, 0.08)", border: "1px solid red", borderRadius: "var(--radius-sm)", padding: "10px", fontSize: "0.85rem", marginBottom: "16px", textAlign: "center" }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ color: "var(--color-green)", background: "rgba(122, 139, 111, 0.08)", border: "1px solid var(--color-green)", borderRadius: "var(--radius-sm)", padding: "10px", fontSize: "0.85rem", marginBottom: "16px", textAlign: "center" }}>
            {successMsg}
          </div>
        )}

        <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
          Email Address
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. yourname@example.com"
          />
        </label>

        <button type="submit" disabled={loading} className="button button--primary" style={{ width: "100%", padding: "12px", display: "flex", gap: "8px", alignItems: "center", justifyContent: "center" }}>
          <EmailIcon style={{ fontSize: "1.2rem" }} />
          {loading ? "Sending link..." : "Send Login Link"}
        </button>

        <div style={{ display: "flex", alignItems: "center", margin: "20px 0", gap: "10px" }}>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(59, 47, 47, 0.15)" }} />
          <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>or</span>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(59, 47, 47, 0.15)" }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="button button--ghost"
          style={{
            width: "100%",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            border: "1px solid rgba(59, 47, 47, 0.2)",
            background: "transparent",
            color: "var(--color-espresso)"
          }}
        >
          <GoogleIcon style={{ fontSize: "1.2rem", display: "block" }} />
          Sign in with Google
        </button>
      </form>
    </main>
  );
}

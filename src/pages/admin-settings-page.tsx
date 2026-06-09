"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { siteConfig } from "@/shared/config/site";
import SettingsIcon from "@mui/icons-material/Settings";

export default function AdminSettingsPage() {
  const [cafeName, setCafeName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCafeName(data.cafeName || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
          setHours(data.hours ? data.hours.join("\n") : "");
        } else {
          setCafeName(siteConfig.cafeName);
          setPhone(siteConfig.phone);
          setAddress(siteConfig.address);
          setHours(siteConfig.hours.join("\n"));
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = {
        cafeName,
        phone,
        address,
        hours: hours.split("\n").filter((h) => h.trim() !== ""),
      };
      
      await setDoc(doc(db, "settings", "general"), payload);
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setMessage("Error: Failed to save settings");
    }
  };

  if (loading) {
    return <p>Loading café settings...</p>;
  }

  return (
    <div style={{ maxWidth: "600px" }}>
      <h1 style={{ marginBottom: "24px", color: "var(--color-espresso)", display: "flex", alignItems: "center", gap: "8px" }}>
        <SettingsIcon /> General Café Settings
      </h1>

      {message && (
        <div style={{ background: "rgba(122, 139, 111, 0.16)", border: "1px solid var(--color-green)", borderRadius: "var(--radius-sm)", padding: "12px", marginBottom: "20px", fontWeight: "bold" }}>
          {message}
        </div>
      )}

      <form className="contact-form" onSubmit={handleSubmit} style={{ padding: "24px" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
          Café Brand Name
          <input
            type="text"
            required
            value={cafeName}
            onChange={(e) => setCafeName(e.target.value)}
            placeholder={`e.g. ${siteConfig.cafeName}`}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
          Public Phone Number
          <input
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +91 98765 43210"
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
          Physical Street Address
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 123 Cafe Street"
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px" }}>
          Operating Hours (One range per line)
          <textarea
            rows={4}
            required
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Mon - Fri: 8:00 AM - 10:00 PM&#10;Sat - Sun: 9:00 AM - 11:00 PM"
            style={{
              background: "var(--color-cream)",
              border: "1px solid rgba(59, 47, 47, 0.16)",
              borderRadius: "var(--radius-sm)",
              padding: "12px",
              width: "100%",
              outline: "none",
              font: "inherit"
            }}
          />
        </label>

        <button type="submit" className="button button--primary" style={{ width: "100%", padding: "12px" }}>
          Save Configuration
        </button>
      </form>
    </div>
  );
}

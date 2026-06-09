"use client";

import { useState } from "react";
import { useAppSelector } from "@/store/hooks";

export default function ContactPage() {
  const siteSettings = useAppSelector((state) => state.settings.data);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMsg(data.message || "Your message has been sent successfully to the café administrator.");
        setName("");
        setPhone("");
        setMessage("");
        setTimeout(() => {
          setSuccessMsg("");
        }, 1000);
      } else {
        setErrorMsg(data.message || data.error || "Failed to send message.");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setErrorMsg("Failed to connect to the server. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-surface">
      <section className="container contact-page">
        <div>
          <span className="eyebrow">Say Hello</span>
          <h1>We would love to welcome you.</h1>
          <p>
            Call us, message us on WhatsApp, follow our updates, or send a quick note before your visit.
          </p>
          <div className="contact-actions">
            <a className="button button--primary" href={`tel:${siteSettings.phone}`}>
              Call Now
            </a>
            <a
              className="button button--secondary"
              href={`https://wa.me/${siteSettings.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a
              className="button button--ghost"
              href={siteSettings.instagram || "https://instagram.com"}
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          {successMsg && (
            <div style={{ color: "var(--color-green)", background: "rgba(122, 139, 111, 0.08)", border: "1px solid var(--color-green)", borderRadius: "var(--radius-sm)", padding: "10px", fontSize: "0.85rem", marginBottom: "10px", fontWeight: "bold" }}>
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div style={{ color: "red", background: "rgba(255, 0, 0, 0.08)", border: "1px solid red", borderRadius: "var(--radius-sm)", padding: "10px", fontSize: "0.85rem", marginBottom: "10px", fontWeight: "bold" }}>
              {errorMsg}
            </div>
          )}
          <label>
            Name
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Your name" 
            />
          </label>
          <label>
            Phone
            <input 
              type="tel" 
              required 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="Your phone number" 
            />
          </label>
          <label>
            Message
            <textarea 
              required 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              rows={5} 
              placeholder="How can we help?" 
            />
          </label>
          <button className="button button--primary" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </main>
  );
}

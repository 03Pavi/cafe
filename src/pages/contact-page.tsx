"use client";

import { useAppSelector } from "@/store/hooks";

export default function ContactPage() {
  const siteSettings = useAppSelector((state) => state.settings.data);

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
        <form className="contact-form">
          <label>
            Name
            <input type="text" name="name" placeholder="Your name" />
          </label>
          <label>
            Phone
            <input type="tel" name="phone" placeholder="Your phone number" />
          </label>
          <label>
            Message
            <textarea name="message" rows={5} placeholder="How can we help?" />
          </label>
          <button className="button button--primary" type="submit">
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}

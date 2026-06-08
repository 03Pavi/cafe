import { siteConfig } from "@/shared/config/site";

export default function ContactPage() {
  return (
    <main className="page-surface">
      <section className="container contact-page">
        <div>
          <span className="eyebrow">Say Hello</span>
          <h1>We would love to welcome you.</h1>
          <p>
            Call us, message us on WhatsApp, follow our opening updates on
            Instagram, or send a quick note before your visit.
          </p>
          <div className="contact-actions">
            <a className="button button--primary" href={`tel:${siteConfig.phone}`}>
              Call Now
            </a>
            <a
              className="button button--secondary"
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a
              className="button button--ghost"
              href={siteConfig.instagram}
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

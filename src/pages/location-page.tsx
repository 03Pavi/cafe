import { siteConfig } from "@/shared/config/site";

export default function LocationPage() {
  return (
    <main className="page-surface">
      <section className="container location-page">
        <div className="location-card">
          <span className="eyebrow">We Are Now Open</span>
          <h1>Visit us for your first cup.</h1>
          <p>{siteConfig.address}</p>
          <div className="location-details">
            <h2>Opening Hours</h2>
            {siteConfig.hours.map((hour) => (
              <p key={hour}>{hour}</p>
            ))}
          </div>
          <div className="location-details">
            <h2>Contact</h2>
            <p>{siteConfig.phone}</p>
          </div>
          <a className="button button--primary" href={siteConfig.directionsUrl}>
            Visit Us Today
          </a>
        </div>
        <div className="map-frame">
          <iframe
            title="Cafe location map"
            src="https://www.google.com/maps?q=cafe&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}

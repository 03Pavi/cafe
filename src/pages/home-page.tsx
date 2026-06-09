import Link from "next/link";
import { OpeningBadge } from "@/features/opening-badge/opening-badge";
import { MenuCard } from "@/entities/menu-item/menu-item-card";
import { bestSellers, menuCategories } from "@/entities/menu-item/menu-data";
import { siteConfig } from "@/shared/config/site";

const trustBadges = [
  "Newly Opened Cafe",
  "Fresh Coffee Daily",
  "Homemade Snacks",
  "Made with Love",
];

export default function HomePage() {
  const previewItems = menuCategories.flatMap((category) => category.items).slice(0, 6);

  return (
    <main>
      <section className="hero-section">
        <div className="container hero-section__grid">
          <div className="hero-section__content fade-in">
            <div className="badge-row">
              <OpeningBadge label="Now Open" />
              <OpeningBadge label="Grand Opening" />
            </div>
            <h1>{siteConfig.cafeName}</h1>
            <p className="hero-section__tagline">{siteConfig.tagline}</p>
            <p style={{ margin: "16px 0 24px", fontSize: "1.1rem" }}>
              We are a newly opened cafe in your area, ready to serve freshly
              brewed coffee, delicious snacks, and a warm cozy atmosphere. Come
              be part of our beginning journey.
            </p>
            <div className="hero-actions">
              <Link className="button button--primary" href="/location">
                Visit Us Today
              </Link>
              <Link className="button button--secondary" href="/menu">
                View Menu
              </Link>
              <a className="button button--ghost" href={siteConfig.directionsUrl}>
                Get Directions
              </a>
            </div>
            <div className="trust-strip" aria-label="Cafe highlights">
              {trustBadges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
          </div>
          <div className="hero-visual fade-in">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1100&q=85"
              alt="Warm cafe interior with fresh coffee"
            />
            <div className="steam steam--one" />
            <div className="steam steam--two" />
            <div className="steam steam--three" />
          </div>
        </div>
      </section>

      <section className="container content-section">
        <div className="section-heading">
          <span>Launch Favorites</span>
          <h2>Best Sellers for Our First Guests</h2>
        </div>
        <div className="card-grid card-grid--four">
          {bestSellers.map((item) => (
            <MenuCard key={item.name} item={item} />
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="container story-section__grid">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85"
            alt="Coffee being prepared by a barista"
          />
          <div>
            <span className="eyebrow">Our Beginning Story</span>
            <h2>Every cafe starts with a dream.</h2>
            <p>
              Ours is simple: to create a warm place where people feel at home
              from the very first sip. We opened our doors with fresh recipes,
              friendly faces, and a little corner made for conversations,
              study breaks, quick snacks, and slow evenings.
            </p>
          </div>
        </div>
      </section>

      <section className="container content-section">
        <div className="section-heading">
          <span>Freshly Started</span>
          <h2>Featured Menu Preview</h2>
        </div>
        <div className="card-grid card-grid--three">
          {previewItems.map((item) => (
            <MenuCard key={`${item.name}-${item.price}`} item={item} />
          ))}
        </div>
      </section>

      <section className="container grand-opening-cta">
        <div className="grand-opening-cta__inner">
          <div>
            <span>We are open now</span>
            <h2>Come Visit Us Today!</h2>
          </div>
          <a className="button button--light" href={siteConfig.directionsUrl}>
            Get Directions
          </a>
        </div>
      </section>
    </main>
  );
}

export default function AboutPage() {
  return (
    <main className="page-surface">
      <section className="container about-page">
        <div className="about-page__content">
          <span className="eyebrow">Our New Beginning</span>
          <h1>A neighborhood cafe opened with heart.</h1>
          <p>
            Brew Haven Cafe began with a small dream: to build a cozy, premium,
            friendly space where people nearby could pause, meet, work, laugh,
            and feel welcomed from day one.
          </p>
          <p>
            We are newly opened, so every guest matters deeply to us. Your first
            visit is part of our first chapter, and we want it to feel warm,
            personal, and worth returning to.
          </p>
          <div className="about-values">
            <span>Fresh daily brews</span>
            <span>Local community first</span>
            <span>Comfort food with care</span>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=85"
          alt="Cozy cafe counter with warm lights"
        />
      </section>
    </main>
  );
}

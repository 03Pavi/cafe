const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=900&q=85",
    alt: "Newly designed cafe interior",
  },
  {
    src: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85",
    alt: "Coffee preparation at the counter",
  },
  {
    src: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=900&q=85",
    alt: "Fresh cafe snacks on a table",
  },
  {
    src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=85",
    alt: "Cozy cafe ambience with warm seating",
  },
  {
    src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85",
    alt: "Fresh cup of coffee",
  },
  {
    src: "https://images.unsplash.com/photo-1513267048331-5611cad62e41?auto=format&fit=crop&w=900&q=85",
    alt: "Cafe dessert and coffee pairing",
  },
];

export default function GalleryPage() {
  return (
    <main className="page-surface">
      <section className="container page-hero">
        <span className="eyebrow">First Look</span>
        <h1>Fresh corners, warm cups, cozy moments.</h1>
        <p>
          A glimpse of our newly designed cafe, coffee preparation, food items,
          and the ambience we opened with.
        </p>
      </section>
      <section className="container gallery-grid">
        {galleryImages.map((image) => (
          <figure className="gallery-item" key={image.src}>
            <img src={image.src} alt={image.alt} />
          </figure>
        ))}
      </section>
    </main>
  );
}

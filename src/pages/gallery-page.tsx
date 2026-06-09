"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGalleryImages } from "@/store/action/gallery-actions";

import { LoadingScreen } from "@/shared/ui/loading-screen";

export default function GalleryPage() {
  const dispatch = useAppDispatch();
  const { images, loading, error } = useAppSelector((state) => state.gallery);

  useEffect(() => {
    dispatch(fetchGalleryImages());
  }, [dispatch]);

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
        {loading && <LoadingScreen message="Loading gallery..." />}
        {error && <p style={{ textAlign: "center", color: "red", width: "100%" }}>{error}</p>}
        {!loading && !error && images.length === 0 && (
          <p style={{ textAlign: "center", width: "100%" }}>No gallery images found.</p>
        )}
        {!loading && !error && images.map((image) => (
          <figure className="gallery-item" key={image.id || image.src}>
            <img src={image.src} alt={image.alt} />
          </figure>
        ))}
      </section>
    </main>
  );
}

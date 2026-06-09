"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMenu } from "@/store/action/menu-actions";
import { MenuCard } from "@/entities/menu-item/menu-item-card";

import { LoadingScreen } from "@/shared/ui/loading-screen";

const categoryIcons: Record<string, string> = {
  All: "🍽️",
  Coffee: "☕",
  Tea: "🍵",
  Snacks: "🍔",
  "Maggi / Fast Food": "🍜",
  "Cold Drinks": "🥤",
};

export default function MenuPage() {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector((state) => state.menu);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const categoryTitles = ["All", ...categories.map((cat) => cat.title)];

  const filteredCategories =
    selectedCategory === "All"
      ? categories
      : categories.filter((cat) => cat.title === selectedCategory);

  return (
    <main className="page-surface">
      <section className="container page-hero">
        <span className="eyebrow">Opening Menu</span>
        <h1>Simple, Fresh, and Made to Welcome You</h1>
        <p>
          Our first menu keeps things comforting and familiar: fresh coffee,
          warm tea, quick snacks, Maggi, and chilled drinks.
        </p>
      </section>

      {/* Category Tabs */}
      <section className="container" style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            padding: "8px 0",
          }}
        >
          {categoryTitles.map((title) => (
            <button
              key={title}
              onClick={() => setSelectedCategory(title)}
              className={`button ${
                selectedCategory === title ? "button--primary" : "button--ghost"
              }`}
              style={{
                borderRadius: "20px",
                padding: "8px 18px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>{categoryIcons[title] || "🍴"}</span>
              {title}
            </button>
          ))}
        </div>
      </section>

      <section className="container menu-layout">
        {loading && (
          <LoadingScreen message="Loading our delicious menu..." />
        )}
        
        {error && !loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ color: "red", marginBottom: "16px" }}>{error}</p>
            <button className="button button--secondary" onClick={() => dispatch(fetchMenu())}>
              Retry Loading
            </button>
          </div>
        )}

        {!loading && !error && filteredCategories.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--color-muted)" }}>
            No menu items found.
          </p>
        )}

        {!loading && !error && filteredCategories.map((category) => (
          <div className="menu-category" key={category.title} style={{ marginBottom: "40px" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "1.8rem", marginBottom: "20px", borderBottom: "1px solid rgba(59, 47, 47, 0.08)", paddingBottom: "10px" }}>
              <span style={{ fontSize: "2rem" }}>{categoryIcons[category.title] || "🍴"}</span>
              {category.title}
            </h2>
            <div className="card-grid card-grid--three">
              {category.items.map((item) => (
                <MenuCard key={item.name} item={item} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

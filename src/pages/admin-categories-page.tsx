"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase-config";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import CategoryIcon from "@mui/icons-material/Category";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";

interface Category {
  id: string;
  name: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "categories"));
      const list: Category[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, name: doc.data().name } as Category);
      });
      setCategories(list);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const id = editingId || "cat-" + Math.random().toString(36).substring(2, 11);
      await setDoc(doc(db, "categories", id), { name });
      
      setName("");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error("Failed to save category:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteDoc(doc(db, "categories", id));
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "24px", color: "var(--color-espresso)", display: "flex", alignItems: "center", gap: "12px" }}>
        <CategoryIcon style={{ fontSize: "2rem" }} /> Menu Categories Manager
      </h1>

      <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "1fr 1.5fr" }}>
        
        <form className="contact-form" onSubmit={handleSubmit} style={{ padding: "24px", height: "fit-content" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            {editingId ? <EditIcon style={{ fontSize: "1.2rem" }} /> : <AddIcon style={{ fontSize: "1.2rem" }} />}
            {editingId ? "Edit Category" : "Add Category"}
          </h2>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "16px" }}>
            Category Name
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Desserts"
            />
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="button button--primary" style={{ flex: 1 }}>
              {editingId ? "Update" : "Save"}
            </button>
            {editingId && (
              <button type="button" className="button button--ghost" onClick={() => { setEditingId(null); setName(""); }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="location-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <ListIcon style={{ fontSize: "1.2rem" }} /> Categories List
          </h2>
          {loading ? (
            <p>Loading categories...</p>
          ) : categories.length === 0 ? (
            <p style={{ color: "var(--color-muted)" }}>No categories yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {categories.map((cat) => (
                <div key={cat.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(59, 47, 47, 0.08)", paddingBottom: "8px" }}>
                  <span>{cat.name}</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => { setName(cat.name); setEditingId(cat.id); }} className="button button--secondary" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="button button--ghost" style={{ padding: "4px 8px", fontSize: "0.8rem", color: "red", borderColor: "red" }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

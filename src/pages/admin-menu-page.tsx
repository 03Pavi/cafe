"use client";

import React, { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebase/firebase-config";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("Coffee");
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "menu-items"));
      const list: MenuItem[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as MenuItem);
      });
      setItems(list);
    } catch (err) {
      console.error("Failed to load menu items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleImageUpload = async (): Promise<string> => {
    if (!imageFile) return imageUrl || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80";
    setUploading(true);
    try {
      const storageRef = ref(storage, `menu/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (err) {
      console.warn("Storage upload failed, falling back to mock:", err);
      return imageUrl || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    try {
      const finalImageUrl = await handleImageUpload();
      const id = editingId || "item-" + Math.random().toString(36).substring(2, 11);
      
      const itemData = {
        name,
        price,
        description,
        imageUrl: finalImageUrl,
        category,
        isAvailable,
      };

      await setDoc(doc(db, "menu-items", id), itemData);
      
      setName("");
      setPrice("");
      setDescription("");
      setImageUrl("");
      setImageFile(null);
      setEditingId(null);
      fetchItems();
    } catch (err) {
      console.error("Failed to submit item:", err);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setName(item.name);
    setPrice(item.price);
    setDescription(item.description);
    setImageUrl(item.imageUrl);
    setCategory(item.category);
    setIsAvailable(item.isAvailable);
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await deleteDoc(doc(db, "menu-items", id));
      fetchItems();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "24px", color: "var(--color-espresso)", display: "flex", alignItems: "center", gap: "8px" }}>
        <RestaurantIcon /> Menu Items Manager
      </h1>

      <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "1fr 1.5fr" }}>
        
        <form className="contact-form" onSubmit={handleSubmit} style={{ padding: "24px", height: "fit-content" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            {editingId ? <><EditIcon /> Edit Menu Item</> : <><AddIcon /> Add Menu Item</>}
          </h2>

          <label style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
            Item Name *
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mocha Latte" />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
            Price *
            <input type="text" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. ₹129" />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
            Category *
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: "10px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(59, 47, 47, 0.16)", font: "inherit", background: "var(--color-cream)", outline: "none" }}
            >
              <option value="Coffee">Coffee</option>
              <option value="Tea">Tea</option>
              <option value="Snacks">Snacks</option>
              <option value="Maggi / Fast Food">Maggi / Fast Food</option>
              <option value="Cold Drinks">Cold Drinks</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Item ingredients / details..." rows={3} style={{ padding: "10px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(59, 47, 47, 0.16)", font: "inherit", background: "var(--color-cream)", outline: "none" }} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
            Upload Image
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} style={{ fontSize: "0.9rem" }} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "16px" }}>
            Or Image URL
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
            Available in Store
          </label>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="button button--primary" style={{ flex: 1 }}>
              {uploading ? "Uploading..." : editingId ? "Update Item" : "Create Item"}
            </button>
            {editingId && (
              <button
                type="button"
                className="button button--ghost"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setPrice("");
                  setDescription("");
                  setImageUrl("");
                  setImageFile(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="location-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <ListAltIcon /> Menu Items Listing
          </h2>
          {loading ? (
            <p>Loading items...</p>
          ) : items.length === 0 ? (
            <p style={{ color: "var(--color-muted)" }}>No menu items yet. Create one on the left!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(59, 47, 47, 0.08)",
                    paddingBottom: "10px"
                  }}
                >
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                    />
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1rem" }}>{item.name}</h3>
                      <span style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
                        {item.category} • {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <strong>{item.price}</strong>
                    <button onClick={() => handleEdit(item)} className="button button--secondary" style={{ padding: "6px 10px", fontSize: "0.8rem" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="button button--ghost" style={{ padding: "6px 10px", fontSize: "0.8rem", color: "red", borderColor: "red" }}>
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

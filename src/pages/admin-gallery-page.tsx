"use client";

import React, { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebase/firebase-config";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { uploadImage } from "@/shared/lib/cloudinary";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [alt, setAlt] = useState("");
  const [src, setSrc] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "gallery-images"));
      const list: GalleryImage[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as GalleryImage);
      });
      setImages(list);
    } catch (err) {
      console.error("Failed to load gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageUpload = async (): Promise<string> => {
    if (!imageFile) return src || "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=300&q=80";
    setUploading(true);
    try {
      return await uploadImage(imageFile, "gallery");
    } catch (err) {
      console.warn("Image upload failed, falling back to mock:", err);
      return src || "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=300&q=80";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const finalSrc = await handleImageUpload();
      const id = "gal-" + Math.random().toString(36).substring(2, 11);
      
      const imgData = {
        src: finalSrc,
        alt: alt || "Café Image",
      };

      await setDoc(doc(db, "gallery-images", id), imgData);
      
      setAlt("");
      setSrc("");
      setImageFile(null);
      fetchImages();
    } catch (err) {
      console.error("Failed to add image:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery image?")) return;
    try {
      await deleteDoc(doc(db, "gallery-images", id));
      fetchImages();
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "24px", color: "var(--color-espresso)", display: "flex", alignItems: "center", gap: "8px" }}>
        <PhotoLibraryIcon /> Café Gallery Manager
      </h1>

      <div className="admin-grid-two-columns">
        
        <form className="contact-form" onSubmit={handleSubmit} style={{ padding: "24px", height: "fit-content" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <AddIcon /> Add Gallery Image
          </h2>

          <label style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
            Image Alt Text *
            <input type="text" required value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. Cozy seating area" />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
            Upload Image File
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "20px" }}>
            Or Image URL
            <input type="text" value={src} onChange={(e) => setSrc(e.target.value)} placeholder="https://..." />
          </label>

          <button type="submit" className="button button--primary" style={{ width: "100%", padding: "12px" }}>
            {uploading ? "Uploading..." : "Add to Gallery"}
          </button>
        </form>

        <div className="location-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <VisibilityIcon /> Gallery Preview
          </h2>
          {loading ? (
            <p>Loading gallery...</p>
          ) : images.length === 0 ? (
            <p style={{ color: "var(--color-muted)" }}>No gallery images yet.</p>
          ) : (
            <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
              {images.map((img) => (
                <div key={img.id} style={{ position: "relative", borderRadius: "var(--radius-sm)", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
                  <img src={img.src} alt={img.alt} style={{ width: "100%", height: "100px", objectFit: "cover" }} />
                  <button
                    onClick={() => handleDelete(img.id)}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      background: "rgba(255, 0, 0, 0.8)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

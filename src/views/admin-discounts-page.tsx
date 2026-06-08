"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase-config";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";

interface Discount {
  code: string;
  percent: number;
  isActive: boolean;
}

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("");
  const [percent, setPercent] = useState<number>(10);
  const [isActive, setIsActive] = useState(true);
  const [editingCode, setEditingCode] = useState<string | null>(null);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "discounts"));
      const list: Discount[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Discount);
      });
      setDiscounts(list);
    } catch (err) {
      console.error("Failed to load discounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || percent <= 0) return;

    try {
      const docId = code.toUpperCase();
      const payload = {
        code: docId,
        percent: Number(percent),
        isActive,
      };
      
      await setDoc(doc(db, "discounts", docId), payload);
      
      setCode("");
      setPercent(10);
      setIsActive(true);
      setEditingCode(null);
      fetchDiscounts();
    } catch (err) {
      console.error("Failed to save coupon:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteDoc(doc(db, "discounts", id));
      fetchDiscounts();
    } catch (err) {
      console.error("Failed to delete coupon:", err);
    }
  };

  const handleEdit = (d: Discount) => {
    setCode(d.code);
    setPercent(d.percent);
    setIsActive(d.isActive);
    setEditingCode(d.code);
  };

  return (
    <div>
      <h1 style={{ marginBottom: "24px", color: "var(--color-espresso)" }}>🎟️ Coupon Codes Manager</h1>

      <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "1fr 1.5fr" }}>
        
        <form className="contact-form" onSubmit={handleSubmit} style={{ padding: "24px", height: "fit-content" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>
            {editingCode ? "✏️ Edit Coupon" : "➕ Create Coupon"}
          </h2>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
            Coupon Code *
            <input
              type="text"
              required
              disabled={!!editingCode}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. COFFEE20"
              style={{ textTransform: "uppercase" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "16px" }}>
            Discount Percentage *
            <input
              type="number"
              required
              min={1}
              max={100}
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              placeholder="e.g. 20"
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Coupon Active
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="button button--primary" style={{ flex: 1 }}>
              {editingCode ? "Update" : "Save"}
            </button>
            {editingCode && (
              <button type="button" className="button button--ghost" onClick={() => { setEditingCode(null); setCode(""); setPercent(10); setIsActive(true); }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="location-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>📋 Available Coupons</h2>
          {loading ? (
            <p>Loading coupons...</p>
          ) : discounts.length === 0 ? (
            <p style={{ color: "var(--color-muted)" }}>No coupons created yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {discounts.map((d) => (
                <div key={d.code} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(59, 47, 47, 0.08)", paddingBottom: "8px" }}>
                  <div>
                    <strong style={{ fontSize: "1.1rem", color: d.isActive ? "var(--color-green)" : "var(--color-muted)" }}>
                      {d.code}
                    </strong>
                    <span style={{ fontSize: "0.85rem", marginLeft: "12px", opacity: 0.8 }}>
                      {d.percent}% Off • {d.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleEdit(d)} className="button button--secondary" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(d.code)} className="button button--ghost" style={{ padding: "4px 8px", fontSize: "0.8rem", color: "red", borderColor: "red" }}>
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

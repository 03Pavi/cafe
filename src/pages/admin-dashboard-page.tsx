"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

interface OrderItem {
  name: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "orders"));
        const list: Order[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(list);
      } catch (err) {
        console.error("Fetch stats error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => o.status === "pending" || o.status === "preparing").length;
  
  const revenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const itemCounts: Record<string, number> = {};
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
    });
  });

  const popularItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (loading) {
    return <p>Loading dashboard statistics...</p>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: "24px", color: "var(--color-espresso)", display: "flex", alignItems: "center", gap: "12px" }}>
        <DashboardIcon style={{ fontSize: "2rem" }} /> Dashboard Overview
      </h1>
      
      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: "40px" }}>
        <div className="location-card" style={{ padding: "20px" }}>
          <LocalShippingIcon style={{ fontSize: "2rem", color: "var(--color-espresso)" }} />
          <h3 style={{ margin: "8px 0 4px", fontSize: "0.9rem", color: "var(--color-muted)" }}>Total Orders</h3>
          <strong style={{ fontSize: "1.8rem", color: "var(--color-espresso)" }}>{totalOrders}</strong>
        </div>
        <div className="location-card" style={{ padding: "20px" }}>
          <MonetizationOnIcon style={{ fontSize: "2rem", color: "var(--color-green)" }} />
          <h3 style={{ margin: "8px 0 4px", fontSize: "0.9rem", color: "var(--color-muted)" }}>Revenue (Completed)</h3>
          <strong style={{ fontSize: "1.8rem", color: "var(--color-green)" }}>₹{revenue}</strong>
        </div>
        <div className="location-card" style={{ padding: "20px" }}>
          <HourglassEmptyIcon style={{ fontSize: "2rem", color: "var(--color-caramel)" }} />
          <h3 style={{ margin: "8px 0 4px", fontSize: "0.9rem", color: "var(--color-muted)" }}>Active Orders</h3>
          <strong style={{ fontSize: "1.8rem", color: "var(--color-espresso)" }}>{activeOrders}</strong>
        </div>
      </div>

      <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "1fr 1fr" }}>
        
        <div className="location-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "16px", color: "var(--color-espresso)", display: "flex", alignItems: "center", gap: "8px" }}>
            <WhatshotIcon style={{ color: "var(--color-caramel)" }} /> Popular Items
          </h2>
          {popularItems.length === 0 ? (
            <p style={{ color: "var(--color-muted)" }}>No items sold yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {popularItems.map(([name, count], index) => (
                <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.95rem" }}>
                  <span>#{index + 1} {name}</span>
                  <strong style={{ background: "rgba(122, 139, 111, 0.16)", padding: "4px 8px", borderRadius: "4px" }}>
                    {count} sold
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="location-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "16px", color: "var(--color-espresso)", display: "flex", alignItems: "center", gap: "8px" }}>
            <TrendingUpIcon style={{ color: "var(--color-green)" }} /> Business Health
          </h2>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
            Your neighborhood café is growing! Check your active orders tab to update customer delivery statuses, or update the menu card price and availability anytime.
          </p>
        </div>
        
      </div>
    </div>
  );
}

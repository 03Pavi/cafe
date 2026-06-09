"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase-config";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { LoadingScreen } from "@/shared/ui/loading-screen";

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: any[];
  subtotal: number;
  discount: number;
  total: number;
  status: "pending" | "preparing" | "completed" | "cancelled";
  timestamp: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(list);
      setLoading(false);
    }, (error) => {
      console.error("Real-time orders sync error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const docRef = doc(db, "orders", orderId);
      await updateDoc(docRef, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#e28743";
      case "preparing":
        return "#d9a066";
      case "completed":
        return "var(--color-green)";
      case "cancelled":
        return "red";
      default:
        return "#745f58";
    }
  };

  if (loading) {
    return <LoadingScreen message="Syncing orders in real-time..." />;
  }

  return (
    <div>
      <h1 style={{ marginBottom: "24px", color: "var(--color-espresso)", display: "flex", alignItems: "center", gap: "8px" }}>
        <ShoppingBagIcon /> Customer Orders (Real-time)
      </h1>
      
      {orders.length === 0 ? (
        <p style={{ color: "var(--color-muted)" }}>No customer orders placed yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              className="location-card admin-order-card-grid"
              style={{
                borderLeft: `5px solid ${getStatusColor(order.status)}`
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", borderBottom: "1px solid rgba(59, 47, 47, 0.08)", paddingBottom: "4px" }}>
                  <strong style={{ fontSize: "0.85rem", opacity: 0.8 }}>ID: {order.id}</strong>
                  <span style={{ fontSize: "0.85rem" }}>
                    {new Date(order.timestamp).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", margin: "12px 0" }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                      <span>{item.name} <span style={{ opacity: 0.7 }}>x{item.quantity}</span></span>
                      <span>{item.price}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(59, 47, 47, 0.08)", paddingTop: "8px" }}>
                  <strong>Total:</strong>
                  <strong style={{ color: "var(--color-green)" }}>₹{order.total}</strong>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: "1.1rem" }}>Customer</h3>
                <p style={{ margin: 0, fontWeight: "bold" }}>{order.customerName}</p>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-muted)" }}>Phone: {order.customerPhone}</p>
                <p style={{ margin: "8px 0 0", fontSize: "0.85rem", lineHeight: "1.4", color: "var(--color-muted)" }}>
                  Address: {order.customerAddress}
                </p>
              </div>

              <div className="admin-order-actions-container" style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center", alignItems: "flex-end" }}>
                <div>
                  <span style={{ fontSize: "0.85rem", opacity: 0.7, marginRight: "8px" }}>Status:</span>
                  <strong style={{ color: getStatusColor(order.status), textTransform: "uppercase" }}>{order.status}</strong>
                </div>
                
                <div className="admin-order-actions-container" style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "flex-end", marginTop: "12px" }}>
                  <button
                    disabled={order.status === "preparing"}
                    onClick={() => handleStatusChange(order.id, "preparing")}
                    className="button button--secondary"
                    style={{ padding: "6px 10px", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <HourglassEmptyIcon style={{ fontSize: "0.95rem" }} /> Prepare
                  </button>
                  <button
                    disabled={order.status === "completed"}
                    onClick={() => handleStatusChange(order.id, "completed")}
                    className="button button--primary"
                    style={{ padding: "6px 10px", fontSize: "0.75rem", background: "var(--color-green)", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <CheckCircleIcon style={{ fontSize: "0.95rem" }} /> Complete
                  </button>
                  <button
                    disabled={order.status === "cancelled"}
                    onClick={() => handleStatusChange(order.id, "cancelled")}
                    className="button button--ghost"
                    style={{ padding: "6px 10px", fontSize: "0.75rem", color: "red", borderColor: "red", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <CancelIcon style={{ fontSize: "0.95rem" }} /> Cancel
                  </button>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

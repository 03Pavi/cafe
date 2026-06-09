"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-config";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPastOrders } from "@/store/action/order-actions";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { LoadingScreen } from "@/shared/ui/loading-screen";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [nameEditing, setNameEditing] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { pastOrders, loading: ordersLoading, error: ordersError } = useAppSelector((state) => state.order);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        dispatch(fetchPastOrders(currentUser.uid));
      } else {
        router.push("/login?redirect=/profile");
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router, dispatch]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !displayName.trim()) return;

    try {
      await updateProfile(user, { displayName: displayName.trim() });
      setUpdateMsg("Profile updated successfully!");
      setNameEditing(false);
      setTimeout(() => setUpdateMsg(""), 3000);
    } catch (err: any) {
      console.error("Failed to update display name:", err);
      setUpdateMsg("Error: Failed to update name.");
    }
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <LoadingScreen message="Loading profile details..." />
      </div>
    );
  }

  if (!user) return null;

  const activeOrders = pastOrders.filter(o => o.status === "pending" || o.status === "preparing");
  const pastCompletedOrders = pastOrders.filter(o => o.status === "completed" || o.status === "cancelled");

  const getStatusStep = (status: string) => {
    switch (status) {
      case "pending": return 1;
      case "preparing": return 2;
      case "completed": return 3;
      default: return 1;
    }
  };

  const renderTimeline = (status: string) => {
    if (status === "cancelled") {
      return (
        <div style={{ color: "red", fontWeight: "bold", padding: "10px 0" }}>
          ❌ This order was cancelled.
        </div>
      );
    }

    const currentStep = getStatusStep(status);

    const steps = [
      { step: 1, label: "Order Placed", icon: PendingActionsIcon },
      { step: 2, label: "Preparing", icon: HourglassTopIcon },
      { step: 3, label: "Ready / Completed", icon: CheckCircleIcon }
    ];

    return (
      <div style={{ marginTop: "20px" }}>
        <h4 style={{ fontSize: "0.9rem", color: "var(--color-muted)", marginBottom: "12px", textTransform: "uppercase" }}>Order Progress Timeline</h4>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", padding: "10px 0" }}>
          {/* Connector Line */}
          <div style={{
            position: "absolute",
            left: "10%",
            right: "10%",
            top: "30px",
            height: "4px",
            backgroundColor: "rgba(59, 47, 47, 0.15)",
            zIndex: 0
          }} />
          <div style={{
            position: "absolute",
            left: "10%",
            width: currentStep === 1 ? "0%" : currentStep === 2 ? "40%" : "80%",
            top: "30px",
            height: "4px",
            backgroundColor: "var(--color-green)",
            transition: "width 0.4s ease",
            zIndex: 1
          }} />

          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep >= s.step;
            const isCurrent = currentStep === s.step;
            return (
              <div key={s.step} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "30%", zIndex: 2 }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: isCompleted ? "var(--color-green)" : "var(--color-white)",
                  color: isCompleted ? "var(--color-white)" : "rgba(59, 47, 47, 0.4)",
                  border: isCurrent ? "3px solid var(--color-caramel)" : "2px solid rgba(59, 47, 47, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease"
                }}>
                  <Icon style={{ fontSize: "1.3rem" }} />
                </div>
                <span style={{
                  marginTop: "8px",
                  fontSize: "0.85rem",
                  fontWeight: isCompleted ? "bold" : "normal",
                  color: isCompleted ? "var(--color-espresso)" : "var(--color-muted)",
                  textAlign: "center"
                }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderOrderList = (list: typeof pastOrders) => {
    if (ordersLoading) return <LoadingScreen message="Loading orders..." fullHeight={false} />;
    if (ordersError) return <p style={{ color: "red" }}>{ordersError}</p>;
    if (list.length === 0) return <p style={{ color: "var(--color-muted)" }}>No orders found in this tab.</p>;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {list.map((order) => (
          <div
            key={order.id}
            className="location-card"
            style={{
              padding: "24px",
              borderLeft: `5px solid ${order.status === "completed" ? "var(--color-green)" : order.status === "cancelled" ? "red" : "var(--color-caramel)"}`
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(59, 47, 47, 0.08)", paddingBottom: "8px", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <strong style={{ fontSize: "0.95rem" }}>Order ID: {order.id}</strong>
                <span style={{ fontSize: "0.85rem", marginLeft: "16px", color: "var(--color-muted)" }}>
                  {new Date(order.timestamp).toLocaleString()}
                </span>
              </div>
              <strong style={{
                color: order.status === "completed" ? "var(--color-green)" : order.status === "cancelled" ? "red" : "var(--color-caramel)",
                textTransform: "uppercase",
                fontSize: "0.85rem"
              }}>
                {order.status}
              </strong>
            </div>

            {/* Order Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
              {order.items?.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                  <span>{item.name} <span style={{ opacity: 0.7 }}>x{item.quantity}</span></span>
                  <span>{item.price}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(59, 47, 47, 0.08)", paddingTop: "10px" }}>
              <strong>Total Paid:</strong>
              <strong style={{ color: "var(--color-green)", fontSize: "1.1rem" }}>₹{order.total}</strong>
            </div>

            {/* Order status timeline (Only for active tab orders) */}
            {activeTab === "active" && renderTimeline(order.status)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="page-surface">
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Back Button */}
        <div>
          <Link href="/" className="button button--ghost" style={{ display: "inline-flex", gap: "8px", alignItems: "center", padding: "8px 16px", borderRadius: "var(--radius-sm)" }}>
            <ArrowBackIcon style={{ fontSize: "1.1rem" }} />
            Back to Home
          </Link>
        </div>

        <div style={{ display: "grid", gap: "32px", gridTemplateColumns: "1fr", gridAutoRows: "min-content", width: "100%" }}>
        
        {/* Profile Card & Info */}
        <div className="location-card" style={{ padding: "28px", display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--color-beige)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-espresso)" }}>
              <PersonIcon style={{ fontSize: "2.2rem" }} />
            </div>
            <div>
              {nameEditing ? (
                <form onSubmit={handleUpdateName} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    style={{ padding: "6px 10px", fontSize: "1.1rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(59, 47, 47, 0.16)" }}
                  />
                  <button type="submit" className="button button--primary" style={{ padding: "6px 12px", fontSize: "0.9rem" }}>Save</button>
                  <button type="button" className="button button--ghost" onClick={() => { setNameEditing(false); setDisplayName(user.displayName || ""); }} style={{ padding: "6px 12px", fontSize: "0.9rem" }}>Cancel</button>
                </form>
              ) : (
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <h1 style={{ fontSize: "1.6rem", margin: 0 }}>{user.displayName || "Valued Customer"}</h1>
                  <button onClick={() => setNameEditing(true)} className="button button--ghost" style={{ padding: "4px 10px", fontSize: "0.75rem", borderRadius: "12px" }}>Edit Name</button>
                </div>
              )}
              <p style={{ margin: "4px 0 0", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
                <EmailIcon style={{ fontSize: "1rem", color: "var(--color-muted)" }} /> {user.email}
              </p>
            </div>
          </div>
          <button onClick={handleLogOut} className="button button--ghost" style={{ padding: "10px 18px", color: "red", borderColor: "rgba(255,0,0,0.2)", display: "flex", alignItems: "center", gap: "8px" }}>
            <ExitToAppIcon style={{ fontSize: "1.1rem" }} /> Sign Out
          </button>
        </div>

        {updateMsg && (
          <div style={{ background: "rgba(122, 139, 111, 0.12)", border: "1px solid var(--color-green)", borderRadius: "var(--radius-sm)", padding: "12px", fontWeight: "bold" }}>
            {updateMsg}
          </div>
        )}

        {/* Orders Section */}
        <div>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", color: "var(--color-espresso)" }}>
            <LocalCafeIcon /> My Orders
          </h2>

          {/* Section Tabs */}
          <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid rgba(59, 47, 47, 0.1)", paddingBottom: "12px", marginBottom: "24px" }}>
            <button
              onClick={() => setActiveTab("active")}
              className={`button ${activeTab === "active" ? "button--primary" : "button--ghost"}`}
              style={{ padding: "8px 18px", borderRadius: "20px" }}
            >
              Active Orders ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`button ${activeTab === "past" ? "button--primary" : "button--ghost"}`}
              style={{ padding: "8px 18px", borderRadius: "20px" }}
            >
              Order History ({pastCompletedOrders.length})
            </button>
          </div>

          {activeTab === "active" ? renderOrderList(activeOrders) : renderOrderList(pastCompletedOrders)}
        </div>

        </div>
      </div>
    </main>
  );
}

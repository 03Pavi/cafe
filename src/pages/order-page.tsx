"use client";

import React from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeFromOrder, updateQuantity } from "@/entities/order/model/order-slice";

export default function OrderPage() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.order.items);

  const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + parsePrice(item.price) * item.quantity,
    0
  );

  const handleQuantityChange = (name: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      dispatch(removeFromOrder(name));
    } else {
      dispatch(updateQuantity({ name, quantity: newQty }));
    }
  };

  return (
    <main className="page-surface">
      <div className="container">
        <h1 style={{ marginBottom: "24px" }}>Place Order</h1>

        {cartItems.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              background: "rgba(255, 250, 244, 0.58)",
              border: "1px solid rgba(59, 47, 47, 0.08)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <p style={{ fontSize: "1.2rem", marginBottom: "24px" }}>
              Your order is currently empty. Add some warm cups and fresh snacks!
            </p>
            <Link href="/menu" className="button button--primary">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="responsive-grid responsive-grid--cart">
            {/* Cart Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {cartItems.map((item) => (
                <div
                  key={item.name}
                  className="menu-card"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: "1 1 200px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.15rem" }}>{item.name}</h3>
                    <p style={{ margin: "4px 0 0", fontSize: "0.9rem" }}>{item.description}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <strong>₹{item.price}</strong>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid rgba(59, 47, 47, 0.16)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                      <button
                        onClick={() => handleQuantityChange(item.name, item.quantity, -1)}
                        style={{ background: "none", border: "none", padding: "6px 12px", cursor: "pointer", fontWeight: "bold" }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: "bold" }}>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.name, item.quantity, 1)}
                        style={{ background: "none", border: "none", padding: "6px 12px", cursor: "pointer", fontWeight: "bold" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Sidebar */}
            <div>
              <div className="location-card" style={{ padding: "24px" }}>
                <h2 style={{ fontSize: "1.3rem", marginBottom: "16px", color: "var(--color-espresso)" }}>Order Summary</h2>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                  <span>Items Subtotal</span>
                  <strong>₹{subtotal}</strong>
                </div>
                <Link href="/checkout" className="button button--primary" style={{ width: "100%", padding: "12px", textAlign: "center" }}>
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

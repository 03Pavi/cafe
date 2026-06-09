"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPastOrders, submitOrder, validateCoupon } from "@/store/action/order-actions";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const cartItems = useAppSelector((state) => state.order.items);
  const appliedCoupon = useAppSelector((state) => state.order.appliedCoupon);
  const promoDiscount = useAppSelector((state) => state.order.promoDiscount);
  const loading = useAppSelector((state) => state.order.loading);
  const error = useAppSelector((state) => state.order.error);
  const pastOrders = useAppSelector((state) => state.order.pastOrders);

  const [user, setUser] = useState<User | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setCustomerName(currentUser.displayName || "");
        dispatch(fetchPastOrders(currentUser.uid));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const userOrders = pastOrders.filter(o => o.userId === user.uid);
      if (userOrders.length > 0) {
        const lastOrder = userOrders[0];
        setCustomerPhone(lastOrder.customerPhone || "");
        setCustomerAddress(lastOrder.customerAddress || "");
      }
    }
  }, [pastOrders, user]);

  const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + parsePrice(item.price) * item.quantity,
    0
  );
  
  const discountAmount = Math.round(subtotal * (promoDiscount / 100));
  const preTax = subtotal - discountAmount;
  const gst = Math.round(preTax * 0.05); // 5% GST
  const grandTotal = preTax + gst;

  const handleApplyCoupon = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    try {
      const result = await dispatch(validateCoupon(couponCode)).unwrap();
      setCouponMessage(`Promo code applied! Saved ${result.percent}%`);
    } catch (err: any) {
      setCouponMessage(err || "Invalid coupon code");
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress || cartItems.length === 0) return;

    const orderData = {
      customerName,
      customerPhone,
      customerAddress,
      items: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      discount: discountAmount,
      total: grandTotal,
      userId: user?.uid,
      customerEmail: user?.email || undefined
    };

    try {
      const result = await dispatch(submitOrder(orderData)).unwrap();
      if (result && result.id) {
        router.push(`/order-success?orderId=${result.id}`);
      }
    } catch (err) {
      console.error("Order submission failure:", err);
    }
  };

  return (
    <main className="page-surface">
      <div className="container">
        <h1 style={{ marginBottom: "24px" }}>Order Summary & Checkout</h1>
        
        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px" }}>
            <p>Your cart is empty. Please add items before checking out.</p>
            <Link href="/menu" className="button button--primary" style={{ marginTop: "16px" }}>
              Go to Menu
            </Link>
          </div>
        ) : (
          <div className="responsive-grid responsive-grid--checkout">
            
            {/* Left Column: Form & Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <form className="contact-form" onSubmit={handlePlaceOrder} style={{ padding: "24px" }}>
                <h2 style={{ fontSize: "1.3rem", marginBottom: "16px", color: "var(--color-espresso)" }}>Delivery Details</h2>
                
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                  Your Name *
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                  Phone Number *
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                  Delivery Address *
                  <textarea
                    required
                    rows={4}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Enter your full delivery address"
                    style={{
                      background: "var(--color-cream)",
                      border: "1px solid rgba(59, 47, 47, 0.16)",
                      borderRadius: "var(--radius-sm)",
                      padding: "12px",
                      width: "100%",
                      outline: "none",
                      font: "inherit"
                    }}
                  />
                </label>
                
                <button type="submit" disabled={loading} className="button button--primary" style={{ width: "100%", padding: "12px" }}>
                  {loading ? "Placing Order..." : "Confirm & Place Order"}
                </button>
              </form>
            </div>

            {/* Right Column: Order summary breakdown & Coupon */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Order breakdown */}
              <div className="location-card" style={{ padding: "24px" }}>
                <h2 style={{ fontSize: "1.3rem", marginBottom: "16px", color: "var(--color-espresso)" }}>Invoice breakdown</h2>
                
                {/* Items list mini */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px", borderBottom: "1px solid rgba(59, 47, 47, 0.1)", paddingBottom: "16px" }}>
                  {cartItems.map((item) => (
                    <div key={item.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                      <span>{item.name} <span style={{ opacity: 0.7 }}>x{item.quantity}</span></span>
                      <span>₹{parsePrice(item.price) * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderBottom: "1px solid rgba(59, 47, 47, 0.1)", paddingBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-green)" }}>
                      <span>Coupon Discount ({promoDiscount}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>CGST + SGST (5%)</span>
                    <span>₹{gst}</span>
                  </div>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "16px" }}>
                  <strong style={{ fontSize: "1.2rem" }}>Total Amount</strong>
                  <strong style={{ fontSize: "1.2rem", color: "var(--color-green)" }}>₹{grandTotal}</strong>
                </div>
              </div>

              {/* Coupon card */}
              <div className="location-card" style={{ padding: "24px" }}>
                <h2 style={{ fontSize: "1.1rem", marginBottom: "12px", color: "var(--color-espresso)" }}>Apply Promo Code</h2>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid rgba(59, 47, 47, 0.16)",
                      textTransform: "uppercase",
                      outline: "none"
                    }}
                  />
                  <button onClick={handleApplyCoupon} className="button button--secondary" style={{ padding: "8px 16px" }}>
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p style={{ marginTop: "10px", fontSize: "0.85rem", fontWeight: "bold", color: promoDiscount > 0 ? "var(--color-green)" : "red" }}>
                    {couponMessage}
                  </p>
                )}
                {error && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "6px" }}>{error}</p>}
              </div>
            </div>
            
          </div>
        )}
      </div>
    </main>
  );
}

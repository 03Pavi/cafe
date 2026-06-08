import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-config";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

let mockOrders: any[] = [];

export async function GET() {
  try {
    const ordersCollection = collection(db, "orders");
    const q = query(ordersCollection, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    
    const orders: any[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Firebase fetch orders error, falling back to mock orders:", error);
    return NextResponse.json(mockOrders);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, items, total } = body;
    
    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data. Missing name, phone, or items." },
        { status: 400 }
      );
    }
    
    const newOrder = {
      customerName,
      customerPhone,
      items,
      total,
      timestamp: new Date().toISOString(),
    };
    
    try {
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      const savedOrder = { id: docRef.id, ...newOrder };
      mockOrders.unshift(savedOrder);
      return NextResponse.json(savedOrder);
    } catch (firebaseErr) {
      console.warn("Firebase save order failed, saving locally:", firebaseErr);
      const savedOrder = { id: "mock-" + Math.random().toString(36).substring(2, 11), ...newOrder };
      mockOrders.unshift(savedOrder);
      return NextResponse.json(savedOrder);
    }
  } catch (error) {
    console.error("POST orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

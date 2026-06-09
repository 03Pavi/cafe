import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-config";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

let mockOrders: any[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const ordersCollection = collection(db, "orders");
    const q = query(ordersCollection, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    
    let orders: any[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    if (userId) {
      orders = orders.filter((order) => order.userId === userId);
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Firebase fetch orders error, falling back to mock orders:", error);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    let orders = [...mockOrders];
    if (userId) {
      orders = orders.filter((order) => order.userId === userId);
    }
    return NextResponse.json(orders);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      customerPhone, 
      customerAddress,
      items, 
      subtotal,
      discount,
      total, 
      userId, 
      customerEmail 
    } = body;
    
    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data. Missing name, phone, or items." },
        { status: 400 }
      );
    }
    
    const newOrder = {
      customerName,
      customerPhone,
      customerAddress: customerAddress || "",
      items,
      subtotal: subtotal || total,
      discount: discount || 0,
      total,
      status: "pending",
      timestamp: new Date().toISOString(),
      ...(userId && { userId }),
      ...(customerEmail && { customerEmail }),
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

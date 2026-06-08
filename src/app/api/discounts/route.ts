import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-config";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";

const mockDiscounts = [
  { code: "WELCOME10", percent: 10, isActive: true },
  { code: "COFFEE15", percent: 15, isActive: true },
  { code: "OPEN20", percent: 20, isActive: true },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      try {
        const discountsCollection = collection(db, "discounts");
        const snapshot = await getDocs(discountsCollection);
        if (snapshot.empty) {
          for (const d of mockDiscounts) {
            await setDoc(doc(db, "discounts", d.code), d);
          }
          return NextResponse.json(mockDiscounts);
        }
        const discounts: any[] = [];
        snapshot.forEach((doc) => {
          discounts.push(doc.data());
        });
        return NextResponse.json(discounts);
      } catch (err) {
        console.warn("Firebase fetch discounts failed, falling back to mock:", err);
        return NextResponse.json(mockDiscounts);
      }
    }

    try {
      const docRef = doc(db, "discounts", code.toUpperCase());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isActive) {
          return NextResponse.json({ code: data.code, percent: data.percent });
        }
      }
    } catch (err) {
      console.warn(`Firebase validate coupon ${code} failed, falling back to mock:`, err);
    }

    const found = mockDiscounts.find((d) => d.code === code.toUpperCase() && d.isActive);
    if (found) {
      return NextResponse.json({ code: found.code, percent: found.percent });
    }

    return NextResponse.json({ error: "Invalid or inactive coupon code" }, { status: 404 });
  } catch (error) {
    console.error("Discounts API GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, percent, isActive } = body;

    if (!code || typeof percent !== "number") {
      return NextResponse.json({ error: "Invalid coupon payload" }, { status: 400 });
    }

    const couponData = {
      code: code.toUpperCase(),
      percent,
      isActive: isActive !== false,
    };

    await setDoc(doc(db, "discounts", couponData.code), couponData);
    return NextResponse.json(couponData);
  } catch (error) {
    console.error("Discounts API POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

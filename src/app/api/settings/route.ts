import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { siteConfig } from "@/shared/config/site";

const defaultSettings = {
  cafeName: siteConfig.cafeName,
  phone: siteConfig.phone,
  address: siteConfig.address,
  hours: siteConfig.hours,
};

export async function GET() {
  try {
    const docRef = doc(db, "settings", "general");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data());
    }
    
    await setDoc(docRef, defaultSettings);
    return NextResponse.json(defaultSettings);
  } catch (error) {
    console.error("Firebase fetch settings error, falling back to local:", error);
    return NextResponse.json(defaultSettings);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cafeName, phone, address, hours } = body;
    
    if (!cafeName || !phone || !address || !hours) {
      return NextResponse.json({ error: "Missing required settings fields" }, { status: 400 });
    }
    
    const payload = { cafeName, phone, address, hours };
    await setDoc(doc(db, "settings", "general"), payload);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("POST settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

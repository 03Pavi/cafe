import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "gallery-images"));
    const list: any[] = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    return NextResponse.json(list);
  } catch (error) {
    console.error("Firebase fetch gallery error:", error);
    return NextResponse.json(
      { error: "Failed to load gallery from Firebase" },
      { status: 500 }
    );
  }
}

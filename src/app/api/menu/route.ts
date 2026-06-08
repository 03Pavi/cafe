import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-config";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { menuCategories } from "@/entities/menu-item/menu-data";

export async function GET() {
  try {
    const menuCollection = collection(db, "menu");
    const snapshot = await getDocs(menuCollection);
    
    if (snapshot.empty) {
      // Seed Firestore with default menu categories
      for (const category of menuCategories) {
        await setDoc(doc(db, "menu", category.title), {
          title: category.title,
          items: category.items,
        });
      }
      return NextResponse.json(menuCategories);
    }
    
    const categories: any[] = [];
    snapshot.forEach((doc) => {
      categories.push(doc.data());
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Firebase fetch error, falling back to local data:", error);
    return NextResponse.json(menuCategories);
  }
}

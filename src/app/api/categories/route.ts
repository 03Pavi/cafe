import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-config";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

const defaultCategories = [
  { name: "Coffee" },
  { name: "Tea" },
  { name: "Snacks" },
  { name: "Maggi / Fast Food" },
  { name: "Cold Drinks" },
];

export async function GET() {
  try {
    const categoriesCollection = collection(db, "categories");
    const snapshot = await getDocs(categoriesCollection);
    
    if (snapshot.empty) {
      for (const cat of defaultCategories) {
        await setDoc(doc(db, "categories", cat.name), cat);
      }
      return NextResponse.json(defaultCategories);
    }
    
    const categories: any[] = [];
    snapshot.forEach((doc) => {
      categories.push(doc.data());
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Firebase fetch categories error, falling back to local:", error);
    return NextResponse.json(defaultCategories);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;
    
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    
    const id = name;
    await setDoc(doc(db, "categories", id), { name });
    return NextResponse.json({ name });
  } catch (error) {
    console.error("POST categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

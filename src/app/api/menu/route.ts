import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-config";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import type { MenuCategory, MenuItem } from "@/entities/menu-item/menu-data";

type FirestoreMenuItem = {
  name?: string;
  price?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  category?: string;
  isAvailable?: boolean;
};

const toMenuCategories = (items: FirestoreMenuItem[]): MenuCategory[] => {
  const categories = new Map<string, MenuItem[]>();

  items.forEach((item) => {
    if (!item.name || !item.price || !item.category) {
      return;
    }

    const categoryItems = categories.get(item.category) || [];
    categoryItems.push({
      name: item.name,
      price: item.price,
      description: item.description || "",
      image: item.imageUrl || item.image,
    });
    categories.set(item.category, categoryItems);
  });

  return Array.from(categories.entries()).map(([title, categoryItems]) => ({
    title,
    label: title,
    items: categoryItems,
  }));
};

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "menu-items"));

    const menuItems: FirestoreMenuItem[] = [];
    snapshot.forEach((menuItemDoc) => {
      menuItems.push(menuItemDoc.data() as FirestoreMenuItem);
    });

    // Filter by availability and sort by category then name in memory
    const processedItems = menuItems
      .filter((item) => item.isAvailable === true)
      .sort((a, b) => {
        const catA = a.category || "";
        const catB = b.category || "";
        if (catA !== catB) {
          return catA.localeCompare(catB);
        }
        const nameA = a.name || "";
        const nameB = b.name || "";
        return nameA.localeCompare(nameB);
      });

    return NextResponse.json(toMenuCategories(processedItems));
  } catch (error) {
    console.error("Firebase fetch menu error:", error);
    return NextResponse.json(
      { error: "Failed to load menu from Firebase" },
      { status: 500 }
    );
  }
}

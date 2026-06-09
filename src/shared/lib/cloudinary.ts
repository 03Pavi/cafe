import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/firebase-config";

export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", path);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data.url) {
        return data.url;
      }
    }
    console.warn("Server-side Cloudinary upload failed or was not configured, falling back to Firebase Storage");
  } catch (err) {
    console.warn("Cloudinary API upload error, falling back to Firebase Storage:", err);
  }

  // Fallback to Firebase Storage
  const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

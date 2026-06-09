import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/firebase-config";

export const uploadImage = async (file: File, path: string): Promise<string> => {
  let shouldFallback = false;
  
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
    } else {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch (e) {}

      if (errorData.error === "credentials_missing" || response.status === 503) {
        console.warn("Cloudinary credentials are not configured. Falling back to Firebase Storage.");
        shouldFallback = true;
      } else {
        // Stop uploading and throw the Cloudinary API error
        throw new Error(errorData.message || `Cloudinary upload failed with status ${response.status}`);
      }
    }
  } catch (err: any) {
    // If it is a custom thrown error from our API, rethrow it to stop the upload process
    if (err.message && !shouldFallback && !err.message.includes("fetch") && !err.message.includes("Failed to fetch")) {
      throw err;
    }
    console.warn("Cloudinary connection failed, falling back to Firebase Storage:", err);
    shouldFallback = true;
  }

  if (shouldFallback) {
    // Fallback to Firebase Storage
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }
  
  throw new Error("Failed to upload image");
};

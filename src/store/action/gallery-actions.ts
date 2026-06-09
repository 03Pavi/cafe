import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export const fetchGalleryImages = createAsyncThunk<
  GalleryImage[],
  void,
  { rejectValue: string }
>("gallery/fetchImages", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<GalleryImage[]>("/api/gallery");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || error.message || "Failed to fetch gallery"
    );
  }
});

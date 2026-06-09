import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchGalleryImages, GalleryImage } from "@/store/action/gallery-actions";

export interface GalleryState {
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
}

const initialState: GalleryState = {
  images: [],
  loading: false,
  error: null,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGalleryImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGalleryImages.fulfilled, (state, action: PayloadAction<GalleryImage[]>) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchGalleryImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Failed to fetch gallery";
      });
  },
});

export default gallerySlice.reducer;

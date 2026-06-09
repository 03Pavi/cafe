import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { MenuCategory, MenuItem } from "../menu-data";
import { fetchMenu } from "@/store/action/menu-actions";

export interface MenuState {
  categories: MenuCategory[];
  items: MenuItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  categories: [],
  items: [],
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<MenuCategory[]>) => {
      state.categories = action.payload;
      state.items = action.payload.flatMap((cat) => cat.items);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action: PayloadAction<MenuCategory[]>) => {
        state.loading = false;
        state.categories = action.payload;
        state.items = action.payload.flatMap((cat) => cat.items);
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Failed to fetch menu";
      });
  },
});

export const { setMenu, setLoading, setError } = menuSlice.actions;
export default menuSlice.reducer;

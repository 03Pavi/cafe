import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { MenuCategory } from "@/entities/menu-item/menu-data";

export const fetchMenu = createAsyncThunk<
  MenuCategory[],
  void,
  { rejectValue: string }
>("menu/fetchMenu", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<MenuCategory[]>("/api/menu");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to fetch menu"
      );
    }

    return rejectWithValue("Failed to fetch menu");
  }
});

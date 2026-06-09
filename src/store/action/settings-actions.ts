import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface SettingsData {
  cafeName: string;
  phone: string;
  address: string;
  hours: string[];
  directionsUrl?: string;
  instagram?: string;
  mapLatitude?: string;
  mapLongitude?: string;
}

export const fetchSettings = createAsyncThunk<
  SettingsData,
  void,
  { rejectValue: string }
>("settings/fetchSettings", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<SettingsData>("/api/settings");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || error.message || "Failed to fetch settings"
    );
  }
});

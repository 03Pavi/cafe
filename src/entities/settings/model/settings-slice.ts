import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSettings, SettingsData } from "@/store/action/settings-actions";
import { siteConfig } from "@/shared/config/site";

export interface SettingsState {
  data: SettingsData;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  data: {
    cafeName: siteConfig.cafeName,
    phone: siteConfig.phone,
    address: siteConfig.address,
    hours: siteConfig.hours,
    directionsUrl: siteConfig.directionsUrl,
    instagram: siteConfig.instagram,
    mapLatitude: "",
    mapLongitude: "",
  },
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action: PayloadAction<SettingsData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Failed to fetch settings";
      });
  },
});

export default settingsSlice.reducer;

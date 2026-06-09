import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "@/entities/order/model/order-slice";
import menuReducer from "@/entities/menu-item/model/menu-slice";
import settingsReducer from "@/entities/settings/model/settings-slice";
import galleryReducer from "@/entities/gallery/model/gallery-slice";

export const store = configureStore({
  reducer: {
    order: orderReducer,
    menu: menuReducer,
    settings: settingsReducer,
    gallery: galleryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

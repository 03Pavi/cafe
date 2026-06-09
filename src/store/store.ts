import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import orderReducer from "@/entities/order/model/order-slice";
import menuReducer from "@/entities/menu-item/model/menu-slice";
import settingsReducer from "@/entities/settings/model/settings-slice";
import galleryReducer from "@/entities/gallery/model/gallery-slice";

// Server-side safe storage engine to support SSR in Next.js
const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const orderPersistConfig = {
  key: "order",
  storage,
  whitelist: ["items", "appliedCoupon", "promoDiscount"], // Only persist cart items and coupon states
};

const persistedOrderReducer = persistReducer(orderPersistConfig, orderReducer);

export const store = configureStore({
  reducer: {
    order: persistedOrderReducer,
    menu: menuReducer,
    settings: settingsReducer,
    gallery: galleryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

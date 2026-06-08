import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "@/entities/order/model/order-slice";
import menuReducer from "@/entities/menu-item/model/menu-slice";

export const store = configureStore({
  reducer: {
    order: orderReducer,
    menu: menuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

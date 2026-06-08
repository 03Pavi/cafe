import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  name: string;
  price: string;
  description: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: "pending" | "preparing" | "completed" | "cancelled";
  timestamp: string;
}

export interface OrderState {
  items: CartItem[];
  appliedCoupon: string | null;
  promoDiscount: number; // percentage
  pastOrders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  items: [],
  appliedCoupon: null,
  promoDiscount: 0,
  pastOrders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addToOrder: (state, action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>) => {
      const existingItem = state.items.find(
        (item) => item.name === action.payload.name
      );
      const qty = action.payload.quantity ?? 1;
      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        state.items.push({ ...action.payload, quantity: qty });
      }
    },
    removeFromOrder: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.name !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ name: string; quantity: number }>
    ) => {
      const existingItem = state.items.find(
        (item) => item.name === action.payload.name
      );
      if (existingItem) {
        existingItem.quantity = Math.max(1, action.payload.quantity);
      }
    },
    applyPromo: (
      state,
      action: PayloadAction<{ code: string; percent: number }>
    ) => {
      state.appliedCoupon = action.payload.code;
      state.promoDiscount = action.payload.percent;
    },
    removePromo: (state) => {
      state.appliedCoupon = null;
      state.promoDiscount = 0;
    },
    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = null;
      state.promoDiscount = 0;
    },
    setPastOrders: (state, action: PayloadAction<Order[]>) => {
      state.pastOrders = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addToOrder,
  removeFromOrder,
  updateQuantity,
  applyPromo,
  removePromo,
  clearCart,
  setPastOrders,
  setLoading,
  setError,
} = orderSlice.actions;

export default orderSlice.reducer;

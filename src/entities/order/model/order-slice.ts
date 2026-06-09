import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPastOrders, submitOrder, validateCoupon } from "@/store/action/order-actions";


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
  userId?: string;
  customerEmail?: string;
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchPastOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPastOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.pastOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchPastOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Failed to fetch orders";
      })
      .addCase(submitOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Failed to submit order";
      })
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload.code;
        state.promoDiscount = action.payload.percent;
        state.error = null;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.appliedCoupon = null;
        state.promoDiscount = 0;
        state.error = action.payload || action.error.message || "Failed to validate coupon";
      });
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

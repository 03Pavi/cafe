import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { clearCart, Order } from "@/entities/order/model/order-slice";

export const fetchPastOrders = createAsyncThunk<
  Order[],
  string | undefined,
  { rejectValue: string }
>("order/fetchPastOrders", async (userId, { rejectWithValue }) => {
  try {
    const url = userId ? `/api/orders?userId=${userId}` : "/api/orders";
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || error.message || "Failed to fetch orders"
    );
  }
});

export const submitOrder = createAsyncThunk<
  any,
  {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: any[];
    subtotal: number;
    discount: number;
    total: number;
    userId?: string;
    customerEmail?: string;
  },
  { rejectValue: string }
>("order/submitOrder", async (orderData, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post("/api/orders", orderData);
    dispatch(clearCart());
    if (orderData.userId) {
      dispatch(fetchPastOrders(orderData.userId));
    } else {
      dispatch(fetchPastOrders());
    }
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || error.message || "Failed to submit order"
    );
  }
});

export const validateCoupon = createAsyncThunk<
  { code: string; percent: number },
  string,
  { rejectValue: string }
>("order/validateCoupon", async (code, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/discounts?code=${code}`);
    if (response.data && response.data.percent) {
      return { code, percent: response.data.percent };
    } else {
      return rejectWithValue("Invalid coupon code");
    }
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || error.message || "Failed to validate coupon"
    );
  }
});

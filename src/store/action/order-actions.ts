import axios from "axios";
import { AppDispatch } from "../store";
import {
  setLoading,
  setPastOrders,
  setError,
  clearCart,
  applyPromo,
  removePromo,
} from "@/entities/order/model/order-slice";

export const fetchPastOrders = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/orders");
    dispatch(setPastOrders(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    console.error("Fetch orders error:", error);
    dispatch(setError(error.message || "Failed to fetch orders"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const submitOrder = (orderData: {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: any[];
  subtotal: number;
  discount: number;
  total: number;
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post("/api/orders", orderData);
    dispatch(clearCart());
    dispatch(setError(null));
    dispatch(fetchPastOrders() as any);
    return response.data;
  } catch (error: any) {
    console.error("Submit order error:", error);
    dispatch(setError(error.message || "Failed to submit order"));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export const validateCoupon = (code: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/discounts?code=${code}`);
    if (response.data && response.data.percent) {
      dispatch(applyPromo({ code, percent: response.data.percent }));
      dispatch(setError(null));
      return { success: true, percent: response.data.percent };
    } else {
      dispatch(removePromo());
      dispatch(setError("Invalid coupon code"));
      return { success: false, error: "Invalid coupon code" };
    }
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    dispatch(removePromo());
    dispatch(setError("Failed to validate coupon"));
    return { success: false, error: "Coupon validation failed" };
  } finally {
    dispatch(setLoading(false));
  }
};

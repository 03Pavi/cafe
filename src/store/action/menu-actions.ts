import axios from "axios";
import { AppDispatch } from "../store";
import { setMenu, setLoading, setError } from "@/entities/menu-item/model/menu-slice";

export const fetchMenu = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/menu");
    dispatch(setMenu(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    console.error("Fetch menu error:", error);
    dispatch(setError(error.message || "Failed to fetch menu"));
  } finally {
    dispatch(setLoading(false));
  }
};

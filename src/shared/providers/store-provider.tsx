"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import React, { useEffect } from "react";
import { fetchSettings } from "@/store/action/settings-actions";
import { fetchMenu } from "@/store/action/menu-actions";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(fetchSettings());
    store.dispatch(fetchMenu());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

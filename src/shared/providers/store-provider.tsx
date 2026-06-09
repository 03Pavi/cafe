"use client";

import { Provider } from "react-redux";
import { store, persistor } from "@/store/store";
import React, { useEffect } from "react";
import { fetchSettings } from "@/store/action/settings-actions";
import { fetchMenu } from "@/store/action/menu-actions";
import { PersistGate } from "redux-persist/integration/react";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(fetchSettings());
    store.dispatch(fetchMenu());
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

import * as React from "react";
import { createContext, PropsWithChildren, useMemo } from "react";

import { CartStore } from "@/entities/cart/model/cart-store";

export type RootStore = {
  cartStore: CartStore;
};

const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider = ({ children }: PropsWithChildren) => {
  const store = useMemo<RootStore>(
    () => ({
      cartStore: new CartStore(),
    }),
    [],
  );

  return <RootStoreContext.Provider value={store}>{children}</RootStoreContext.Provider>;
};

export const useRootStore = () => {
  const store = React.use(RootStoreContext);

  if (!store) {
    throw new Error("RootStoreProvider is missing");
  }

  return store;
};

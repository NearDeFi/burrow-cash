import { configureStore } from "@reduxjs/toolkit";

import assetsReducer from "./assetsSlice";
import balancesReducer from "./balancesSlice";

export const store = configureStore({
  reducer: {
    assets: assetsReducer,
    balances: balancesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

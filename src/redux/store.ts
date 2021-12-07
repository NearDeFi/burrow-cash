import { configureStore } from "@reduxjs/toolkit";

import assetsReducer from "./assetsSlice";
import accountReducer from "./accountSlice";

export const store = configureStore({
  reducer: {
    assets: assetsReducer,
    account: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

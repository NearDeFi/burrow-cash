import { configureStore } from "@reduxjs/toolkit";

import assetsReducer from "./assetsSlice";
import accountReducer from "./accountSlice";
import appReducer from "./appSlice";

export const store = configureStore({
  reducer: {
    assets: assetsReducer,
    account: accountReducer,
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

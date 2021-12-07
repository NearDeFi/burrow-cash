import { configureStore } from "@reduxjs/toolkit";

import assetsReducer from "./assetsSlice";

export const store = configureStore({
  reducer: {
    assets: assetsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

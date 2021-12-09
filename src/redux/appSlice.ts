import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import { transformAsset } from "./utils";

type TokenAction = "Supply" | "Borrow" | "Repay" | "Adjust" | "Withdraw";

export interface AppState {
  showModal: boolean;
  selected: {
    action?: TokenAction;
    tokenId: string;
  };
}

const initialState: AppState = {
  showModal: false,
  selected: {
    action: undefined,
    tokenId: "",
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    hideModal(state) {
      state.showModal = false;
    },
    showModal(state, action: PayloadAction<{ action: TokenAction; tokenId: string }>) {
      state.selected = action.payload;
      state.showModal = true;
    },
  },
});

export const getModalStatus = createSelector(
  (state: RootState) => state.app,
  (app) => app.showModal,
);

export const getSelectedAction = createSelector(
  (state: RootState) => state.app,
  (app) => app.selected,
);

export const getAssetData = createSelector(
  (state: RootState) => state.app,
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (app, assets, account) => {
    const asset = assets[app.selected.tokenId];
    return {
      tokenId: asset.token_id,
      action: app.selected.action,
      ...(asset ? transformAsset(asset, account) : {}),
    };
  },
);

export const { hideModal, showModal } = appSlice.actions;
export default appSlice.reducer;

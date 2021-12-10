import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import { transformAsset } from "./utils";

type TokenAction = "Supply" | "Borrow" | "Repay" | "Adjust" | "Withdraw";

export interface AppState {
  showModal: boolean;
  selected: {
    action?: TokenAction;
    tokenId: string;
    useAsCollateral: boolean;
    amount: number;
  };
}

const initialState: AppState = {
  showModal: false,
  selected: {
    action: undefined,
    tokenId: "",
    useAsCollateral: false,
    amount: 0,
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    hideModal(state) {
      state.showModal = false;
    },
    showModal(
      state,
      action: PayloadAction<{ action: TokenAction; amount: number; tokenId: string }>,
    ) {
      state.selected = { useAsCollateral: false, ...action.payload };
      state.showModal = true;
    },
    updateAmount(state, action: PayloadAction<{ amount: number }>) {
      state.selected.amount = action.payload.amount;
    },
    toggleUseAsCollateral(state, action: PayloadAction<{ useAsCollateral: boolean }>) {
      state.selected.useAsCollateral = action.payload.useAsCollateral;
    },
  },
});

export const getModalStatus = createSelector(
  (state: RootState) => state.app,
  (app) => app.showModal,
);

export const getSelectedValues = createSelector(
  (state: RootState) => state.app,
  (app) => app.selected,
);

export const getAssetData = createSelector(
  (state: RootState) => state.app,
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (app, assets, account) => {
    const asset = assets[app.selected?.tokenId];
    return {
      tokenId: asset?.token_id,
      action: app.selected.action,
      ...(asset ? transformAsset(asset, account) : {}),
    };
  },
);

export const { hideModal, showModal, updateAmount, toggleUseAsCollateral } = appSlice.actions;
export default appSlice.reducer;

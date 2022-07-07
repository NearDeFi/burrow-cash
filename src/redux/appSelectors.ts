import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import { transformAsset } from "./utils";

export const getConfig = createSelector(
  (state: RootState) => state.app,
  (app) => app.config,
);

export const getModalStatus = createSelector(
  (state: RootState) => state.app,
  (app) => app.showModal,
);

export const getDisplayAsTokenValue = createSelector(
  (state: RootState) => state.app,
  (app) => app.displayAsTokenValue,
);

export const getSlimStats = createSelector(
  (state: RootState) => state.app,
  (app) => app.slimStats,
);

export const getFullDigits = createSelector(
  (state: RootState) => state.app,
  (app) => app.fullDigits,
);

export const getProtocolStats = createSelector(
  (state: RootState) => state.app,
  (app) => app.protocolStats,
);

export const getAppState = createSelector(
  (state: RootState) => state.app,
  (app) => app,
);

export const getShowDust = createSelector(
  (state: RootState) => state.app,
  (app) => app.showDust,
);

export const getShowTicker = createSelector(
  (state: RootState) => state.app,
  (app) => app.showTicker,
);

export const getSelectedValues = createSelector(
  (state: RootState) => state.app,
  (app) => app.selected,
);

export const getTableSorting = createSelector(
  (state: RootState) => state.app,
  (app) => app.tableSorting,
);

export const getDegenMode = createSelector(
  (state: RootState) => state.app,
  (app) => app.degenMode,
);

export const getAssetData = createSelector(
  (state: RootState) => state.app,
  (state: RootState) => state.assets.data,
  (state: RootState) => state.account,
  (app, assets, account) => {
    const asset = assets[app.selected?.tokenId];
    return {
      tokenId: asset?.token_id,
      action: app.selected.action,
      ...(asset ? transformAsset(asset, account, assets, app) : {}),
    };
  },
);

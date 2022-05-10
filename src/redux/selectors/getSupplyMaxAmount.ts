import { createSelector } from "@reduxjs/toolkit";
import Decimal from "decimal.js";

import { RootState } from "../store";

export const getSupplyMaxAmount = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.assets.data,
    (state: RootState) => state.account.balances,
    (assets, balances) => {
      const asset = assets[tokenId];
      const { decimals } = asset.metadata;

      const suppliedBalance = new Decimal(balances[tokenId] || "0").div(
        new Decimal(10).pow(decimals),
      );

      return suppliedBalance.toString();
    },
  );

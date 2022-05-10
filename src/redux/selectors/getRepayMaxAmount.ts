import { createSelector } from "@reduxjs/toolkit";
import Decimal from "decimal.js";

import { RootState } from "../store";
import { NEAR_STORAGE_DEPOSIT } from "../../store";
import { nearTokenId } from "../../utils";

export const getRepayMaxAmount = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.assets.data,
    (state: RootState) => state.account,
    (assets, account) => {
      const asset = assets[tokenId];

      let accountBalance = new Decimal(account.balances[tokenId] || "0").div(
        new Decimal(10).pow(asset.metadata.decimals),
      );
      if (tokenId === nearTokenId) {
        accountBalance = accountBalance.add(
          new Decimal(account.balances["near"] || "0")
            .div(new Decimal(10).pow(asset.metadata.decimals))
            .sub(NEAR_STORAGE_DEPOSIT),
        );
      }
      const borrowed = new Decimal(account.portfolio.borrowed[tokenId]?.balance || "0").div(
        new Decimal(10).pow(asset.metadata.decimals + asset.config.extra_decimals),
      );

      return Decimal.min(borrowed, accountBalance).toString();
    },
  );

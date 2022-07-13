import { createSelector } from "@reduxjs/toolkit";

import { NEAR_LOGO_SVG, shrinkToken } from "../../store";
import { RootState } from "../store";
import { INetTvlFarmReward } from "../../interfaces/asset";

interface IProtocolReward {
  icon: string;
  name: string;
  symbol: string;
  tokenId: string;
  dailyAmount: number;
  remainingAmount: number;
  price: number;
}

export const getProtocolRewards = createSelector(
  (state: RootState) => state.assets,
  (assets) => {
    const rewards = Object.entries(assets.netTvlFarm).map(
      ([tokenId, farm]: [string, INetTvlFarmReward]) => {
        const asset = assets.data[tokenId];
        const { name, symbol, icon } = asset.metadata;
        const assetDecimals = asset.metadata.decimals + asset.config.extra_decimals;

        const dailyAmount = Number(shrinkToken(farm.reward_per_day, assetDecimals));
        const remainingAmount = Number(shrinkToken(farm.remaining_rewards, assetDecimals));
        return {
          icon: icon || `data:image/svg+xml,${NEAR_LOGO_SVG}`,
          name,
          symbol,
          tokenId,
          dailyAmount,
          remainingAmount,
          price: asset.price?.usd || 0,
        } as IProtocolReward;
      },
    );

    return rewards;
  },
);

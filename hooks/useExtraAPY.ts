import Decimal from "decimal.js";

import { getAccountPortfolio } from "../redux/accountSelectors";
import { getAssets, getTotalSupplyAndBorrowUSD } from "../redux/assetsSelectors";
import { computePoolsDailyAmount } from "../redux/selectors/getAccountRewards";
import { getStaking } from "../redux/selectors/getStaking";
import { getConfig } from "../redux/appSelectors";
import { useAppSelector } from "../redux/hooks";
import { shrinkToken } from "../store/helper";
import { getNetTvlAPY, getTotalNetTvlAPY } from "../redux/selectors/getNetAPY";
import { useNonFarmedAssets } from "./hooks";

export function useExtraAPY({ tokenId: assetId, isBorrow }) {
  const [totalSupplyUSD, totalBorrowUSD] = useAppSelector(getTotalSupplyAndBorrowUSD(assetId));
  const { xBRRR, extraXBRRRAmount } = useAppSelector(getStaking);
  const portfolio = useAppSelector(getAccountPortfolio);
  const appConfig = useAppSelector(getConfig);
  const assets = useAppSelector(getAssets);
  const userNetTvlAPY = useAppSelector(getNetTvlAPY({ isStaking: false }));
  const totalNetTvlApy = useAppSelector(getTotalNetTvlAPY);
  const { hasNegativeNetLiquidity } = useNonFarmedAssets();

  const hasNetTvlFarms = Object.keys(portfolio.farms.netTvl).length > 0;

  const netLiquidityAPY = hasNegativeNetLiquidity
    ? 0
    : hasNetTvlFarms
    ? userNetTvlAPY
    : totalNetTvlApy;

  const asset = assets.data[assetId];

  const assetDecimals = asset.metadata.decimals + asset.config.extra_decimals;
  const assetPrice = assets.data[assetId].price?.usd || 0;

  const totalBorrowAssetUSD =
    Number(shrinkToken(portfolio.borrowed[assetId]?.balance || 0, assetDecimals)) * assetPrice;
  const totalSupplyAssetUSD =
    Number(shrinkToken(portfolio.supplied[assetId]?.balance || 0, assetDecimals)) * assetPrice;
  const totalCollateralAssetUSD =
    Number(shrinkToken(portfolio.collateral[assetId]?.balance || 0, assetDecimals)) * assetPrice;

  const totalUserAssetUSD = isBorrow
    ? totalBorrowAssetUSD
    : totalSupplyAssetUSD + totalCollateralAssetUSD;

  const computeRewardAPY = (rewardTokenId, rewardsPerDay, decimals, price) => {
    const rewardAsset = assets.data[rewardTokenId];
    const type = isBorrow ? "borrowed" : "supplied";
    const farmData = portfolio.farms?.[type]?.[assetId]?.[rewardTokenId];

    const totalDailyRewards = new Decimal(rewardsPerDay)
      .div(new Decimal(10).pow(decimals))
      .toNumber();

    const totalDeposits = isBorrow ? totalBorrowUSD : totalSupplyUSD;

    if (!farmData)
      return (
        new Decimal(rewardsPerDay)
          .div(new Decimal(10).pow(decimals))
          .mul(365)
          .mul(price)
          .div(totalDeposits)
          .mul(100)
          .toNumber() || 0
      );

    const { multiplier, totalBoostedShares, shares } = computePoolsDailyAmount(
      type,
      asset,
      rewardAsset,
      portfolio,
      xBRRR,
      farmData,
      appConfig.booster_decimals,
    );

    const apy =
      ((totalDailyRewards * price * 365 * multiplier) /
        ((totalUserAssetUSD * totalBoostedShares) / shares)) *
      100;

    return apy || 0;
  };

  const computeStakingRewardAPY = (rewardTokenId: string) => {
    const rewardAsset = assets.data[rewardTokenId];
    const type = isBorrow ? "borrowed" : "supplied";
    const farmData = portfolio.farms?.[type]?.[assetId]?.[rewardTokenId];

    if (!farmData) return 0;

    const { newDailyAmount } = computePoolsDailyAmount(
      type,
      asset,
      rewardAsset,
      portfolio,
      xBRRR + extraXBRRRAmount,
      farmData,
      appConfig.booster_decimals,
    );

    const rewardAssetPrice = assets.data[rewardTokenId].price?.usd || 0;

    const apy = ((newDailyAmount * 365 * rewardAssetPrice) / totalUserAssetUSD) * 100;

    return apy;
  };

  const netTvlMultiplier = asset.config.net_tvl_multiplier / 10000;

  return {
    computeRewardAPY,
    computeStakingRewardAPY,
    netLiquidityAPY,
    netTvlMultiplier,
  };
}

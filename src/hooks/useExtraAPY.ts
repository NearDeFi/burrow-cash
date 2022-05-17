import Decimal from "decimal.js";

import { getAccountPortfolio } from "../redux/accountSelectors";
import { getConfig } from "../redux/appSelectors";
import { getAssets, getTotalSupplyAndBorrowUSD } from "../redux/assetsSelectors";
import { useAppSelector } from "../redux/hooks";
import { computeDailyAmount } from "../redux/selectors/getAccountRewards";
import { getGains } from "../redux/selectors/getNetAPY";
import { getStaking } from "../redux/selectors/getStaking";

export function useExtraAPY({ tokenId: assetId, isBorrow }) {
  const { xBRRR, extraXBRRRAmount } = useAppSelector(getStaking);
  const portfolio = useAppSelector(getAccountPortfolio);
  const appConfig = useAppSelector(getConfig);
  const assets = useAppSelector(getAssets);
  const [totalSupplyUSD, totalBorrowUSD] = useAppSelector(getTotalSupplyAndBorrowUSD(assetId));

  const computeRewardAPY = (rewardsPerDay, decimals, price) => {
    return new Decimal(rewardsPerDay)
      .div(new Decimal(10).pow(decimals))
      .mul(365)
      .mul(price)
      .div(isBorrow ? totalBorrowUSD : totalSupplyUSD)
      .mul(100)
      .toNumber();
  };

  const computeStakingRewardAPY = (
    type: "supplied" | "borrowed",
    tokenId: string,
    rewardTokenId: string,
  ) => {
    const asset = assets.data[tokenId];
    const rewardAsset = assets.data[rewardTokenId];
    const farmData = portfolio.farms?.[type]?.[tokenId]?.[rewardTokenId];

    if (!farmData) return 0;

    const { newDailyAmount } = computeDailyAmount(
      type,
      asset,
      rewardAsset,
      portfolio,
      xBRRR + extraXBRRRAmount,
      farmData,
      appConfig.booster_decimals,
    );

    const [, totalCollateral] = getGains(portfolio, assets, "collateral");
    const [, totalSupplied] = getGains(portfolio, assets, "supplied");
    const [, totalBorrowed] = getGains(portfolio, assets, "borrowed");

    const totalAmount = type === "supplied" ? totalSupplied + totalCollateral : totalBorrowed;
    const price = asset?.price?.usd || 0;

    const apy = ((newDailyAmount * price * 365) / totalAmount) * 100;

    return apy;
  };

  return { computeStakingRewardAPY, computeRewardAPY };
}

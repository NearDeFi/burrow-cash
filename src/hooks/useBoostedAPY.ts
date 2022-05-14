import { getAccountPortfolio } from "../redux/accountSelectors";
import { getConfig } from "../redux/appSelectors";
import { getAssets } from "../redux/assetsSelectors";
import { useAppSelector } from "../redux/hooks";
import { computeDailyAmount } from "../redux/selectors/getAccountRewards";
import { computeStakingBoostedAPY } from "../redux/selectors/getNetAPY";
import { getStaking } from "../redux/selectors/getStaking";

export function useBoostedAPY() {
  const { xBRRR, extraXBRRRAmount } = useAppSelector(getStaking);
  const portfolio = useAppSelector(getAccountPortfolio);
  const appConfig = useAppSelector(getConfig);
  const assets = useAppSelector(getAssets);

  const getBoostedAPY = (type: "supplied" | "borrowed", tokenId: string, rewardTokenId: string) => {
    const asset = assets[tokenId];
    const rewardAsset = assets[rewardTokenId];
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

    const apy = computeStakingBoostedAPY(type, asset, portfolio, newDailyAmount);
    return apy;
  };

  return getBoostedAPY;
}

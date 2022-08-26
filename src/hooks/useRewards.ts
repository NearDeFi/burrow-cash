import { useAppSelector } from "../redux/hooks";
import { getAccountRewards } from "../redux/selectors/getAccountRewards";
import { getNetLiquidityRewards, getProtocolRewards } from "../redux/selectors/getProtocolRewards";
import { getTokenLiquidity } from "../redux/selectors/getTokenLiquidity";
import { useProtocolNetLiquidity } from "./useNetLiquidity";

export function useRewards() {
  const assetRewards = useAppSelector(getAccountRewards);
  const protocol = useAppSelector(getProtocolRewards);

  const { brrr } = assetRewards;
  const extra = Object.entries(assetRewards.extra);
  const net = Object.entries(assetRewards.net);

  return { brrr, extra, net, protocol };
}

export function useNetLiquidityRewards() {
  const rewards = useAppSelector(getNetLiquidityRewards);
  return rewards;
}

export function useProRataNetLiquidityReward(tokenId, dailyAmount) {
  const { protocolNetLiquidity } = useProtocolNetLiquidity();
  const tokenLiquidity = useAppSelector(getTokenLiquidity(tokenId));

  if (!tokenId) return dailyAmount;
  const share = tokenLiquidity / protocolNetLiquidity;
  return dailyAmount * share;
}
